import { User } from '../../features/users/model/user';
import { countries } from '../../shared/countries';

import { CountryCode, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
const range = (len: number): number[] => Array.from({ length: len }, (_, i) => i);

export async function makeData(count: number): Promise<User[]> {
  const { faker } = await import('@faker-js/faker');

  const newUser = (): User => {
    const countryObject = faker.helpers.arrayElement(countries);
    const phoneNumberObj = getExampleNumber(countryObject.iso.toUpperCase() as CountryCode, examples);

    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      phoneNumber: phoneNumberObj ? phoneNumberObj.format('E.164') : `+${countryObject.code}${faker.string.numeric(8)}`,
      country: countryObject.iso.toLowerCase(),
      email: faker.internet.email(),
      createdAt: faker.date.past({ years: 4 }),
      status: faker.helpers.arrayElement(['active', 'inactive', 'pending'] as const),
      role: faker.helpers.arrayElement(['admin', 'user', 'manager'] as const),
    };
  };

  return range(count).map(newUser);
}
