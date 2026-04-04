"use client";

import { useState, useEffect, useMemo } from "react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  LayoutDashboard, List, Grid3X3, Upload, Plus, Search, Filter, 
  MoreVertical, Edit, Trash2, Download, Bell, Settings, Users,
  CheckCircle2, Clock, AlertTriangle, XCircle, TrendingUp,
  Calendar, User, Building, Flag, BarChart3, PieChart, FileSpreadsheet,
  ChevronDown, ChevronUp, RefreshCw, Eye, Mail, MessageSquare, Save, Send
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
  createdAt: string;
  updatedAt: string;
}

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
  not_started: { label: "لم يبدأ", color: "text-slate-600", bgColor: "bg-slate-100", icon: Clock },
  in_progress: { label: "قيد التنفيذ", color: "text-amber-600", bgColor: "bg-amber-100", icon: TrendingUp },
  delayed: { label: "متأخر", color: "text-red-600", bgColor: "bg-red-100", icon: AlertTriangle },
  completed: { label: "مكتمل", color: "text-emerald-600", bgColor: "bg-emerald-100", icon: CheckCircle2 },
};

const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: "منخفض", color: "text-slate-600", bgColor: "bg-slate-100" },
  medium: { label: "متوسط", color: "text-amber-600", bgColor: "bg-amber-100" },
  high: { label: "عالي", color: "text-orange-600", bgColor: "bg-orange-100" },
  critical: { label: "حرج", color: "text-red-600", bgColor: "bg-red-100" },
};

