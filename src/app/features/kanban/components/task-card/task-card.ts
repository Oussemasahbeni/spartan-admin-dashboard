import { Component, computed, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
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
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { BadgeVariants, HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { ColumnId, Task, TaskInsightLabel, TaskPriority } from '../../model/task';
import { avatarToneVariants, priorityBadgeVariants, teamBadgeVariants } from '../../model/task-variants';

const PRIORITY_CONFIG: Record<TaskPriority, { icon: string; variant: BadgeVariants['variant'] }> = {
  high: { icon: 'lucideFlame', variant: 'destructive' },
  medium: { icon: 'lucideArrowUpRight', variant: 'secondary' },
  low: { icon: 'lucideMinus', variant: 'secondary' },
};

const INSIGHT_ICONS: Record<TaskInsightLabel, string> = {
  attachments: 'lucidePaperclip',
  comments: 'lucideMessageSquare',
  documents: 'lucideFileText',
};

@Component({
  selector: 'adm-task-card',
  imports: [
    TranslocoModule,
    NgIcon,
    HlmAvatarImports,
    HlmBadgeImports,
    HlmProgressImports,
    HlmSeparatorImports,
    InitialsPipe,
  ],
  providers: [
    provideIcons({
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
    class: 'block',
  },
  template: `
    <article
      *transloco="let t; prefix: 'kanban.card'"
      class="bg-card text-card-foreground relative flex flex-col gap-3 rounded-xl border p-4 shadow-xs"
    >
      <div class="min-w-0 space-y-1.5">
        <div class="flex items-center justify-between gap-3">
          <h3 class="min-w-0 truncate text-sm leading-none font-medium">
            <!-- The title button's ::after overlay stretches its click target over the whole card. -->
            <button
              type="button"
              class="focus-visible:after:ring-ring text-start after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2"
              (click)="taskClick.emit(task())"
            >
              {{ task().title }}
            </button>
          </h3>
          <hlm-badge
            *transloco="let t; prefix: 'kanban.priority'"
            [variant]="priorityConfig().variant"
            [class]="priorityBadgeClass()"
          >
            <ng-icon [name]="priorityConfig().icon" />
            {{ t(task().priority) }}
          </hlm-badge>
        </div>
        <p class="text-muted-foreground line-clamp-2 text-sm leading-5">{{ task().description }}</p>
      </div>

      @if (!showProgressDetails()) {
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <hlm-avatar class="size-5">
              <span hlmAvatarFallback [class]="ownerToneClass()">
                {{ task().owner.name | initials }}
              </span>
            </hlm-avatar>
            <span class="text-muted-foreground text-sm">{{ task().owner.name }}</span>
          </div>

          <div class="text-muted-foreground flex min-w-0 items-center gap-1.5">
            <span class="truncate text-sm">{{ task().dueDate }}</span>
            <ng-icon name="lucideCalendarDays" />
          </div>
        </div>
      } @else {
        <div class="flex flex-col gap-3">
          <div class="space-y-1.5">
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="leading-none">{{ t('progress') }}</span>
              <span class="leading-none tabular-nums">{{ task().progress }}%</span>
            </div>
            <hlm-progress [value]="task().progress">
              <hlm-progress-indicator />
            </hlm-progress>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between gap-3">
              <span class="text-muted-foreground text-sm">{{ t('owner') }}</span>
              <div class="flex items-center gap-1.5">
                <span class="text-muted-foreground truncate text-sm">{{ task().owner.name }}</span>
                <hlm-avatar class="size-5">
                  <span hlmAvatarFallback [class]="ownerToneClass()">
                    {{ task().owner.name | initials }}
                  </span>
                </hlm-avatar>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3">
              <span class="text-muted-foreground text-sm">{{ t('dueDate') }}</span>
              <span class="text-muted-foreground flex items-center gap-1.5">
                <span class="truncate text-sm">{{ task().dueDate }}</span>
                <ng-icon name="lucideCalendarDays" />
              </span>
            </div>

            <div class="flex items-center justify-between gap-3">
              <span class="text-muted-foreground text-sm">{{ t('team') }}</span>
              <hlm-badge variant="secondary" [class]="teamBadgeClass()">
                {{ task().team }}
              </hlm-badge>
            </div>
          </div>
        </div>
      }

      <hlm-separator />

      <div>
        @if (isDone()) {
          <div class="flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-600">
            <ng-icon name="lucideBadgeCheck" />
            {{ t('done') }}
          </div>
        } @else {
          <div class="text-muted-foreground flex items-center gap-3 text-sm">
            @for (insight of task().insights; track insight.label) {
              <span class="flex items-center gap-1.5 text-sm">
                <ng-icon [name]="insightIcons[insight.label]" />
                {{ insight.count }}
              </span>
            }
          </div>
        }
      </div>
    </article>
  `,
})
export class TaskCard {
  public readonly task = input.required<Task>();
  public readonly columnId = input.required<ColumnId>();

  public readonly taskClick = output<Task>();

  protected readonly insightIcons = INSIGHT_ICONS;

  protected readonly isDone = computed(() => this.columnId() === 'done');
  protected readonly showProgressDetails = computed(() => this.columnId() === 'inProgress');
  protected readonly priorityConfig = computed(() => PRIORITY_CONFIG[this.task().priority]);
  protected readonly priorityBadgeClass = computed(() => priorityBadgeVariants({ priority: this.task().priority }));
  protected readonly ownerToneClass = computed(() => avatarToneVariants({ tone: this.task().owner.tone }));
  protected readonly teamBadgeClass = computed(() => teamBadgeVariants({ team: this.task().team }));
}
