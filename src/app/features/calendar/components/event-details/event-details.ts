import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventApi, EventInput } from '@fullcalendar/core/index.js';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlignLeft, lucideCalendar, lucideClock, lucideMapPin, lucideTag } from '@ng-icons/lucide';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports, HlmDialogService } from '@spartan-ng/helm/dialog';

import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { CalendarStore } from '../../state/calendar-store';
import { CalendarForm } from '../calendar-form/calendar-form';

@Component({
  selector: 'adm-event-details',
  imports: [HlmDialogImports, HlmButtonImports, HlmBadgeImports, NgIcon, HlmSeparatorImports, TranslocoModule, DatePipe],
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
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _calendarStore = inject(CalendarStore);
  private readonly _dialogContext = injectBrnDialogContext<{ event: EventApi }>();

  // ==========================================
  // State
  // ==========================================
  protected readonly event = signal(this._dialogContext.event);

  // ==========================================
  // Public Methods
  // ==========================================
  onEditEvent() {
    const dialogRef = this._hlmDialogService.open<EventInput>(CalendarForm, {
      context: {
        event: this.event(),
        date: this.event().start,
      },
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (!result) return;

      this._calendarStore.updateEvent(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.event.update((current: any) => ({
        ...current,
        id: current.id,
        title: result.title,
        start: result.start instanceof String ? new Date(result.start as string) : result.start,
        end: result.end instanceof String ? new Date(result.end as string) : result.end,
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
      this._dialogRef.close();
    }
  }
}
