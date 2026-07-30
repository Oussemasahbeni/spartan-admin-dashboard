import { EventInput } from '@fullcalendar/angular';

const clampDay = (year: number, month: number, day: number): number => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Math.min(Math.max(day, 1), daysInMonth);
};

const scheduledAt = (eventIndex: number, hour: number, minute: number, dayOffset = 0): Date => {
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  const monthOffset = eventIndex % 4;
  const cycle = Math.floor(eventIndex / 4);
  const dayOfMonth = ((cycle * 3 + monthOffset * 2) % 28) + 1;

  const targetYear = baseDate.getFullYear();
  const targetMonth = baseDate.getMonth() + monthOffset;
  const normalizedBaseDate = new Date(targetYear, targetMonth, 1);
  const safeDay = clampDay(normalizedBaseDate.getFullYear(), normalizedBaseDate.getMonth(), dayOfMonth);

  normalizedBaseDate.setDate(safeDay);
  normalizedBaseDate.setHours(hour, minute, 0, 0);

  if (dayOffset !== 0) {
    normalizedBaseDate.setDate(normalizedBaseDate.getDate() + dayOffset);
  }

  return normalizedBaseDate;
};

export const STATIC_EVENTS: EventInput[] = [
  {
    id: '32f3a187-650d-4d9a-abe4-81736fb6d1af',
    title: 'Morning Yoga Session',
    start: scheduledAt(0, 2, 22),
    end: scheduledAt(0, 5, 22),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'Daily stretching and meditation to start the day.',
      type: 'personal',
    },
  },
  {
    id: 'eed075f8-cfe4-4523-afad-b0a9f5a8854d',
    title: 'Email Inbox Clearing',
    start: scheduledAt(1, 6, 31),
    end: scheduledAt(1, 7, 31),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Process outstanding client requests and clear the backlog.',
      type: 'work',
    },
  },
  {
    id: '4c9fcb3c-a375-43dc-b818-6aade423a708',
    title: 'Product Sprint Planning',
    start: scheduledAt(2, 15, 36),
    end: scheduledAt(2, 18, 36),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Reviewing the roadmap for the upcoming development cycle.',
      type: 'meeting',
    },
  },
  {
    id: '7583e2de-17c9-4cef-85cb-1b03e12f4789',
    title: 'Grocery Shopping',
    start: scheduledAt(3, 10, 24),
    end: scheduledAt(3, 12, 24),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'Weekly grocery run—don’t forget the oat milk.',
      type: 'personal',
    },
  },
  {
    id: '20476d67-0481-4d8b-a2d9-f9abf8f886c7',
    title: 'URGENT: Server Maintenance',
    start: scheduledAt(4, 23, 50),
    end: scheduledAt(4, 3, 50, 1),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Critical security patch deployment for main production servers.',
      type: 'urgent',
    },
  },
  {
    id: '2bb962bc-c222-48cc-a37c-22e9b70a12d8',
    title: 'Afternoon Gym',
    start: scheduledAt(5, 11, 3),
    end: scheduledAt(5, 13, 3),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'Leg day at the local fitness center.',
      type: 'personal',
    },
  },
  {
    id: '89c5828e-bf0d-4e31-857a-4d84f504a638',
    title: 'Fix Production Bug #402',
    start: scheduledAt(6, 17, 30),
    end: scheduledAt(6, 19, 30),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Investigating payment gateway timeout issues reported by users.',
      type: 'urgent',
    },
  },
  {
    id: '3e817409-0032-426e-b3dc-691a6e2ae0ca',
    title: 'Client Onboarding Call',
    start: scheduledAt(7, 16, 27),
    end: scheduledAt(7, 17, 27),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Introductory call with the new Marketing team.',
      type: 'meeting',
    },
  },
  {
    id: 'c5cc5587-bbfa-4bc6-bdb2-5f11000e0230',
    title: 'Code Review & Documentation',
    start: scheduledAt(8, 9, 37),
    end: scheduledAt(8, 12, 37),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Reviewing pull requests and updating API documentation.',
      type: 'work',
    },
  },
  {
    id: '51382918-b44c-4877-99c6-46e810e4be83',
    title: 'Submit Tax Returns',
    start: scheduledAt(9, 13, 41),
    end: scheduledAt(9, 15, 41),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Final deadline for quarterly tax filing.',
      type: 'urgent',
    },
  },
  {
    id: 'bb27f603-83c0-4eb6-ae7e-b74f2abfa53e',
    title: 'Family Dinner',
    start: scheduledAt(10, 12, 30),
    end: scheduledAt(10, 15, 30),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'Catching up with family over dinner at the Italian place.',
      type: 'personal',
    },
  },
  {
    id: 'fa605f18-4ea4-4fe6-a387-9977527c7aac',
    title: 'Weekly Sync',
    start: scheduledAt(11, 13, 45),
    end: scheduledAt(11, 14, 45),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Standard team check-in on project status.',
      type: 'meeting',
    },
  },
  {
    id: 'cee8fb53-7929-4b37-9849-6316b20bcce0',
    title: 'Design System Update',
    start: scheduledAt(12, 7, 32),
    end: scheduledAt(12, 10, 32),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Refactoring Figma components and updating the CSS variables.',
      type: 'work',
    },
  },
  {
    id: 'fdb00013-aee3-452a-b853-cc326dc3be2c',
    title: 'Weekend Hike',
    start: scheduledAt(13, 19, 30),
    end: scheduledAt(13, 22, 30),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'Exploring the trails at the National Park.',
      type: 'personal',
    },
  },
  {
    id: '1c2760aa-d953-4812-aa3b-23b658395e50',
    title: 'Brainstorming Session',
    start: scheduledAt(14, 0, 13),
    end: scheduledAt(14, 1, 13),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Ideation for the upcoming Q3 marketing campaign.',
      type: 'meeting',
    },
  },
  {
    id: 'be91d44a-693e-44b3-b1a3-eb36e71f0de4',
    title: 'Deep Work: Feature A',
    start: scheduledAt(15, 20, 21),
    end: scheduledAt(15, 0, 21, 1),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Uninterrupted time for complex logic implementation.',
      type: 'work',
    },
  },
  {
    id: 'fc694f5d-84fc-4536-8d64-748ebed16aa3',
    title: 'Quarterly Report Analysis',
    start: scheduledAt(16, 16, 52),
    end: scheduledAt(16, 20, 52),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Reviewing performance metrics and growth KPIs.',
      type: 'work',
    },
  },
  {
    id: 'ed51942a-7b1c-4ad9-a926-328e05b918b8',
    title: 'Movie Night',
    start: scheduledAt(17, 23, 38),
    end: scheduledAt(17, 1, 38, 1),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'Watching the new Sci-Fi release with friends.',
      type: 'personal',
    },
  },
  {
    id: '90b9a351-5c26-4b48-8a0e-ac288e71881d',
    title: 'URGENT: Lease Agreement Review',
    start: scheduledAt(18, 1, 47),
    end: scheduledAt(18, 5, 47),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Legal review of the new office lease required today.',
      type: 'urgent',
    },
  },
  {
    id: '10fa214d-2efa-47a9-91c5-ace24b599046',
    title: 'Partnership Strategy',
    start: scheduledAt(19, 16, 18),
    end: scheduledAt(19, 18, 18),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Evaluating potential B2B partnerships for the next year.',
      type: 'work',
    },
  },
  {
    id: '19e72e34-b866-4127-8ab2-114685dff177',
    title: 'Interview: Frontend Dev',
    start: scheduledAt(20, 21, 2),
    end: scheduledAt(20, 1, 2, 1),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Technical interview for the Senior Frontend Engineer position.',
      type: 'meeting',
    },
  },
  {
    id: '12a10c55-f7d8-4e91-a1a6-06cf731d78cc',
    title: '1-on-1 with Manager',
    start: scheduledAt(21, 12, 47),
    end: scheduledAt(21, 13, 47),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Bi-weekly career development and feedback sync.',
      type: 'meeting',
    },
  },
  {
    id: 'aecaaac1-96b7-4692-b666-d409ade09d8f',
    title: 'Stakeholder Workshop',
    start: scheduledAt(22, 17, 17),
    end: scheduledAt(22, 21, 17),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Defining project requirements with the executive board.',
      type: 'meeting',
    },
  },
  {
    id: '37a50e1f-177c-4fd8-9871-72809ee15e1d',
    title: 'EMERGENCY: Database Outage',
    start: scheduledAt(23, 11, 48),
    end: scheduledAt(23, 15, 48),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Immediate investigation into DB connection pool exhaustion.',
      type: 'urgent',
    },
  },
  {
    id: 'dfd5f665-1849-47f4-9520-879df354f219',
    title: 'Laptop Repair Appointment',
    start: scheduledAt(24, 9, 33),
    end: scheduledAt(24, 11, 33),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Battery replacement at the service center.',
      type: 'urgent',
    },
  },
  {
    id: '3f0cb021-a5be-4e9d-b478-02189ad3c8e5',
    title: 'Design Critique',
    start: scheduledAt(25, 15, 0),
    end: scheduledAt(25, 19, 0),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Reviewing the new mobile app onboarding flow.',
      type: 'meeting',
    },
  },
  {
    id: '9308d98a-1103-4e0a-be89-6d7cdcd71b75',
    title: 'Read: Industry Trends',
    start: scheduledAt(26, 22, 26),
    end: scheduledAt(26, 1, 26, 1),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'Catching up on AI research papers and tech blogs.',
      type: 'personal',
    },
  },
  {
    id: 'd1e04caf-e398-4669-843a-6e4325286f2f',
    title: 'Submit Expense Reports',
    start: scheduledAt(27, 21, 15),
    end: scheduledAt(27, 23, 15),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Process all travel receipts before the month-end cutoff.',
      type: 'urgent',
    },
  },
  {
    id: 'f1f01ee8-52b5-483a-a27a-ad8a20a75aae',
    title: 'Security Audit Prep',
    start: scheduledAt(28, 1, 59),
    end: scheduledAt(28, 3, 59),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Preparing logs and access records for the annual audit.',
      type: 'urgent',
    },
  },
  {
    id: '0814852f-cea2-4ed4-98da-aa0e866e919a',
    title: 'Content Strategy Sync',
    start: scheduledAt(29, 17, 50),
    end: scheduledAt(29, 18, 50),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Discussing the editorial calendar for the company blog.',
      type: 'meeting',
    },
  },
  {
    id: '6789defd-2e7c-46c8-8b7e-1101dc9e6055',
    title: 'Ad Campaign Review',
    start: scheduledAt(30, 1, 28),
    end: scheduledAt(30, 5, 28),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Analyzing performance of social media ad spend.',
      type: 'meeting',
    },
  },
  {
    id: '8f503752-5d0f-475d-b3a7-5cebe394f17a',
    title: 'Urgent Bug: Login Page',
    start: scheduledAt(31, 17, 53),
    end: scheduledAt(31, 19, 53),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Users unable to login on iOS Safari—needs immediate fix.',
      type: 'urgent',
    },
  },
  {
    id: 'b16a3084-59f4-4dae-bc9a-b63add9fe7bf',
    title: 'HR Policy Briefing',
    start: scheduledAt(32, 7, 20),
    end: scheduledAt(32, 9, 20),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Update on the new remote work and benefits package.',
      type: 'meeting',
    },
  },
  {
    id: 'f01719ee-58b8-461c-bd58-0ed0f849e4ed',
    title: 'Refactor Core Library',
    start: scheduledAt(33, 15, 25),
    end: scheduledAt(33, 18, 25),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Cleaning up technical debt in the shared utility modules.',
      type: 'work',
    },
  },
  {
    id: '8a5514fa-7f49-4606-a2d2-d2757424e719',
    title: 'Update GitHub READMEs',
    start: scheduledAt(34, 7, 24),
    end: scheduledAt(34, 10, 24),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Improving documentation for internal developer onboarding.',
      type: 'work',
    },
  },
  {
    id: '02a24ccf-ff9f-44d7-9dd4-cdc936464c97',
    title: 'CRITICAL: Data Recovery',
    start: scheduledAt(35, 7, 16),
    end: scheduledAt(35, 8, 16),
    color: 'var(--fc-red)',
    extendedProps: {
      description: 'Recovering deleted files from the dev environment backup.',
      type: 'urgent',
    },
  },
  {
    id: '48a3d38a-422f-419a-a282-ae69f4b111d7',
    title: 'QA Testing Phase 2',
    start: scheduledAt(36, 6, 41),
    end: scheduledAt(36, 10, 41),
    color: 'var(--fc-blue)',
    extendedProps: {
      description: 'Executing end-to-end test cases for the upcoming release.',
      type: 'work',
    },
  },
  {
    id: 'eaa059db-03fc-40b5-b87a-967d6e1785d3',
    title: 'Pick up Dry Cleaning',
    start: scheduledAt(37, 3, 58),
    end: scheduledAt(37, 4, 58),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'The shop closes at 5:00 PM.',
      type: 'personal',
    },
  },
  {
    id: 'b265de40-00ee-4f4f-ad08-004b31133852',
    title: 'New Feature Kickoff',
    start: scheduledAt(38, 9, 25),
    end: scheduledAt(38, 10, 25),
    color: 'var(--fc-yellow)',
    extendedProps: {
      description: 'Alignment meeting for the new Dashboard widgets.',
      type: 'meeting',
    },
  },
  {
    id: 'cc119abd-9505-4bd5-b4d2-07c1babe52f9',
    title: 'Relax & Meditate',
    start: scheduledAt(39, 12, 7),
    end: scheduledAt(39, 16, 7),
    color: 'var(--fc-green)',
    extendedProps: {
      description: 'Scheduled downtime to prevent burnout.',
      type: 'personal',
    },
  },
];
