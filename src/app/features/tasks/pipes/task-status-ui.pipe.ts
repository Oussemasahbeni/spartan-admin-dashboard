import { Pipe, PipeTransform } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheckCircle2, lucideLoader, lucideSquare } from '@ng-icons/lucide';
import { TaskStatus } from '../model/task';

@Pipe({ name: 'taskStatusUI' })
export class TaskStatusUIPipe implements PipeTransform {
  transform(value: TaskStatus) {
    const configs: Record<TaskStatus, { icon: string; class: string }> = {
      todo: { icon: 'lucideSquare', class: 'text-slate-500 dark:text-slate-400' },
      inprogress: { icon: 'lucideLoader', class: 'text-blue-500 dark:text-blue-400' },
      completed: { icon: 'lucideCheckCircle2', class: 'text-emerald-500 dark:text-emerald-400' },
    };
    return configs[value] ?? { icon: 'lucideCircleDashed', class: 'text-muted-foreground' };
  }
}

export function provideTaskStatusIcons() {
  return provideIcons({
    lucideSquare,
    lucideLoader,
    lucideCheckCircle2,
  });
}
