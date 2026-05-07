import { Tag } from './tag';

export type TaskStatus = 'todo' | 'inprogress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  commentsCount: number;
  attachmentsCount?: number;
  tags: Tag[];
  assigneeAvatar: string;
  imageUrl?: string;
  status: TaskStatus;
  isCompleted: boolean;
}

export interface TaskFormContext {
  existingTags: Tag[];
}

export interface TaskFormModel {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
}
