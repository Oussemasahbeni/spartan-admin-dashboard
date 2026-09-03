import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CalendarOptions,
  DateClickInfo,
  EventClickInfo,
  EventDropInfo,
  EventInput,
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import listPlugin from '@fullcalendar/angular/list';
import themePlugin from '@fullcalendar/angular/themes/classic';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideChevronLeft,
  lucideChevronRight,
  lucideColumns3,
  lucideFilter,
  lucideGrid2x2,
  lucideList,
  lucidePlus,
  lucideSettings,
  lucideSquare,
} from '@ng-icons/lucide';
import { BrnHoverCardImports } from '@spartan-ng/brain/hover-card';
import { toast } from '@spartan-ng/brain/sonner';
import type { ToggleValue } from '@spartan-ng/brain/toggle-group';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { isBefore, subDays } from 'date-fns';
import { CalendarForm } from '../components/calendar-form/calendar-form';
import { EventDetails } from '../components/event-details/event-details';
import { CalendarStore, EVENT_TYPES } from '../state/calendar-store';

@Component({
  selector: 'adm-calendar',
  imports: [
    HlmButtonImports,
    BrnHoverCardImports,
    HlmDropdownMenuImports,
    HlmBadgeImports,
    HlmDatePickerImports,
    HlmToggleGroupImports,
    HlmButtonGroupImports,
    NgIcon,
    FullCalendarModule,
    TranslocoModule,
    DatePipe,
  ],
  providers: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucidePlus,
      lucideCalendar,
      lucideGrid2x2,
      lucideColumns3,
      lucideSquare,
      lucideList,
      lucideSettings,
      lucideFilter,
    }),
  ],
  templateUrl: './calendar.html',
})
export default class Calendar {
  // ==========================================
  // Services
  // ==========================================
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _calendarStore = inject(CalendarStore);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _translocoService = inject(TranslocoService);

  // ==========================================
  // ViewChild
  // ==========================================
  protected readonly calendar = viewChild<FullCalendarComponent>('calendar');
  // ==========================================
  // State
  // ==========================================

  protected readonly currentTitle = signal('');
  protected readonly currentStart = signal<Date | null>(null);
  protected readonly currentEnd = signal<Date | null>(null);
  protected readonly currentDate = signal<Date>(new Date());

  protected readonly eventTypes = EVENT_TYPES;

  protected readonly selectedTypes = this._calendarStore.selectedTypes;

  protected readonly showDatePicker = computed(() => this.currentView() === 'timeGridDay');
  protected readonly calendarApi = computed(() => this.calendar()?.getApi());

  protected readonly selectedDate = signal<Date>(new Date());

  protected readonly visibleEventCount = signal(0);

  protected readonly use24HourFormat = signal(true);

  protected readonly eventDisplayMode = signal<'block' | 'list-item'>('block');

  protected readonly availableViews = signal([
    { value: 'dayGridMonth', label: 'month', icon: 'lucideGrid2x2' },
    { value: 'timeGridWeek', label: 'week', icon: 'lucideColumns3' },
    { value: 'timeGridDay', label: 'day', icon: 'lucideSquare' },
    { value: 'listWeek', label: 'list', icon: 'lucideList' },
  ]);
  protected readonly currentView = signal(this.availableViews()[0].value);

  protected readonly activeLanguage = computed(() => this._translocoService.activeLang());
  protected readonly calendarOptions = computed<CalendarOptions>(() => ({
    initialView: this.currentView(),
    plugins: [themePlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    events: this._calendarStore.filteredEvents(),
    contentHeight: 'auto',
    eventDisplay: this.eventDisplayMode(),
    eventTimeFormat: this.use24HourFormat()
      ? { hour: '2-digit', minute: '2-digit', hour12: false } // 14:30
      : { hour: 'numeric', minute: '2-digit', meridiem: 'short' }, // 2:30 PM
    eventClass: 'rounded-md p-1',
    aspectRatio: 2,
    locale: this.activeLanguage(),
    editable: true,
    droppable: true,
    fixedWeekCount: false,
    eventDrop: (info) => this.handleEventDrop(info),
    eventClick: (info) => this.handleEventClick(info),
    dateClick: (info) => this.handleDateClick(info),
    datesSet: (dateInfo) => {
      const api = this.calendar()?.getApi();
      if (api) {
        this.currentTitle.set(api.view.title);
      }
      this.currentStart.set(dateInfo.start);
      // FullCalendar's end date is exclusive, so we adjust it to be inclusive for display purposes
      const adjustedEnd = subDays(dateInfo.end, 1);
      this.currentEnd.set(adjustedEnd);
      // Calculate visible events in the current view
      const viewStart = dateInfo.start;
      const viewEnd = dateInfo.end;
      const visibleCount = dateInfo.view.calendar.getEvents().filter((eventApi) => {
        const eventStart = eventApi.start;
        const eventEnd = eventApi.end ?? eventApi.start;
        if (!eventStart || !eventEnd) return false;
        return isBefore(eventStart, viewEnd) && !isBefore(eventEnd, viewStart);
      }).length;
      this.visibleEventCount.set(visibleCount);
    },
  }));

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
  protected changeView(view: ToggleValue<string>): void {
    if (typeof view !== 'string') return;
    this.calendarApi()?.changeView(view);
    this.currentView.set(view);
  }

  protected addEvent(): void {
    const dialogRef = this._hlmDialogService.open(CalendarForm, {
      contentClass: 'sm:min-w-lg',
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (result) {
        this._calendarStore.addEvent(result);
      }
    });
  }

  protected onDatePickerChange(dateStr: string) {
    const api = this.calendarApi();
    if (api) {
      api.gotoDate(dateStr);
    }
  }

  protected toggleTimeFormat() {
    this.use24HourFormat.update((current) => !current);
  }
  protected toggleEventDisplayMode(): void {
    this.eventDisplayMode.update((current) => (current === 'block' ? 'list-item' : 'block'));
  }

  protected toggleFilter(typeValue: string) {
    this._calendarStore.toggleType(typeValue);
  }

  protected clearFilters(): void {
    this._calendarStore.clearFilters();
  }

  // ==========================================
  // Event Handlers
  // ==========================================
  private handleEventDrop(info: EventDropInfo): void {
    const { event } = info;
    const updatedEvent: EventInput = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      color: event.color,
      extendedProps: { ...event.extendedProps },
    };

    this._calendarStore.updateEvent(updatedEvent);
    toast.success(this._translocoService.translate('calendar.toast.eventUpdated', { eventTitle: event.title }));
  }

  private handleEventClick(info: EventClickInfo): void {
    const dialogRef = this._hlmDialogService.open(EventDetails, {
      context: {
        event: info.event,
      },
      contentClass: 'sm:min-w-lg',
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (result) {
        this._calendarStore.updateEvent(result);
      }
    });
  }

  private handleDateClick(info: DateClickInfo): void {
    const dialogRef = this._hlmDialogService.open(CalendarForm, {
      context: {
        date: info.date,
      },
      contentClass: 'sm:min-w-lg',
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (result) {
        this._calendarStore.addEvent(result);
      }
    });
  }
}
