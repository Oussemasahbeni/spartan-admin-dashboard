import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlignLeft,
  lucideCalendar,
  lucideCheckCircle2,
  lucideLayout,
  lucideLoader,
  lucideMessageSquare,
  lucidePaperclip,
  lucideSquare,
  lucideTag,
  lucideUser,
} from '@ng-icons/lucide';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { TAG_COLOR_CLASSES } from '../../model/tag';
import { Task } from '../../model/task';

export interface TaskDetailsContext {
  task: Task;
}

@Component({
  selector: 'adm-task-details',
  imports: [
    TranslocoModule,
    HlmDialogImports,
    NgIcon,
    HlmBadgeImports,
    HlmButtonImports,
    HlmAvatarImports,
    HlmSeparatorImports,
  ],
  providers: [
    provideIcons({
      lucideAlignLeft,
      lucideCalendar,
      lucideLayout,
      lucideMessageSquare,
      lucidePaperclip,
      lucideTag,
      lucideUser,
      lucideCheckCircle2,
      lucideLoader,
      lucideSquare,
    }),
  ],
  host: {
    class: 'block w-full',
  },

  template: `
    @let task = _task;

    <!-- Cover image -->
    @if (task.imageUrl) {
      <div class="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
        <div class="relative h-40 w-full">
          <img class="h-full w-full object-cover" alt="Task cover" [src]="task.imageUrl" />
          <div class="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    }

    <!-- Title row -->
    <div *transloco="let t; prefix: 'tasks'" class="mb-5 flex items-start gap-3">
      <ng-icon name="lucideLayout" class="text-muted-foreground mt-0.5 shrink-0" />
      <div class="min-w-0 flex-1">
        <h2 class="text-foreground text-xl leading-snug font-semibold">{{ task.title }}</h2>
        <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span hlmBadge variant="outline" class="text-muted-foreground h-auto gap-1 rounded-full px-2 py-0.5 text-[11px]">
            @switch (task.status) {
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
            {{ t('columns.' + task.status) }}
          </span>
          @for (tag of task.tags; track tag.name) {
            <span
              hlmBadge
              variant="outline"
              [class]="
                'h-auto cursor-default rounded-full px-2 py-0.5 text-[11px] font-medium ' + tagColorClasses[tag.color]
              "
            >
              {{ tag.name }}
            </span>
          }
        </div>
      </div>
    </div>

    <!-- Two-column body -->
    <div *transloco="let t; prefix: 'tasks.details'" class="flex gap-6">
      <!-- LEFT: main content -->
      <div class="flex min-w-0 flex-1 flex-col gap-6">
        <!-- Description -->
        <section>
          <h3 class="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
            <ng-icon name="lucideAlignLeft" />
            {{ t('description') }}
          </h3>
          @if (task.description) {
            <div class="bg-muted/40 hover:bg-muted/60 rounded-lg p-3 transition-colors">
              <p class="text-foreground/80 text-sm leading-relaxed">{{ task.description }}</p>
            </div>
          } @else {
            <div class="bg-muted/40 hover:bg-muted/60 cursor-default rounded-lg p-3 transition-colors">
              <p class="text-muted-foreground/60 text-sm italic">{{ t('noDescription') }}</p>
            </div>
          }
        </section>

        <!-- Activity -->
        <section>
          <h3 class="text-muted-foreground mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
            <ng-icon name="lucideMessageSquare" />
            {{ t('activity') }}
          </h3>
          <div class="flex items-center gap-3">
            <hlm-avatar size="sm" class="ring-background shrink-0 ring-2">
              <img hlmAvatarImage loading="lazy" alt="" [src]="task.assigneeAvatar" />
              <span hlmAvatarFallback class="text-xs">{{ avatarInitials }}</span>
            </hlm-avatar>
            <div class="bg-muted/40 flex-1 rounded-lg px-3 py-2.5">
              <p class="text-muted-foreground text-xs">
                @if (task.commentsCount > 0) {
                  {{ task.commentsCount }} {{ t('commentsCount') }}
                } @else {
                  {{ t('noComments') }}
                }
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT: sidebar -->
      <aside class="flex w-[30%] shrink-0 flex-col gap-4">
        <!-- Members -->
        <div>
          <h3 class="text-muted-foreground mb-2 text-[10px] font-semibold tracking-widest uppercase">{{ t('members') }}</h3>
          <div class="flex flex-wrap gap-1.5">
            <hlm-avatar size="lg" class="ring-background ring-2">
              <img hlmAvatarImage loading="lazy" alt="" [src]="task.assigneeAvatar" />
              <span hlmAvatarFallback class="text-xs">{{ avatarInitials }}</span>
            </hlm-avatar>
          </div>
        </div>

        <div hlmSeparator></div>

        <!-- Labels / Tags -->
        @if (task.tags.length > 0) {
          <div>
            <h3 class="text-muted-foreground mb-2 text-[10px] font-semibold tracking-widest uppercase">
              <ng-icon name="lucideTag" class="mr-0.5" />
              {{ t('labels') }}
            </h3>
            <div class="flex flex-col gap-1.5">
              @for (tag of task.tags; track tag.name) {
                <span [class]="'w-full rounded-md px-2.5 py-1 text-xs font-semibold ' + tagColorClasses[tag.color]">
                  {{ tag.name }}
                </span>
              }
            </div>
          </div>

          <div hlmSeparator></div>
        }

        <!-- Due date -->
        <div>
          <h3 class="text-muted-foreground mb-2 text-[10px] font-semibold tracking-widest uppercase">
            <ng-icon name="lucideCalendar" class="mr-0.5" />
            {{ t('dueDate') }}
          </h3>
          <div class="bg-muted/50 flex items-center gap-1.5 rounded-md px-2.5 py-1.5">
            <ng-icon name="lucideCalendar" class="text-muted-foreground shrink-0" />
            <span class="text-foreground text-xs font-medium">{{ task.dueDate }}</span>
          </div>
        </div>

        <!-- Attachments -->
        @if (task.attachmentsCount && task.attachmentsCount > 0) {
          <div hlmSeparator></div>
          <div>
            <h3 class="text-muted-foreground mb-2 text-[10px] font-semibold tracking-widest uppercase">
              <ng-icon name="lucidePaperclip" class="mr-0.5" />
              {{ t('attachments') }}
            </h3>
            <div class="bg-muted/50 flex items-center gap-1.5 rounded-md px-2.5 py-1.5">
              <ng-icon name="lucidePaperclip" class="text-muted-foreground shrink-0" />
              <span class="text-foreground text-xs font-medium">{{ task.attachmentsCount }} {{ t('files') }}</span>
            </div>
          </div>
        }
      </aside>
    </div>

    <!-- Footer -->
    <div *transloco="let t; prefix: 'tasks.details'" class="mt-6 flex justify-end">
      <button hlmBtn variant="outline" size="sm" type="button" (click)="close()">
        {{ t('close') }}
      </button>
    </div>
  `,
})
export class TaskDetails {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dialogRef = inject<BrnDialogRef<void>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<TaskDetailsContext>();

  // ==========================================
  // State
  // ==========================================

  protected readonly _task = this._dialogContext.task;

  protected readonly tagColorClasses = TAG_COLOR_CLASSES;

  protected readonly avatarInitials = this._dialogContext.task.title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  // ==========================================
  // Methods
  // ==========================================

  protected close(): void {
    this._dialogRef.close();
  }
}
