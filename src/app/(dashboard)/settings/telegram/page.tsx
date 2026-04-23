"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Trash2, RefreshCw, CheckCircle2, XCircle, MessageSquare, Link2, Link2Off } from "lucide-react";

interface LinkedAccount {
  id: string;
  chatId: string;
  userId: string;
  createdAt: string;
  user: { name: string | null; email: string; role: string };
}

interface TelegramLog {
  id: string;
  chatId: string;
  messagePreview: string;
  parsed: boolean;
  parseError: string | null;
  taskId: string | null;
  createdAt: string;
}

interface WebhookInfo {
  url?: string;
  pending_update_count?: number;
  last_error_message?: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ar-SA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TelegramSettingsPage() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [logs, setLogs] = useState<TelegramLog[]>([]);
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [appUrl, setAppUrl] = useState("");

  // New account form
  const [newChatId, setNewChatId] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [addingAccount, setAddingAccount] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [accountsRes, logsRes, webhookRes, usersRes] = await Promise.allSettled([
        fetch("/api/telegram/settings/linked-accounts").then((r) => r.json()),
        fetch("/api/telegram/settings/logs").then((r) => r.json()),
        fetch("/api/telegram/settings/webhook").then((r) => r.json()),
        fetch("/api/users").then((r) => r.json()),
      ]);

      if (accountsRes.status === "fulfilled") setAccounts((accountsRes.value as any).accounts ?? []);
      if (logsRes.status === "fulfilled") setLogs((logsRes.value as any).logs ?? []);
      if (webhookRes.status === "fulfilled") setWebhookInfo((webhookRes.value as any).webhookInfo ?? null);
      if (usersRes.status === "fulfilled") setUsers((usersRes.value as any).users ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    if (typeof window !== "undefined") {
      setAppUrl(window.location.origin);
    }
  }, [fetchAll]);

  const handleRegisterWebhook = async () => {
    if (!appUrl) {
      toast.error("أدخل رابط التطبيق أولاً");
      return;
    }
    setWebhookLoading(true);
    try {
      const res = await fetch("/api/telegram/settings/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appUrl }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("تم تسجيل Webhook بنجاح");
        await fetchAll();
      } else {
        toast.error(data.description || "فشل تسجيل Webhook");
      }
    } catch {
      toast.error("خطأ في الشبكة");
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleAddAccount = async () => {
    if (!newChatId || !newUserId) {
      toast.error("أدخل Chat ID والمستخدم");
      return;
    }
    setAddingAccount(true);
    try {
      const res = await fetch("/api/telegram/settings/linked-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: newChatId, userId: newUserId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم ربط الحساب بنجاح");
        setNewChatId("");
        setNewUserId("");
        await fetchAll();
      } else {
        toast.error(data.error || "فشل ربط الحساب");
      }
    } catch {
      toast.error("خطأ في الشبكة");
    } finally {
      setAddingAccount(false);
    }
  };

  const handleRemoveAccount = async (id: string) => {
    try {
      const res = await fetch(`/api/telegram/settings/linked-accounts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("تم إلغاء ربط الحساب");
        setAccounts((prev) => prev.filter((a) => a.id !== id));
      } else {
        toast.error("فشل إلغاء الربط");
      }
    } catch {
      toast.error("خطأ في الشبكة");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`;

  return (
    <div className="space-y-6 max-w-4xl text-right" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          إعدادات بوت تيليغرام
        </h1>
        <p className="text-muted-foreground mt-1">
          إدارة ربط حسابات تيليغرام وإعداد Webhook وعرض سجل الرسائل الواردة.
        </p>
      </div>

      {/* Webhook Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">حالة Webhook</CardTitle>
          <CardDescription>عنوان Webhook المُسجَّل لدى تيليغرام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-3 text-sm font-mono break-all">
            {webhookInfo?.url || <span className="text-muted-foreground">لم يُسجَّل بعد</span>}
          </div>
          {webhookInfo?.last_error_message && (
            <p className="text-sm text-destructive">آخر خطأ: {webhookInfo.last_error_message}</p>
          )}
          {webhookInfo?.pending_update_count != null && (
            <p className="text-sm text-muted-foreground">
              تحديثات معلّقة: {webhookInfo.pending_update_count}
            </p>
          )}
          <Separator />
          <div className="flex items-center gap-2">
            <Input
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://your-app-url.com"
              className="flex-1 font-mono text-xs"
            />
            <Button onClick={handleRegisterWebhook} disabled={webhookLoading}>
              {webhookLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              تسجيل Webhook
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            سيتم تسجيل: <span className="font-mono">{webhookUrl}</span>
          </p>
        </CardContent>
      </Card>

      {/* Linked Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            الحسابات المربوطة
          </CardTitle>
          <CardDescription>ربط Chat ID تيليغرام بمستخدم في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد حسابات مربوطة بعد.</p>
          ) : (
            <div className="space-y-2">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {account.chatId}
                      </span>
                      <span>↔</span>
                      <span>{account.user.name || account.user.email}</span>
                      <Badge variant="outline" className="text-xs">{account.user.role}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{account.user.email}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveAccount(account.id)}
                  >
                    <Link2Off className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">ربط حساب جديد</h4>
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="chatId" className="text-xs">Chat ID</Label>
                <Input
                  id="chatId"
                  value={newChatId}
                  onChange={(e) => setNewChatId(e.target.value)}
                  placeholder="123456789"
                  className="font-mono"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="userId" className="text-xs">المستخدم</Label>
                <Select value={newUserId} onValueChange={setNewUserId}>
                  <SelectTrigger id="userId">
                    <SelectValue placeholder="اختر مستخدمًا" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name || u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddAccount} disabled={addingAccount}>
                {addingAccount ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                ربط
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">آخر الرسائل الواردة</CardTitle>
          <CardDescription>سجل آخر 10 رسائل وردت عبر البوت</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد رسائل بعد.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {log.parsed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {log.chatId}
                      </span>
                      {log.taskId && (
                        <Badge variant="outline" className="text-xs">
                          مهمة: {log.taskId.slice(0, 8)}…
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate">{log.messagePreview}</p>
                    {log.parseError && (
                      <p className="text-xs text-destructive">{log.parseError}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchAll}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
