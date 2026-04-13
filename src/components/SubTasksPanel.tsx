"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, ChevronRight } from "lucide-react";

interface ChildTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  completion: number;
  assigneeId: string | null;
}

interface ParentTask {
  id: string;
  title: string;
  status: string;
}

interface SubTasksPanelProps {
  parent?: ParentTask | null;
  children?: ChildTask[];
  onNavigateToTask?: (taskId: string) => void;
  onAddSubTask?: (parentId: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  delayed: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = PRIORITY_COLORS[priority] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {priority}
    </span>
  );
}

export function SubTasksPanel({
  parent,
  children = [],
  onNavigateToTask,
  onAddSubTask,
}: SubTasksPanelProps) {
  return (
    <div className="space-y-4">
      {/* Parent breadcrumb */}
      {parent && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="font-medium">Parent Task:</span>
          <button
            type="button"
            onClick={() => onNavigateToTask?.(parent.id)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            <ChevronRight className="h-3 w-3" />
            {parent.title}
          </button>
          <StatusBadge status={parent.status} />
        </div>
      )}

      {/* Sub-tasks section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Sub-tasks
            {children.length > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({children.length})
              </span>
            )}
          </h3>
          {onAddSubTask && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => onAddSubTask(parent?.id ?? "")}
            >
              <Plus className="h-3 w-3" />
              Add Sub-task
            </Button>
          )}
        </div>

        {children.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            No sub-tasks yet. Click &quot;Add Sub-task&quot; to break this task down.
          </p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground w-32">Progress</th>
                </tr>
              </thead>
              <tbody>
                {children.map((child, idx) => (
                  <tr
                    key={child.id}
                    className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${
                      idx % 2 === 0 ? "" : "bg-muted/10"
                    }`}
                  >
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToTask?.(child.id)}
                        className="text-left text-blue-600 hover:text-blue-800 hover:underline font-medium truncate max-w-xs block"
                      >
                        {child.title}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={child.status} />
                    </td>
                    <td className="px-3 py-2">
                      <PriorityBadge priority={child.priority} />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.round(child.completion * 100)}
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {Math.round(child.completion * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
