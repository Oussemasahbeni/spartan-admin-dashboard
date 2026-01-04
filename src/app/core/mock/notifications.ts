import { faker } from '@faker-js/faker';
import { Notification } from '../../layout/app/model/notification';

const range = (len: number): number[] => Array.from({ length: len }, (_, i) => i);

export function makeNotificationsData(count: number): Notification[] {
  const newUser = (): Notification => {
    return {
      user: faker.person.fullName(),
      // Store translation keys instead of text
      action: faker.helpers.arrayElement(['commentedOn', 'liked', 'shared', 'mentionedYouIn', 'repliedTo', 'assignedYouTo']),
      subject: faker.helpers.arrayElement(['yourPost', 'theProject', 'aTask', 'anIssue', 'aDocument', 'theReport']),
      date: faker.date.recent({ days: 21 }),
      unread: faker.datatype.boolean(),
      avatar: faker.image.avatar(),
    };
  };

  return range(count).map(newUser);
}
