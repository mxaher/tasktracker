"use client";

import ContactsTab from "@/components/settings/ContactsTab";
import { Fragment, useState, useEffect, useMemo, useRef, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  LayoutDashboard, List, Grid3X3, Upload, Plus, Search, Filter,
  MoreVertical, Edit, Trash2, Download, Bell, Settings, Users,
  CheckCircle2, Clock, AlertTriangle, XCircle, TrendingUp,
  Calendar, User, Building, Flag, BarChart3, PieChart, FileSpreadsheet,
  ChevronDown, ChevronUp, RefreshCw, Eye, Mail, MessageSquare, Save, Send,
  AlertCircle, X, Loader2
} from "lucide-react";
import { format, differenceInDays, isPast, isToday, addDays } from "date-fns";
import { Switch } from "@/components/ui/switch";

// Types
interface Task {
  id: string;
  taskId: string | null;
  title: string;
  description: string | null;
  ownerId: string | null;
  owner: { id: string; name: string | null; email: string } | null;
  assigneeId: string | null;
  assignee: { id: string; name: string | null; email: string } | null;
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
  createdAt: string;
  updatedAt: string;
  latestUpdate: {
    content: string;
    createdAt: string;
  } | null;
}

type TaskMutationPayload = Partial<Task> & {
  newUpdateContent?: string | null;
};

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  delayedTasks: number;
  notStartedTasks: number;
  completionRate: number;
  tasksByDepartment: { department: string; count: number }[];
  tasksByPriority: { priority: string; count: number }[];
  tasksByStatus: { status: string; count: number }[];
  overdueTasks: number;
  dueSoonTasks: number;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  department: string | null;
  role: string;
}

// Status configurations
const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "بانتظار البدء", color: "text-violet-600", bgColor: "bg-violet-100", icon: Clock },
  not_started: { label: "لم يبدأ", color: "text-slate-600", bgColor: "bg-slate-100", icon: Clock },
  in_progress: { label: "قيد التنفيذ", color: "text-amber-600", bgColor: "bg-amber-100", icon: TrendingUp },
  delayed: { label: "متأخر", color: "text-red-600", bgColor: "bg-red-100", icon: AlertTriangle },
  completed: { label: "مكتمل", color: "text-emerald-600", bgColor: "bg-emerald-100", icon: CheckCircle2 },
};

const RUNNING_TASK_STATUSES = ["not_started", "pending", "in_progress", "delayed"] as const;
const COMPLETED_TASK_STATUSES = ["completed"] as const;

function matchesStatusGroup(currentStatuses: string[], groupStatuses: readonly string[]) {
  if (currentStatuses.length !== groupStatuses.length) {
    return false;
  }

  return groupStatuses.every((status) => currentStatuses.includes(status));
}

const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: "منخفض", color: "text-slate-600", bgColor: "bg-slate-100" },
  medium: { label: "متوسط", color: "text-amber-600", bgColor: "bg-amber-100" },
  high: { label: "عالي", color: "text-orange-600", bgColor: "bg-orange-100" },
  critical: { label: "حرج", color: "text-red-600", bgColor: "bg-red-100" },
};

