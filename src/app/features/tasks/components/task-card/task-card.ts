import { Component, computed, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideCheckCircle2,
  lucideCircle,
  lucideClock,
  lucideLoader,
  lucideMessageSquare,
  lucideMoreVertical,
  lucidePaperclip,
  lucideSquare,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { cva } from 'class-variance-authority';
import { parseISO, startOfDay } from 'date-fns';
import { TAG_COLOR_CLASSES } from '../../model/tag';
import { Task } from '../../model/task';

const dueDateVariants = cva('flex items-center gap-1 rounded-full border px-1.5 py-0.5 transition-colors', {
  variants: {
    state: {
      overdue: 'border-red-400 bg-red-50 text-red-500 dark:bg-red-950',
      completed: 'border-emerald-400 bg-emerald-50 text-emerald-600 dark:bg-emerald-950',
      default: 'text-muted-foreground border-transparent',
    },
  },
  defaultVariants: { state: 'default' },
});

@Component({
  selector: 'adm-task-card',
  imports: [
    TranslocoModule,
    NgIcon,
    HlmBadgeImports,
    HlmCardImports,
    HlmButtonImports,
    HlmAvatarImports,
    HlmSeparatorImports,
  ],
  providers: [
    provideIcons({
      lucideCalendar,
      lucideCheckCircle2,
      lucideCircle,
      lucideClock,
      lucideLoader,
      lucideMessageSquare,
      lucideMoreVertical,
      lucidePaperclip,
      lucideSquare,
    }),
  ],
  host: {
    class: 'block group',
  },
  template: `
    <article
      hlmCard
      role="button"
      tabindex="0"
      class="focus-visible:ring-ring cursor-pointer gap-0 py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      (focusin)="groupFocused = true"
      (focusout)="onFocusOut($event)"
      (click)="taskClick.emit(task())"
      (keydown.enter)="taskClick.emit(task())"
      (keydown.space)="$event.preventDefault(); taskClick.emit(task())"
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
                [attr.aria-label]="'tasks.card.toggleComplete' | transloco"
                [attr.aria-pressed]="task().isCompleted"
                [class]="task().isCompleted ? 'text-emerald-500' : 'text-muted-foreground'"
                (click)="toggleComplete.emit(task()); $event.stopPropagation()"
              >
                @if (task().isCompleted) {
                  <ng-icon name="lucideCheckCircle2" />
                } @else {
                  <ng-icon name="lucideCircle" />
                }
              </button>
            </div>

            <div class="flex min-w-0 flex-1 flex-col gap-1.5">
              <!-- Status badge -->
              <span
                *transloco="let t; prefix: 'tasks.columns'"
                hlmBadge
                variant="outline"
                class="text-muted-foreground w-fit"
              >
                @switch (task().status) {
                  @case ('todo') {
                    <ng-icon class="text-slate-500 dark:text-slate-400" name="lucideSquare" />
                  }
                  @case ('inprogress') {
                    <ng-icon class="text-blue-500 dark:text-blue-400" name="lucideLoader" />
                  }
                  @case ('completed') {
                    <ng-icon class="text-emerald-500 dark:text-emerald-400" name="lucideCheckCircle2" />
                  }
                  @default {
                    <ng-icon class="text-muted-foreground" name="lucideSquare" />
                  }
                }
                {{ t(task().status) }}
              </span>
              <h4
                class="text-card-foreground group-hover:text-primary line-clamp-2 text-base leading-snug font-semibold transition-colors"
                [class.line-through]="task().isCompleted"
                [class.text-muted-foreground]="task().isCompleted"
              >
                <button
                  type="button"
                  class="focus-visible:ring-ring cursor-pointer rounded-xs text-start focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  (click)="taskClick.emit(task()); $event.stopPropagation()"
                >
                  {{ task().title }}
                </button>
              </h4>
            </div>
          </div>

          <!-- Assignee avatar -->
          <hlm-avatar size="sm" class="ring-background shrink-0 ring-2">
            <img hlmAvatarImage loading="lazy" alt="" [src]="task().assigneeAvatar" />
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
            <ng-icon [name]="isOverdue() ? 'lucideClock' : 'lucideCalendar'" />
            <span>{{ task().dueDate }}</span>
          </div>

          <!-- Comments -->
          @if (task().commentsCount > 0) {
            <div class="flex items-center gap-1">
              <ng-icon name="lucideMessageSquare" />
              <span>{{ task().commentsCount }}</span>
            </div>
          }

          <!-- Attachments -->
          @if (task().attachmentsCount && task().attachmentsCount! > 0) {
            <div class="flex items-center gap-1">
              <ng-icon name="lucidePaperclip" />
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
          [attr.aria-label]="'tasks.card.openMenu' | transloco"
          (click)="optionsClick.emit($event); $event.stopPropagation()"
        >
          <ng-icon name="lucideMoreVertical" />
        </button>
      </div>
    </article>
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
