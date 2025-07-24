import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, FileText, Check, X, MessageSquare } from 'lucide-react';
import { BookRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';

const BookRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  const [newRequest, setNewRequest] = useState({
    bookTitle: '',
    author: '',
    reason: ''
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem('bookRequests') || '[]');
    setRequests(storedRequests);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    // Filter by user role
    if (user?.role === 'member') {
      return request.memberId === user.id && matchesSearch && matchesStatus;
    }
    return matchesSearch && matchesStatus;
  });

  const handleSubmitRequest = () => {
    if (!user || !newRequest.bookTitle || !newRequest.author) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const request: BookRequest = {
      id: `req-${Date.now()}`,
      memberId: user.id,
      bookTitle: newRequest.bookTitle,
      author: newRequest.author,
      reason: newRequest.reason,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    const updatedRequests = [...requests, request];
    localStorage.setItem('bookRequests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    
    setIsRequestModalOpen(false);
    setNewRequest({ bookTitle: '', author: '', reason: '' });

    toast({
      title: "Request Submitted",
      description: "Your book request has been submitted successfully.",
    });
  };

  const handleUpdateRequestStatus = (requestId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status, 
            responseDate: new Date().toISOString(),
            adminNotes 
          }
        : request
    );
    
    localStorage.setItem('bookRequests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);

    toast({
      title: "Request Updated",
      description: `Request has been ${status}.`,
    });
  };

  const canManageRequests = user?.role === 'admin' || user?.role === 'librarian';
  const canCreateRequests = user?.role === 'member';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Book Requests</h1>
          <p className="text-muted-foreground">
            {canCreateRequests ? 'Request new books for the library' : 'Manage member book requests'}
          </p>
        </div>
        {canCreateRequests && (
          <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Request Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request a New Book</DialogTitle>
                <DialogDescription>
                  Suggest a book for the library to purchase
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bookTitle">Book Title *</Label>
                  <Input
                    id="bookTitle"
                    value={newRequest.bookTitle}
                    onChange={(e) => setNewRequest({...newRequest, bookTitle: e.target.value})}
                    placeholder="Enter book title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={newRequest.author}
                    onChange={(e) => setNewRequest({...newRequest, author: e.target.value})}
                    placeholder="Enter author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Request</Label>
                  <Textarea
                    id="reason"
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                    placeholder="Why would you like this book in the library?"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest} className="btn-primary">
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by book title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics for admins */}
      {canManageRequests && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Check className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => r.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const requestDate = new Date(request.requestDate);
          const responseDate = request.responseDate ? new Date(request.responseDate) : null;

          return (
            <Card key={request.id} className="card-elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{request.bookTitle}</CardTitle>
                    <CardDescription>by {request.author}</CardDescription>
                  </div>
                  <Badge variant={
                    request.status === 'pending' ? 'default' :
                    request.status === 'approved' ? 'secondary' :
                    'destructive'
                  }>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {request.reason && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Reason:</h4>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Requested: {requestDate.toLocaleDateString()}</span>
                    {responseDate && (
                      <span>Responded: {responseDate.toLocaleDateString()}</span>
                    )}
                  </div>

                  {request.adminNotes && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Admin Notes:
                      </h4>
                      <p className="text-sm">{request.adminNotes}</p>
                    </div>
                  )}

                  {canManageRequests && request.status === 'pending' && (
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateRequestStatus(request.id, 'approved', 'Request approved for procurement')}
                        className="btn-secondary"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateRequestStatus(request.id, 'rejected', 'Request rejected - not suitable for library collection')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No requests found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : canCreateRequests 
                ? 'Request your first book to get started'
                : 'No book requests have been submitted yet'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookRequests;