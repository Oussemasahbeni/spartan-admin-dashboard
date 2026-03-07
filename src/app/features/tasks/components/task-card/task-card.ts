import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideMessageSquare, lucideMoreVertical, lucidePaperclip } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { TAG_COLOR_CLASSES } from '../../model/tag';
import { Task } from '../../model/task';
import { provideTaskStatusIcons, TaskStatusUIPipe } from '../../pipes/task-status-ui.pipe';

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
    provideIcons({ lucideCalendar, lucideMessageSquare, lucidePaperclip, lucideMoreVertical }),
    provideTaskStatusIcons(),
  ],
  host: {
    class: 'block group',
  },
  template: `
    <div hlmCard class="gap-0 py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <!-- Optional cover image -->
      @if (task().imageUrl) {
        <div class="overflow-hidden rounded-t-xl">
          <img
            class="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt="Task preview"
            [src]="task().imageUrl"
          />
        </div>
      }

      <!-- Card Header -->
      <div hlmCardHeader class="px-4 pt-4 pb-0 [.border-b]:pb-0">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1 space-y-1.5">
            <!-- Status badge -->
            @let ui = task().status | taskStatusUI;
            <span *transloco="let t; prefix: 'tasks.columns'" hlmBadge variant="outline" class="text-muted-foreground w-fit">
              <ng-icon hlmIcon size="xs" [class]="ui.class" [name]="ui.icon" />
              {{ t(task().status) }}
            </span>
            <h4
              class="text-card-foreground group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold transition-colors"
            >
              {{ task().title }}
            </h4>
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
          <p class="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
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
                  'h-auto cursor-default rounded-full px-2 py-0 text-[10px] font-normal lowercase ' +
                  tagColorClasses[tag.color]
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
        <div class="text-muted-foreground flex items-center gap-3 text-xs">
          <!-- Due date -->
          <div class="flex items-center gap-1">
            <ng-icon hlmIcon name="lucideCalendar" size="xs" />
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
          size="icon"
          class="text-muted-foreground hover:text-foreground h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          (click)="optionsClick.emit($event)"
        >
          <ng-icon hlmIcon name="lucideMoreVertical" size="xs" />
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  // ==========================================
  // Inputs
  // ==========================================

  readonly task = input.required<Task>();

  // ==========================================
  // Outputs
  // ==========================================

  readonly optionsClick = output<MouseEvent>();

  // ==========================================
  // Derived state
  // ==========================================

  protected readonly tagColorClasses = TAG_COLOR_CLASSES;

  protected readonly avatarInitials = computed(() =>
    this.task()
      .title.split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
  );
}
