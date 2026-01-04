import { faker } from '@faker-js/faker';
import { Payment } from '../../features/dashboards/dashboard-1/overview/components/table/payments-table';

const range = (len: number): number[] => Array.from({ length: len }, (_, i) => i);

export function makePaymentData(count: number): Payment[] {
  const newPayment = (): Payment => {
    return {
      email: faker.internet.email(),
      amount: parseFloat(faker.finance.amount({ min: 10, max: 500, dec: 2 })),
      status: faker.helpers.arrayElement(['success', 'processing', 'failed'] as const),
    };
  };

  return range(count).map(newPayment);
}
