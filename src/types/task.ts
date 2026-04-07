/**
 * Extended Task type that includes hierarchy-related fields
 * returned from the API when fetching a single task.
 */
export interface TaskBase {
  id: string;
  taskId: string | null;
  title: string;
  description: string | null;
  ownerId: string | null;
  assigneeId: string | null;
  department: string | null;
  priority: string;
  status: string;
  strategicPillar: string | null;
  completion: number;
  riskIndicator: string | null;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  notes: string | null;
  nextStep: string | null;
  ceoNotes: string | null;
  sourceMonth: string | null;
  source: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; name: string | null; email: string } | null;
  assignee: { id: string; name: string | null; email: string } | null;
  latestUpdate: { content: string; createdAt: string } | null;
}

export type ChildTaskSummary = Pick<
  TaskBase,
  'id' | 'title' | 'status' | 'priority' | 'completion' | 'assigneeId'
>;

export type ParentTaskSummary = Pick<TaskBase, 'id' | 'title' | 'status'>;

export interface TaskWithHierarchy extends TaskBase {
  /** Shallow parent info — only populated on single-task GET */
  parent?: ParentTaskSummary | null;
  /** Shallow children list — only populated on single-task GET */
  children?: ChildTaskSummary[];
  /** Count of direct children — populated on task list GET */
  childrenCount?: number;
}
