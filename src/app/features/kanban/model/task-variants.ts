import { cva } from 'class-variance-authority';
import { AvatarTone, TaskPriority, TaskTeam } from './task';

/** Badge classes for a task's priority; `high` relies on the hlmBadge `destructive` variant. */
export const priorityBadgeVariants = cva('shrink-0 rounded-md border-transparent px-2 font-medium', {
  variants: {
    priority: {
      high: '',
      medium: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
      low: 'bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    } satisfies Record<TaskPriority, string>,
  },
});

export const teamBadgeVariants = cva('rounded-md border-transparent px-2 font-medium', {
  variants: {
    team: {
      Backend: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      Data: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      Design: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300',
      Docs: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
      'Finance Ops': 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
      Platform: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
      Product: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
      QA: 'bg-red-500/10 text-red-700 dark:text-red-300',
      Security: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    } satisfies Record<TaskTeam, string>,
  },
});

/** Avatar-fallback classes for an owner's tone. */
export const avatarToneVariants = cva('rounded-sm text-[10px]', {
  variants: {
    tone: {
      zinc: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300',
      lime: 'bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300',
      indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
      fuchsia: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300',
      violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
      pink: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
      sky: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    } satisfies Record<AvatarTone, string>,
  },
});
