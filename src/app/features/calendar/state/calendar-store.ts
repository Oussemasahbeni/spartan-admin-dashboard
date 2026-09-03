import { computed, Service, signal } from '@angular/core';
import { STATIC_EVENTS } from '@core/mock/events.data';
import { EventInput } from '@fullcalendar/angular';

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

@Service()
export class CalendarStore {
  private readonly _events = signal<EventInput[]>(structuredClone(STATIC_EVENTS));
  private readonly _selectedTypes = signal<string[]>([]);

  public readonly events = this._events.asReadonly();
  public readonly selectedTypes = this._selectedTypes.asReadonly();

  public readonly filteredEvents = computed(() => {
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
