import { countries } from '../../shared/countries';
import { User } from './user.type';

const range = (len: number): number[] => Array.from({ length: len }, (_, i) => i);

export async function makeData(count: number): Promise<User[]> {
  const { faker } = await import('@faker-js/faker');

  const newUser = (): User => {
    const countryObject = faker.helpers.arrayElement(countries);
    const randomDigits = faker.string.numeric({ length: { min: 8, max: 10 } });

    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      phoneNumber: `${countryObject.code}${randomDigits}`,
      country: countryObject.iso.toLowerCase(),
      email: faker.internet.email(),
      createdAt: faker.date.past({ years: 4 }),
      status: faker.helpers.arrayElement(['active', 'inactive', 'pending'] as const),
      role: faker.helpers.arrayElement(['admin', 'user', 'manager'] as const),
    };
  };

  return range(count).map(newUser);
}
