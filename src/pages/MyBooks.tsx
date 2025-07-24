import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Clock, AlertTriangle, RotateCcw } from 'lucide-react';
import { Book, Transaction, User as UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const MyBooks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadMyBooks();
  }, [user]);

  const loadMyBooks = () => {
    if (!user) return;
    
    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = allTransactions.filter((t: Transaction) => t.memberId === user.id);
    const allBooks = JSON.parse(localStorage.getItem('books') || '[]');
    
    setMyTransactions(userTransactions);
    setBooks(allBooks);
  };

  const handleRenewBook = (transactionId: string) => {
    const transaction = myTransactions.find(t => t.id === transactionId);
    if (!transaction || transaction.renewalCount >= 2) {
      toast({
        title: "Renewal Failed",
        description: "Maximum renewal limit reached or transaction not found.",
        variant: "destructive"
      });
      return;
    }

    const newDueDate = new Date(transaction.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14); // Extend by 14 days

    const updatedTransaction = {
      ...transaction,
      dueDate: newDueDate.toISOString(),
      renewalCount: transaction.renewalCount + 1
    };

    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const updatedTransactions = allTransactions.map((t: Transaction) => 
      t.id === transactionId ? updatedTransaction : t
    );

    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    loadMyBooks();

    toast({
      title: "Book Renewed",
      description: `Book renewed successfully. New due date: ${newDueDate.toLocaleDateString()}`,
    });
  };

  const issuedBooks = myTransactions.filter(t => t.status === 'issued');
  const returnedBooks = myTransactions.filter(t => t.status === 'returned');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">My Books</h1>
        <p className="text-muted-foreground">Manage your borrowed books and reading history</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Borrowed</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issuedBooks.length}</div>
            <p className="text-xs text-muted-foreground">Active loans</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books Read</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnedBooks.length}</div>
            <p className="text-xs text-muted-foreground">Books returned</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {issuedBooks.filter(t => new Date() > new Date(t.dueDate)).length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Currently Borrowed Books */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Currently Borrowed Books</h2>
        {issuedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issuedBooks.map((transaction) => {
              const book = books.find(b => b.id === transaction.bookId);
              const issueDate = new Date(transaction.issueDate);
              const dueDate = new Date(transaction.dueDate);
              const isOverdue = new Date() > dueDate;
              const canRenew = transaction.renewalCount < 2 && !isOverdue;

              return (
                <Card key={transaction.id} className="card-elevated">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{book?.title}</CardTitle>
                        <CardDescription>by {book?.author}</CardDescription>
                      </div>
                      <Badge variant={isOverdue ? "destructive" : "default"}>
                        {isOverdue ? "Overdue" : "Issued"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Issued: {issueDate.toLocaleDateString()}</span>
                        </span>
                        <span className={`flex items-center space-x-1 ${isOverdue ? 'text-destructive' : ''}`}>
                          <Clock className="h-4 w-4" />
                          <span>Due: {dueDate.toLocaleDateString()}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Renewals: {transaction.renewalCount}/2
                        </span>
                        {canRenew && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRenewBook(transaction.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Renew
                          </Button>
                        )}
                      </div>

                      {isOverdue && (
                        <div className="p-3 bg-destructive/10 rounded-lg">
                          <div className="flex items-center space-x-2 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              This book is overdue! Please return it as soon as possible.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="card-elevated">
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No books currently borrowed</h3>
              <p className="text-sm text-muted-foreground">Visit the Books section to browse and request books</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reading History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Reading History</h2>
        {returnedBooks.length > 0 ? (
          <div className="space-y-3">
            {returnedBooks.slice(0, 5).map((transaction) => {
              const book = books.find(b => b.id === transaction.bookId);
              const returnDate = transaction.returnDate ? new Date(transaction.returnDate) : null;

              return (
                <Card key={transaction.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{book?.title}</h4>
                        <p className="text-sm text-muted-foreground">by {book?.author}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Returned</Badge>
                        {returnDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {returnDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="card-elevated">
            <CardContent className="text-center py-8">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No reading history yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyBooks;