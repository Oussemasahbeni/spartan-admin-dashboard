import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucidePlus, lucideTag, lucideX } from '@ng-icons/lucide';
import { BrnDialogImports, BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { format } from 'date-fns';
import { Tag, TAG_COLOR_CLASSES, TagColor } from '../../model/tag';
import { Task, TaskFormContext, TaskFormModel, TaskStatus } from '../../model/task';

@Component({
  selector: 'adm-task-form',
  imports: [
    BrnDialogImports,
    HlmDatePickerImports,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmTextareaImports,
    HlmSelectImports,
    HlmButtonImports,
    HlmSpinnerImports,
    HlmIconImports,
    HlmLabelImports,
    HlmPopoverImports,
    FormField,
    FormRoot,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideTag, lucidePlus, lucideX, lucideChevronLeft })],
  host: {
    class: 'flex flex-col gap-4 sm:max-w-lg',
  },
  templateUrl: './task-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dialogRef = inject<BrnDialogRef<Task>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<TaskFormContext>();

  // ==========================================
  // State
  // ==========================================

  protected readonly isSubmitting = signal(false);
  protected readonly taskStatuses: TaskStatus[] = ['todo', 'inprogress', 'completed'];
  protected readonly tagColors = Object.keys(TAG_COLOR_CLASSES) as TagColor[];
  protected readonly tagColorClasses = TAG_COLOR_CLASSES;

  // Tag management (outside Signal Form — dynamic list)
  protected readonly pendingTagColor = signal<TagColor>('indigo');
  protected readonly addedTags = signal<Tag[]>([]);
  private readonly tagModel = signal({ name: '' });
  protected readonly tagForm = form(this.tagModel);
  protected readonly existingTags = computed(() =>
    this._dialogContext.existingTags.filter((et) => !this.addedTags().some((at) => at.name === et.name))
  );

  // Popover state
  protected readonly tagPopoverState = signal<'open' | 'closed'>('closed');
  protected readonly tagPopoverView = signal<'list' | 'create'>('list');

  private readonly taskModel = signal<TaskFormModel>({
    title: '',
    description: '',
    status: 'todo',
    dueDate: null,
  });

  protected readonly taskForm = form(
    this.taskModel,
    (schema) => {
      required(schema.title);
      required(schema.status);
      required(schema.dueDate);
    },

    {
      submission: {
        action: async () => this._submit(),
      },
    }
  );

  protected readonly today = new Date();

  // ==========================================
  // Methods
  // ==========================================

  protected onTagPopoverStateChanged(state: string): void {
    this.tagPopoverState.set(state as 'open' | 'closed');
    if (state === 'closed') {
      this.tagPopoverView.set('list');
      this.tagForm.name().value.set('');
      this.pendingTagColor.set('indigo');
    }
  }

  protected addTag(): void {
    const raw = this.tagForm.name().value().trim();
    const normalizedName = raw.toLowerCase();
    if (!normalizedName) return;

    if (this.addedTags().some((tag) => tag.name.trim().toLowerCase() === normalizedName)) return;

    const name = raw;
    this.addedTags.update((tags) => [...tags, { name, color: this.pendingTagColor() }]);
    this.tagForm.name().value.set('');
    this.pendingTagColor.set('indigo');
    this.tagPopoverView.set('list');
  }

  protected pickExistingTag(tag: Tag): void {
    const normalizedName = tag.name.trim().toLowerCase();
    if (this.addedTags().some((existingTag) => existingTag.name.trim().toLowerCase() === normalizedName)) return;

    this.addedTags.update((tags) => [...tags, tag]);
  }

  protected removeTag(index: number): void {
    this.addedTags.update((tags) => tags.filter((_, i) => i !== index));
  }

  private _submit(): void {
    const val = this.taskForm;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: val.title().value(),
      description: val.description().value() || undefined,
      status: val.status().value(),
      dueDate: val.dueDate().value() ? format(val.dueDate().value()!, 'yyyy-MM-dd') : '',
      commentsCount: 0,
      isCompleted: false,
      tags: this.addedTags(),
      assigneeAvatar: `https://i.pravatar.cc/150?u=${crypto.randomUUID()}`,
    };

    this._dialogRef.close(newTask);
  }

  protected cancel(): void {
    this._dialogRef.close();
  }
}
