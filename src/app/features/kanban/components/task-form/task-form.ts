import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required, submit } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { BrnDialogImports, BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { format } from 'date-fns';
import { COLUMN_IDS, TASK_OWNERS } from '../../model/board-data';
import { ColumnId, Task, TaskFormContext, TaskFormModel, TaskFormResult, TaskPriority, TaskTeam } from '../../model/task';

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
    FormField,
    FormRoot,
    TranslocoModule,
  ],
  host: {
    class: 'flex flex-col gap-4',
  },
  templateUrl: './task-form.html',
})
export class TaskForm {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dialogRef = inject<BrnDialogRef<TaskFormResult>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<TaskFormContext>();

  // ==========================================
  // State
  // ==========================================

  protected readonly columnIds: ColumnId[] = COLUMN_IDS;
  protected readonly priorities: TaskPriority[] = ['high', 'medium', 'low'];
  protected readonly teams: TaskTeam[] = [
    'Backend',
    'Data',
    'Design',
    'Docs',
    'Finance Ops',
    'Platform',
    'Product',
    'QA',
    'Security',
  ];

  private readonly taskModel = signal<TaskFormModel>({
    title: '',
    description: '',
    columnId: this._dialogContext.columnId ?? 'todo',
    priority: 'medium',
    team: 'Product',
    dueDate: null,
  });

  protected readonly taskForm = form(this.taskModel, (schema) => {
    required(schema.title);
    required(schema.columnId);
    required(schema.priority);
    required(schema.team);
    required(schema.dueDate);
  });

  protected readonly today = new Date();

  // ==========================================
  // Methods
  // ==========================================

  protected onSubmit(): void {
    submit(this.taskForm, async () => {
      const val = this.taskForm;
      const owner = TASK_OWNERS[Math.floor(Math.random() * TASK_OWNERS.length)];

      const task: Task = {
        id: crypto.randomUUID(),
        title: val.title().value(),
        description: val.description().value(),
        priority: val.priority().value(),
        dueDate: val.dueDate().value() ? format(val.dueDate().value()!, 'MMM d') : '',
        progress: 0,
        owner,
        team: val.team().value(),
        insights: [],
      };

      this._dialogRef.close({ columnId: val.columnId().value(), task });
    });
  }

}
