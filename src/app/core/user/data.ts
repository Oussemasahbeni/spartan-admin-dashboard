import { faker } from '@faker-js/faker';
import { countries } from '../../shared/countries';
import { User } from './user.type';

const range = (len: number): number[] => Array.from({ length: len }, (_, i) => i);

const newUser = (): User => {
  //  Pick the country first
  const countryObject = faker.helpers.arrayElement(countries);

  //  Generate a random string of digits (usually 7 to 10 digits)
  const randomDigits = faker.string.numeric({ length: { min: 8, max: 10 } });

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    //  Combine the country code with the random digits
    phoneNumber: `${countryObject.code}${randomDigits}`,
    //  Use the same country's ISO
    country: countryObject.iso.toLowerCase(),

    email: faker.internet.email(),
    createdAt: faker.date.past({ years: 4 }),
    status: faker.helpers.arrayElement(['active', 'inactive', 'pending'] as const),
    role: faker.helpers.arrayElement(['admin', 'user', 'manager'] as const),
  };
};

export function makeData(count: number): User[] {
  return range(count).map(newUser);
}
