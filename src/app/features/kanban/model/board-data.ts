import { BoardState, ColumnId, TaskOwner } from './task';

export const COLUMN_IDS: ColumnId[] = ['todo', 'inProgress', 'inReview', 'done'];

export const TASK_OWNERS: TaskOwner[] = [
  { name: 'Oussema Sahbeni', tone: 'zinc' },
  { name: 'Ethan Brooks', tone: 'lime' },
  { name: 'Hannah Reed', tone: 'indigo' },
  { name: 'Rohan Iyer', tone: 'fuchsia' },
  { name: 'Nora Bennett', tone: 'violet' },
  { name: 'Vikram Menon', tone: 'pink' },
  { name: 'Clara Hughes', tone: 'sky' },
];

const [oussema, ethan, hannah, rohan, nora, vikram, clara] = TASK_OWNERS;

export const INITIAL_BOARD: BoardState = {
  todo: [
    {
      id: 'electron-app-shell',
      title: 'Electron app shell',
      description: 'Create local-first desktop shell with React, Tailwind, and shadcn/ui.',
      priority: 'high',
      dueDate: new Date(2026, 5, 20),
      progress: 25,
      owner: oussema,
      team: 'Platform',
      insights: [
        { label: 'attachments', count: 4 },
        { label: 'comments', count: 9 },
        { label: 'documents', count: 2 },
      ],
    },
    {
      id: 'secure-preload-api',
      title: 'Secure preload API',
      description: 'Expose renderer-safe methods for imports, records, PDFs, and backups.',
      priority: 'high',
      dueDate: new Date(2026, 5, 22),
      progress: 20,
      owner: nora,
      team: 'Backend',
      insights: [
        { label: 'attachments', count: 2 },
        { label: 'comments', count: 6 },
        { label: 'documents', count: 1 },
      ],
    },
    {
      id: 'party-employee-records',
      title: 'Party and employee records',
      description: 'Create local records for clients, contractors, employees, and identifiers.',
      priority: 'medium',
      dueDate: new Date(2026, 5, 24),
      progress: 15,
      owner: rohan,
      team: 'Product',
      insights: [
        { label: 'comments', count: 5 },
        { label: 'documents', count: 2 },
      ],
    },
    {
      id: 'generated-documents-index',
      title: 'Generated documents index',
      description: 'Plan filters for generated PDFs by party, salary month, employee, and import batch.',
      priority: 'medium',
      dueDate: new Date(2026, 5, 25),
      progress: 10,
      owner: hannah,
      team: 'Docs',
      insights: [
        { label: 'attachments', count: 2 },
        { label: 'comments', count: 4 },
      ],
    },
  ],
  inProgress: [
    {
      id: 'sqlite-drizzle-schema',
      title: 'SQLite and Drizzle schema',
      description: 'Model parties, employees, tenders, work orders, salary imports, and documents.',
      priority: 'high',
      dueDate: new Date(2026, 5, 26),
      progress: 65,
      owner: oussema,
      team: 'Data',
      insights: [
        { label: 'attachments', count: 5 },
        { label: 'comments', count: 11 },
        { label: 'documents', count: 4 },
      ],
    },
    {
      id: 'salary-excel-import',
      title: 'Salary Excel import',
      description: 'Read salary sheets with SheetJS and persist import batches locally.',
      priority: 'high',
      dueDate: new Date(2026, 5, 28),
      progress: 45,
      owner: ethan,
      team: 'Data',
      insights: [
        { label: 'attachments', count: 3 },
        { label: 'comments', count: 8 },
        { label: 'documents', count: 2 },
      ],
    },
    {
      id: 'column-mapping-builder',
      title: 'Column mapping builder',
      description: 'Map Excel columns to salary fields with reusable templates per party.',
      priority: 'medium',
      dueDate: new Date(2026, 6, 1),
      progress: 30,
      owner: clara,
      team: 'Design',
      insights: [
        { label: 'comments', count: 6 },
        { label: 'documents', count: 2 },
      ],
    },
  ],
  inReview: [
    {
      id: 'salary-row-validation',
      title: 'Salary row validation',
      description: 'Flag missing employee IDs, invalid amounts, duplicate rows, and unmapped fields.',
      priority: 'high',
      dueDate: new Date(2026, 6, 4),
      progress: 75,
      owner: nora,
      team: 'QA',
      insights: [
        { label: 'attachments', count: 4 },
        { label: 'comments', count: 10 },
      ],
    },
    {
      id: 'payslip-preview',
      title: 'Payslip preview',
      description: 'Preview generated payslips before bulk PDF export and document history.',
      priority: 'medium',
      dueDate: new Date(2026, 6, 6),
      progress: 60,
      owner: ethan,
      team: 'Finance Ops',
      insights: [
        { label: 'attachments', count: 3 },
        { label: 'comments', count: 7 },
        { label: 'documents', count: 3 },
      ],
    },
  ],
  done: [
    {
      id: 'architecture-rule',
      title: 'Architecture rule locked',
      description: 'Renderer stays UI-only; preload, IPC, services, and database stay separated.',
      priority: 'high',
      dueDate: new Date(2026, 5, 8),
      progress: 100,
      owner: oussema,
      team: 'Backend',
      insights: [
        { label: 'comments', count: 6 },
        { label: 'documents', count: 3 },
      ],
    },
    {
      id: 'private-mvp-scope',
      title: 'Private MVP scope',
      description: 'Start private source first, then revisit open-core after workflow validation.',
      priority: 'medium',
      dueDate: new Date(2026, 5, 10),
      progress: 100,
      owner: vikram,
      team: 'Finance Ops',
      insights: [
        { label: 'attachments', count: 2 },
        { label: 'comments', count: 4 },
      ],
    },
    {
      id: 'mvp-module-priorities',
      title: 'MVP module priorities',
      description: 'Payslip generation is first, but data model supports wider tender operations.',
      priority: 'medium',
      dueDate: new Date(2026, 5, 12),
      progress: 100,
      owner: rohan,
      team: 'Finance Ops',
      insights: [
        { label: 'comments', count: 5 },
        { label: 'documents', count: 2 },
      ],
    },
  ],
};
