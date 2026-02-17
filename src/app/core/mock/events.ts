import { faker } from '@faker-js/faker';
import { EventInput } from '@fullcalendar/core/index.js';

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

    const isAllDay = faker.datatype.boolean();

    const themeColors = ['var(--fc-red)', 'var(--fc-yellow)', 'var(--fc-green)', 'var(--fc-blue)'];

    return {
      id: faker.string.uuid(),
      title: faker.lorem.words({ min: 2, max: 3 }),
      start: startDate,
      end: isAllDay ? undefined : endDate,
      allDay: isAllDay,
      backgroundColor: faker.helpers.arrayElement(themeColors),
      borderColor: 'transparent',
      extendedProps: {
        description: faker.lorem.sentence(),
      },
    };
  };

  return range(count).map(newEvent);
}
