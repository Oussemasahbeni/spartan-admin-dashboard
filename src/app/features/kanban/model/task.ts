export type ColumnId = 'todo' | 'inProgress' | 'inReview' | 'done';

export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskTeam = 'Backend' | 'Data' | 'Design' | 'Docs' | 'Finance Ops' | 'Platform' | 'Product' | 'QA' | 'Security';

export type TaskInsightLabel = 'attachments' | 'comments' | 'documents';

export interface TaskInsight {
  label: TaskInsightLabel;
  count: number;
}

export type AvatarTone = 'zinc' | 'lime' | 'indigo' | 'fuchsia' | 'violet' | 'pink' | 'sky';

export interface TaskOwner {
  name: string;
  tone: AvatarTone;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date;
  progress: number;
  owner: TaskOwner;
  team: TaskTeam;
  insights: TaskInsight[];
}

export type BoardState = Record<ColumnId, Task[]>;

export interface TaskFormContext {
  columnId?: ColumnId;
}

export interface TaskFormResult {
  columnId: ColumnId;
  task: Task;
}

export interface TaskFormModel {
  title: string;
  description: string;
  columnId: ColumnId;
  priority: TaskPriority;
  team: TaskTeam;
  dueDate: Date | null;
}
