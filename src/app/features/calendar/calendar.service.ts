import { computed, Injectable, signal } from '@angular/core';
import { makeEventsData } from '@core/mock/events';
import { EventInput } from '@fullcalendar/core/index.js';

export interface EventType {
  color: string;
  value: string;
}

export const EVENT_TYPES: EventType[] = [
  { color: 'var(--fc-blue)', value: 'work' },
  { color: 'var(--fc-green)', value: 'personal' },
  { color: 'var(--fc-red)', value: 'urgent' },
  { color: 'var(--fc-yellow)', value: 'meeting' },
];

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private readonly _events = signal<EventInput[]>(makeEventsData(40));
  private readonly _selectedTypes = signal<string[]>([]);

  readonly events = this._events.asReadonly();
  readonly selectedTypes = this._selectedTypes.asReadonly();

  readonly filteredEvents = computed(() => {
    const activeFilters = this.selectedTypes();
    const allEvents = this._events();

    if (activeFilters.length === 0) {
      return allEvents;
    }
    return allEvents.filter((event) => activeFilters.includes(event.extendedProps?.['type']));
  });

  addEvent(event: EventInput): void {
    this._events.update((events) => [...events, event]);
  }

  updateEvent(updatedEvent: EventInput): void {
    this._events.update((events) => [...events.filter((e) => e.id !== updatedEvent.id), updatedEvent]);
  }

  deleteEvent(id: string): void {
    this._events.update((events) => events.filter((e) => e.id !== id));
  }

  toggleType(typeValue: string) {
    this._selectedTypes.update((current) =>
      current.includes(typeValue) ? current.filter((t) => t !== typeValue) : [...current, typeValue]
    );
  }

  clearFilters(): void {
    this._selectedTypes.set([]);
  }
}
