import { FileManagerFile, FileManagerFolder } from './file';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Demo timestamps relative to "now", so the sample data never looks stale. */
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * MINUTE);
const hoursAgo = (hours: number) => new Date(Date.now() - hours * HOUR);
const daysAgo = (days: number) => new Date(Date.now() - days * DAY);

export const FOLDERS: FileManagerFolder[] = [
  { id: 'brand-assets', name: 'Brand assets', fileCount: 24, size: 1.8e9, updatedAt: minutesAgo(12) },
  { id: 'product-design', name: 'Product design', fileCount: 38, size: 4.6e9, updatedAt: daysAgo(1) },
  { id: 'legal-documents', name: 'Legal documents', fileCount: 16, size: 840e6, updatedAt: daysAgo(3) },
  { id: 'research', name: 'Research', fileCount: 11, size: 620e6, updatedAt: daysAgo(5) },
  { id: 'marketing', name: 'Marketing', fileCount: 29, size: 2.3e9, updatedAt: daysAgo(7) },
  { id: 'team-resources', name: 'Team resources', fileCount: 18, size: 1.2e9, updatedAt: daysAgo(10) },
];

export const FILES: FileManagerFile[] = [
  {
    id: 'product-roadmap',
    name: 'Product roadmap 2027.pdf',
    kind: 'pdf',
    size: 8.4e6,
    owner: 'Oussema Sahbeni',
    modifiedAt: minutesAgo(5),
    shared: true,
    starred: true,
  },
  {
    id: 'design-system',
    name: 'Design system foundations.fig',
    kind: 'design',
    size: 24.1e6,
    owner: 'Hannah Reed',
    modifiedAt: hoursAgo(2),
    shared: true,
    starred: false,
  },
  {
    id: 'campaign-performance',
    name: 'Campaign performance.xlsx',
    kind: 'spreadsheet',
    size: 2.7e6,
    owner: 'Ethan Brooks',
    modifiedAt: daysAgo(1),
    shared: false,
    starred: false,
  },
  {
    id: 'research-notes',
    name: 'Customer research notes.docx',
    kind: 'document',
    size: 1.2e6,
    owner: 'Hannah Reed',
    modifiedAt: new Date('2026-07-29T14:30:00'),
    shared: true,
    starred: true,
  },
  {
    id: 'release-assets',
    name: 'Release assets.zip',
    kind: 'archive',
    size: 186e6,
    owner: 'Oussema Sahbeni',
    modifiedAt: new Date('2026-07-28T11:00:00'),
    shared: false,
    starred: false,
  },
  {
    id: 'handoff-checklist',
    name: 'Handoff checklist.pdf',
    kind: 'pdf',
    size: 940e3,
    owner: 'Ethan Brooks',
    modifiedAt: new Date('2026-07-26T09:15:00'),
    shared: true,
    starred: false,
  },
  {
    id: 'quarterly-budget',
    name: 'Quarterly budget forecast.xlsx',
    kind: 'spreadsheet',
    size: 3.8e6,
    owner: 'Oussema Sahbeni',
    modifiedAt: new Date('2026-07-24T16:45:00'),
    shared: true,
    starred: false,
  },
  {
    id: 'mobile-app-prototype',
    name: 'Mobile app prototype.fig',
    kind: 'design',
    size: 18.6e6,
    owner: 'Ethan Brooks',
    modifiedAt: new Date('2026-07-23T10:20:00'),
    shared: true,
    starred: true,
  },
  {
    id: 'partnership-agreement',
    name: 'Partnership agreement.docx',
    kind: 'document',
    size: 620e3,
    owner: 'Ethan Brooks',
    modifiedAt: new Date('2026-07-21T13:00:00'),
    shared: false,
    starred: false,
  },
  {
    id: 'product-launch-brief',
    name: 'Product launch brief.pdf',
    kind: 'pdf',
    size: 4.2e6,
    owner: 'Oussema Sahbeni',
    modifiedAt: new Date('2026-07-19T15:30:00'),
    shared: true,
    starred: false,
  },
  {
    id: 'brand-exports',
    name: 'Brand exports.zip',
    kind: 'archive',
    size: 72e6,
    owner: 'Oussema Sahbeni',
    modifiedAt: new Date('2026-07-17T08:40:00'),
    shared: false,
    starred: false,
  },
];
