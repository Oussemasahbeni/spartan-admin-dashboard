import { Component, computed, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideCircle,
  lucideClock,
  lucideMessageSquare,
  lucideMoreVertical,
  lucidePaperclip,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { cva } from 'class-variance-authority';
import { parseISO, startOfDay } from 'date-fns';
import { TAG_COLOR_CLASSES } from '../../model/tag';
import { Task } from '../../model/task';
import { provideTaskStatusIcons, TaskStatusUIPipe } from '../../pipes/task-status-ui.pipe';

const dueDateVariants = cva('flex items-center gap-1 rounded-full border px-1.5 py-0.5 transition-colors', {
  variants: {
    state: {
      overdue: 'border-red-400 bg-red-50 text-red-500 dark:bg-red-950',
      completed: 'border-emerald-400 bg-emerald-50 text-emerald-600 dark:bg-emerald-950',
      default: 'border-transparent text-muted-foreground',
    },
  },
  defaultVariants: { state: 'default' },
});

@Component({
  selector: 'adm-task-card',
  imports: [
    TranslocoModule,
    TaskStatusUIPipe,
    HlmIconImports,
    HlmBadgeImports,
    HlmCardImports,
    HlmButtonImports,
    HlmAvatarImports,
    HlmSeparatorImports,
  ],
  providers: [
    provideIcons({ lucideCalendar, lucideClock, lucideCircle, lucideMessageSquare, lucidePaperclip, lucideMoreVertical }),
    provideTaskStatusIcons(),
  ],
  host: {
    class: 'block group',
  },
  template: `
    <div
      hlmCard
      role="button"
      tabindex="0"
      class="focus-visible:ring-ring cursor-pointer gap-0 py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      [aria-label]="task().title"
      (focusin)="groupFocused = true"
      (focusout)="onFocusOut($event)"
      (click)="taskClick.emit(task())"
      (keydown.enter)="taskClick.emit(task())"
      (keydown.space)="taskClick.emit(task()); $event.preventDefault()"
    >
      <!-- Optional cover image -->
      @if (task().imageUrl) {
        <div class="overflow-hidden rounded-t-xl">
          <img
            class="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt="Task preview"
            [src]="task().imageUrl!"
          />
        </div>
      }

      <!-- Card Header -->
      <div hlmCardHeader class="px-4 pt-4 pb-0 [.border-b]:pb-0">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start">
            <!-- Complete toggle -->
            <div
              [class]="
                (task().isCompleted ? 'w-9 pr-2' : 'w-0 group-hover:w-9 group-hover:pr-2') +
                ' group-focus-within:w-9 group-focus-within:pr-2 focus-visible:w-9 focus-visible:pr-2' +
                ' overflow-hidden transition-all duration-200 ease-in-out'
              "
            >
              <button
                hlmBtn
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Toggle task completion"
                [class]="task().isCompleted ? 'text-emerald-500' : 'text-muted-foreground'"
                (click)="toggleComplete.emit(task()); $event.stopPropagation()"
              >
                @if (task().isCompleted) {
                  <ng-icon hlmIcon name="lucideCheckCircle2" size="sm" />
                } @else {
                  <ng-icon hlmIcon name="lucideCircle" size="sm" />
                }
              </button>
            </div>

            <div class="flex min-w-0 flex-1 flex-col gap-1.5">
              <!-- Status badge -->
              @let ui = task().status | taskStatusUI;
              <span
                *transloco="let t; prefix: 'tasks.columns'"
                hlmBadge
                variant="outline"
                class="text-muted-foreground w-fit"
              >
                <ng-icon hlmIcon size="xs" [class]="ui.class" [name]="ui.icon" />
                {{ t(task().status) }}
              </span>
              <h4
                class="text-card-foreground group-hover:text-primary line-clamp-2 text-base leading-snug font-semibold transition-colors"
                [class.line-through]="task().isCompleted"
                [class.text-muted-foreground]="task().isCompleted"
              >
                {{ task().title }}
              </h4>
            </div>
          </div>

          <!-- Assignee avatar -->
          <hlm-avatar size="sm" class="ring-background shrink-0 ring-2">
            <img hlmAvatarImage [src]="task().assigneeAvatar" [alt]="task().title" />
            <span hlmAvatarFallback class="text-xs">{{ avatarInitials() }}</span>
          </hlm-avatar>
        </div>
      </div>

      <!-- Card Content -->
      <div hlmCardContent class="flex flex-col px-4 py-3">
        @if (task().description) {
          <p class="text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed">
            {{ task().description }}
          </p>
        }

        <!-- Tags -->
        @if (task().tags.length > 0) {
          <div class="flex flex-wrap gap-1">
            @for (tag of task().tags; track tag.name) {
              <span
                hlmBadge
                variant="outline"
                [class]="
                  'h-auto cursor-default rounded-full px-2 py-0 text-xs font-normal lowercase ' + tagColorClasses[tag.color]
                "
              >
                {{ tag.name }}
              </span>
            }
          </div>
        }
      </div>

      <!-- Separator -->
      <div hlmSeparator class="mx-4"></div>

      <!-- Card Footer -->
      <div hlmCardFooter class="flex items-center justify-between px-4 py-2.5">
        <div class="text-muted-foreground flex items-center gap-3 text-sm">
          <!-- Due date -->
          <div [class]="dueDateClass()">
            <ng-icon hlmIcon size="xs" [name]="isOverdue() ? 'lucideClock' : 'lucideCalendar'" />
            <span>{{ task().dueDate }}</span>
          </div>

          <!-- Comments -->
          @if (task().commentsCount > 0) {
            <div class="flex items-center gap-1">
              <ng-icon hlmIcon name="lucideMessageSquare" size="xs" />
              <span>{{ task().commentsCount }}</span>
            </div>
          }

          <!-- Attachments -->
          @if (task().attachmentsCount && task().attachmentsCount! > 0) {
            <div class="flex items-center gap-1">
              <ng-icon hlmIcon name="lucidePaperclip" size="xs" />
              <span>{{ task().attachmentsCount }}</span>
            </div>
          }
        </div>

        <!-- Options menu trigger -->
        <button
          hlmBtn
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Open task actions menu"
          (click)="optionsClick.emit($event); $event.stopPropagation()"
        >
          <ng-icon hlmIcon name="lucideMoreVertical" size="xs" />
        </button>
      </div>
    </div>
  `,
})
export class TaskCard {
  // ==========================================
  // Inputs
  // ==========================================

  public readonly task = input.required<Task>();

  protected groupFocused = false;

  // ==========================================
  // Outputs
  // ==========================================

  protected readonly optionsClick = output<MouseEvent>();
  protected readonly taskClick = output<Task>();
  protected readonly toggleComplete = output<Task>();

  // ==========================================
  // Derived state
  // ==========================================

  protected readonly dueDateClass = computed(() =>
    dueDateVariants({
      state: this.isOverdue() ? 'overdue' : this.task().isCompleted ? 'completed' : 'default',
    })
  );
  protected readonly tagColorClasses = TAG_COLOR_CLASSES;

  protected readonly isOverdue = computed(() => {
    if (this.task().isCompleted || !this.task().dueDate) return false;

    const dueDate = startOfDay(parseISO(this.task().dueDate));
    const today = startOfDay(new Date());

    return dueDate < today;
  });

  protected readonly avatarInitials = computed(() =>
    this.task()
      .title.split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
  );

  protected onFocusOut(event: FocusEvent): void {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    if (currentTarget instanceof HTMLElement && relatedTarget instanceof Node && currentTarget.contains(relatedTarget)) {
      return;
    }

    this.groupFocused = false;
  }
}
