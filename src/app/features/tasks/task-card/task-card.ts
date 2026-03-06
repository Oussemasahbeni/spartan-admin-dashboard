import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideLink, lucideMessageSquare, lucideMoreVertical } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { Task } from '../model/task';

@Component({
  selector: 'adm-task-card',
  standalone: true,
  imports: [TranslocoModule, HlmIconImports, HlmBadgeImports, HlmCardImports, HlmButtonImports],
  providers: [provideIcons({ lucideCalendar, lucideMessageSquare, lucideLink, lucideMoreVertical })],
  host: {
    class: 'block group',
  },
  template: `
    <section hlmCard class="transition-shadow hover:shadow-md">
      <div hlmCardContent class="flex flex-col p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <h4 class="text-card-foreground group-hover:text-primary text-base leading-none font-semibold transition-colors">
              {{ task().title }}
            </h4>
            @if (task().description) {
              <p class="text-muted-foreground line-clamp-2 leading-relaxed">
                {{ task().description }}
              </p>
            }
          </div>
          <img
            class="border-background h-8 w-8 shrink-0 rounded-full border-2 shadow-sm"
            [src]="task().assigneeAvatar"
            [alt]="task().title"
          />
        </div>

        @if (task().imageUrl) {
          <div class="border-border mt-3 overflow-hidden rounded-md border">
            <img
              class="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="Task preview"
              [src]="task().imageUrl"
            />
          </div>
        }

        @if (task().tags.length > 0) {
          <div class="mt-4 flex flex-wrap gap-1.5">
            @for (tag of task().tags; track tag) {
              <div hlmBadge variant="secondary" class="px-2 py-0 font-medium lowercase">
                {{ tag }}
              </div>
            }
          </div>
        }

        <div class="text-muted-foreground/60 border-border/50 mt-4 flex items-center justify-between border-t pt-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <ng-icon hlmIcon name="lucideCalendar" size="xs" />
              <span>{{ task().dueDate }}</span>
            </div>

            @if (task().commentsCount > 0) {
              <div class="flex items-center gap-1.5">
                <ng-icon hlmIcon name="lucideMessageSquare" size="xs" />
                <span>{{ task().commentsCount }}</span>
              </div>
            }
          </div>

          <button hlmBtn type="button" variant="ghost" size="icon" class="h-6 w-6" (click)="optionsClick.emit($event)">
            <ng-icon hlmIcon name="lucideMoreVertical" size="xs" />
          </button>
        </div>
      </div>
    </section>
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
}
