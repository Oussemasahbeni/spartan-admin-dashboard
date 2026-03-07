import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFilter, lucideMoreVertical, lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { TaskCardComponent } from '../components/task-card/task-card';
import { TaskForm } from '../components/task-form/task-form';
import { Tag } from '../model/tag';
import { Task, TaskStatus } from '../model/task';

@Component({
  selector: 'adm-tasks',
  imports: [TranslocoModule, DragDropModule, HlmButtonImports, HlmIconImports, TaskCardComponent],
  providers: [provideIcons({ lucidePlus, lucideMoreVertical, lucideFilter, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.html',
})
export default class TasksComponent {
  // ==========================================
  // Services
  // ==========================================

  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);

  // ==========================================
  // State
  // ==========================================

  /** All tasks stored as a flat list; columns are derived via `taskGroups`. */
  readonly tasks = signal<Task[]>([
    {
      id: '1',
      title: 'Finish user onboarding',
      status: 'todo',
      dueDate: 'Tomorrow',
      commentsCount: 1,
      tags: [{ name: 'Development', color: 'indigo' }] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
      id: '2',
      title: 'Work in progress(WIP) Dashboard',
      status: 'inprogress',
      dueDate: 'Today',
      commentsCount: 1,
      tags: [{ name: 'Development', color: 'indigo' }] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=2',
    },
    {
      id: '3',
      title: 'Manage internal feedback',
      status: 'completed',
      dueDate: 'Tomorrow',
      commentsCount: 1,
      tags: [{ name: 'Dev', color: 'slate' }] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=3',
    },
    {
      id: '4',
      title: 'Design landing page',
      status: 'inprogress',
      dueDate: 'Next week',
      commentsCount: 2,
      attachmentsCount: 1,
      tags: [{ name: 'Design', color: 'violet' }] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=4',
    },
    {
      id: '5',
      title: 'Fix payment bug',
      status: 'todo',
      dueDate: 'Today',
      commentsCount: 3,
      tags: [
        { name: 'Bugfix', color: 'red' },
        { name: 'Payments', color: 'amber' },
      ] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=5',
    },
    {
      id: '6',
      title: 'Prepare release v1.2',
      status: 'inprogress',
      dueDate: 'Mar 10',
      commentsCount: 0,
      attachmentsCount: 2,
      tags: [{ name: 'Release', color: 'emerald' }] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=6',
    },
    {
      id: '7',
      title: 'Customer feedback review',
      status: 'todo',
      dueDate: 'Friday',
      commentsCount: 4,
      tags: [{ name: 'Support', color: 'sky' }] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=7',
    },
    {
      id: '8',
      title: 'Refactor auth module',
      status: 'inprogress',
      dueDate: 'Next Monday',
      commentsCount: 1,
      tags: [
        { name: 'Refactor', color: 'fuchsia' },
        { name: 'Auth', color: 'rose' },
      ] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=8',
    },
    {
      id: '9',
      title: 'Write unit tests',
      status: 'completed',
      dueDate: 'Yesterday',
      commentsCount: 0,
      tags: [{ name: 'Testing', color: 'green' }] satisfies Tag[],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=9',
    },
  ]);

  /** Static column definitions that drive the kanban board layout. */
  readonly columns = [
    { id: 'todo' as TaskStatus, title: 'To Do', color: 'bg-slate-400' },
    { id: 'inprogress' as TaskStatus, title: 'In Progress', color: 'bg-blue-500' },
    { id: 'completed' as TaskStatus, title: 'Completed', color: 'bg-emerald-500' },
  ];

  /**
   * Derived signal that groups tasks by status.
   * Also exposes the total count so the template avoids re-computing it.
   */
  readonly taskGroups = computed(() => {
    const all = this.tasks();
    return {
      todo: all.filter((t) => t.status === 'todo'),
      inprogress: all.filter((t) => t.status === 'inprogress'),
      completed: all.filter((t) => t.status === 'completed'),
      count: all.length,
    };
  });

  /** Tracks which column the user is currently dragging over for visual feedback. */
  readonly draggingOverColumn = signal<TaskStatus | null>(null);

  /**
   * Returns the full class string for a kanban drop zone.
   * Applies a highlight style when the user drags over the column.
   */
  dropZoneClass(colId: TaskStatus): string {
    const base = 'relative flex flex-1 flex-col overflow-hidden rounded-xl border-2 transition-all duration-200';
    return this.draggingOverColumn() === colId
      ? `${base} bg-primary/10 border-primary/50 scale-[1.01] shadow-sm`
      : `${base} bg-muted/30 border-transparent hover:bg-muted/50`;
  }

  /** Unique tags derived from all tasks, deduplicated by name. */
  readonly existingTags = computed(() => {
    const tags = this.tasks().flatMap((t) => t.tags);
    return Array.from(new Map(tags.map((tag) => [tag.name, tag])).values());
  });

  // ==========================================
  // Public Methods
  // ==========================================

  drop(event: CdkDragDrop<Task[]>) {
    this.draggingOverColumn.set(null);

    const previousStatus = event.previousContainer.id as TaskStatus;
    const newStatus = event.container.id as TaskStatus;

    if (previousStatus === newStatus) {
      // Reorder within the same column
      this.tasks.update((allTasks) => {
        const colTasks = [...allTasks.filter((t) => t.status === previousStatus)];
        const otherTasks = allTasks.filter((t) => t.status !== previousStatus);
        const [moved] = colTasks.splice(event.previousIndex, 1);
        colTasks.splice(event.currentIndex, 0, moved);
        return [...otherTasks, ...colTasks];
      });
    } else {
      // Move to a different column and insert at the drop position
      const task = event.item.data as Task;
      this.tasks.update((allTasks) => {
        const targetTasks = [...allTasks.filter((t) => t.status === newStatus)];
        const otherTasks = allTasks.filter((t) => t.status !== newStatus && t.id !== task.id);
        targetTasks.splice(event.currentIndex, 0, { ...task, status: newStatus });
        return [...otherTasks, ...targetTasks];
      });
    }
  }

  // ==========================================
  // Private Methods
  // ==========================================

  protected openAddTaskDialog(): void {
    this._hlmDialogService
      .open(TaskForm, {
        contentClass: 'w-2xl',
        context: { existingTags: this.existingTags() },
      })
      .closed$.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((newTask) => {
        if (newTask) this.tasks.update((t) => [...t, newTask as Task]);
      });
  }
}
