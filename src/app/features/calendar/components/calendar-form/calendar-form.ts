import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, FormRoot, required, submit, validate } from '@angular/forms/signals';
import { EventInput } from '@fullcalendar/angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';

import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { format, isAfter, parse, set } from 'date-fns';

export interface CalendarEventModel {
  title: string;
  description: string;
  startDate: Date | null;
  startTime: string;
  endDate: Date | null;
  endTime: string;
}

/**
 * The event shape the form needs to prefill itself. Structurally satisfied by
 * both FullCalendar's live EventApi and the details dialog's plain snapshot.
 */
export interface CalendarFormEvent {
  id?: string;
  title: string;
  start: Date | null;
  end: Date | null;
  extendedProps: { description?: string; [key: string]: unknown };
}

@Component({
  selector: 'adm-calendar-form',
  imports: [
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
    HlmFieldImports,
    HlmButtonImports,
    HlmSpinnerImports,
    HlmButtonImports,
    HlmSelectImports,
    HlmDatePickerImports,
    HlmCheckboxImports,
    TranslocoModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './calendar-form.html',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class CalendarForm implements OnInit {
  // ==========================================
  // Services
  // ==========================================

  private readonly _transloco = inject(TranslocoService);
  private readonly _dialogRef = inject<BrnDialogRef>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ event?: CalendarFormEvent; date?: Date }>();

  // ==========================================
  // State
  // ==========================================

  protected readonly isEditMode = signal<boolean>(!!this._dialogContext.event);

  private readonly eventModel = signal<CalendarEventModel>({
    title: '',
    description: '',
    startDate: null,
    startTime: '09:00',
    endDate: null,
    endTime: '10:00',
  });

  protected readonly eventForm = form(this.eventModel, (schema) => {
    required(schema.title);
    required(schema.description);
    required(schema.startDate);
    required(schema.endDate);
    validate(schema.endDate, ({ value }) => {
      const endBase = value();
      const model = this.eventModel();

      if (!endBase || !model.startDate) return null;

      const startCombined = mergeTime(model.startDate, model.startTime);
      const endCombined = mergeTime(endBase, model.endTime);

      return isAfter(endCombined, startCombined) ? null : { kind: 'endBeforeStart' };
    });
  });

  // ==========================================
  // Public Methods
  // ==========================================

  ngOnInit(): void {
    const { event, date } = this._dialogContext;

    if (event) {
      const start = event.start ? new Date(event.start) : new Date();
      const end = event.end ? new Date(event.end) : new Date(start);

      this.eventModel.set({
        title: event.title,
        description: event.extendedProps['description'] || '',
        startDate: start,
        endDate: end,
        startTime: format(start, 'HH:mm'),
        endTime: format(end, 'HH:mm'),
      });
    } else {
      // For new events, use the clicked date or today
      const baseDate = date ? new Date(date) : new Date();
      this.eventModel.update((m) => ({ ...m, startDate: baseDate, endDate: baseDate }));
    }
  }

  onSubmit() {
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
    const formValue = this.eventForm;
    const startDate = formValue.startDate().value();
    const endDate = formValue.endDate().value();

    if (!startDate || !endDate) return;

    const start = mergeTime(startDate, formValue.startTime().value());
    const end = mergeTime(endDate, formValue.endTime().value());

    const event: EventInput = {
      id: this._dialogContext.event?.id ?? crypto.randomUUID(),
      title: formValue.title().value(),
      start,
      end,
      extendedProps: {
        description: formValue.description().value(),
      },
    };

    this._showToast();
    this._dialogRef.close(event);
  }

  private _showToast() {
    const message = this.isEditMode()
      ? this._transloco.translate('calendar.toast.eventUpdated', { eventTitle: this.eventForm().value().title })
      : this._transloco.translate('calendar.toast.eventCreated');
    toast.success(message);
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
export const mergeTime = (date: Date, timeStr: string) => {
  const formatPattern = timeStr.length > 5 ? 'HH:mm:ss' : 'HH:mm';

  const timeDate = parse(timeStr, formatPattern, date);

  return set(date, {
    hours: timeDate.getHours(),
    minutes: timeDate.getMinutes(),
    seconds: timeDate.getSeconds() || 0,
    milliseconds: 0,
  });
};
