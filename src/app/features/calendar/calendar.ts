import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { makeEventsData } from '@core/mock/events';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideChevronLeft, lucideChevronRight, lucidePlus } from '@ng-icons/lucide';
import { BrnHoverCardImports } from '@spartan-ng/brain/hover-card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { CalendarForm } from './calendar-form/calendar-form';
@Component({
  selector: 'adm-calendar',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    BrnHoverCardImports,
    HlmDropdownMenuImports,
    FullCalendarModule,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucidePlus, lucideCalendar })],
  templateUrl: './calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Calendar {
  // ==========================================
  // Services
  // ==========================================
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _breakpointObserver = inject(BreakpointObserver);

  // ==========================================
  // ViewChild
  // ==========================================
  readonly calendar = viewChild<FullCalendarComponent>('calendar');

  // ==========================================
  // State
  // ==========================================
  readonly calendarApi = computed(() => this.calendar()?.getApi());

  readonly currentTitle = signal('');
  readonly availableViews = signal([
    { value: 'dayGridMonth', label: 'month' },
    { value: 'timeGridWeek', label: 'week' },
    { value: 'timeGridDay', label: 'day' },
    { value: 'listWeek', label: 'list' },
  ]);
  readonly currentView = signal(this.availableViews()[0]);

  readonly events = signal<EventInput[]>(makeEventsData(40));

  readonly activeLanguage = toSignal(this._translocoService.langChanges$, {
    initialValue: this._translocoService.getActiveLang(),
  });

  readonly calendarOptions = computed<CalendarOptions>(() => ({
    initialView: this.currentView().value,
    headerToolbar: false,
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    events: this.events(),
    contentHeight: 'auto',
    eventDisplay: 'block',
    aspectRatio: 2,
    locale: this.activeLanguage(),
    editable: true,
    droppable: true,
    eventDrop: (info) => this.handleEventDrop(info),
    eventClick: (info) => this.handleEventClick(info),
    dateClick: (info) => this.handleDateClick(info),
    datesSet: () => {
      const api = this.calendar()?.getApi();
      if (api) {
        this.currentTitle.set(api.view.title);
      }
    },
  }));

  constructor() {
    this._breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((result) => {
        if (result.matches) {
          this.changeView({ value: 'listWeek', label: 'list' });
        } else {
          this.changeView(this.availableViews()[0]);
        }
      });
  }

  // ==========================================
  // Methods
  // ==========================================
  protected nextMonth(): void {
    this.calendarApi()?.next();
  }

  protected previousMonth(): void {
    this.calendarApi()?.prev();
  }

  protected goToToday(): void {
    this.calendarApi()?.today();
  }
  protected changeView(viewName: { value: string; label: string }): void {
    this.calendarApi()?.changeView(viewName.value);
    this.currentView.set(viewName);
  }

  protected addEvent(): void {
    const dialogRef = this._hlmDialogService.open(CalendarForm, {
      contentClass: 'max-w-3xl',
      autoFocus: 'dialog',
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result: EventInput) => {
      if (result) {
        this.events.update((events) => [...events, result]);
      }
    });
  }

  // ==========================================
  // Event Handlers
  // ==========================================
  private handleEventDrop(info: EventDropArg): void {
    const { event } = info;
    const updatedEvent: EventInput = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      backgroundColor: event.backgroundColor,
      extendedProps: { ...event.extendedProps },
    };

    this.events.update((events) => [...events.filter((e) => e.id !== updatedEvent.id), updatedEvent]);
  }

  private handleEventClick(info: EventClickArg): void {
    const dialogRef = this._hlmDialogService.open(CalendarForm, {
      contentClass: 'max-w-3xl',
      autoFocus: 'dialog',
      context: {
        event: info.event,
      },
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result: EventInput) => {
      if (result) {
        this.events.update((events) => [...events.filter((e) => e.id !== result.id), result]);
      }
    });
  }

  private handleDateClick(info: DateClickArg): void {
    const dialogRef = this._hlmDialogService.open(CalendarForm, {
      contentClass: 'max-w-3xl',
      autoFocus: 'dialog',
      context: {
        date: info.date,
      },
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result: EventInput) => {
      if (result) {
        this.events.update((events) => [...events, result]);
      }
    });
  }
}
