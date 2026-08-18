import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideBot,
  lucideChevronDown,
  lucideGripVertical,
  lucideKanban,
  lucideLayoutTemplate,
  lucideList,
  lucideMoreVertical,
  lucidePlus,
  lucideSearch,
  lucideSlidersHorizontal,
  lucideTable2,
  lucideUpload,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

import { TaskCard } from '../components/task-card/task-card';
import { TaskDetails } from '../components/task-details/task-details';
import { TaskForm } from '../components/task-form/task-form';
import { COLUMN_IDS, INITIAL_BOARD } from '../model/board-data';
import { BoardState, ColumnId, Task, TaskFormResult } from '../model/task';

@Component({
  selector: 'adm-kanban',
  imports: [
    TranslocoModule,
    DragDropModule,
    NgIcon,
    HlmButtonImports,
    HlmButtonGroupImports,
    HlmDropdownMenuImports,
    HlmEmptyImports,
    HlmInputGroupImports,
    HlmTabsImports,
    TaskCard,
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideBot,
      lucideChevronDown,
      lucideGripVertical,
      lucideKanban,
      lucideLayoutTemplate,
      lucideList,
      lucideMoreVertical,
      lucidePlus,
      lucideSearch,
      lucideSlidersHorizontal,
      lucideTable2,
      lucideUpload,
    }),
  ],
  templateUrl: './kanban.html',
})
export default class Kanban {
  // ==========================================
  // Services
  // ==========================================

  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _transloco = inject(TranslocoService);

  // ==========================================
  // State
  // ==========================================

  protected readonly viewTab = signal('board');
  protected readonly searchQuery = signal('');

  protected readonly board = signal<BoardState>(INITIAL_BOARD);
  protected readonly columnOrder = signal<ColumnId[]>([...COLUMN_IDS]);

  /** Tracks the column the user is currently dragging a task over, for the highlight state. */
  protected readonly draggingOverColumn = signal<ColumnId | null>(null);

  protected readonly searchActive = computed(() => this.searchQuery().trim().length > 0);

  /** Board filtered by the search query; identical to `board` when the query is empty. */
  protected readonly filteredBoard = computed<BoardState>(() => {
    const board = this.board();
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return board;

    const matches = (task: Task) =>
      task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query);

    return {
      todo: board.todo.filter(matches),
      inProgress: board.inProgress.filter(matches),
      inReview: board.inReview.filter(matches),
      done: board.done.filter(matches),
    };
  });

  /**
   * CLDR plural category ('one', 'few', 'many', ...) of `count` for the active language.
   * Used to pick the matching `column.taskCount.*` translation key.
   */
  protected pluralOf(count: number): Intl.LDMLPluralRule {
    return new Intl.PluralRules(this._transloco.getActiveLang()).select(count);
  }

  // ==========================================
  // Drag & Drop
  // ==========================================

  protected dropColumn(event: CdkDragDrop<ColumnId[]>): void {
    this.columnOrder.update((order) => {
      const next = [...order];
      moveItemInArray(next, event.previousIndex, event.currentIndex);
      return next;
    });
  }

  protected dropTask(event: CdkDragDrop<Task[]>): void {
    this.draggingOverColumn.set(null);

    const from = event.previousContainer.id as ColumnId;
    const to = event.container.id as ColumnId;

    this.board.update((board) => {
      const next: BoardState = { ...board, [from]: [...board[from]] };
      if (from === to) {
        moveItemInArray(next[from], event.previousIndex, event.currentIndex);
      } else {
        next[to] = [...board[to]];
        transferArrayItem(next[from], next[to], event.previousIndex, event.currentIndex);
      }
      return next;
    });
  }

  // ==========================================
  // Search
  // ==========================================

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  // ==========================================
  // Dialogs
  // ==========================================

  protected openAddTaskDialog(columnId?: ColumnId): void {
    this._hlmDialogService
      .open(TaskForm, {
        context: { columnId },
        contentClass: 'sm:min-w-lg',
      })
      .closed$.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((result) => {
        if (!result) return;
        const { columnId: target, task } = result as TaskFormResult;
        this.board.update((board) => ({ ...board, [target]: [...board[target], task] }));
      });
  }

  protected openTaskDetailsDialog(task: Task, columnId: ColumnId): void {
    this._hlmDialogService.open(TaskDetails, {
      context: { task, columnId },
      contentClass: 'sm:min-w-lg',
    });
  }
}
