"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ContactRecord = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  } | null;
};

type UserRecord = {
  id: string;
  email: string;
  name: string | null;
  department: string | null;
  role: string;
  username?: string | null;
};

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  userId: string;
};

const emptyFormState: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  userId: "none",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

function getLinkedUserLabel(user: UserRecord) {
  return user.name || user.username || user.email;
}

function normalizePhone(value: string) {
  const stripped = value.replace(/[\s()-]/g, "");
  // Auto-prepend + if the number starts with digits
  return stripped && !stripped.startsWith("+") ? `+${stripped}` : stripped;
}

function validateForm(form: ContactFormState) {
  if (!form.name.trim()) {
    return "الاسم مطلوب.";
  }

  if (form.phone.trim() && !PHONE_REGEX.test(normalizePhone(form.phone.trim()))) {
    return "يجب إدخال رقم الهاتف بصيغة دولية صحيحة مثل +966xxxxxxxxx.";
  }

  if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim())) {
    return "يرجى إدخال بريد إلكتروني صحيح.";
  }

  return null;
}

function ContactSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`contact-skeleton-${index}`}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

/**
 * Renders the contacts management tab inside the settings screen.
 */
export default function ContactsTab() {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [form, setForm] = useState<ContactFormState>(emptyFormState);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);
  const [contactToDelete, setContactToDelete] = useState<ContactRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return contacts;
    }

    return contacts.filter((contact) =>
      [contact.name, contact.phone || "", contact.email || ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [contacts, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [contactsResponse, usersResponse] = await Promise.all([
        fetch("/api/settings/contacts"),
        fetch("/api/users"),
      ]);

      if (!contactsResponse.ok) {
        throw new Error("تعذر تحميل جهات الاتصال");
      }

      if (!usersResponse.ok) {
        throw new Error("تعذر تحميل المستخدمين");
      }

      const contactsData = (await contactsResponse.json()) as { contacts?: ContactRecord[] };
      const usersData = (await usersResponse.json()) as { users?: UserRecord[] };

      setContacts(contactsData.contacts || []);
      setUsers(usersData.users || []);
    } catch (loadError) {
      console.error("Failed to load contacts tab data:", loadError);
      setError(loadError instanceof Error ? loadError.message : "تعذر تحميل جهات الاتصال");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openCreateDialog = () => {
    setEditingContact(null);
    setForm(emptyFormState);
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: ContactRecord) => {
    setEditingContact(contact);
    setForm({
      name: contact.name,
      phone: contact.phone || "",
      email: contact.email || "",
      userId: contact.userId || "none",
    });
    setIsDialogOpen(true);
  };

  const closeEditor = () => {
    setIsDialogOpen(false);
    setEditingContact(null);
    setForm(emptyFormState);
  };

  const handleSubmit = async () => {
    const validationError = validateForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        userId: form.userId === "none" ? null : form.userId,
      };

      const response = await fetch(
        editingContact ? `/api/settings/contacts/${editingContact.id}` : "/api/settings/contacts",
        {
          method: editingContact ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "تعذر حفظ جهة الاتصال");
      }

      await loadData();
      closeEditor();
      toast.success(editingContact ? "تم تحديث جهة الاتصال بنجاح." : "تمت إضافة جهة الاتصال بنجاح.");
    } catch (saveError) {
      console.error("Failed to save contact:", saveError);
      toast.error(saveError instanceof Error ? saveError.message : "تعذر حفظ جهة الاتصال");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/settings/contacts/${contactToDelete.id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "تعذر حذف جهة الاتصال");
      }

      await loadData();
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
      toast.success("تم حذف جهة الاتصال بنجاح.");
    } catch (deleteError) {
      console.error("Failed to delete contact:", deleteError);
      toast.error(deleteError instanceof Error ? deleteError.message : "تعذر حذف جهة الاتصال");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ابحث في جهات الاتصال بالاسم أو الهاتف أو البريد"
            className="pr-9"
          />
        </div>

        <Button onClick={openCreateDialog}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة جهة اتصال
        </Button>
      </div>

      {isDialogOpen ? (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>{editingContact ? "تعديل جهة الاتصال" : "إضافة جهة اتصال"}</CardTitle>
            <CardDescription>
              أضف جهة اتصال يمكنها استقبال رسائل واتساب التذكيرية والإشعارات البريدية.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inline-contact-name">الاسم</Label>
              <Input
                id="inline-contact-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inline-contact-phone">رقم الهاتف</Label>
              <Input
                id="inline-contact-phone"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="+966xxxxxxxxx"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inline-contact-email">البريد الإلكتروني</Label>
              <Input
                id="inline-contact-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>المستخدم المرتبط</Label>
              <Select
                value={form.userId}
                onValueChange={(value) => setForm((current) => ({ ...current, userId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستخدمًا" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون مستخدم مرتبط</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {getLinkedUserLabel(user)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={closeEditor}>
                إلغاء
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "جارٍ الحفظ..." : editingContact ? "حفظ التعديلات" : "إضافة جهة الاتصال"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>تعذر تحميل جهات الاتصال</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void loadData()}>
              إعادة المحاولة
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!loading && !error && contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">لا توجد جهات اتصال بعد.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            أضف أول جهة اتصال لتفعيل إشعارات واتساب والبريد الإلكتروني.
          </p>
          <Button className="mt-4" onClick={openCreateDialog}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة جهة اتصال
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>المستخدم المرتبط</TableHead>
                <TableHead className="w-[120px]">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <ContactSkeletonRows />
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    لا توجد جهات اتصال مطابقة لبحثك.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell dir="ltr">{contact.phone || "—"}</TableCell>
                    <TableCell dir="ltr">{contact.email || "—"}</TableCell>
                    <TableCell>
                      {contact.user ? (
                        <div className="flex flex-col">
                          <span>{contact.user.name || contact.user.username || contact.user.email}</span>
                          <span className="text-xs text-muted-foreground">{contact.user.email}</span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(contact)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setContactToDelete(contact);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف جهة الاتصال؟</AlertDialogTitle>
            <AlertDialogDescription>
              {contactToDelete
                ? `سيتم حذف ${contactToDelete.name} نهائيًا.`
                : "لا يمكن التراجع عن هذا الإجراء."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "جارٍ الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
