import { faker } from '@faker-js/faker';
import { EventInput } from '@fullcalendar/core/index.js';
import { EVENT_TYPES } from '../../features/calendar/calendar.service';

const range = (len: number): number[] => Array.from({ length: len }, (_, i) => i);

export function makeEventsData(count: number): EventInput[] {
  const newEvent = (): EventInput => {
    // Generate a start date sometime in the last 30 days or next 30 days
    const startDate = faker.date.between({
      from: faker.date.recent({ days: 30 }),
      to: faker.date.soon({ days: 30 }),
    });

    // Ensure the end date is always after the start date (e.g., 1 to 4 hours later)
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + faker.number.int({ min: 1, max: 4 }));

    const typeObj = faker.helpers.arrayElement(EVENT_TYPES);

    return {
      id: faker.string.uuid(),
      title: faker.lorem.words({ min: 2, max: 3 }),
      start: startDate,
      end: endDate,
      backgroundColor: typeObj.color,
      extendedProps: {
        description: faker.lorem.sentence(),
        type: typeObj.value,
      },
    };
  };

  return range(count).map(newEvent);
}
