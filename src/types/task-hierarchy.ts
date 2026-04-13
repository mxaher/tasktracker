import type { mapTaskRow } from "@/lib/cloudflare-d1";

export type MappedTask = ReturnType<typeof mapTaskRow>;

/** Shallow child shape returned in list/detail responses */
export interface ChildTaskSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  completion: number;
  assigneeId: string | null;
  assignee: { id: string; name: string | null; email: string } | null;
}

/** Shallow parent shape returned in detail responses */
export interface ParentTaskSummary {
  id: string;
  title: string;
  status: string;
}

/** Full task response enriched with hierarchy data */
export interface TaskWithHierarchy extends MappedTask {
  parentId: string | null;
  parent: ParentTaskSummary | null;
  children: ChildTaskSummary[];
  childrenCount: number;
}
