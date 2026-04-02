"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  not_started: { label: "Not Started", color: "text-slate-600", bgColor: "bg-slate-100", icon: Clock },
  in_progress: { label: "In Progress", color: "text-amber-600", bgColor: "bg-amber-100", icon: TrendingUp },
  delayed: { label: "Delayed", color: "text-red-600", bgColor: "bg-red-100", icon: AlertTriangle },
  completed: { label: "Completed", color: "text-emerald-600", bgColor: "bg-emerald-100", icon: CheckCircle2 },
};

const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: "Low", color: "text-slate-600", bgColor: "bg-slate-100" },
  medium: { label: "Medium", color: "text-amber-600", bgColor: "bg-amber-100" },
  high: { label: "High", color: "text-orange-600", bgColor: "bg-orange-100" },
  critical: { label: "Critical", color: "text-red-600", bgColor: "bg-red-100" },
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
  const [filterStatus, setFilterStatus] = useState<string>("all");
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
    if (filterStatus !== "all") {
      result = result.filter(task => task.status === filterStatus);
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
  }, [tasks, searchQuery, filterStatus, filterPriority, filterDepartment, sortBy, sortOrder]);

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
            {trend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
            {Math.abs(trend)}% from last month
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
                    ? `${Math.abs(daysRemaining)} days overdue`
                    : daysRemaining === 0 
                      ? "Due today"
                      : `${daysRemaining} days left`
                )}
              </span>
            )}
          </div>
        </CardContent>
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
        toast.error("Title is required");
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
            <DialogTitle>{selectedTask ? "Edit Task" : "Create New Task"}</DialogTitle>
            <DialogDescription>
              {selectedTask ? "Update task details and progress" : "Add a new task to your tracker"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={localTask.title || ""}
                onChange={(e) => setLocalTask({ ...localTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={localTask.description || ""}
                onChange={(e) => setLocalTask({ ...localTask, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={localTask.department || ""}
                  onChange={(e) => setLocalTask({ ...localTask, department: e.target.value })}
                  placeholder="Enter department"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="strategicPillar">Strategic Pillar</Label>
                <Input
                  id="strategicPillar"
                  value={localTask.strategicPillar || ""}
                  onChange={(e) => setLocalTask({ ...localTask, strategicPillar: e.target.value })}
                  placeholder="Enter strategic pillar"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="owner">Owner</Label>
                <Select
                  value={localTask.ownerId || "none"}
                  onValueChange={(value) => setLocalTask({ ...localTask, ownerId: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No owner assigned</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={localTask.assigneeId || "none"}
                  onValueChange={(value) => setLocalTask({ ...localTask, assigneeId: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No assignee</SelectItem>
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
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={localTask.priority || "medium"}
                  onValueChange={(value) => setLocalTask({ ...localTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={localTask.status || "not_started"}
                  onValueChange={(value) => setLocalTask({ 
                    ...localTask, 
                    status: value,
                    completion: value === "completed" ? 1 : localTask.completion
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="completion">Completion %</Label>
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
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={localTask.startDate ? format(new Date(localTask.startDate), "yyyy-MM-dd") : ""}
                  onChange={(e) => setLocalTask({ ...localTask, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={localTask.dueDate ? format(new Date(localTask.dueDate), "yyyy-MM-dd") : ""}
                  onChange={(e) => setLocalTask({ ...localTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={localTask.notes || ""}
                onChange={(e) => setLocalTask({ ...localTask, notes: e.target.value })}
                placeholder="Add notes"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="nextStep">Next Step</Label>
              <Input
                id="nextStep"
                value={localTask.nextStep || ""}
                onChange={(e) => setLocalTask({ ...localTask, nextStep: e.target.value })}
                placeholder="What's the next step?"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ceoNotes">CEO Notes</Label>
              <Textarea
                id="ceoNotes"
                value={localTask.ceoNotes || ""}
                onChange={(e) => setLocalTask({ ...localTask, ceoNotes: e.target.value })}
                placeholder="CEO comments"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sourceMonth">Source Month</Label>
              <Input
                id="sourceMonth"
                value={localTask.sourceMonth || ""}
                onChange={(e) => setLocalTask({ ...localTask, sourceMonth: e.target.value })}
                placeholder="e.g., January 2025"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedTask ? "Update Task" : "Create Task"}
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
          <DialogTitle>Upload Tasks</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file with your task data
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
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
                {uploadProgress < 100 ? "Processing..." : "Complete!"}
              </p>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Supported columns:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Task ID, Title, Description</li>
              <li>Owner, Department, Priority</li>
              <li>Status, Start Date, Due Date</li>
              <li>Completion %, Notes, Source Month</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!uploadFile || uploadProgress > 0}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
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
            title="Total Tasks"
            value={stats.totalTasks}
            icon={List}
            subtitle="All tasks in system"
          />
          <KPICard
            title="Completion Rate"
            value={`${Math.round(stats.completionRate)}%`}
            icon={CheckCircle2}
            subtitle={`${stats.completedTasks} completed`}
            trend={5}
          />
          <KPICard
            title="In Progress"
            value={stats.inProgressTasks}
            icon={TrendingUp}
            subtitle="Active tasks"
          />
          <KPICard
            title="Delayed"
            value={stats.delayedTasks}
            icon={AlertTriangle}
            subtitle="Need attention"
            color="destructive"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Distribution</CardTitle>
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
              <CardTitle className="text-base">Priority Distribution</CardTitle>
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
            <CardTitle className="text-base">Tasks by Department</CardTitle>
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
                Overdue Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-700">{stats.overdueTasks}</p>
              <p className="text-sm text-red-600 mt-1">Tasks past due date</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                <Clock className="h-4 w-4" />
                Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-700">{stats.dueSoonTasks}</p>
              <p className="text-sm text-amber-600 mt-1">Due within 7 days</p>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          {departments.length > 0 && (
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
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
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTasks.length} of {tasks.length} tasks
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
            <p>No tasks found</p>
            <Button className="mt-4" onClick={() => openTaskModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first task
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
          <ScrollArea className="h-[calc(100vh-400px)]">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead className="min-w-[200px]">Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
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
                      <TableCell>
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
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setTaskToDelete(task); 
                                setIsDeleteDialogOpen(true); 
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          <h1 className="text-2xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">Configure email notifications and reports</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={savingSettings}>
          {savingSettings ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>

      {/* Admin Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Admin Email Configuration
          </CardTitle>
          <CardDescription>
            Set the email address that will receive reports and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="adminEmail">Admin Email Address</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@example.com"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              This email will receive in-progress task reports and summaries
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSendTestEmail} 
            disabled={sendingTest || !settings.adminEmail}
          >
            {sendingTest ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Send Test Email
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Reminders with Calendar Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled Reminders
          </CardTitle>
          <CardDescription>
            Schedule email reminders on specific dates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing reminders list */}
          {scheduledReminders.length > 0 && (
            <div className="space-y-2">
              <Label>Upcoming Reminders</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {scheduledReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{reminder.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(reminder.reminderDate), "MMMM d, yyyy")} at {reminder.reminderTime}
                        {reminder.isSent && <span className="ml-2 text-emerald-600">(Sent)</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={reminder.isSent ? "secondary" : "default"}>
                        {reminder.isSent ? "Sent" : "Pending"}
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
                <Label htmlFor="reminderTitle">Reminder Title *</Label>
                <Input
                  id="reminderTitle"
                  placeholder="e.g., Monthly Task Review"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminderDesc">Description (Optional)</Label>
                <Textarea
                  id="reminderDesc"
                  placeholder="Additional notes for this reminder..."
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reminderDate">Date *</Label>
                  <Input
                    id="reminderDate"
                    type="date"
                    value={newReminder.reminderDate}
                    onChange={(e) => setNewReminder({ ...newReminder, reminderDate: e.target.value })}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reminderTime">Time</Label>
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
                  <Label htmlFor="sendToAdmin" className="text-sm">Send to Admin</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendToOwners"
                    checked={newReminder.sendToOwners}
                    onChange={(e) => setNewReminder({ ...newReminder, sendToOwners: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="sendToOwners" className="text-sm">Send to Task Owners</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateReminder}>Schedule Reminder</Button>
                <Button variant="outline" onClick={() => setShowReminderForm(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowReminderForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule New Reminder
            </Button>
          )}

          {/* Manual cron trigger */}
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={handleTriggerCron}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Scheduled Reminders Now
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will process all pending reminders that are due
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Reminder Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Custom Reminder Dates
          </CardTitle>
          <CardDescription>
            Set specific dates to receive task summary emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="customDates">Reminder Dates (YYYY-MM-DD, comma-separated)</Label>
            <Textarea
              id="customDates"
              placeholder="e.g., 2024-01-15, 2024-02-01, 2024-03-01"
              value={settings.customReminderDates}
              onChange={(e) => setSettings({ ...settings, customReminderDates: e.target.value })}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              On these dates, you will receive an email summary of all active tasks
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reminderDaysBefore">Days Before Due Date for Auto Reminders</Label>
            <Input
              id="reminderDaysBefore"
              type="number"
              min={1}
              max={30}
              value={settings.reminderDaysBefore}
              onChange={(e) => setSettings({ ...settings, reminderDaysBefore: parseInt(e.target.value) || 3 })}
            />
            <p className="text-xs text-muted-foreground">
              Task owners will receive reminders this many days before their task is due
            </p>
          </div>
        </CardContent>
      </Card>

      {/* In-Progress Task Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            In-Progress Tasks Report
          </CardTitle>
          <CardDescription>
            Receive regular reports of all tasks currently in progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable In-Progress Reports</Label>
              <p className="text-xs text-muted-foreground">
                Receive reports about tasks that are currently being worked on
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
                <Label>Report Frequency</Label>
                <Select
                  value={settings.inProgressReportFrequency}
                  onValueChange={(value) => 
                    setSettings({ ...settings, inProgressReportFrequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {settings.inProgressReportFrequency === "daily" && (
                <div className="grid gap-2">
                  <Label htmlFor="dailyTime">Daily Report Time</Label>
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
                    <Label>Report Day</Label>
                    <Select
                      value={String(settings.weeklyReportDay)}
                      onValueChange={(value) => 
                        setSettings({ ...settings, weeklyReportDay: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sunday</SelectItem>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weeklyTime">Report Time</Label>
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
            Task Reminders
          </CardTitle>
          <CardDescription>
            Configure automatic reminders for task owners
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Task Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Send email reminders to task owners before due dates
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
              <Label>Overdue Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Send reminders for tasks that are past their due date
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
              <Send className="h-4 w-4 mr-2" />
              Send Overdue Reminders Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration Info */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            Email Configuration Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 mb-3">
            To enable email notifications, add these variables to your <code className="bg-amber-100 px-1 rounded">.env</code> file:
          </p>
          <div className="bg-amber-100/50 p-3 rounded-lg space-y-2 font-mono text-sm">
            <p><span className="text-amber-800">RESEND_API_KEY=</span><span className="text-amber-600">re_xxxxxxxxxxxx</span></p>
            <p><span className="text-amber-800">FROM_EMAIL=</span><span className="text-amber-600">noreply@yourdomain.com</span></p>
            <p><span className="text-amber-800">ADMIN_EMAIL=</span><span className="text-amber-600">admin@yourdomain.com</span></p>
          </div>
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm font-medium text-amber-800 mb-1">How to get a Resend API Key:</p>
            <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a> and create a free account</li>
              <li>Navigate to API Keys in your dashboard</li>
              <li>Create a new API key and copy it</li>
              <li>Add it to your .env file as RESEND_API_KEY</li>
            </ol>
          </div>
          <p className="text-xs text-amber-600 mt-4">
            Without these settings, emails will be logged to console instead of being sent.
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
          <div className="flex items-center gap-2 mr-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TaskTracker</span>
          </div>
          
          <nav className="flex items-center gap-1 flex-1">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "tasks" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("tasks")}
            >
              <List className="h-4 w-4 mr-2" />
              Tasks
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button size="sm" onClick={() => openTaskModal()}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
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
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
