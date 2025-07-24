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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Book, Transaction, User as UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Transactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    memberId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const memberUsers = allUsers.filter((u: UserType) => u.role === 'member');
    
    setTransactions(storedTransactions);
    setBooks(storedBooks);
    setMembers(memberUsers);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const book = books.find(b => b.id === transaction.bookId);
    const member = members.find(m => m.id === transaction.memberId);
    const matchesSearch = book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIssueBook = () => {
    if (!issueForm.bookId || !issueForm.memberId) {
      toast({
        title: "Error",
        description: "Please select both book and member.",
        variant: "destructive"
      });
      return;
    }

    const book = books.find(b => b.id === issueForm.bookId);
    if (!book || book.availableCopies <= 0) {
      toast({
        title: "Error",
        description: "Book is not available for issue.",
        variant: "destructive"
      });
      return;
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

    const newTransaction: Transaction = {
      id: `trans-${Date.now()}`,
      bookId: issueForm.bookId,
      memberId: issueForm.memberId,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'issued',
      fineAmount: 0,
      renewalCount: 0
    };

    // Update book availability
    const updatedBooks = books.map(b => 
      b.id === issueForm.bookId 
        ? { ...b, availableCopies: b.availableCopies - 1 }
        : b
    );

    // Update transactions
    const updatedTransactions = [...transactions, newTransaction];

    localStorage.setItem('books', JSON.stringify(updatedBooks));
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    loadData();
    setIsIssueModalOpen(false);
    setIssueForm({ bookId: '', memberId: '' });

    toast({
      title: "Book Issued",
      description: "Book has been successfully issued to the member.",
    });
  };

  const handleReturnBook = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const returnDate = new Date();
    const dueDate = new Date(transaction.dueDate);
    const isOverdue = returnDate > dueDate;
    const daysDiff = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const fineAmount = isOverdue ? Math.max(0, daysDiff * 10) : 0; // ₹10 per day fine

    // Update transaction
    const updatedTransactions = transactions.map(t => 
      t.id === transactionId 
        ? { 
            ...t, 
            status: 'returned' as const,
            returnDate: returnDate.toISOString(),
            fineAmount 
          }
        : t
    );

    // Update book availability
    const updatedBooks = books.map(b => 
      b.id === transaction.bookId 
        ? { ...b, availableCopies: b.availableCopies + 1 }
        : b
    );

    localStorage.setItem('books', JSON.stringify(updatedBooks));
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    loadData();

    toast({
      title: "Book Returned",
      description: fineAmount > 0 
        ? `Book returned with fine: ₹${fineAmount}` 
        : "Book returned successfully.",
    });
  };

  const canManageTransactions = user?.role === 'admin' || user?.role === 'librarian';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Book Transactions</h1>
          <p className="text-muted-foreground">Manage book issues and returns</p>
        </div>
        {canManageTransactions && (
          <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Issue Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue Book to Member</DialogTitle>
                <DialogDescription>
                  Select a book and member to issue the book
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="book">Select Book</Label>
                  <Select value={issueForm.bookId} onValueChange={(value) => setIssueForm({...issueForm, bookId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {books.filter(book => book.availableCopies > 0).map(book => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title} - {book.author} (Available: {book.availableCopies})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member">Select Member</Label>
                  <Select value={issueForm.memberId} onValueChange={(value) => setIssueForm({...issueForm, memberId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.filter(member => member.isActive).map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.membershipId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsIssueModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleIssueBook} className="btn-primary">
                  Issue Book
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
            placeholder="Search by book title or member name..."
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
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="issued">Currently Issued</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => {
          const book = books.find(b => b.id === transaction.bookId);
          const member = members.find(m => m.id === transaction.memberId);
          const issueDate = new Date(transaction.issueDate);
          const dueDate = new Date(transaction.dueDate);
          const isOverdue = transaction.status === 'issued' && new Date() > dueDate;

          return (
            <Card key={transaction.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{book?.title}</h3>
                      <Badge variant={
                        transaction.status === 'issued' ? 'default' :
                        transaction.status === 'returned' ? 'secondary' :
                        'destructive'
                      }>
                        {isOverdue ? 'Overdue' : transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">by {book?.author}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Issued: {issueDate.toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {dueDate.toLocaleDateString()}</span>
                      </span>
                      {transaction.returnDate && (
                        <span className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Returned: {new Date(transaction.returnDate).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Member:</span>
                      <span className="text-sm">{member?.name} ({member?.membershipId})</span>
                    </div>
                    {transaction.fineAmount > 0 && (
                      <div className="flex items-center space-x-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Fine: ₹{transaction.fineAmount}</span>
                      </div>
                    )}
                  </div>
                  
                  {canManageTransactions && transaction.status === 'issued' && (
                    <Button
                      onClick={() => handleReturnBook(transaction.id)}
                      className="btn-secondary"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Return Book
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No transactions found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by issuing some books to members'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Transactions;