// ─────────────────────────────────────────────────────────────
// SearchableSelect — searchable dropdown for departments,
// strategic pillars, owners and assignees
// ─────────────────────────────────────────────────────────────
const arabicDateFormatter = new Intl.DateTimeFormat("ar-SA", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const arabicDateTimeFormatter = new Intl.DateTimeFormat("ar-SA", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatArabicDate(value: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : arabicDateFormatter.format(parsed);
}

function formatArabicDateTime(value: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : arabicDateTimeFormatter.format(parsed);
}

interface SearchableSelectOption {
  value: string;
  label: string;
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "اختر...",
  allowCustom = false,
  onCreateOption,
}: {
  value: string;
  onChange: (val: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  allowCustom?: boolean;
  onCreateOption?: (name: string) => Promise<string | null>;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayLabel = options.find((o) => o.value === value)?.label || (value && value !== "none" ? value : "");

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const showCustom =
    allowCustom &&
    search.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === search.toLowerCase());

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); setSearch(""); }
  };

  const select = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearch("");
  };

  const handleCreateOption = async () => {
    const name = search.trim();
    if (!name || !onCreateOption) return;
    setCreating(true);
    try {
      const newId = await onCreateOption(name);
      if (newId) {
        onChange(newId);
        setOpen(false);
        setSearch("");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:border-primary/50 transition-colors"
      >
        <span className={displayLabel ? "text-foreground" : "text-muted-foreground"}>
          {displayLabel || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[180px] rounded-md border bg-background shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث..."
                className="w-full h-8 rounded-sm border border-input bg-transparent pr-7 pl-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && !showCustom && (
              <div className="px-3 py-2 text-sm text-muted-foreground">لا توجد نتائج</div>
            )}
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => select(opt.value)}
                className={`w-full text-right px-3 py-1.5 text-sm hover:bg-muted transition-colors ${
                  opt.value === value ? "bg-primary/10 font-medium" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
            {showCustom && (
              <button
                type="button"
                disabled={creating}
                onClick={onCreateOption ? handleCreateOption : () => select(search.trim())}
                className="w-full text-right px-3 py-1.5 text-sm text-primary hover:bg-primary/5 transition-colors border-t flex items-center gap-2 disabled:opacity-60"
              >
                {creating ? <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" /> : null}
                {onCreateOption ? `+ إضافة "${search.trim()}"` : `+ استخدام "${search.trim()}"`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KPICard — module-level to prevent remounting on parent render
// ─────────────────────────────────────────────────────────────
function KPICard({ title, value, subtitle, icon: Icon, trend }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof List;
  trend?: number;
  color?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <div className={`flex items-center text-xs mt-2 ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3 ml-1" /> : <AlertTriangle className="h-3 w-3 ml-1" />}
            {Math.abs(trend)}% مقارنة بالشهر الماضي
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// TaskCard — memoized module-level component
// ─────────────────────────────────────────────────────────────
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task) => void;
  onDateClick: (task: Task) => void;
  onProgressClick: (task: Task) => void;
    onSendReminder?: (task: Task) => void;
  getDaysRemaining: (dueDate: string | null) => number | null;
  getRiskColor: (task: Task) => string;
}
const TaskCard = memo(function TaskCard({
  task, onEdit, onDelete, onComplete,
  onSendReminder, onDateClick, onProgressClick, getDaysRemaining, getRiskColor
}: TaskCardProps) {  const StatusIcon = statusConfig[task.status]?.icon || Clock;
  const daysRemaining = getDaysRemaining(task.dueDate);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onEdit(task)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {task.taskId && (
                <Badge variant="outline" className="text-xs">
                  #{task.taskId}
                </Badge>
              )}
              <Badge className={`${priorityConfig[task.priority]?.bgColor} ${priorityConfig[task.priority]?.color}`}>
                {priorityConfig[task.priority]?.label}
              </Badge>
            </div>
            <CardTitle className="text-base line-clamp-2">{task.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => { e.stopPropagation(); onDelete(task); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {task.department && (
            <span className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {task.department}
            </span>
          )}
          {task.owner && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {task.owner.name || task.owner.email}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">نسبة الإنجاز</span>
            <span className="font-medium">{Math.round(task.completion * 100)}%</span>
          </div>
          <Progress value={task.completion * 100} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <Badge className={`${statusConfig[task.status]?.bgColor} ${statusConfig[task.status]?.color}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[task.status]?.label}
          </Badge>
          {task.dueDate && (
            <span className={`text-sm ${getRiskColor(task)}`}>
              {daysRemaining !== null && (
                daysRemaining < 0
                  ? `متأخر ${Math.abs(daysRemaining)} يوم`
                  : daysRemaining === 0
                    ? "اليوم"
                    : `${daysRemaining} يوم متبقي`
              )}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-3 px-4 gap-2 flex-wrap border-t">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs h-8"
          disabled={task.status === "completed"}
          onClick={(e) => { e.stopPropagation(); onComplete(task); }}
        >
          <CheckCircle2 className="h-3 w-3 ml-1" /> مكتمل
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs h-8"
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
        >
          <Edit className="h-3 w-3 ml-1" /> تحديث
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs h-8"
          onClick={(e) => { e.stopPropagation(); onDateClick(task); }}
        >
          <Calendar className="h-3 w-3 ml-1" /> التاريخ
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs h-8"
          onClick={(e) => { e.stopPropagation(); onProgressClick(task); }}
        >
          <BarChart3 className="h-3 w-3 ml-1" /> التقدم
        </Button>
      </CardFooter>
    </Card>
  );
});

// ─────────────────────────────────────────────────────────────
// TaskModal — module-level, receives props instead of closing over parent state
// KEY FIX: useEffect dependency is `isOpen`, not `editingTask`,
// so localTask only resets when the modal opens — not on every parent render.
// ─────────────────────────────────────────────────────────────
interface TaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: Task | null;
  editingTask: Partial<Task>;
  tasks: Task[];
  users: User[];
  departments: string[];
  strategicPillars: string[];
  onCreateTask: (data: TaskMutationPayload) => void;
  onUpdateTask: (data: TaskMutationPayload) => void;
  onUserCreated: (user: User) => void;
}

function TaskModal({
  isOpen, onOpenChange, selectedTask, editingTask,
  tasks, users, departments, strategicPillars,
  onCreateTask, onUpdateTask, onUserCreated,
}: TaskModalProps) {
  const [localTask, setLocalTask] = useState<Partial<Task>>(editingTask);
  const [duplicateTitles, setDuplicateTitles] = useState<Task[]>([]);
  const [quickUpdate, setQuickUpdate] = useState("");
  const [pendingUpdateContent, setPendingUpdateContent] = useState<string | null>(null);

  // Reset local state only when the modal opens — not on every parent re-render
  useEffect(() => {
    if (isOpen) {
      setLocalTask(editingTask);
      setDuplicateTitles([]);
      setQuickUpdate("");
      setPendingUpdateContent(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Duplicate detection
  useEffect(() => {
    const titleVal = (localTask.title || "").trim();
    if (titleVal.length < 3) {
      setDuplicateTitles([]);
      return;
    }
    const lower = titleVal.toLowerCase();
    const matches = tasks.filter(t => {
      if (t.id === selectedTask?.id) return false;
      const tl = t.title.toLowerCase().trim();
      return tl.includes(lower) || lower.includes(tl);
    });
    setDuplicateTitles(matches);
  }, [localTask.title, tasks, selectedTask]);

  const handleSubmit = () => {
    if (!localTask.title?.trim()) {
      toast.error("العنوان مطلوب");
      return;
    }
    const payload: TaskMutationPayload = { ...localTask, newUpdateContent: pendingUpdateContent };
    if (selectedTask) {
      onUpdateTask(payload);
    } else {
      onCreateTask(payload);
    }
  };

  const handleAddUpdate = () => {
    if (!quickUpdate.trim()) return;
    const content = quickUpdate.trim();
    const createdAt = new Date().toISOString();
    setPendingUpdateContent(content);
    setLocalTask({
      ...localTask,
      latestUpdate: {
        content,
        createdAt,
      },
    });
    setQuickUpdate("");
  };

  const createUserFromName = async (name: string): Promise<string | null> => {
    try {
      const email = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@tasktracker.local`;
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role: "viewer" }),
      });
      if (!res.ok) throw new Error("Failed to create user");
      const data = await res.json();
      if (data.user) {
        onUserCreated(data.user);
        return data.user.id;
      }
      return null;
    } catch {
      toast.error("فشل إنشاء المستخدم");
      return null;
    }
  };

  const DEFAULT_SOURCES = [
    "الرئيس التنفيذي",
    "لجنة التدقيق",
    "اللجنة التنفيذية",
    "مجلس الإدارة",
    "الإدارة العليا",
    "خطة استراتيجية",
    "تدقيق داخلي",
    "تدقيق خارجي",
    "مبادرة ذاتية",
  ];

  const deptOptions = departments.map(d => ({ value: d, label: d }));
  const pillarOptions = strategicPillars.map(p => ({ value: p, label: p }));
  const sourceOptions = DEFAULT_SOURCES.map(s => ({ value: s, label: s }));
  const ownerOptions: SearchableSelectOption[] = [
    { value: "none", label: "لا يوجد مالك" },
    ...users.map(u => ({ value: u.id, label: u.name || u.email })),
  ];
  const assigneeOptions: SearchableSelectOption[] = [
    { value: "none", label: "لا يوجد مُكلَّف" },
    ...users.map(u => ({ value: u.id, label: u.name || u.email })),
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-none max-w-[1200px] h-[60vh] min-h-[500px] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b flex-shrink-0">
          <DialogTitle>{selectedTask ? "تعديل المهمة" : "إنشاء مهمة جديدة"}</DialogTitle>
          <DialogDescription>
            {selectedTask ? "تحديث تفاصيل المهمة والتقدم" : "إضافة مهمة جديدة إلى المتتبع"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left panel */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">العنوان *</Label>
              <Input
                id="title"
                value={localTask.title || ""}
                onChange={(e) => setLocalTask({ ...localTask, title: e.target.value })}
                placeholder="أدخل عنوان المهمة"
                className={duplicateTitles.length > 0 ? "border-amber-400 focus-visible:ring-amber-400" : ""}
              />
              {duplicateTitles.length > 0 && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2 flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-medium">تحذير: يوجد مهام مشابهة</p>
                    {duplicateTitles.map(d => (
                      <p key={d.id}>
                        &quot;{d.title}&quot; — {statusConfig[d.status]?.label || d.status}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={localTask.description || ""}
                onChange={(e) => setLocalTask({ ...localTask, description: e.target.value })}
                placeholder="أدخل وصف المهمة"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>القسم</Label>
                <SearchableSelect
                  value={localTask.department || ""}
                  onChange={(val) => setLocalTask({ ...localTask, department: val || null })}
                  options={deptOptions}
                  placeholder="اختر أو اكتب القسم"
                  allowCustom
                />
              </div>
              <div className="grid gap-2">
                <Label>الركيزة الاستراتيجية</Label>
                <SearchableSelect
                  value={localTask.strategicPillar || ""}
                  onChange={(val) => setLocalTask({ ...localTask, strategicPillar: val || null })}
                  options={pillarOptions}
                  placeholder="اختر أو اكتب الركيزة"
                  allowCustom
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>مصدر المهمة</Label>
                <SearchableSelect
                  value={localTask.source || ""}
                  onChange={(val) => setLocalTask({ ...localTask, source: val || null })}
                  options={sourceOptions}
                  placeholder="اختر أو اكتب المصدر"
                  allowCustom
                />
              </div>
              <div className="grid gap-2">
                <Label>المالك</Label>
                <SearchableSelect
                  value={localTask.ownerId || "none"}
                  onChange={(val) => setLocalTask({ ...localTask, ownerId: val === "none" ? null : val })}
                  options={ownerOptions}
                  placeholder="اختر أو أضف المالك"
                  allowCustom
                  onCreateOption={createUserFromName}
                />
              </div>
              <div className="grid gap-2">
                <Label>المُكلَّف</Label>
                <SearchableSelect
                  value={localTask.assigneeId || "none"}
                  onChange={(val) => setLocalTask({ ...localTask, assigneeId: val === "none" ? null : val })}
                  options={assigneeOptions}
                  placeholder="اختر أو أضف المُكلَّف"
                  allowCustom
                  onCreateOption={createUserFromName}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">تاريخ البدء</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={localTask.startDate ? format(new Date(localTask.startDate), "yyyy-MM-dd") : ""}
                  onChange={(e) => setLocalTask({ ...localTask, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={localTask.dueDate ? format(new Date(localTask.dueDate), "yyyy-MM-dd") : ""}
                  onChange={(e) => setLocalTask({ ...localTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sourceMonth">شهر المصدر</Label>
              <Input
                id="sourceMonth"
                value={localTask.sourceMonth || ""}
                onChange={(e) => setLocalTask({ ...localTask, sourceMonth: e.target.value })}
                placeholder="مثال: يناير 2025"
              />
            </div>
          </div>

          <div className="w-px bg-border flex-shrink-0" />

          {/* Right panel */}
          <div className="w-96 flex-shrink-0 overflow-y-auto px-5 py-4 space-y-5 bg-muted/20">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>الحالة</Label>
                <Select
                  value={localTask.status || "not_started"}
                  onValueChange={(value) => setLocalTask({
                    ...localTask,
                    status: value,
                    completion: value === "completed" ? 1 : localTask.completion
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">بانتظار البدء</SelectItem>
                    <SelectItem value="not_started">لم يبدأ</SelectItem>
                    <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="delayed">متأخر</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>الأولوية</Label>
                <Select
                  value={localTask.priority || "medium"}
                  onValueChange={(value) => setLocalTask({ ...localTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفض</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">عالي</SelectItem>
                    <SelectItem value="critical">حرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>نسبة الإنجاز</Label>
                  <span className="text-sm font-semibold text-primary">{Math.round((localTask.completion || 0) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round((localTask.completion || 0) * 100)}
                  onChange={(e) => setLocalTask({
                    ...localTask,
                    completion: parseInt(e.target.value) / 100
                  })}
                  className="w-full accent-primary"
                />
                <Progress value={Math.round((localTask.completion || 0) * 100)} className="h-2" />
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">إضافة تحديث</Label>
              <Textarea
                value={quickUpdate}
                onChange={(e) => setQuickUpdate(e.target.value)}
                placeholder="اكتب تحديثاً سريعاً..."
                rows={3}
                onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleAddUpdate(); }}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddUpdate}
                disabled={!quickUpdate.trim()}
                className="w-full"
              >
                <Send className="h-3.5 w-3.5 me-2" /> إضافة التحديث
              </Button>
              {pendingUpdateContent ? (
                <div className="rounded-lg border border-dashed bg-background p-3 text-sm">
                  <div className="mb-1 font-medium text-foreground">سيتم حفظ آخر تحديث عند تحديث المهمة</div>
                  <div className="text-muted-foreground">{pendingUpdateContent}</div>
                </div>
              ) : null}
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label>سجل الملاحظات</Label>
              <Textarea
                value={localTask.notes || ""}
                onChange={(e) => setLocalTask({ ...localTask, notes: e.target.value })}
                placeholder="لا توجد ملاحظات بعد"
                rows={5}
                className="text-xs"
              />
            </div>

            <div className="grid gap-2">
              <Label>الخطوة التالية</Label>
              <Input
                value={localTask.nextStep || ""}
                onChange={(e) => setLocalTask({ ...localTask, nextStep: e.target.value })}
                placeholder="ما الخطوة التالية؟"
              />
            </div>

            <div className="grid gap-2">
              <Label>ملاحظات الرئيس التنفيذي</Label>
              <Textarea
                value={localTask.ceoNotes || ""}
                onChange={(e) => setLocalTask({ ...localTask, ceoNotes: e.target.value })}
                placeholder="تعليقات الرئيس التنفيذي"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSubmit}>
            {selectedTask ? "تحديث المهمة" : "إنشاء المهمة"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// UploadModal — module-level
// ─────────────────────────────────────────────────────────────
interface UploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  uploadFile: File | null;
  uploadProgress: number;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
}

function UploadModal({ isOpen, onOpenChange, uploadFile, uploadProgress, onFileChange, onUpload }: UploadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>رفع المهام</DialogTitle>
          <DialogDescription>
            ارفع ملف Excel أو CSV يحتوي على بيانات المهام
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">الملف</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            />
          </div>

          {uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground text-center">
                {uploadProgress < 100 ? "جار المعالجة..." : "اكتمل!"}
              </p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">الأعمدة المدعومة:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>رقم المهمة، العنوان، الوصف</li>
              <li>المالك، القسم، الأولوية</li>
              <li>الحالة، تاريخ البدء، تاريخ الاستحقاق</li>
              <li>نسبة الإنجاز، الملاحظات، شهر المصدر</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onUpload} disabled={!uploadFile || uploadProgress > 0}>
            <Upload className="ml-2 h-4 w-4" />
            رفع
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// DashboardContent — module-level
// ─────────────────────────────────────────────────────────────
interface DashboardContentProps {
  stats: DashboardStats | null;
  onNavigateToDepartment: (department: string) => void;
  onNavigateToOverdue: () => void;
  onNavigateToDueSoon: () => void;
}

function DashboardContent({ stats, onNavigateToDepartment, onNavigateToOverdue, onNavigateToDueSoon }: DashboardContentProps) {
  if (!stats) return null;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="إجمالي المهام" value={stats.totalTasks} icon={List} subtitle="جميع المهام في النظام" />
        <KPICard title="معدل الإنجاز" value={`${Math.round(stats.completionRate)}%`} icon={CheckCircle2} subtitle={`${stats.completedTasks} مكتملة`} trend={5} />
        <KPICard title="قيد التنفيذ" value={stats.inProgressTasks} icon={TrendingUp} subtitle="المهام النشطة" />
        <KPICard title="متأخرة" value={stats.delayedTasks} icon={AlertTriangle} subtitle="تحتاج اهتماماً" color="destructive" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base text-right">توزيع الحالات</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.tasksByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === "completed" ? "bg-emerald-500" :
                      item.status === "in_progress" ? "bg-amber-500" :
                      item.status === "delayed" ? "bg-red-500" : "bg-slate-400"
                    }`} />
                    <span className="text-sm">{statusConfig[item.status]?.label || item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.count}</span>
                    <span className="text-xs text-muted-foreground">({Math.round((item.count / stats.totalTasks) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base text-right">توزيع الأولويات</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.tasksByPriority.map((item) => (
                <div key={item.priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className={`w-3 h-3 rounded-full ${
                      item.priority === "critical" ? "bg-red-600" :
                      item.priority === "high" ? "bg-orange-500" :
                      item.priority === "medium" ? "bg-amber-500" : "bg-slate-400"
                    }`} />
                    <span className="text-sm">{priorityConfig[item.priority]?.label || item.priority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.count}</span>
                    <span className="text-xs text-muted-foreground">({Math.round((item.count / stats.totalTasks) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base text-right">المهام حسب القسم</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {stats.tasksByDepartment.map((item) => (
              <div
                key={item.department}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                role="button"
                tabIndex={0}
                onClick={() => onNavigateToDepartment(item.department)}
                onKeyDown={(e) => e.key === "Enter" && onNavigateToDepartment(item.department)}
              >
                <Badge variant="secondary">{item.count}</Badge>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.department}</span>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className="border-red-200 bg-red-50/50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={onNavigateToOverdue}
        >
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-700 flex-row-reverse justify-end">
              المهام المتأخرة <AlertTriangle className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700 text-right">{stats.overdueTasks}</p>
            <p className="text-sm text-red-600 mt-1 text-right">مهام تجاوزت تاريخ الاستحقاق</p>
          </CardContent>
        </Card>

        <Card
          className="border-amber-200 bg-amber-50/50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={onNavigateToDueSoon}
        >
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-amber-700 flex-row-reverse justify-end">
              تستحق قريباً <Clock className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700 text-right">{stats.dueSoonTasks}</p>
            <p className="text-sm text-amber-600 mt-1 text-right">تستحق خلال 7 أيام</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TaskListContent — module-level
// ─────────────────────────────────────────────────────────────
interface TaskListContentProps {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatuses: string[];
  setFilterStatuses: (fn: (prev: string[]) => string[]) => void;
  filterPriority: string;
  setFilterPriority: (p: string) => void;
  filterDepartment: string;
  setFilterDepartment: (d: string) => void;
  filterOverdue: boolean;
  setFilterOverdue: (v: boolean) => void;
  filterDueSoon: boolean;
  setFilterDueSoon: (v: boolean) => void;
  filterSource: string;
  setFilterSource: (s: string) => void;
  sourceFilterOptions: SearchableSelectOption[];
  deptFilterOptions: SearchableSelectOption[];
  viewMode: "table" | "card";
  setViewMode: (m: "table" | "card") => void;
  selectedTaskIds: Set<string>;
  setSelectedTaskIds: (fn: (prev: Set<string>) => Set<string>) => void;
  setIsBulkDeleteDialogOpen: (open: boolean) => void;
  onOpenTaskModal: (task?: Task) => void;
  onDeleteTask: (task: Task) => void;
  onSendBulkWhatsApp: () => void;
  bulkWhatsAppSending: boolean;
  onSendSingleReminder: (task: Task, channel: "whatsapp" | "email") => void;
  activeReminderKey: string | null;
  onCompleteTask: (task: Task) => void;
  onDateClick: (task: Task) => void;
  onProgressClick: (task: Task) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (o: "asc" | "desc") => void;
  onExport: () => void;
  getDaysRemaining: (dueDate: string | null) => number | null;
  getRiskColor: (task: Task) => string;
}

function TaskListContent({
  tasks, filteredTasks, loading,
  searchQuery, setSearchQuery,
  filterStatuses, setFilterStatuses,
  filterPriority, setFilterPriority,
  filterDepartment, setFilterDepartment,
  filterOverdue, setFilterOverdue,
  filterDueSoon, setFilterDueSoon,
  filterSource, setFilterSource, sourceFilterOptions,
  deptFilterOptions, viewMode, setViewMode,
  selectedTaskIds, setSelectedTaskIds,
  setIsBulkDeleteDialogOpen,
  onOpenTaskModal, onDeleteTask, onSendBulkWhatsApp, bulkWhatsAppSending, onSendSingleReminder, activeReminderKey, onCompleteTask,
  onDateClick, onProgressClick, onExport,
  sortBy, setSortBy, sortOrder, setSortOrder,
  getDaysRemaining, getRiskColor,
}: TaskListContentProps) {
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: string }) =>
    sortBy === field
      ? sortOrder === "asc"
        ? <ChevronUp className="h-3 w-3 inline-block ml-1 flex-shrink-0" />
        : <ChevronDown className="h-3 w-3 inline-block ml-1 flex-shrink-0" />
      : (
        <span className="inline-flex flex-col ml-1 opacity-30 flex-shrink-0" style={{ lineHeight: 0, gap: 0, verticalAlign: "middle" }}>
          <ChevronUp className="h-2 w-2" />
          <ChevronDown className="h-2 w-2" />
        </span>
      );

  const allFilteredSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every(t => selectedTaskIds.has(t.id));
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const isRunningTasksFilterActive = matchesStatusGroup(filterStatuses, RUNNING_TASK_STATUSES);
  const isCompletedTasksFilterActive = matchesStatusGroup(filterStatuses, COMPLETED_TASK_STATUSES);
  const isAllTasksFilterActive = filterStatuses.length === 0 && !filterOverdue && !filterDueSoon;

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedTaskIds(() => new Set());
    } else {
      setSelectedTaskIds(() => new Set(filteredTasks.map(t => t.id)));
    }
  };

  const toggleSelectTask = (id: string) => {
    setSelectedTaskIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpandedRow = (taskId: string) => {
    setExpandedTaskId((current) => (current === taskId ? null : taskId));
  };

  const applyStatusFilterGroup = (statuses: readonly string[]) => {
    setFilterOverdue(false);
    setFilterDueSoon(false);
    setFilterStatuses(() => [...statuses]);
  };

  const clearStatusFilterGroup = () => {
    setFilterOverdue(false);
    setFilterDueSoon(false);
    setFilterStatuses(() => []);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 gap-2 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المهام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>
          <div className="flex w-full flex-wrap gap-2 xl:w-auto">
            <Button
              variant={isRunningTasksFilterActive ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => applyStatusFilterGroup(RUNNING_TASK_STATUSES)}
            >
              المهام الجارية
            </Button>
            <Button
              variant={isAllTasksFilterActive ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={clearStatusFilterGroup}
            >
              كل المهام
            </Button>
            <Button
              variant={isCompletedTasksFilterActive ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => applyStatusFilterGroup(COMPLETED_TASK_STATUSES)}
            >
              المهام المكتملة
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Filter className="size-4" />
                {isRunningTasksFilterActive
                  ? "المهام الجارية"
                  : isCompletedTasksFilterActive
                    ? "المهام المكتملة"
                    : filterStatuses.length === 0
                      ? "كل الحالات"
                      : `${filterStatuses.length} حالات`}
                <ChevronDown className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(["pending", "not_started", "in_progress", "delayed", "completed"] as const).map(status => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filterStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    setFilterStatuses(prev =>
                      checked ? [...prev, status] : prev.filter(s => s !== status)
                    );
                  }}
                >
                  <span className={`inline-block size-2 rounded-full me-2 ${statusConfig[status]?.color?.replace("text-", "bg-").split(" ")[0] ?? ""}`} />
                  {statusConfig[status]?.label ?? status}
                </DropdownMenuCheckboxItem>
              ))}
              {filterStatuses.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatuses(() => [])}>
                    مسح التصفية
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {(filterStatuses.length > 0 || filterOverdue || filterDueSoon) && (
            <div className="flex flex-wrap gap-1">
              {filterStatuses.map(status => (
                <Badge
                  key={status}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:opacity-80"
                  onClick={() => setFilterStatuses(prev => prev.filter(s => s !== status))}
                >
                  {statusConfig[status]?.label ?? status}
                  <span className="text-xs leading-none">×</span>
                </Badge>
              ))}
              {filterOverdue && (
                <Badge variant="destructive" className="gap-1 cursor-pointer hover:opacity-80" onClick={() => setFilterOverdue(false)}>
                  المهام المتأخرة <span className="text-xs leading-none">×</span>
                </Badge>
              )}
              {filterDueSoon && (
                <Badge className="gap-1 cursor-pointer hover:opacity-80 bg-amber-500 hover:bg-amber-600" onClick={() => setFilterDueSoon(false)}>
                  تستحق قريباً <span className="text-xs leading-none">×</span>
                </Badge>
              )}
            </div>
          )}
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأولويات</SelectItem>
              <SelectItem value="critical">حرج</SelectItem>
              <SelectItem value="high">عالي</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="low">منخفض</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-full sm:w-[180px]">
            <SearchableSelect
              value={filterDepartment}
              onChange={setFilterDepartment}
              options={deptFilterOptions}
              placeholder="كل الأقسام"
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <SearchableSelect
              value={filterSource}
              onChange={setFilterSource}
              options={sourceFilterOptions}
              placeholder="كل المصادر"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={onSendBulkWhatsApp} disabled={selectedTaskIds.size === 0 || bulkWhatsAppSending}>
                  {bulkWhatsAppSending ? <Loader2 className="h-4 w-4 ml-1 animate-spin" /> : <MessageSquare className="h-4 w-4 ml-1" />}
                  إرسال رسالة جماعية
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {selectedTaskIds.size === 0
                ? "حدّد مهمة واحدة أو أكثر لإرسال رسالة واتساب مجمعة."
                : "سيتم جمع المهام ذات المسؤول نفسه داخل رسالة واتساب واحدة."}
            </TooltipContent>
          </Tooltip>
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "card" ? "default" : "outline"} size="sm" onClick={() => setViewMode("card")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={onExport}>
            <Download className="h-4 w-4 ml-1" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedTaskIds.size > 0 && viewMode === "table" && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 px-4 py-2">
          <span className="text-sm font-medium text-primary">{selectedTaskIds.size} مهمة محددة</span>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onSendBulkWhatsApp} disabled={bulkWhatsAppSending}>
            {bulkWhatsAppSending ? <Loader2 className="h-3 w-3 ml-1 animate-spin" /> : <MessageSquare className="h-3 w-3 ml-1" />} إرسال رسالة جماعية
          </Button>
          <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => setIsBulkDeleteDialogOpen(true)}>
            <Trash2 className="h-3 w-3 ml-1" /> حذف المحدد
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={toggleSelectAll}>
            {allFilteredSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 ml-auto" onClick={() => setSelectedTaskIds(() => new Set())}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        عرض {filteredTasks.length} من {tasks.length} مهمة
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <List className="h-12 w-12 mb-4" />
            <p>لا توجد مهام</p>
            <Button className="mt-4" onClick={() => onOpenTaskModal()}>
              <Plus className="ml-2 h-4 w-4" />
              أنشئ مهمتك الأولى
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "card" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onOpenTaskModal}
              onDelete={onDeleteTask}
              onComplete={onCompleteTask}
              onDateClick={onDateClick}
              onProgressClick={onProgressClick}
                            
              getDaysRemaining={getDaysRemaining}
              getRiskColor={getRiskColor}
            />
          ))}
        </div>
      ) : (
        <Card className="w-full overflow-hidden">
          <ScrollArea className="h-[calc(100vh-400px)] w-full" dir="rtl">
            <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[1120px]" dir="rtl">
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <TableHead className="w-[40px] pr-4 text-center">
                    <div className="flex justify-center items-center">
                      <Checkbox checked={allFilteredSelected} onCheckedChange={toggleSelectAll} aria-label="تحديد الكل" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[50px] text-center select-none">
                    <div className="flex items-center justify-center">#</div>
                  </TableHead>
                  <TableHead
                    className="min-w-[200px] text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center justify-center">المهمة<SortIcon field="title" /></div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none"
                    onClick={() => handleSort("source")}
                  >
                    <div className="flex items-center justify-center">المصدر<SortIcon field="source" /></div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none"
                    onClick={() => handleSort("department")}
                  >
                    <div className="flex items-center justify-center">القسم<SortIcon field="department" /></div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none"
                    onClick={() => handleSort("owner")}
                  >
                    <div className="flex items-center justify-center">المسؤول<SortIcon field="owner" /></div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none"
                    onClick={() => handleSort("priority")}
                  >
                    <div className="flex items-center justify-center">الأولوية<SortIcon field="priority" /></div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center justify-center">الحالة<SortIcon field="status" /></div>
                  </TableHead>
                  <TableHead
                    className="w-[100px] text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none"
                    onClick={() => handleSort("completion")}
                  >
                    <div className="flex items-center justify-center">التقدم<SortIcon field="completion" /></div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none"
                    onClick={() => handleSort("dueDate")}
                  >
                    <div className="flex items-center justify-center">تاريخ الاكتمال<SortIcon field="dueDate" /></div>
                  </TableHead>
                  <TableHead className="w-[200px] text-center select-none">
                    <div className="flex items-center justify-center">الإجراءات</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task, index) => {
                  const StatusIcon = statusConfig[task.status]?.icon || Clock;
                  const daysRemaining = getDaysRemaining(task.dueDate);
                  const isSelected = selectedTaskIds.has(task.id);
                  const isExpanded = expandedTaskId === task.id;

                  return (
                    <Fragment key={task.id}>
                    <TableRow
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "bg-primary/5 hover:bg-primary/10" : ""} ${isExpanded ? "border-b-0 bg-muted/30" : ""}`}
                      onClick={() => toggleExpandedRow(task.id)}
                      aria-expanded={isExpanded}
                    >
                      <TableCell className="pr-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center items-center">
                          <Checkbox checked={isSelected} onCheckedChange={() => toggleSelectTask(task.id)} aria-label={`تحديد ${task.title}`} />
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium text-muted-foreground">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 text-muted-foreground">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium line-clamp-1">{task.title}</div>
                            {task.description ? <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div> : null}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {task.source ? (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">{task.source}</Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell>{task.department || "—"}</TableCell>
                      <TableCell>{task.owner?.name || "—"}</TableCell>
                      <TableCell>
                        <Badge className={`${priorityConfig[task.priority]?.bgColor} ${priorityConfig[task.priority]?.color}`}>
                          {priorityConfig[task.priority]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[task.status]?.bgColor} ${statusConfig[task.status]?.color}`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[task.status]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={task.completion * 100} className="h-2 flex-1" />
                          <span className="text-xs font-medium w-8">{Math.round(task.completion * 100)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <div className={getRiskColor(task)}>
                            <div className="text-sm">{formatArabicDate(task.dueDate)}</div>
                            {daysRemaining !== null && task.status !== "completed" && (
                              <div className="text-xs">
                                {daysRemaining < 0
                                  ? `متأخرة ${Math.abs(daysRemaining)} يوم`
                                  : daysRemaining === 0
                                    ? "تستحق اليوم"
                                    : `متبقي ${daysRemaining} يوم`}
                              </div>
                            )}
                          </div>
                        ) : "—"}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <DropdownMenu>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                                    {activeReminderKey?.startsWith(`${task.id}:`)
                                      ? <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                                      : <Bell className="h-3 w-3 ml-1" />}
                                    إرسال تذكير
                                  </Button>
                                </DropdownMenuTrigger>
                              </TooltipTrigger>
                              <TooltipContent>أرسل تذكيرًا إلى مسؤول المهمة عبر واتساب أو البريد الإلكتروني.</TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>قناة التذكير</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onSendSingleReminder(task, "whatsapp")}>
                                <MessageSquare className="h-4 w-4 ml-2" />
                                إرسال عبر واتساب
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onSendSingleReminder(task, "email")}>
                                <Mail className="h-4 w-4 ml-2" />
                                إرسال عبر البريد
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2" disabled={task.status === "completed"} onClick={() => onCompleteTask(task)}>
                            <CheckCircle2 className="h-3 w-3 ml-1" /> مكتمل
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => onOpenTaskModal(task)}>
                            <Edit className="h-3 w-3 ml-1" /> تحديث
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => onDateClick(task)}>
                            <Calendar className="h-3 w-3 ml-1" /> التاريخ
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => onProgressClick(task)}>
                            <BarChart3 className="h-3 w-3 ml-1" /> التقدم
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDeleteTask(task)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded ? (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={11} className="border-t-0 px-6 pb-5 pt-0">
                          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/95 p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                آخر تحديث
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {task.latestUpdate ? formatArabicDateTime(task.latestUpdate.createdAt) : "لا توجد تحديثات"}
                              </span>
                            </div>
                            {task.latestUpdate ? (
                              <div className="rounded-xl bg-muted/40 p-4 text-sm leading-7 text-foreground">
                                {task.latestUpdate.content}
                              </div>
                            ) : (
                              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                                لا توجد تحديثات
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SettingsContent — module-level
// ─────────────────────────────────────────────────────────────
interface SettingsState {
  adminEmail: string;
  dailyDigestEnabled: boolean;
  dailyDigestTime: string;
  weeklyReportEnabled: boolean;
  weeklyReportDay: number;
  weeklyReportTime: string;
  inProgressReportEnabled: boolean;
  inProgressReportFrequency: string;
  taskReminderEnabled: boolean;
  overdueReminderEnabled: boolean;
  customReminderDates: string;
  reminderDaysBefore: number;
  whatsappOwnerRemindersEnabled: boolean;
  whatsappReminderOffsets: string;
  whatsappReminderTemplate: string;
}

interface ReminderRunSummary {
  sentOwners: { ownerId: string; ownerName: string; taskCount: number }[];
  skippedOwners: { ownerId: string; ownerName: string; reason: string }[];
  failedOwners: { ownerId: string; ownerName: string; reason: string }[];
  includedTasks: { taskId: string; title: string; ownerName: string }[];
  skippedTasks: { taskId: string; title: string; ownerName: string; reason: string }[];
}

interface ScheduledReminder {
  id: string;
  title: string;
  description: string | null;
  reminderDate: string;
  reminderTime: string;
  sendToAdmin: boolean;
  sendToOwners: boolean;
  isActive: boolean;
  isSent: boolean;
  emailsSent: number;
  emailsFailed: number;
}

interface SettingsContentProps {
  settings: SettingsState;
  setSettings: (s: SettingsState) => void;
  savingSettings: boolean;
  sendingTest: boolean;
  scheduledReminders: ScheduledReminder[];
  newReminder: { title: string; description: string; reminderDate: string; reminderTime: string; sendToAdmin: boolean; sendToOwners: boolean };
  setNewReminder: (r: SettingsContentProps["newReminder"]) => void;
  showReminderForm: boolean;
  setShowReminderForm: (s: boolean) => void;
  onSaveSettings: () => void;
  onSendTestEmail: () => void;
  onSendTaskReminders: () => void;
  onSendOwnerReminderNow: () => void;
  onCreateReminder: () => void;
  onDeleteReminder: (id: string) => void;
  onTriggerCron: () => void;
  sendingOwnerRemindersNow: boolean;
  ownerReminderSummary: ReminderRunSummary | null;
}

function SettingsContent({
  settings, setSettings, savingSettings, sendingTest,
  scheduledReminders, newReminder, setNewReminder,
  showReminderForm, setShowReminderForm,
  onSaveSettings, onSendTestEmail, onSendTaskReminders, onSendOwnerReminderNow,
  onCreateReminder, onDeleteReminder, onTriggerCron,
  sendingOwnerRemindersNow, ownerReminderSummary,
}: SettingsContentProps) {
  const [settingsTab, setSettingsTab] = useState("notifications");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إعدادات الإشعارات</h1>
          <p className="text-muted-foreground">إعداد إشعارات البريد والتقارير</p>
        </div>
        {settingsTab === "notifications" ? <Button onClick={onSaveSettings} disabled={savingSettings}>
          {savingSettings ? <RefreshCw className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
          حفظ الإعدادات
        </Button> : null}
      </div>

      <Tabs value={settingsTab} onValueChange={setSettingsTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        <TabsContent value="notifications" className="mt-0 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" />إعداد البريد الإلكتروني للمسؤول</CardTitle>
          <CardDescription>حدد عنوان البريد الإلكتروني الذي سيستقبل التقارير والإشعارات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="adminEmail">بريد المسؤول الإلكتروني</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="moh_zaher@msn.com"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">سيستقبل هذا البريد تقارير المهام قيد التنفيذ والملخصات</p>
          </div>
          <Button variant="outline" onClick={onSendTestEmail} disabled={sendingTest || !settings.adminEmail}>
            {sendingTest ? <RefreshCw className="h-4 w-4 ml-2 animate-spin" /> : <Mail className="h-4 w-4 ml-2" />}
            إرسال بريد تجريبي
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" />التذكيرات المجدولة</CardTitle>
          <CardDescription>جدولة تذكيرات بريد إلكتروني في تواريخ محددة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {scheduledReminders.length > 0 && (
            <div className="space-y-2">
              <Label>التذكيرات القادمة</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {scheduledReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{reminder.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(reminder.reminderDate), "MMMM d, yyyy")} at {reminder.reminderTime}
                        {reminder.isSent && <span className="mr-2 text-emerald-600">(أُرسل)</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={reminder.isSent ? "secondary" : "default"}>{reminder.isSent ? "أُرسل" : "قيد الانتظار"}</Badge>
                      {!reminder.isSent && (
                        <Button variant="ghost" size="sm" onClick={() => onDeleteReminder(reminder.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showReminderForm ? (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="grid gap-2">
                <Label htmlFor="reminderTitle">عنوان التذكير *</Label>
                <Input id="reminderTitle" placeholder="مثال: مراجعة المهام الشهرية" value={newReminder.title} onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminderDesc">الوصف (اختياري)</Label>
                <Textarea id="reminderDesc" placeholder="ملاحظات إضافية لهذا التذكير..." value={newReminder.description} onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reminderDate">التاريخ *</Label>
                  <Input id="reminderDate" type="date" value={newReminder.reminderDate} onChange={(e) => setNewReminder({ ...newReminder, reminderDate: e.target.value })} min={format(new Date(), "yyyy-MM-dd")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reminderTime">الوقت</Label>
                  <Input id="reminderTime" type="time" value={newReminder.reminderTime} onChange={(e) => setNewReminder({ ...newReminder, reminderTime: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sendToAdmin" checked={newReminder.sendToAdmin} onChange={(e) => setNewReminder({ ...newReminder, sendToAdmin: e.target.checked })} className="rounded" />
                  <Label htmlFor="sendToAdmin" className="text-sm">إرسال للمسؤول</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sendToOwners" checked={newReminder.sendToOwners} onChange={(e) => setNewReminder({ ...newReminder, sendToOwners: e.target.checked })} className="rounded" />
                  <Label htmlFor="sendToOwners" className="text-sm">إرسال لأصحاب المهام</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={onCreateReminder}>جدولة التذكير</Button>
                <Button variant="outline" onClick={() => setShowReminderForm(false)}>إلغاء</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowReminderForm(true)}>
              <Plus className="h-4 w-4 ml-2" /> جدولة تذكير جديد
            </Button>
          )}

          <div className="pt-4 border-t">
            <Button variant="outline" onClick={onTriggerCron}>
              <RefreshCw className="h-4 w-4 ml-2" /> معالجة التذكيرات المجدولة الآن
            </Button>
            <p className="text-xs text-muted-foreground mt-2">سيعالج هذا جميع التذكيرات المعلقة المستحقة</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" />تواريخ التذكير المخصصة</CardTitle>
          <CardDescription>حدد تواريخ محددة لاستقبال ملخصات المهام بالبريد</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="customDates">تواريخ التذكير (YYYY-MM-DD، مفصولة بفواصل)</Label>
            <Textarea id="customDates" placeholder="مثال: 2024-01-15, 2024-02-01, 2024-03-01" value={settings.customReminderDates} onChange={(e) => setSettings({ ...settings, customReminderDates: e.target.value })} rows={2} />
            <p className="text-xs text-muted-foreground">في هذه التواريخ ستستقبل ملخصاً بريدياً لجميع المهام النشطة</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reminderDaysBefore">أيام قبل تاريخ الاستحقاق للتذكيرات التلقائية</Label>
            <Input id="reminderDaysBefore" type="number" min={1} max={30} value={settings.reminderDaysBefore} onChange={(e) => setSettings({ ...settings, reminderDaysBefore: parseInt(e.target.value) || 3 })} />
            <p className="text-xs text-muted-foreground">سيتلقى أصحاب المهام تذكيرات قبل هذا العدد من الأيام من تاريخ الاستحقاق</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" />تقرير المهام قيد التنفيذ</CardTitle>
          <CardDescription>استقبل تقارير دورية لجميع المهام قيد التنفيذ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تفعيل تقارير المهام قيد التنفيذ</Label>
              <p className="text-xs text-muted-foreground">استقبل تقارير عن المهام التي يجري العمل عليها</p>
            </div>
            <Switch checked={settings.inProgressReportEnabled} onCheckedChange={(checked) => setSettings({ ...settings, inProgressReportEnabled: checked })} />
          </div>

          {settings.inProgressReportEnabled && (
            <div className="grid gap-4 pt-4 border-t">
              <div className="grid gap-2">
                <Label>تكرار التقرير</Label>
                <Select value={settings.inProgressReportFrequency} onValueChange={(value) => setSettings({ ...settings, inProgressReportFrequency: value })}>
                  <SelectTrigger><SelectValue placeholder="اختر التكرار" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">يومي</SelectItem>
                    <SelectItem value="weekly">أسبوعي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.inProgressReportFrequency === "daily" && (
                <div className="grid gap-2">
                  <Label htmlFor="dailyTime">وقت التقرير اليومي</Label>
                  <Input id="dailyTime" type="time" value={settings.dailyDigestTime} onChange={(e) => setSettings({ ...settings, dailyDigestTime: e.target.value })} />
                </div>
              )}

              {settings.inProgressReportFrequency === "weekly" && (
                <>
                  <div className="grid gap-2">
                    <Label>يوم التقرير</Label>
                    <Select value={String(settings.weeklyReportDay)} onValueChange={(value) => setSettings({ ...settings, weeklyReportDay: parseInt(value) })}>
                      <SelectTrigger><SelectValue placeholder="اختر اليوم" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">الأحد</SelectItem>
                        <SelectItem value="1">الاثنين</SelectItem>
                        <SelectItem value="2">الثلاثاء</SelectItem>
                        <SelectItem value="3">الأربعاء</SelectItem>
                        <SelectItem value="4">الخميس</SelectItem>
                        <SelectItem value="5">الجمعة</SelectItem>
                        <SelectItem value="6">السبت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weeklyTime">وقت التقرير</Label>
                    <Input id="weeklyTime" type="time" value={settings.weeklyReportTime} onChange={(e) => setSettings({ ...settings, weeklyReportTime: e.target.value })} />
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />تذكيرات المهام</CardTitle>
          <CardDescription>إعداد التذكيرات التلقائية لأصحاب المهام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تفعيل تذكيرات المهام</Label>
              <p className="text-xs text-muted-foreground">إرسال تذكيرات بريدية لأصحاب المهام قبل تواريخ الاستحقاق</p>
            </div>
            <Switch checked={settings.taskReminderEnabled} onCheckedChange={(checked) => setSettings({ ...settings, taskReminderEnabled: checked })} />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label>تذكيرات التأخر</Label>
              <p className="text-xs text-muted-foreground">إرسال تذكيرات للمهام التي تجاوزت تاريخ الاستحقاق</p>
            </div>
            <Switch checked={settings.overdueReminderEnabled} onCheckedChange={(checked) => setSettings({ ...settings, overdueReminderEnabled: checked })} />
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" onClick={onSendTaskReminders}>
              <Send className="h-4 w-4 ml-2" /> إرسال تذكيرات التأخر الآن
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" />تذكيرات واتساب لمسؤولي المهام</CardTitle>
          <CardDescription>اضبط التذكيرات التلقائية عبر واتساب لمسؤولي المهام وشغّلها فورًا عند الحاجة.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تفعيل تذكيرات واتساب التلقائية</Label>
              <p className="text-xs text-muted-foreground">عند التفعيل، سيتلقى مسؤولو المهام تذكيرات واتساب بناءً على قواعد التوقيت أدناه.</p>
            </div>
            <Switch checked={settings.whatsappOwnerRemindersEnabled} onCheckedChange={(checked) => setSettings({ ...settings, whatsappOwnerRemindersEnabled: checked })} />
          </div>

          <div className="grid gap-2 pt-4 border-t">
            <Label htmlFor="whatsappReminderOffsets">توقيت التذكير</Label>
            <Input
              id="whatsappReminderOffsets"
              value={settings.whatsappReminderOffsets}
              onChange={(e) => setSettings({ ...settings, whatsappReminderOffsets: e.target.value })}
              placeholder="0,1,2"
            />
            <p className="text-xs text-muted-foreground">أدخل الأيام مفصولة بفواصل مثل <code>0,1,2</code> ليوم الاستحقاق، وقبل يوم، وقبل يومين.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappReminderTemplate">قالب الرسالة</Label>
            <Textarea
              id="whatsappReminderTemplate"
              rows={4}
              value={settings.whatsappReminderTemplate}
              onChange={(e) => setSettings({ ...settings, whatsappReminderTemplate: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              المتغيرات المتاحة: <code>{"{{ownerName}}"}</code>، <code>{"{{taskTitle}}"}</code>، <code>{"{{taskId}}"}</code>، <code>{"{{dueDate}}"}</code>، <code>{"{{priority}}"}</code>، <code>{"{{department}}"}</code>.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-1">
              <Label>إرسال الآن</Label>
              <p className="text-xs text-muted-foreground">أرسل تذكيرات واتساب فورًا لجميع المهام المؤهلة الخاصة بالمسؤولين.</p>
            </div>
            <Button variant="outline" onClick={onSendOwnerReminderNow} disabled={sendingOwnerRemindersNow}>
              {sendingOwnerRemindersNow ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Send className="h-4 w-4 ml-2" />}
              إرسال الآن
            </Button>
          </div>

          {ownerReminderSummary ? (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="grid gap-2 md:grid-cols-4">
                <div className="rounded-md bg-background p-3 border"><p className="text-xs text-muted-foreground">المسؤولون الذين تم التواصل معهم</p><p className="text-lg font-semibold">{ownerReminderSummary.sentOwners.length}</p></div>
                <div className="rounded-md bg-background p-3 border"><p className="text-xs text-muted-foreground">المسؤولون الذين فشل الإرسال لهم</p><p className="text-lg font-semibold">{ownerReminderSummary.failedOwners.length}</p></div>
                <div className="rounded-md bg-background p-3 border"><p className="text-xs text-muted-foreground">المهام المشمولة</p><p className="text-lg font-semibold">{ownerReminderSummary.includedTasks.length}</p></div>
                <div className="rounded-md bg-background p-3 border"><p className="text-xs text-muted-foreground">المهام المتخطاة</p><p className="text-lg font-semibold">{ownerReminderSummary.skippedTasks.length}</p></div>
              </div>
              {ownerReminderSummary.skippedTasks.length > 0 ? (
                <div className="space-y-2">
                  <Label>المهام المتخطاة</Label>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {ownerReminderSummary.skippedTasks.slice(0, 8).map((task) => (
                      <p key={`${task.taskId}-${task.reason}`}>{task.title} - {task.ownerName} - {task.reason}</p>
                    ))}
                  </div>
                </div>
              ) : null}
              {ownerReminderSummary.failedOwners.length > 0 ? (
                <div className="space-y-2">
                  <Label>المسؤولون الذين فشل الإرسال لهم</Label>
                  <div className="space-y-1 text-sm text-destructive">
                    {ownerReminderSummary.failedOwners.map((owner) => (
                      <p key={`${owner.ownerId}-${owner.reason}`}>{owner.ownerName} - {owner.reason}</p>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-amber-700"><AlertTriangle className="h-4 w-4" />إعداد البريد الإلكتروني مطلوب</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 mb-3">لتفعيل إشعارات البريد، أضف هذه المتغيرات لملف <code className="bg-amber-100 px-1 rounded">.env</code>:</p>
          <div className="bg-amber-100/50 p-3 rounded-lg space-y-2 font-mono text-sm">
            <p><span className="text-amber-800">RESEND_API_KEY=</span><span className="text-amber-600">re_xxxxxxxxxxxx</span></p>
            <p><span className="text-amber-800">FROM_EMAIL=</span><span className="text-amber-600">noreply@yourdomain.com</span></p>
            <p><span className="text-amber-800">ADMIN_EMAIL=</span><span className="text-amber-600">admin@yourdomain.com</span></p>
          </div>
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm font-medium text-amber-800 mb-1">كيفية الحصول على مفتاح Resend API:</p>
            <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
              <li>اذهب إلى <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a> وأنشئ حساباً مجانياً</li>
              <li>انتقل إلى API Keys في لوحة التحكم</li>
              <li>أنشئ مفتاح API جديداً وانسخه</li>
              <li>أضفه إلى ملف .env بإسم RESEND_API_KEY</li>
            </ol>
          </div>
          <p className="text-xs text-amber-600 mt-4">بدون هذه الإعدادات، سيتم تسجيل الرسائل في وحدة التحكم بدلاً من إرسالها.</p>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="contacts" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />Contacts</CardTitle>
              <CardDescription>Manage phone numbers and email addresses used for two-way messaging.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TaskTrackerApp — main component, now much leaner
// ─────────────────────────────────────────────────────────────
export default function TaskTrackerApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatuses, setFilterStatuses] = useState<string[]>([...RUNNING_TASK_STATUSES]);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Partial<Task>>({});
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [filterDueSoon, setFilterDueSoon] = useState(false);
  const [filterSource, setFilterSource] = useState<string>("all");

  const [settings, setSettings] = useState<SettingsState>({
    adminEmail: "",
    dailyDigestEnabled: false,
    dailyDigestTime: "09:00",
    weeklyReportEnabled: false,
    weeklyReportDay: 1,
    weeklyReportTime: "09:00",
    inProgressReportEnabled: false,
    inProgressReportFrequency: "daily",
    taskReminderEnabled: true,
    overdueReminderEnabled: true,
    customReminderDates: "",
    reminderDaysBefore: 3,
    whatsappOwnerRemindersEnabled: false,
    whatsappReminderOffsets: "0,1",
    whatsappReminderTemplate: "مرحبًا {{ownerName}}، هذا تذكير بخصوص المهمة {{taskTitle}} (رقم المهمة {{taskId}}). تاريخ الاستحقاق: {{dueDate}}. الأولوية: {{priority}}.",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [sendingBulkWhatsApp, setSendingBulkWhatsApp] = useState(false);
  const [activeReminderKey, setActiveReminderKey] = useState<string | null>(null);
  const [sendingOwnerRemindersNow, setSendingOwnerRemindersNow] = useState(false);
  const [ownerReminderSummary, setOwnerReminderSummary] = useState<ReminderRunSummary | null>(null);

  const [quickDateTask, setQuickDateTask] = useState<Task | null>(null);
  const [quickDateValue, setQuickDateValue] = useState("");
  const [quickProgressTask, setQuickProgressTask] = useState<Task | null>(null);
  const [quickProgressValue, setQuickProgressValue] = useState(0);

  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    reminderDate: "",
    reminderTime: "09:00",
    sendToAdmin: true,
    sendToOwners: true,
  });
  const [showReminderForm, setShowReminderForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("تعذر تحميل المهام");
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("تعذر تحميل المهام");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/tasks/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      if (data.settings) {
        setSettings({
          adminEmail: data.settings.adminEmail || "",
          dailyDigestEnabled: data.settings.dailyDigestEnabled || false,
          dailyDigestTime: data.settings.dailyDigestTime || "09:00",
          weeklyReportEnabled: data.settings.weeklyReportEnabled || false,
          weeklyReportDay: data.settings.weeklyReportDay || 1,
          weeklyReportTime: data.settings.weeklyReportTime || "09:00",
          inProgressReportEnabled: data.settings.inProgressReportEnabled || false,
          inProgressReportFrequency: data.settings.inProgressReportFrequency || "daily",
          taskReminderEnabled: data.settings.taskReminderEnabled ?? true,
          overdueReminderEnabled: data.settings.overdueReminderEnabled ?? true,
          customReminderDates: data.settings.customReminderDates || "",
          reminderDaysBefore: data.settings.reminderDaysBefore ?? 3,
          whatsappOwnerRemindersEnabled: data.settings.whatsappOwnerRemindersEnabled ?? false,
          whatsappReminderOffsets: data.settings.whatsappReminderOffsets || "0,1",
          whatsappReminderTemplate: data.settings.whatsappReminderTemplate || "مرحبًا {{ownerName}}، هذا تذكير بخصوص المهمة {{taskTitle}} (رقم المهمة {{taskId}}). تاريخ الاستحقاق: {{dueDate}}. الأولوية: {{priority}}.",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchScheduledReminders = async () => {
    try {
      const response = await fetch("/api/reminders");
      if (!response.ok) throw new Error("Failed to fetch reminders");
      const data = await response.json();
      setScheduledReminders(data.reminders || []);
    } catch (error) {
      console.error("Error fetching scheduled reminders:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.allSettled([
          fetchTasks(),
          fetchUsers(),
          fetchStats(),
          fetchSettings(),
          fetchScheduledReminders(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedTaskIds(new Set());
  }, [searchQuery, filterStatuses, filterPriority, filterDepartment]);

  const departments = useMemo(() => {
    const depts = new Set(tasks.map(t => t.department).filter(Boolean));
    return Array.from(depts) as string[];
  }, [tasks]);

  const strategicPillars = useMemo(() => {
    const pillars = new Set(tasks.map(t => t.strategicPillar).filter(Boolean));
    return Array.from(pillars) as string[];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.department?.toLowerCase().includes(query) ||
        task.owner?.name?.toLowerCase().includes(query) ||
        task.taskId?.toLowerCase().includes(query)
      );
    }
    if (filterStatuses.length > 0) result = result.filter(task => filterStatuses.includes(task.status));
    if (filterPriority !== "all") result = result.filter(task => task.priority === filterPriority);
    if (filterDepartment !== "all") result = result.filter(task => task.department === filterDepartment);
    if (filterSource !== "all") result = result.filter(task => task.source === filterSource);
    if (filterOverdue) {
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      result = result.filter(task => task.status !== "completed" && task.dueDate && new Date(task.dueDate).setHours(0,0,0,0) < todayStart.getTime());
    }
    if (filterDueSoon) {
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const sevenDays = new Date(todayStart); sevenDays.setDate(sevenDays.getDate() + 7);
      result = result.filter(task => task.status !== "completed" && task.dueDate && new Date(task.dueDate).setHours(0,0,0,0) >= todayStart.getTime() && new Date(task.dueDate).setHours(0,0,0,0) <= sevenDays.getTime());
    }

    result.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      switch (sortBy) {
        case "title": aVal = a.title.toLowerCase(); bVal = b.title.toLowerCase(); break;
        case "source": aVal = a.source?.toLowerCase() || "ω"; bVal = b.source?.toLowerCase() || "ω"; break;
        case "department": aVal = a.department?.toLowerCase() || "ω"; bVal = b.department?.toLowerCase() || "ω"; break;
        case "owner": aVal = a.owner?.name?.toLowerCase() || "ω"; bVal = b.owner?.name?.toLowerCase() || "ω"; break;
        case "dueDate": aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0; bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0; break;
        case "priority": {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aVal = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bVal = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        }
        case "status": {
          const statusOrder = { pending: 1, not_started: 2, in_progress: 3, delayed: 4, completed: 5 };
          aVal = statusOrder[a.status as keyof typeof statusOrder] || 0;
          bVal = statusOrder[b.status as keyof typeof statusOrder] || 0;
          break;
        }
        case "completion": aVal = a.completion; bVal = b.completion; break;
        default: aVal = new Date(a.updatedAt).getTime(); bVal = new Date(b.updatedAt).getTime();
      }
      if (sortOrder === "asc") return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    return result;
  }, [tasks, searchQuery, filterStatuses, filterPriority, filterDepartment, filterSource, filterOverdue, filterDueSoon, sortBy, sortOrder]);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("تعذر إنشاء المهمة");
      toast.success("تم إنشاء المهمة بنجاح");
      await fetchTasks();
      await fetchStats();
      setIsTaskModalOpen(false);
      setEditingTask({});
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("تعذر إنشاء المهمة");
    }
  };

  const handleUpdateTask = async (taskData: TaskMutationPayload) => {
    if (!selectedTask) return;
    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("تعذر تحديث المهمة");
      toast.success("Task updated successfully");
      await fetchTasks();
      await fetchStats();
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      setEditingTask({});
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("تعذر تحديث المهمة");
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const response = await fetch(`/api/tasks/${taskToDelete.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("تعذر حذف المهمة");
      toast.success("Task deleted successfully");
      await fetchTasks();
      await fetchStats();
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("تعذر حذف المهمة");
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedTaskIds);
    let deleted = 0;
    for (const id of ids) {
      try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        if (res.ok) deleted++;
      } catch {}
    }
    toast.success(`تم حذف ${deleted} مهمة بنجاح`);
    setSelectedTaskIds(new Set());
    setIsBulkDeleteDialogOpen(false);
    await fetchTasks();
    await fetchStats();
  };

  const handleQuickUpdate = async (taskId: string, data: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("تعذر تحديث المهمة");
      toast.success("تم التحديث بنجاح");
      await fetchTasks();
      await fetchStats();
    } catch {
      toast.error("فشل التحديث");
    }
  };

  const handleMarkComplete = async (task: Task) => {
    await handleQuickUpdate(task.id, { status: "completed", completion: 1 });
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("file", uploadFile);
    try {
      setUploadProgress(10);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      setUploadProgress(50);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "تعذر رفع الملف");
      }
      const result = await response.json();
      setUploadProgress(100);
      toast.success(`تم استيراد ${result.imported} مهمة بنجاح`);
      await fetchTasks();
      await fetchStats();
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error instanceof Error ? error.message : "تعذر رفع الملف");
      setUploadProgress(0);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/tasks/export");
      if (!response.ok) throw new Error("تعذر تصدير المهام");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks_export_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("تم تصدير المهام بنجاح");
    } catch (error) {
      console.error("Error exporting tasks:", error);
      toast.error("تعذر تصدير المهام");
    }
  };

  const openTaskModal = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
      setEditingTask(task);
    } else {
      setSelectedTask(null);
      setEditingTask({ status: "pending", priority: "medium", completion: 0 });
    }
    setIsTaskModalOpen(true);
  };

  const handleTaskModalOpenChange = (open: boolean) => {
    setIsTaskModalOpen(open);
    if (!open) {
      setSelectedTask(null);
      setEditingTask({});
    }
  };

  const getDaysRemaining = (dueDate: string | null): number | null => {
    if (!dueDate) return null;
    return differenceInDays(new Date(dueDate), new Date());
  };

  const getRiskColor = (task: Task): string => {
    if (task.status === "completed") return "text-emerald-600";
    if (task.status === "delayed") return "text-red-600";
    const daysRemaining = getDaysRemaining(task.dueDate);
    if (daysRemaining === null) return "text-slate-600";
    if (daysRemaining < 0) return "text-red-600";
    if (daysRemaining <= 3) return "text-orange-600";
    if (daysRemaining <= 7) return "text-amber-600";
    return "text-emerald-600";
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("تعذر حفظ الإعدادات");
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("تعذر حفظ الإعدادات");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!settings.adminEmail) { toast.error("يرجى إدخال البريد الإلكتروني للمشرف أولًا"); return; }
    setSendingTest(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "in-progress-report", reportType: "daily" }),
      });
      if (!response.ok) throw new Error("تعذر إرسال رسالة الاختبار");
      toast.success("تم إرسال رسالة الاختبار بنجاح");
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("تعذر إرسال رسالة الاختبار");
    } finally {
      setSendingTest(false);
    }
  };

  const handleSendTaskReminders = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "overdue-all" }),
      });
      const data = await response.json();
      toast.success(`تم إرسال ${data.sent} تذكير، وفشل ${data.failed}`);
    } catch (error) {
      console.error("Error sending reminders:", error);
      toast.error("تعذر إرسال التذكيرات");
    }
  };

  const handleSendBulkWhatsApp = async () => {
    if (selectedTaskIds.size === 0) {
      toast.error("حدّد مهمة واحدة أو أكثر أولًا.");
      return;
    }

    if (!window.confirm("هل تريد إرسال رسالة واتساب مجمعة إلى مسؤولي المهام المحددة؟")) {
      return;
    }

    setSendingBulkWhatsApp(true);
    try {
      const response = await fetch("/api/tasks/reminders/bulk-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskIds: Array.from(selectedTaskIds) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر إرسال رسائل واتساب المجمعة");

      const result = data.result as ReminderRunSummary;
      const skippedOwners = new Set(result.skippedTasks.map((task) => task.ownerName));
      const failedOwners = result.failedOwners.map((owner) => owner.ownerName).join(", ");

      toast.success(
        `تم إرسال ${result.sentOwners.length} رسالة للمسؤولين. تم تخطي ${result.skippedTasks.length} مهمة.${failedOwners ? ` المسؤولون الذين فشل الإرسال لهم: ${failedOwners}` : ""}`,
      );

      if (skippedOwners.size > 0) {
        toast.error(`تعذر الوصول إلى جهات الاتصال التالية أو تم تخطيها: ${Array.from(skippedOwners).join("، ")}`);
      }

      setOwnerReminderSummary(result);
    } catch (error) {
      console.error("Error sending grouped reminders:", error);
      toast.error(error instanceof Error ? error.message : "تعذر إرسال رسائل واتساب المجمعة");
    } finally {
      setSendingBulkWhatsApp(false);
    }
  };

  const handleSendSingleReminder = async (task: Task, channel: "whatsapp" | "email", force = false) => {
    const reminderKey = `${task.id}:${channel}`;
    setActiveReminderKey(reminderKey);
    try {
      const response = await fetch(`/api/tasks/${task.id}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, force }),
      });
      const data = await response.json();
      if (response.status === 409) {
        const shouldResend = window.confirm(`${data.error || "تم إرسال تذكير لهذه المهمة اليوم بالفعل."}\n\nهل تريد الإرسال مرة أخرى؟`);
        if (shouldResend) {
          await handleSendSingleReminder(task, channel, true);
        } else {
          toast.message("تم الإبقاء على التذكير السابق دون إعادة الإرسال.");
        }
        return;
      }
      if (!response.ok) throw new Error(data.error || "تعذر إرسال التذكير");

      toast.success(
        channel === "whatsapp"
          ? "تم إرسال تذكير واتساب بنجاح."
          : "تم إرسال تذكير البريد الإلكتروني بنجاح.",
      );
    } catch (error) {
      console.error("Error sending single reminder:", error);
      toast.error(error instanceof Error ? error.message : "تعذر إرسال التذكير");
    } finally {
      setActiveReminderKey(null);
    }
  };

  const handleSendOwnerReminderNow = async () => {
    if (!window.confirm("هل تريد تشغيل تذكيرات واتساب الآن لجميع مسؤولي المهام المؤهلين؟")) {
      return;
    }

    setSendingOwnerRemindersNow(true);
    try {
      const response = await fetch("/api/settings/reminders/send-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: false }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تشغيل تذكيرات واتساب");

      const result = data.result as ReminderRunSummary;
      setOwnerReminderSummary(result);
      toast.success(
        `اكتمل الإرسال الفوري: تم التواصل مع ${result.sentOwners.length} مسؤول، وتخطي ${result.skippedTasks.length} مهمة، وفشل ${result.failedOwners.length} مسؤول.`,
      );
    } catch (error) {
      console.error("Error sending owner reminders now:", error);
      toast.error(error instanceof Error ? error.message : "تعذر تشغيل تذكيرات المسؤولين");
    } finally {
      setSendingOwnerRemindersNow(false);
    }
  };

  const handleCreateReminder = async () => {
    if (!newReminder.title || !newReminder.reminderDate) { toast.error("Title and date are required"); return; }
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder),
      });
      if (!response.ok) throw new Error("Failed to create reminder");
      toast.success("Reminder scheduled successfully");
      await fetchScheduledReminders();
      setNewReminder({ title: "", description: "", reminderDate: "", reminderTime: "09:00", sendToAdmin: true, sendToOwners: true });
      setShowReminderForm(false);
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast.error("Failed to create reminder");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      const response = await fetch(`/api/reminders?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete reminder");
      toast.success("Reminder deleted");
      await fetchScheduledReminders();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  const handleTriggerCron = async () => {
    try {
      const response = await fetch("/api/cron", { method: "POST" });
      const data = await response.json();
      toast.success(`Cron executed: ${data.results?.scheduledReminders?.processed || 0} reminders processed`);
    } catch (error) {
      console.error("Error triggering cron:", error);
      toast.error("Failed to trigger cron");
    }
  };

    const handleSendTaskReminder = async (task: Task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}/remind`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to send task reminder");
      toast.success("Task reminder sent successfully");
    } catch (error) {
      console.error("Error sending task reminder:", error);
      toast.error("Failed to send task reminder");
    }
  };

  const deptFilterOptions: SearchableSelectOption[] = [
    { value: "all", label: "كل الأقسام" },
    ...departments.map(d => ({ value: d, label: d })),
  ];

  const taskSources = useMemo(() => {
    const s = new Set(tasks.map(t => t.source).filter(Boolean));
    return Array.from(s) as string[];
  }, [tasks]);

  const sourceFilterOptions: SearchableSelectOption[] = [
    { value: "all", label: "كل المصادر" },
    ...taskSources.map(s => ({ value: s, label: s })),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 md:px-6 lg:px-8 flex h-14 items-center">
          <div className="flex items-center gap-2 ml-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">متتبع المهام</span>
          </div>
          <nav className="flex items-center gap-1 flex-1">
            <Button variant={activeTab === "dashboard" ? "secondary" : "ghost"} size="sm" onClick={() => setActiveTab("dashboard")}>
              <LayoutDashboard className="h-4 w-4 ml-2" /> لوحة التحكم
            </Button>
            <Button variant={activeTab === "tasks" ? "secondary" : "ghost"} size="sm" onClick={() => setActiveTab("tasks")}>
              <List className="h-4 w-4 ml-2" /> المهام
            </Button>
            <Button variant={activeTab === "settings" ? "secondary" : "ghost"} size="sm" onClick={() => setActiveTab("settings")}>
              <Settings className="h-4 w-4 ml-2" /> الإعدادات
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4 ml-2" /> استيراد
            </Button>
            <Button size="sm" onClick={() => openTaskModal()}>
              <Plus className="h-4 w-4 ml-2" /> مهمة جديدة
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 md:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="dashboard" className="mt-0">
            <DashboardContent
              stats={stats}
              onNavigateToDepartment={(dept) => {
                setFilterDepartment(dept);
                setFilterOverdue(false);
                setFilterDueSoon(false);
                setActiveTab("tasks");
              }}
              onNavigateToOverdue={() => {
                setFilterOverdue(true);
                setFilterDueSoon(false);
                setFilterDepartment("all");
                setFilterStatuses(() => []);
                setActiveTab("tasks");
              }}
              onNavigateToDueSoon={() => {
                setFilterDueSoon(true);
                setFilterOverdue(false);
                setFilterDepartment("all");
                setFilterStatuses(() => []);
                setActiveTab("tasks");
              }}
            />
          </TabsContent>
          <TabsContent value="tasks" className="mt-0">
            <TaskListContent
              tasks={tasks}
              filteredTasks={filteredTasks}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatuses={filterStatuses}
              setFilterStatuses={setFilterStatuses}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterDepartment={filterDepartment}
              setFilterDepartment={setFilterDepartment}
              filterOverdue={filterOverdue}
              setFilterOverdue={setFilterOverdue}
              filterDueSoon={filterDueSoon}
              setFilterDueSoon={setFilterDueSoon}
              filterSource={filterSource}
              setFilterSource={setFilterSource}
              sourceFilterOptions={sourceFilterOptions}
              deptFilterOptions={deptFilterOptions}
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectedTaskIds={selectedTaskIds}
              setSelectedTaskIds={setSelectedTaskIds}
              setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
              onOpenTaskModal={openTaskModal}
              onDeleteTask={(task) => { setTaskToDelete(task); setIsDeleteDialogOpen(true); }}
              onSendBulkWhatsApp={handleSendBulkWhatsApp}
              bulkWhatsAppSending={sendingBulkWhatsApp}
              onSendSingleReminder={handleSendSingleReminder}
              activeReminderKey={activeReminderKey}
              onCompleteTask={handleMarkComplete}
              onDateClick={(task) => { setQuickDateTask(task); setQuickDateValue(task.dueDate ? task.dueDate.split("T")[0] : ""); }}
              onProgressClick={(task) => { setQuickProgressTask(task); setQuickProgressValue(Math.round(task.completion * 100)); }}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              onExport={handleExport}
              getDaysRemaining={getDaysRemaining}
              getRiskColor={getRiskColor}
            />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <SettingsContent
              settings={settings}
              setSettings={setSettings}
              savingSettings={savingSettings}
              sendingTest={sendingTest}
              scheduledReminders={scheduledReminders}
              newReminder={newReminder}
              setNewReminder={setNewReminder}
              showReminderForm={showReminderForm}
              setShowReminderForm={setShowReminderForm}
              onSaveSettings={handleSaveSettings}
              onSendTestEmail={handleSendTestEmail}
              onSendTaskReminders={handleSendTaskReminders}
              onSendOwnerReminderNow={handleSendOwnerReminderNow}
              onCreateReminder={handleCreateReminder}
              onDeleteReminder={handleDeleteReminder}
              onTriggerCron={handleTriggerCron}
              sendingOwnerRemindersNow={sendingOwnerRemindersNow}
              ownerReminderSummary={ownerReminderSummary}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-auto border-t py-4">
        <div className="flex w-full flex-col gap-2 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <span>متتبع المهام © {new Date().getFullYear()}</span>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <span>{tasks.length} مهمة</span>
            <span>•</span>
            <span>آخر تحديث: {mounted ? formatArabicDateTime(new Date().toISOString()) : "--"}</span>
          </div>
        </div>
      </footer>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={handleTaskModalOpenChange}
        selectedTask={selectedTask}
        editingTask={editingTask}
        tasks={tasks}
        users={users}
        departments={departments}
        strategicPillars={strategicPillars}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onUserCreated={(user) => setUsers(prev => [...prev, user])}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        uploadFile={uploadFile}
        uploadProgress={uploadProgress}
        onFileChange={setUploadFile}
        onUpload={handleUpload}
      />

      {/* Single Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المهمة</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف &quot;{taskToDelete?.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المهام المحددة</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف {selectedTaskIds.size} مهمة؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">حذف {selectedTaskIds.size} مهمة</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Date Dialog */}
      <Dialog open={!!quickDateTask} onOpenChange={(open) => { if (!open) setQuickDateTask(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>تغيير تاريخ الاستحقاق</DialogTitle>
            <DialogDescription>{quickDateTask?.title}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input type="date" value={quickDateValue} onChange={(e) => setQuickDateValue(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickDateTask(null)}>إلغاء</Button>
            <Button onClick={async () => {
              if (quickDateTask) {
                await handleQuickUpdate(quickDateTask.id, { dueDate: quickDateValue || null });
                setQuickDateTask(null);
              }
            }}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Progress Dialog */}
      <Dialog open={!!quickProgressTask} onOpenChange={(open) => { if (!open) setQuickProgressTask(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>تغيير نسبة الإنجاز</DialogTitle>
            <DialogDescription>{quickProgressTask?.title}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={0}
                max={100}
                value={quickProgressValue}
                onChange={(e) => setQuickProgressValue(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <Progress value={quickProgressValue} className="h-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickProgressTask(null)}>إلغاء</Button>
            <Button onClick={async () => {
              if (quickProgressTask) {
                await handleQuickUpdate(quickProgressTask.id, { completion: quickProgressValue / 100 });
                setQuickProgressTask(null);
              }
            }}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
