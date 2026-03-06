import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFilter, lucideMoreVertical, lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { Task, TaskStatus } from './model/task';
import { TaskCardComponent } from './task-card/task-card';

@Component({
  selector: 'adm-tasks',
  standalone: true,
  imports: [CommonModule, TranslocoModule, DragDropModule, HlmButtonImports, HlmIconImports, TaskCardComponent],
  providers: [provideIcons({ lucidePlus, lucideMoreVertical, lucideFilter, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.html',
})
export default class TasksComponent {
  readonly tasks = signal<Task[]>([
    {
      id: '1',
      title: 'Finish user onboarding',
      status: 'todo',
      dueDate: 'Tomorrow',
      commentsCount: 1,
      tags: ['Development'],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
      id: '2',
      title: 'Work in progress(WIP) Dashboard',
      status: 'inprogress',
      dueDate: 'Today',
      commentsCount: 1,
      tags: ['Development'],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=2',
    },
    {
      id: '3',
      title: 'Manage internal feedback',
      status: 'completed',
      dueDate: 'Tomorrow',
      commentsCount: 1,
      tags: ['Dev'],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=3',
    },
  ]);

  // Computed signals to split tasks into columns
  readonly todoTasks = computed(() => this.tasks().filter((t) => t.status === 'todo'));
  readonly inProgressTasks = computed(() => this.tasks().filter((t) => t.status === 'inprogress'));
  readonly completedTasks = computed(() => this.tasks().filter((t) => t.status === 'completed'));

  readonly columns = [
    { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-orange-500' },
    { id: 'completed', title: 'Completed', color: 'bg-green-500' },
  ];

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      // Reordering in same column - normally you'd update a 'position' property
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between columns
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as TaskStatus;

      // Update the signal state
      this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    }
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks().filter((t) => t.status === status);
  }
}
