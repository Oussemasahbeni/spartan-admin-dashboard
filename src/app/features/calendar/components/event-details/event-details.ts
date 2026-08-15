import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlignLeft, lucideCalendar, lucideClock, lucideMapPin, lucideTag } from '@ng-icons/lucide';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports, HlmDialogService } from '@spartan-ng/helm/dialog';

import { toast } from '@spartan-ng/brain/sonner';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { CalendarStore } from '../../state/calendar-store';
import { CalendarForm } from '../calendar-form/calendar-form';
import { EventApi, EventInput } from '@fullcalendar/angular';

/**
 * Plain snapshot of the event shown in the dialog. EventApi exposes its fields
 * as prototype getters, so a spread of the live instance copies nothing —
 * the dialog works on this snapshot instead.
 */
interface EventDetailsView {
  id: string;
  title: string;
  allDay: boolean;
  start: Date | null;
  end: Date | null;
  extendedProps: { description?: string; [key: string]: unknown };
}

const toEventView = (event: EventApi): EventDetailsView => ({
  id: event.id,
  title: event.title,
  allDay: event.allDay,
  start: event.start,
  end: event.end,
  extendedProps: event.extendedProps,
});

const toDate = (value: EventInput['start']): Date | null => {
  if (value == null) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return null;
};

@Component({
  selector: 'adm-event-details',
  imports: [HlmDialogImports, HlmButtonImports, HlmBadgeImports, HlmSeparatorImports, NgIcon, TranslocoModule, DatePipe],
  providers: [
    provideIcons({
      lucideCalendar,
      lucideClock,
      lucideMapPin,
      lucideAlignLeft,
      lucideTag,
    }),
  ],
  host: {
    class: 'flex flex-col gap-4',
  },
  templateUrl: './event-details.html',
})
export class EventDetails {
  // ==========================================
  // Services
  // ==========================================
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _dialogRef = inject<BrnDialogRef>(BrnDialogRef);
  private readonly _transloco = inject(TranslocoService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _calendarStore = inject(CalendarStore);
  private readonly _dialogContext = injectBrnDialogContext<{ event: EventApi }>();

  // ==========================================
  // State
  // ==========================================
  protected readonly event = signal(toEventView(this._dialogContext.event));

  // ==========================================
  // Public Methods
  // ==========================================
  onEditEvent() {
    const dialogRef = this._hlmDialogService.open<EventInput>(CalendarForm, {
      context: {
        event: this.event(),
        date: this.event().start ?? undefined,
      },
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (!result) return;

      this._calendarStore.updateEvent(result);
      this.event.update((current) => ({
        ...current,
        title: result.title ?? current.title,
        start: toDate(result.start) ?? current.start,
        end: toDate(result.end) ?? current.end,
        extendedProps: {
          ...current.extendedProps,
          ...result.extendedProps,
        },
      }));
    });
  }

  onDeleteEvent() {
    const id = this.event().id;
    if (id) {
      this._calendarStore.deleteEvent(id);
      toast.success(this._transloco.translate('calendar.toast.eventDeleted', { eventTitle: this.event().title }));
      this._dialogRef.close();
    }
  }
}
