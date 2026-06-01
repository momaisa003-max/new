'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ChevronLeft,
  Mail,
  Search,
  Trash2,
  Reply,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { ContactMessageType } from '@/lib/types';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-emerald-100 text-emerald-800',
  resolved: 'bg-gray-100 text-gray-800',
  archived: 'bg-slate-100 text-slate-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const categoryLabels: Record<string, string> = {
  general: 'General Inquiry',
  order: 'Order Issue',
  product: 'Product Question',
  payment: 'Payment Problem',
  shipping: 'Shipping & Delivery',
  return: 'Returns & Refunds',
  account: 'Account Issue',
  seller: 'Seller Support',
  partnership: 'Business Partnership',
  feedback: 'Feedback',
  complaint: 'Complaint',
  other: 'Other',
};

export default function AdminMessagesView() {
  const navigate = useAppStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const [messages, setMessages] = useState<ContactMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [total, setTotal] = useState(0);

  // Detail dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageType | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<ContactMessageType | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterCategory !== 'all') params.set('category', filterCategory);
      params.set('limit', '100');
      const res = await fetch(`/api/contact?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
        setTotal(data.total || 0);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate({ page: 'home' });
      return;
    }
    fetchMessages();
  }, [user, isAdmin, navigate, filterStatus, filterCategory]);

  if (!user || !isAdmin()) return null;

  const openDetail = (msg: ContactMessageType) => {
    setSelectedMessage(msg);
    setReplyText(msg.reply || '');
    setDetailOpen(true);
    // Mark as read if new
    if (msg.status === 'new') {
      fetch(`/api/contact/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      }).then(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
      });
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    setReplying(true);
    try {
      const res = await fetch(`/api/contact/${selectedMessage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText.trim(), status: 'replied' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === selectedMessage.id ? { ...m, ...updated } : m))
        );
        setSelectedMessage((prev) => (prev ? { ...prev, ...updated } : null));
        toast.success('Reply sent successfully');
      } else {
        toast.error('Failed to send reply');
      }
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (msgId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contact/${msgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status: newStatus } : m))
        );
        toast.success('Status updated');
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteMessage) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contact/${deleteMessage.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Message deleted');
        setDeleteDialogOpen(false);
        fetchMessages();
      } else {
        toast.error('Failed to delete message');
      }
    } catch {
      toast.error('Failed to delete message');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const newCount = messages.filter((m) => m.status === 'new').length;

  const adminNav = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'admin' as const },
    { icon: Package, label: 'Products', page: 'admin-products' as const },
    { icon: ShoppingBag, label: 'Orders', page: 'admin-orders' as const },
    { icon: Users, label: 'Users', page: 'admin-users' as const },
    { icon: Mail, label: `Messages${newCount > 0 ? ` (${newCount})` : ''}`, page: 'admin-messages' as const },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="size-4 text-blue-600" />;
      case 'read': return <Clock className="size-4 text-yellow-600" />;
      case 'replied': return <CheckCircle className="size-4 text-emerald-600" />;
      case 'resolved': return <CheckCircle className="size-4 text-gray-500" />;
      default: return <Mail className="size-4 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.page === 'admin-messages';
              return (
                <button
                  key={item.page}
                  onClick={() => navigate({ page: item.page })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Button variant="ghost" size="sm" onClick={() => navigate({ page: 'admin' })} className="mb-2">
            <ChevronLeft className="size-4 mr-1" />
            Dashboard
          </Button>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="size-6 text-emerald-600" />
                Contact Messages
              </h1>
              <p className="text-sm text-muted-foreground">
                {total} total messages · {newCount} new
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="size-4 mr-1" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Messages */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="size-12 mx-auto mb-3 text-muted-foreground/30" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((msg) => (
                <Card
                  key={msg.id}
                  className={`py-0 gap-0 hover:shadow-md transition-shadow cursor-pointer ${
                    msg.status === 'new' ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => openDetail(msg)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="size-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-sm font-bold">
                          {msg.name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-gray-900">{msg.name}</span>
                            <span className="text-xs text-muted-foreground">{msg.email}</span>
                            {msg.status === 'new' && (
                              <Badge className="text-xs border-0 bg-blue-100 text-blue-700">NEW</Badge>
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-gray-800 truncate">{msg.subject}</h4>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.message}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge className={`text-xs border-0 ${statusColors[msg.status] || ''}`}>
                              {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                            </Badge>
                            <Badge className={`text-xs border-0 ${priorityColors[msg.priority] || ''}`}>
                              {msg.priority.charAt(0).toUpperCase() + msg.priority.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {categoryLabels[msg.category] || msg.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => openDetail(msg)}>
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 text-red-500 hover:text-red-700" onClick={() => { setDeleteMessage(msg); setDeleteDialogOpen(true); }}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail / Reply Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedMessage.status)}
                  Message from {selectedMessage.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Message Details */}
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">From:</span>{' '}
                    <span className="font-medium">{selectedMessage.name}</span>
                    <span className="text-muted-foreground ml-1">({selectedMessage.email})</span>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      <span className="font-medium">{selectedMessage.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Category:</span>{' '}
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[selectedMessage.category] || selectedMessage.category}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>{' '}
                    <span className="font-medium">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedMessage.subject}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Status Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Select
                    value={selectedMessage.status}
                    onValueChange={(v) => handleStatusChange(selectedMessage.id, v)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={`text-xs border-0 ${priorityColors[selectedMessage.priority] || ''}`}>
                    Priority: {selectedMessage.priority}
                  </Badge>
                </div>

                {/* Existing Reply */}
                {selectedMessage.reply && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-emerald-700 mb-1">
                      Reply sent on {selectedMessage.repliedAt && new Date(selectedMessage.repliedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.reply}</p>
                  </div>
                )}

                {/* Reply Form */}
                <div>
                  <Label className="mb-2 block">
                    {selectedMessage.reply ? 'Update Reply' : 'Write a Reply'}
                  </Label>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailOpen(false)}>
                  Close
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleReply}
                  disabled={replying || !replyText.trim()}
                >
                  {replying ? (
                    <Loader2 className="size-4 mr-1 animate-spin" />
                  ) : (
                    <Reply className="size-4 mr-1" />
                  )}
                  {replying ? 'Sending...' : 'Send Reply'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the message from &quot;{deleteMessage?.name}&quot;? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
