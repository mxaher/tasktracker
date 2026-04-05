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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  return value.replace(/[\s()-]/g, "");
}

function validateForm(form: ContactFormState) {
  if (!form.name.trim()) {
    return "Name is required.";
  }

  if (form.phone.trim() && !PHONE_REGEX.test(normalizePhone(form.phone.trim()))) {
    return "Phone must be in valid international format like +966xxxxxxxxx.";
  }

  if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim())) {
    return "Email must be a valid email address.";
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
        throw new Error("Failed to fetch contacts");
      }

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const contactsData = (await contactsResponse.json()) as { contacts?: ContactRecord[] };
      const usersData = (await usersResponse.json()) as { users?: UserRecord[] };

      setContacts(contactsData.contacts || []);
      setUsers(usersData.users || []);
    } catch (loadError) {
      console.error("Failed to load contacts tab data:", loadError);
      setError(loadError instanceof Error ? loadError.message : "Failed to load contacts");
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
        throw new Error(data.error || "Failed to save contact");
      }

      await loadData();
      setIsDialogOpen(false);
      setForm(emptyFormState);
      setEditingContact(null);
      toast.success(editingContact ? "Contact updated successfully." : "Contact added successfully.");
    } catch (saveError) {
      console.error("Failed to save contact:", saveError);
      toast.error(saveError instanceof Error ? saveError.message : "Failed to save contact");
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
        throw new Error(data.error || "Failed to delete contact");
      }

      await loadData();
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
      toast.success("Contact deleted successfully.");
    } catch (deleteError) {
      console.error("Failed to delete contact:", deleteError);
      toast.error(deleteError instanceof Error ? deleteError.message : "Failed to delete contact");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search contacts by name, phone, or email"
            className="pl-9"
          />
        </div>

        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load contacts</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void loadData()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!loading && !error && contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">No contacts yet.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first contact to enable WhatsApp and email notifications.
          </p>
          <Button className="mt-4" onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Linked User</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <ContactSkeletonRows />
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No contacts match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.phone || "—"}</TableCell>
                    <TableCell>{contact.email || "—"}</TableCell>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContact ? "Edit Contact" : "Add Contact"}</DialogTitle>
            <DialogDescription>
              Store a contact that can receive WhatsApp reminders and email notifications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="+966xxxxxxxxx"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Linked User</Label>
              <Select
                value={form.userId}
                onValueChange={(value) => setForm((current) => ({ ...current, userId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked user</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {getLinkedUserLabel(user)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : editingContact ? "Save Changes" : "Add Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact?</AlertDialogTitle>
            <AlertDialogDescription>
              {contactToDelete
                ? `This will permanently delete ${contactToDelete.name}.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
