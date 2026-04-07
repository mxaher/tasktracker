"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Search } from "lucide-react";

interface TaskOption {
  id: string;
  title: string;
  status: string;
}

interface ParentTaskComboboxProps {
  value: string | null;
  onChange: (value: string | null) => void;
  /** The current task's own ID — excluded from results to prevent self-parenting */
  excludeId?: string;
  /** Additional IDs to exclude (e.g. existing descendants to prevent circular refs) */
  excludeIds?: string[];
  disabled?: boolean;
}

export function ParentTaskCombobox({
  value,
  onChange,
  excludeId,
  excludeIds = [],
  disabled = false,
}: ParentTaskComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<TaskOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resolve the label for an existing value on mount
  useEffect(() => {
    if (!value) {
      setSelectedLabel(null);
      return;
    }
    fetch(`/api/tasks/${value}`)
      .then((r) => r.json())
      .then((data: { task?: { title?: string } }) => {
        setSelectedLabel(data.task?.title ?? value);
      })
      .catch(() => setSelectedLabel(value));
  }, [value]);

  const fetchOptions = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const url = query
          ? `/api/tasks?search=${encodeURIComponent(query)}`
          : `/api/tasks?rootOnly=true`;
        const res = await fetch(url);
        const data = (await res.json()) as { tasks?: TaskOption[] };
        const all = data.tasks ?? [];
        const excluded = new Set([excludeId, ...excludeIds].filter(Boolean) as string[]);
        setOptions(all.filter((t) => !excluded.has(t.id)).slice(0, 20));
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [excludeId, excludeIds],
  );

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchOptions(search), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, open, fetchOptions]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(task: TaskOption) {
    onChange(task.id);
    setSelectedLabel(task.title);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setSelectedLabel(null);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Parent Task{" "}
        <span className="text-xs font-normal text-gray-400">(optional)</span>
      </label>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selectedLabel ? (
          <span className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{selectedLabel}</Badge>
          </span>
        ) : (
          <span className="text-muted-foreground">Search and select a parent task…</span>
        )}
        <span className="flex items-center gap-1">
          {selectedLabel && (
            <X
              className="h-3 w-3 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            />
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              autoFocus
              placeholder="Search tasks by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 p-0 h-auto focus-visible:ring-0 shadow-none text-sm"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {loading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>
            )}
            {!loading && options.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No tasks found</div>
            )}
            {!loading &&
              options.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handleSelect(task)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center justify-between gap-2"
                >
                  <span className="truncate">{task.title}</span>
                  <Badge
                    variant="outline"
                    className="text-xs shrink-0 capitalize"
                  >
                    {task.status.replace(/_/g, " ")}
                  </Badge>
                </button>
              ))}
          </div>
          {value && (
            <div className="border-t px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground"
                onClick={handleClear}
              >
                Remove parent
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
