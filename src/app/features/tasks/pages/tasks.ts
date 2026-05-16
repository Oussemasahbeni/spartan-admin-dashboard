import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFilter, lucideMoreVertical, lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { TaskCard } from '../components/task-card/task-card';
import { TaskDetails } from '../components/task-details/task-details';
import { TaskForm } from '../components/task-form/task-form';
import { Task, TaskStatus } from '../model/task';

@Component({
  selector: 'adm-tasks',
  imports: [TranslocoModule, DragDropModule, HlmButtonImports, HlmIconImports, TaskCard],
  providers: [provideIcons({ lucidePlus, lucideMoreVertical, lucideFilter, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.html',
})
export default class Tasks {
  // ==========================================
  // Services
  // ==========================================

  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);

  // ==========================================
  // State
  // ==========================================

  /** All tasks stored as a flat list; columns are derived via `taskGroups`. */
  public readonly tasks = signal<Task[]>([
    {
      id: '1',
      title: 'Finish user onboarding',
      description: 'Complete onboarding checklist and send welcome email to new users.',
      status: 'todo',
      dueDate: '2026-10-03',
      commentsCount: 1,
      isCompleted: false,
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
      tags: [{ name: 'Development', color: 'indigo' }],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
      id: '2',
      title: 'Work in progress(WIP) Dashboard',
      description: 'Polish dashboard widgets and finalize layout for the release.',
      status: 'inprogress',
      dueDate: '2025-09-29',
      commentsCount: 1,
      isCompleted: false,
      tags: [{ name: 'Development', color: 'indigo' }],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=2',
    },
    {
      id: '3',
      title: 'Manage internal feedback',
      description: 'Review and triage internal feedback from the team; log action items.',
      status: 'completed',
      dueDate: '2025-10-04',
      commentsCount: 1,
      isCompleted: true,
      tags: [{ name: 'Dev', color: 'slate' }],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=3',
    },
    {
      id: '4',
      title: 'Design landing page',
      description: 'Create final designs and hand off assets to frontend for implementation.',
      status: 'inprogress',
      dueDate: '2025-10-11',
      commentsCount: 2,
      attachmentsCount: 1,
      isCompleted: false,
      imageUrl: 'https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?auto=format&fit=crop&w=1200&q=80',
      tags: [{ name: 'Design', color: 'violet' }],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=4',
    },
    {
      id: '5',
      title: 'Fix payment bug',
      description: 'Investigate transaction failure and deploy hotfix to production.',
      status: 'todo',
      dueDate: '2025-09-30',
      commentsCount: 3,
      isCompleted: false,
      tags: [
        { name: 'Bugfix', color: 'red' },
        { name: 'Payments', color: 'amber' },
      ],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=5',
    },
    {
      id: '6',
      title: 'Prepare release v1.2',
      description: 'Finalize changelog, run release checklist and coordinate deployment.',
      status: 'inprogress',
      dueDate: '2025-03-10',
      commentsCount: 0,
      attachmentsCount: 2,
      isCompleted: false,
      tags: [{ name: 'Release', color: 'emerald' }],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=6',
    },
    {
      id: '7',
      title: 'Customer feedback review',
      description: 'Aggregate customer feedback and prepare items for product backlog.',
      status: 'todo',
      dueDate: '2025-10-17',
      commentsCount: 4,
      isCompleted: false,
      tags: [{ name: 'Support', color: 'sky' }],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=7',
    },
    {
      id: '8',
      title: 'Refactor auth module',
      description: 'Refactor authentication flows to improve testability and security.',
      status: 'inprogress',
      dueDate: '2026-10-06',
      commentsCount: 1,
      isCompleted: false,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      tags: [
        { name: 'Refactor', color: 'fuchsia' },
        { name: 'Auth', color: 'rose' },
      ],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=8',
    },
    {
      id: '9',
      title: 'Write unit tests',
      description: 'Increase unit test coverage for core services and components.',
      status: 'completed',
      dueDate: '2025-09-25',
      commentsCount: 0,
      isCompleted: true,
      tags: [{ name: 'Testing', color: 'green' }],
      assigneeAvatar: 'https://i.pravatar.cc/150?u=9',
    },
  ]);

  /** Static column definitions that drive the kanban board layout. */
  protected readonly columns = [
    { id: 'todo' as TaskStatus, title: 'To Do', color: 'bg-slate-400' },
    { id: 'inprogress' as TaskStatus, title: 'In Progress', color: 'bg-blue-500' },
    { id: 'completed' as TaskStatus, title: 'Completed', color: 'bg-emerald-500' },
  ];

  /**
   * Derived signal that groups tasks by status.
   * Also exposes the total count so the template avoids re-computing it.
   */
  protected readonly taskGroups = computed(() => {
    const all = this.tasks();
    return {
      todo: all.filter((t) => t.status === 'todo'),
      inprogress: all.filter((t) => t.status === 'inprogress'),
      completed: all.filter((t) => t.status === 'completed'),
      count: all.length,
    };
  });

  /** Tracks which column the user is currently dragging over for visual feedback. */
  protected readonly draggingOverColumn = signal<TaskStatus | null>(null);

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
  protected readonly existingTags = computed(() => {
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
        targetTasks.splice(event.currentIndex, 0, this.syncTaskStatusAndCompletion(task, { status: newStatus }));
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

  protected toggleTaskComplete(task: Task): void {
    this.tasks.update((all) =>
      all.map((t) => (t.id === task.id ? this.syncTaskStatusAndCompletion(t, { isCompleted: !t.isCompleted }) : t))
    );
  }

  private syncTaskStatusAndCompletion(task: Task, changes: Partial<Pick<Task, 'status' | 'isCompleted'>>): Task {
    const nextStatus = changes.status ?? task.status;
    const nextIsCompleted = changes.isCompleted ?? task.isCompleted;

    if (nextStatus === 'completed' || nextIsCompleted) {
      return {
        ...task,
        ...changes,
        status: 'completed',
        isCompleted: true,
      };
    }

    return {
      ...task,
      ...changes,
      status: nextStatus,
      isCompleted: false,
    };
  }

  protected openTaskDetailsDialog(task: Task): void {
    this._hlmDialogService.open(TaskDetails, {
      contentClass: 'w-4xl',
      context: { task },
    });
  }
}
