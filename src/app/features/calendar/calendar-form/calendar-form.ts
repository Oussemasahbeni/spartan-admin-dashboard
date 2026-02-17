import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { EventApi, EventInput } from '@fullcalendar/core/index.js';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ValidationErrors } from '@shared/components/validation-errors/validation-errors';
import { BrnDialogImports, BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'adm-calendar-form',
  imports: [
    BrnDialogImports,
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
    HlmFieldImports,
    HlmButtonImports,
    HlmSpinnerImports,
    HlmIconImports,
    HlmButtonImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmIconImports,
    HlmDatePickerImports,
    HlmCheckboxImports,
    TranslocoModule,
    FormField,
    ValidationErrors,
  ],
  templateUrl: './calendar-form.html',
  host: {
    class: 'flex flex-col gap-4 sm:min-w-lg ',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarForm implements OnInit {
  // ==========================================
  // Services
  // ==========================================

  private readonly _transloco = inject(TranslocoService);
  private readonly _dialogRef = inject<BrnDialogRef>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ event?: EventApi; date?: Date }>();

  // ==========================================
  // State
  // ==========================================

  protected readonly isEditMode = signal<boolean>(!!this._dialogContext.event);
  protected readonly isSubmitting = signal(false);

  private readonly eventModel = signal({
    title: '',
    description: '',
    startDate: new Date(),
    startTime: '09:00',
    endDate: new Date(),
    endTime: '10:00',
    allDay: false,
  });

  readonly eventForm = form(this.eventModel, (schema) => {
    required(schema.title);
    required(schema.description);
    required(schema.startDate);
    required(schema.endDate);
    validate(schema.endDate, ({ value }) => {
      const endBase = value();
      if (!endBase) return null;

      //  Get current form values
      const currentModel = this.eventModel();
      const isAllDay = currentModel.allDay;

      //  Combine Start Date + Time
      const startCombined = new Date(currentModel.startDate);
      if (!isAllDay) {
        const [h, m] = currentModel.startTime.split(':').map(Number);
        startCombined.setHours(h, m, 0, 0);
      }

      //  Combine End Date + Time
      const endCombined = new Date(endBase);
      if (!isAllDay) {
        const [h, m] = currentModel.endTime.split(':').map(Number);
        endCombined.setHours(h, m, 0, 0);
      }

      //  Compare
      return endCombined > startCombined ? null : { kind: 'endBeforeStart' };
    });
  });

  // ==========================================
  // Public Methods
  // ==========================================

  ngOnInit(): void {
    const event = this._dialogContext.event;
    if (event) {
      const startDate = new Date(event.start as Date);
      const endDate = new Date(event.end as Date);
      this.eventModel.set({
        title: event.title || '',
        description: event.extendedProps['description'] || '',
        startDate,
        startTime: startDate.toTimeString().slice(0, 5),
        endDate,
        endTime: endDate.toTimeString().slice(0, 5),
        allDay: event.allDay || false,
      });
    }

    if (!event && this._dialogContext.date) {
      const selectedDate = new Date(this._dialogContext.date);
      this.eventModel.set({
        ...this.eventModel(),
        startDate: selectedDate,
        endDate: selectedDate,
      });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.eventForm, async () => {
      if (!this.eventForm().dirty()) {
        this._dialogRef.close(false);
        return;
      }
      this.onSaveEvent();
    });
  }

  // ==========================================
  // Private Methods
  // ==========================================

  onSaveEvent() {
    this.isSubmitting.set(true);
    const eventId = this._dialogContext.event?.id;
    const formValue = this.eventForm;

    let start = formValue.startDate().value();
    let end = formValue.endDate().value();

    if (!formValue.allDay().value()) {
      start = this._combineDateAndTime(start, formValue.startTime().value());
      end = this._combineDateAndTime(end, formValue.endTime().value());
    }

    const event: EventInput = {
      id: eventId ?? crypto.randomUUID(),
      title: formValue.title().value(),
      start,
      end,
      allDay: formValue.allDay().value(),
      extendedProps: {
        description: formValue.description().value(),
      },
    };

    this.showToast();
    this._dialogRef.close(event);
    this.isSubmitting.set(false);
  }

  showToast() {
    const message = this.isEditMode()
      ? this._transloco.translate('calendar.toast.eventUpdated')
      : this._transloco.translate('calendar.toast.eventCreated');
    toast.success(message);
  }

  private _combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  }

  protected closeDialog(): void {
    const isDirty = this.eventForm().dirty();

    if (isDirty) {
      // TODO: replace with a translation and a proper confirmation dialog
      const confirmDiscard = confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmDiscard) {
        return;
      }
    }

    // If not dirty OR user confirmed discard, close the dialog
    this._dialogRef.close();
  }
}
