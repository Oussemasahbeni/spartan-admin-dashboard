export type TaskStatus = 'todo' | 'inprogress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  commentsCount: number;
  attachmentsCount?: number;
  tags: string[];
  assigneeAvatar: string;
  imageUrl?: string;
  status: TaskStatus;
}