export default function TaskTrackerApp() {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
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
  
  // Settings state
  const [settings, setSettings] = useState<{
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
  }>({
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
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  // Quick action state
  const [quickDateTask, setQuickDateTask] = useState<Task | null>(null);
  const [quickDateValue, setQuickDateValue] = useState("");
  const [quickProgressTask, setQuickProgressTask] = useState<Task | null>(null);
  const [quickProgressValue, setQuickProgressValue] = useState(0);
  
  // Scheduled reminders state
  const [scheduledReminders, setScheduledReminders] = useState<Array<{
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
  }>>([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    reminderDate: "",
    reminderTime: "09:00",
    sendToAdmin: true,
    sendToOwners: true,
  });
  const [showReminderForm, setShowReminderForm] = useState(false);

  // Fetch data
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
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
      await Promise.all([fetchTasks(), fetchUsers(), fetchStats(), fetchSettings(), fetchScheduledReminders()]);
      setLoading(false);
    };
    loadData();
    setMounted(true);
  }, []);

  // Computed values
  const departments = useMemo(() => {
    const depts = new Set(tasks.map(t => t.department).filter(Boolean));
    return Array.from(depts) as string[];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
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

    // Filters
    if (filterStatuses.length > 0) {
      result = result.filter(task => filterStatuses.includes(task.status));
    }
    if (filterPriority !== "all") {
      result = result.filter(task => task.priority === filterPriority);
    }
    if (filterDepartment !== "all") {
      result = result.filter(task => task.department === filterDepartment);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      
      switch (sortBy) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "dueDate":
          aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aVal = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bVal = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case "completion":
          aVal = a.completion;
          bVal = b.completion;
          break;
        case "updatedAt":
        default:
          aVal = new Date(a.updatedAt).getTime();
          bVal = new Date(b.updatedAt).getTime();
      }

      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return result;
  }, [tasks, searchQuery, filterStatuses, filterPriority, filterDepartment, sortBy, sortOrder]);

  // Task operations
  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to create task");
      toast.success("Task created successfully");
      await fetchTasks();
      await fetchStats();
      setIsTaskModalOpen(false);
      setEditingTask({});
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!selectedTask) return;
    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to update task");
      toast.success("Task updated successfully");
      await fetchTasks();
      await fetchStats();
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      setEditingTask({});
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      toast.success("Task deleted successfully");
      await fetchTasks();
      await fetchStats();
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleQuickUpdate = async (taskId: string, data: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update task");
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
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      setUploadProgress(50);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload file");
      }
      
      const result = await response.json();
      setUploadProgress(100);
      
      toast.success(`Successfully imported ${result.imported} tasks`);
      await fetchTasks();
      await fetchStats();
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
      setUploadProgress(0);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/tasks/export");
      if (!response.ok) throw new Error("Failed to export tasks");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks_export_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("Tasks exported successfully");
    } catch (error) {
      console.error("Error exporting tasks:", error);
      toast.error("Failed to export tasks");
    }
  };

  const openTaskModal = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
      setEditingTask(task);
    } else {
      setSelectedTask(null);
      setEditingTask({
        status: "not_started",
        priority: "medium",
        completion: 0,
      });
    }
    setIsTaskModalOpen(true);
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

  // Settings operations
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!settings.adminEmail) {
      toast.error("Please enter an admin email first");
      return;
    }
    
    setSendingTest(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "in-progress-report",
          reportType: "daily",
        }),
      });
      if (!response.ok) throw new Error("Failed to send test email");
      toast.success("Test email sent successfully");
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email");
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
      toast.success(`Sent ${data.sent} reminders, ${data.failed} failed`);
    } catch (error) {
      console.error("Error sending reminders:", error);
      toast.error("Failed to send reminders");
    }
  };

  // Scheduled reminder handlers
  const handleCreateReminder = async () => {
    if (!newReminder.title || !newReminder.reminderDate) {
      toast.error("Title and date are required");
      return;
    }
    
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder),
      });
      if (!response.ok) throw new Error("Failed to create reminder");
      toast.success("Reminder scheduled successfully");
      await fetchScheduledReminders();
      setNewReminder({
        title: "",
        description: "",
        reminderDate: "",
        reminderTime: "09:00",
        sendToAdmin: true,
        sendToOwners: true,
      });
      setShowReminderForm(false);
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast.error("Failed to create reminder");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      const response = await fetch(`/api/reminders?id=${id}`, {
        method: "DELETE",
      });
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

  // Components
  const KPICard = ({ title, value, subtitle, icon: Icon, trend, color = "primary" }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: typeof List;
    trend?: number;
    color?: string;
  }) => (
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

  const TaskCard = ({ task }: { task: Task }) => {
    const StatusIcon = statusConfig[task.status]?.icon || Clock;
    const daysRemaining = getDaysRemaining(task.dueDate);
    
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => openTaskModal(task)}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openTaskModal(task); }}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); setTaskToDelete(task); setIsDeleteDialogOpen(true); }}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <span className="text-muted-foreground">Progress</span>
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
            onClick={(e) => { e.stopPropagation(); handleMarkComplete(task); }}
          >
            <CheckCircle2 className="h-3 w-3 ml-1" /> مكتمل
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8"
            onClick={(e) => { e.stopPropagation(); openTaskModal(task); }}
          >
            <Edit className="h-3 w-3 ml-1" /> تحديث
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8"
            onClick={(e) => {
              e.stopPropagation();
              setQuickDateTask(task);
              setQuickDateValue(task.dueDate ? task.dueDate.split("T")[0] : "");
            }}
          >
            <Calendar className="h-3 w-3 ml-1" /> التاريخ
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8"
            onClick={(e) => {
              e.stopPropagation();
              setQuickProgressTask(task);
              setQuickProgressValue(Math.round(task.completion * 100));
            }}
          >
            <BarChart3 className="h-3 w-3 ml-1" /> التقدم
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const TaskModal = () => {
    const [localTask, setLocalTask] = useState<Partial<Task>>(editingTask);
    
    useEffect(() => {
      setLocalTask(editingTask);
    }, [editingTask]);

    const handleSubmit = () => {
      if (!localTask.title?.trim()) {
        toast.error("العنوان مطلوب");
        return;
      }
      if (selectedTask) {
        handleUpdateTask(localTask);
      } else {
        handleCreateTask(localTask);
      }
    };

    return (
      <Dialog open={isTaskModalOpen} onOpenChange={(open) => {
        setIsTaskModalOpen(open);
        if (!open) {
          setSelectedTask(null);
          setEditingTask({});
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTask ? "تعديل المهمة" : "إنشاء مهمة جديدة"}</DialogTitle>
            <DialogDescription>
              {selectedTask ? "تحديث ��فاصيل المهمة والتقدم" : "إضافة مهمة جديدة إلى المتتبع"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">العنوان *</Label>
              <Input
                id="title"
                value={localTask.title || ""}
                onChange={(e) => setLocalTask({ ...localTask, title: e.target.value })}
                placeholder="أدخل عنوان المهمة"
              />
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
                <Label htmlFor="department">القسم</Label>
                <Input
                  id="department"
                  value={localTask.department || ""}
                  onChange={(e) => setLocalTask({ ...localTask, department: e.target.value })}
                  placeholder="أدخل القسم"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="strategicPillar">الركيزة الاستراتيجية</Label>
                <Input
                  id="strategicPillar"
                  value={localTask.strategicPillar || ""}
                  onChange={(e) => setLocalTask({ ...localTask, strategicPillar: e.target.value })}
                  placeholder="أدخل الركيزة الاستراتيجية"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="owner">المالك</Label>
                <Select
                  value={localTask.ownerId || "none"}
                  onValueChange={(value) => setLocalTask({ ...localTask, ownerId: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المالك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">لا يوجد مالك</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">المُكلَّف</Label>
                <Select
                  value={localTask.assigneeId || "none"}
                  onValueChange={(value) => setLocalTask({ ...localTask, assigneeId: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المُكلَّف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">لا يوجد مُكلَّف</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">الأولوية</Label>
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
                <Label htmlFor="status">الحالة</Label>
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
                    <SelectItem value="not_started">لم يبدأ</SelectItem>
                    <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="delayed">متأخر</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="completion">نسبة الإنجاز %</Label>
                <Input
                  id="completion"
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round((localTask.completion || 0) * 100)}
                  onChange={(e) => setLocalTask({ 
                    ...localTask, 
                    completion: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) / 100 
                  })}
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
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={localTask.notes || ""}
                onChange={(e) => setLocalTask({ ...localTask, notes: e.target.value })}
                placeholder="أضف ملاحظات"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="nextStep">الخطوة التالية</Label>
              <Input
                id="nextStep"
                value={localTask.nextStep || ""}
                onChange={(e) => setLocalTask({ ...localTask, nextStep: e.target.value })}
                placeholder="ما الخطوة التالية؟"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ceoNotes">ملاحظات الرئيس التنفيذي</Label>
              <Textarea
                id="ceoNotes"
                value={localTask.ceoNotes || ""}
                onChange={(e) => setLocalTask({ ...localTask, ceoNotes: e.target.value })}
                placeholder="تعليقات الرئيس التنفيذي"
                rows={2}
              />
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
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {selectedTask ? "تحديث المهمة" : "إنشاء المهمة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const UploadModal = () => (
    <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
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
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
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
          <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleUpload} disabled={!uploadFile || uploadProgress > 0}>
            <Upload className="ml-2 h-4 w-4" />
            رفع
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Dashboard content
  const DashboardContent = () => {
    if (!stats) return null;

    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="إجمالي المهام"
            value={stats.totalTasks}
            icon={List}
            subtitle="جميع المهام في النظام"
          />
          <KPICard
            title="معدل الإنجاز"
            value={`${Math.round(stats.completionRate)}%`}
            icon={CheckCircle2}
            subtitle={`${stats.completedTasks} مكتملة`}
            trend={5}
          />
          <KPICard
            title="قيد التنفيذ"
            value={stats.inProgressTasks}
            icon={TrendingUp}
            subtitle="المهام النشطة"
          />
          <KPICard
            title="متأخرة"
            value={stats.delayedTasks}
            icon={AlertTriangle}
            subtitle="تحتاج اهتماماً"
            color="destructive"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">توزيع الحالات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.tasksByStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === "completed" ? "bg-emerald-500" :
                        item.status === "in_progress" ? "bg-amber-500" :
                        item.status === "delayed" ? "bg-red-500" :
                        "bg-slate-400"
                      }`} />
                      <span className="text-sm">{statusConfig[item.status]?.label || item.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.count}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((item.count / stats.totalTasks) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">توزيع الأولويات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.tasksByPriority.map((item) => (
                  <div key={item.priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        item.priority === "critical" ? "bg-red-600" :
                        item.priority === "high" ? "bg-orange-500" :
                        item.priority === "medium" ? "bg-amber-500" :
                        "bg-slate-400"
                      }`} />
                      <span className="text-sm">{priorityConfig[item.priority]?.label || item.priority}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.count}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((item.count / stats.totalTasks) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">المهام حسب القسم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {stats.tasksByDepartment.map((item) => (
                <div 
                  key={item.department} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.department}</span>
                  </div>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overdue & Due Soon */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                المهام المتأخرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-700">{stats.overdueTasks}</p>
              <p className="text-sm text-red-600 mt-1">مهام تجاوزت تاريخ الاستحقاق</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                <Clock className="h-4 w-4" />
                تستحق قريباً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-700">{stats.dueSoonTasks}</p>
              <p className="text-sm text-amber-600 mt-1">تستحق خلال 7 أيام</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Task list content
  const TaskListContent = () => (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المهام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Filter className="size-4" />
                {filterStatuses.length === 0 ? "كل الحالات" : `${filterStatuses.length} حالات`}
                <ChevronDown className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(["not_started", "in_progress", "delayed", "completed"] as const).map(status => (
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
                  <DropdownMenuItem onClick={() => setFilterStatuses([])}>
                    مسح التصفية
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {filterStatuses.length > 0 && (
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
            </div>
          )}
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[140px]">
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
          {departments.length > 0 && (
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأقسام</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("card")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 ml-1" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        عرض {filteredTasks.length} من {tasks.length} مهمة
      </div>

      {/* Task views */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <List className="h-12 w-12 mb-4" />
            <p>لا توجد مهام</p>
            <Button className="mt-4" onClick={() => openTaskModal()}>
              <Plus className="ml-2 h-4 w-4" />
              أنشئ مهمتك الأولى
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "card" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <Card className="w-full overflow-hidden">
          <ScrollArea className="h-[calc(100vh-400px)]" dir="rtl">
            <Table className="w-full" dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">الرقم</TableHead>
                  <TableHead className="min-w-[200px]">العنوان</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>المالك</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="w-[100px]">التقدم</TableHead>
                  <TableHead>تاريخ الاستحقاق</TableHead>
                  <TableHead className="w-[200px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => {
                  const StatusIcon = statusConfig[task.status]?.icon || Clock;
                  const daysRemaining = getDaysRemaining(task.dueDate);
                  
                  return (
                    <TableRow 
                      key={task.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openTaskModal(task)}
                    >
                      <TableCell className="font-mono text-xs">
                        {task.taskId || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium line-clamp-1">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {task.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{task.department || "-"}</TableCell>
                      <TableCell>{task.owner?.name || "-"}</TableCell>
                      <TableCell>
                        <Badge className={`${priorityConfig[task.priority]?.bgColor} ${priorityConfig[task.priority]?.color}`}>
                          {priorityConfig[task.priority]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[task.status]?.bgColor} ${statusConfig[task.status]?.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[task.status]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={task.completion * 100} className="h-2 flex-1" />
                          <span className="text-xs font-medium w-8">
                            {Math.round(task.completion * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <div className={getRiskColor(task)}>
                            <div className="text-sm">
                              {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </div>
                            {daysRemaining !== null && task.status !== "completed" && (
                              <div className="text-xs">
                                {daysRemaining < 0 
                                  ? `${Math.abs(daysRemaining)}d overdue`
                                  : daysRemaining === 0 
                                    ? "Today"
                                    : `${daysRemaining}d left`
                                }
                              </div>
                            )}
                          </div>
                        ) : "-"}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2"
                            disabled={task.status === "completed"}
                            onClick={() => handleMarkComplete(task)}
                          >
                            <CheckCircle2 className="h-3 w-3 ml-1" /> مكتمل
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2"
                            onClick={() => openTaskModal(task)}
                          >
                            <Edit className="h-3 w-3 ml-1" /> تحديث
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2"
                            onClick={() => {
                              setQuickDateTask(task);
                              setQuickDateValue(task.dueDate ? task.dueDate.split("T")[0] : "");
                            }}
                          >
                            <Calendar className="h-3 w-3 ml-1" /> التاريخ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2"
                            onClick={() => {
                              setQuickProgressTask(task);
                              setQuickProgressValue(Math.round(task.completion * 100));
                            }}
                          >
                            <BarChart3 className="h-3 w-3 ml-1" /> التقدم
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setTaskToDelete(task); setIsDeleteDialogOpen(true); }} className="text-red-600">
                                <Trash2 className="ml-2 h-4 w-4" /> حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}
    </div>
  );

  // Settings content
  const SettingsContent = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إعدادات الإشعارات</h1>
          <p className="text-muted-foreground">إعداد إشعارات البريد والتقارير</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={savingSettings}>
          {savingSettings ? (
            <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 ml-2" />
          )}
          حفظ الإعدادات
        </Button>
      </div>

      {/* Admin Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            إعداد البريد الإلكتروني للمسؤول
          </CardTitle>
          <CardDescription>
            حدد عنوان البريد الإلكتروني الذي سيستقبل التقارير والإشعارات
          </CardDescription>
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
            <p className="text-xs text-muted-foreground">
              سيستقبل هذا البريد تقارير المهام قيد التنفيذ والملخصات
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSendTestEmail}
            disabled={sendingTest || !settings.adminEmail}
          >
            {sendingTest ? (
              <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 ml-2" />
            )}
            إرسال بريد تجريبي
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Reminders with Calendar Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            التذكيرات المجدولة
          </CardTitle>
          <CardDescription>
            جدولة تذكيرات بريد إلكتروني في تواريخ محددة
          </CardDescription>
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
                      <Badge variant={reminder.isSent ? "secondary" : "default"}>
                        {reminder.isSent ? "أُرسل" : "قيد الانتظار"}
                      </Badge>
                      {!reminder.isSent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new reminder form */}
          {showReminderForm ? (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="grid gap-2">
                <Label htmlFor="reminderTitle">عنوان التذكير *</Label>
                <Input
                  id="reminderTitle"
                  placeholder="مثال: مراجعة المهام الشهرية"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminderDesc">الوصف (اختياري)</Label>
                <Textarea
                  id="reminderDesc"
                  placeholder="ملاحظات إضافية لهذا التذكير..."
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reminderDate">التاريخ *</Label>
                  <Input
                    id="reminderDate"
                    type="date"
                    value={newReminder.reminderDate}
                    onChange={(e) => setNewReminder({ ...newReminder, reminderDate: e.target.value })}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reminderTime">الوقت</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={newReminder.reminderTime}
                    onChange={(e) => setNewReminder({ ...newReminder, reminderTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendToAdmin"
                    checked={newReminder.sendToAdmin}
                    onChange={(e) => setNewReminder({ ...newReminder, sendToAdmin: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="sendToAdmin" className="text-sm">إرسال للمسؤول</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendToOwners"
                    checked={newReminder.sendToOwners}
                    onChange={(e) => setNewReminder({ ...newReminder, sendToOwners: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="sendToOwners" className="text-sm">إرسال لأصحاب المهام</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateReminder}>جدولة التذكير</Button>
                <Button variant="outline" onClick={() => setShowReminderForm(false)}>إلغاء</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowReminderForm(true)}>
              <Plus className="h-4 w-4 ml-2" />
              جدولة تذكير جديد
            </Button>
          )}

          {/* Manual cron trigger */}
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={handleTriggerCron}>
              <RefreshCw className="h-4 w-4 ml-2" />
              معالجة التذكيرات المجدولة الآن
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              سيعالج هذا جميع التذكيرات المعلقة المستحقة
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Reminder Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            تواريخ التذكير المخصصة
          </CardTitle>
          <CardDescription>
            حدد تواريخ محددة لاستقبال ملخصات المهام بالبريد
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="customDates">تواريخ التذكير (YYYY-MM-DD، مفصولة بفواصل)</Label>
            <Textarea
              id="customDates"
              placeholder="مثال: 2024-01-15, 2024-02-01, 2024-03-01"
              value={settings.customReminderDates}
              onChange={(e) => setSettings({ ...settings, customReminderDates: e.target.value })}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              في هذه التواريخ ستستقبل ملخصاً بريدياً لجميع المهام النشطة
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reminderDaysBefore">أيام قبل تاريخ الاستحقاق للتذكيرات التلقائية</Label>
            <Input
              id="reminderDaysBefore"
              type="number"
              min={1}
              max={30}
              value={settings.reminderDaysBefore}
              onChange={(e) => setSettings({ ...settings, reminderDaysBefore: parseInt(e.target.value) || 3 })}
            />
            <p className="text-xs text-muted-foreground">
              سيتلقى أصحاب المهام تذكيرات قبل هذا العدد من الأيام من تاريخ الاستحقاق
            </p>
          </div>
        </CardContent>
      </Card>

      {/* In-Progress Task Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            تقرير المهام قيد التنفيذ
          </CardTitle>
          <CardDescription>
            استقبل تقارير دورية لجميع المهام قيد التنفيذ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تفعيل تقارير المهام قيد التنفيذ</Label>
              <p className="text-xs text-muted-foreground">
                استقبل تقارير عن المهام التي يجري العمل عليها
              </p>
            </div>
            <Switch
              checked={settings.inProgressReportEnabled}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, inProgressReportEnabled: checked })
              }
            />
          </div>
          
          {settings.inProgressReportEnabled && (
            <div className="grid gap-4 pt-4 border-t">
              <div className="grid gap-2">
                <Label>تكرار التقرير</Label>
                <Select
                  value={settings.inProgressReportFrequency}
                  onValueChange={(value) =>
                    setSettings({ ...settings, inProgressReportFrequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التكرار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">يومي</SelectItem>
                    <SelectItem value="weekly">أسبوعي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {settings.inProgressReportFrequency === "daily" && (
                <div className="grid gap-2">
                  <Label htmlFor="dailyTime">وقت التقرير اليومي</Label>
                  <Input
                    id="dailyTime"
                    type="time"
                    value={settings.dailyDigestTime}
                    onChange={(e) => setSettings({ ...settings, dailyDigestTime: e.target.value })}
                  />
                </div>
              )}
              
              {settings.inProgressReportFrequency === "weekly" && (
                <>
                  <div className="grid gap-2">
                    <Label>يوم التقرير</Label>
                    <Select
                      value={String(settings.weeklyReportDay)}
                      onValueChange={(value) =>
                        setSettings({ ...settings, weeklyReportDay: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر اليوم" />
                      </SelectTrigger>
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
                    <Input
                      id="weeklyTime"
                      type="time"
                      value={settings.weeklyReportTime}
                      onChange={(e) => setSettings({ ...settings, weeklyReportTime: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            تذكيرات المهام
          </CardTitle>
          <CardDescription>
            إعداد التذكيرات التلقائية لأصحاب المهام
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تفعيل تذكيرات المهام</Label>
              <p className="text-xs text-muted-foreground">
                إرسال تذكيرات بريدية لأصحاب المهام قبل تواريخ الاستحقاق
              </p>
            </div>
            <Switch
              checked={settings.taskReminderEnabled}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, taskReminderEnabled: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label>تذكيرات التأخر</Label>
              <p className="text-xs text-muted-foreground">
                إرسال تذكيرات للمهام التي تجاوزت تاريخ الاستحقاق
              </p>
            </div>
            <Switch
              checked={settings.overdueReminderEnabled}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, overdueReminderEnabled: checked })
              }
            />
          </div>
          
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={handleSendTaskReminders}>
              <Send className="h-4 w-4 ml-2" />
              إرسال تذكيرات التأخر الآن
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration Info */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            إعداد البريد الإلكتروني مطلوب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 mb-3">
            لتفعيل إشعارات البريد، أضف هذه المتغيرات لملف <code className="bg-amber-100 px-1 rounded">.env</code>:
          </p>
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
          <p className="text-xs text-amber-600 mt-4">
            بدون هذه الإعدادات، سيتم تسجيل الرسائل في وحدة التحكم بدلاً من إرسالها.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 md:px-6 lg:px-8 flex h-14 items-center">
          <div className="flex items-center gap-2 ml-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">متتبع المهام</span>
          </div>

          <nav className="flex items-center gap-1 flex-1">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4 ml-2" />
              لوحة التحكم
            </Button>
            <Button
              variant={activeTab === "tasks" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("tasks")}
            >
              <List className="h-4 w-4 ml-2" />
              المهام
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4 ml-2" />
              استيراد
            </Button>
            <Button size="sm" onClick={() => openTaskModal()}>
              <Plus className="h-4 w-4 ml-2" />
              مهمة جديدة
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 md:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="dashboard" className="mt-0">
            <DashboardContent />
          </TabsContent>
          <TabsContent value="tasks" className="mt-0">
            <TaskListContent />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <SettingsContent />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-auto">
        <div className="w-full px-4 md:px-6 lg:px-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>TaskTracker © {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4">
            <span>{tasks.length} tasks</span>
            <span>•</span>
            <span>Last updated: {mounted ? format(new Date(), "MMM d, yyyy h:mm a") : "--"}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal />
      <UploadModal />
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المهمة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف "{taskToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
              حذف
            </AlertDialogAction>
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
            <Input
              type="date"
              value={quickDateValue}
              onChange={(e) => setQuickDateValue(e.target.value)}
            />
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
