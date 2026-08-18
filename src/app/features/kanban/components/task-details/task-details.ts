import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlignLeft,
  lucideArrowUpRight,
  lucideBadgeCheck,
  lucideCalendarDays,
  lucideFileText,
  lucideFlame,
  lucideMessageSquare,
  lucideMinus,
  lucidePaperclip,
} from '@ng-icons/lucide';
import { InitialsPipe } from '@shared/pipes/initials/initials.pipe';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { ColumnId, Task, TaskInsightLabel, TaskPriority } from '../../model/task';
import { avatarToneVariants, priorityBadgeVariants, teamBadgeVariants } from '../../model/task-variants';

export interface TaskDetailsContext {
  task: Task;
  columnId: ColumnId;
}

const PRIORITY_ICONS: Record<TaskPriority, string> = {
  high: 'lucideFlame',
  medium: 'lucideArrowUpRight',
  low: 'lucideMinus',
};

const INSIGHT_ICONS: Record<TaskInsightLabel, string> = {
  attachments: 'lucidePaperclip',
  comments: 'lucideMessageSquare',
  documents: 'lucideFileText',
};

@Component({
  selector: 'adm-task-details',
  imports: [
    TranslocoModule,
    HlmDialogImports,
    NgIcon,
    HlmBadgeImports,
    HlmButtonImports,
    HlmAvatarImports,
    HlmProgressImports,
    HlmSeparatorImports,
    InitialsPipe,
  ],
  providers: [
    provideIcons({
      lucideAlignLeft,
      lucideArrowUpRight,
      lucideBadgeCheck,
      lucideCalendarDays,
      lucideFileText,
      lucideFlame,
      lucideMessageSquare,
      lucideMinus,
      lucidePaperclip,
    }),
  ],
  host: {
    class: 'block w-full',
  },
  template: `
    @let task = _task;

    <!-- Title row -->
    <div *transloco="let t; prefix: 'kanban'" class="mb-5 flex flex-col gap-2">
      <h2 class="text-foreground text-xl leading-snug font-semibold">{{ task.title }}</h2>
      <div class="flex flex-wrap items-center gap-1.5">
        <hlm-badge [variant]="task.priority === 'high' ? 'destructive' : 'secondary'" [class]="priorityBadgeClass">
          <ng-icon [name]="priorityIcons[task.priority]" />
          {{ t('priority.' + task.priority) }}
        </hlm-badge>
        <hlm-badge variant="secondary" [class]="teamBadgeClass">
          {{ task.team }}
        </hlm-badge>
        @if (_columnId === 'done') {
          <span class="flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-600">
            <ng-icon name="lucideBadgeCheck" />
            {{ t('card.done') }}
          </span>
        }
      </div>
    </div>

    <div *transloco="let t; prefix: 'kanban.details'" class="flex flex-col gap-5">
      <!-- Description -->
      <section>
        <h3 class="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
          <ng-icon name="lucideAlignLeft" />
          {{ t('description') }}
        </h3>
        @if (task.description) {
          <div class="bg-muted/40 rounded-lg p-3">
            <p class="text-foreground/80 text-sm leading-relaxed">{{ task.description }}</p>
          </div>
        } @else {
          <div class="bg-muted/40 rounded-lg p-3">
            <p class="text-muted-foreground/60 text-sm italic">{{ t('noDescription') }}</p>
          </div>
        }
      </section>

      <!-- Progress -->
      <section>
        <div class="text-muted-foreground mb-2 flex items-center justify-between text-xs">
          <h3 class="font-semibold tracking-widest uppercase">{{ t('progress') }}</h3>
          <span class="tabular-nums">{{ task.progress }}%</span>
        </div>
        <hlm-progress [value]="task.progress">
          <hlm-progress-indicator />
        </hlm-progress>
      </section>

      <div hlmSeparator></div>

      <!-- Meta -->
      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-3">
          <span class="text-muted-foreground text-sm">{{ t('owner') }}</span>
          <div class="flex items-center gap-1.5">
            <hlm-avatar class="size-5 rounded-sm after:rounded-sm">
              <span hlmAvatarFallback [class]="avatarToneClass">
                {{ task.owner.name | initials }}
              </span>
            </hlm-avatar>
            <span class="text-foreground text-sm font-medium">{{ task.owner.name }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between gap-3">
          <span class="text-muted-foreground text-sm">{{ t('dueDate') }}</span>
          <span class="text-foreground flex items-center gap-1.5 text-sm font-medium">
            {{ task.dueDate }}
            <ng-icon name="lucideCalendarDays" />
          </span>
        </div>

        @if (task.insights.length > 0) {
          <div class="flex items-center justify-between gap-3">
            <span class="text-muted-foreground text-sm">{{ t('insights') }}</span>
            <div class="text-muted-foreground flex items-center gap-3 text-sm">
              @for (insight of task.insights; track insight.label) {
                <span class="flex items-center gap-1.5">
                  <ng-icon [name]="insightIcons[insight.label]" />
                  {{ insight.count }}
                </span>
              }
            </div>
          </div>
        }
      </section>
    </div>

    <!-- Footer -->
    <div *transloco="let t; prefix: 'kanban.details'" class="mt-6 flex justify-end">
      <button hlmBtn variant="outline" size="sm" type="button" hlmDialogClose>
        {{ t('close') }}
      </button>
    </div>
  `,
})
export class TaskDetails {
  private readonly _dialogContext = injectBrnDialogContext<TaskDetailsContext>();

  protected readonly _task = this._dialogContext.task;
  protected readonly _columnId = this._dialogContext.columnId;

  protected readonly priorityIcons = PRIORITY_ICONS;
  protected readonly insightIcons = INSIGHT_ICONS;

  protected readonly priorityBadgeClass = priorityBadgeVariants({ priority: this._task.priority });
  protected readonly teamBadgeClass = teamBadgeVariants({ team: this._task.team });
  protected readonly avatarToneClass = avatarToneVariants({ tone: this._task.owner.tone });
}
