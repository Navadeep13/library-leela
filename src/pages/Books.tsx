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
import { Search, Plus, Edit, Trash2, BookOpen, Users } from 'lucide-react';
import { Book } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Books = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    language: 'English',
    totalCopies: 1,
    publisher: '',
    publishedYear: new Date().getFullYear(),
    description: ''
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(storedBooks);
  };

  const categories = ['all', 'Programming', 'History', 'Comics', 'Literature', 'Poetry', 'Biography', 'Technology', 'Children', 'Mythology'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddBook = () => {
    const book: Book = {
      id: `book-${Date.now()}`,
      ...newBook,
      availableCopies: newBook.totalCopies,
      addedAt: new Date().toISOString()
    };

    const updatedBooks = [...books, book];
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
    setIsAddModalOpen(false);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      category: '',
      language: 'English',
      totalCopies: 1,
      publisher: '',
      publishedYear: new Date().getFullYear(),
      description: ''
    });

    toast({
      title: "Book Added",
      description: "Book has been successfully added to the library.",
    });
  };

  const handleEditBook = () => {
    if (!editingBook) return;

    const updatedBooks = books.map(book => 
      book.id === editingBook.id ? editingBook : book
    );
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
    setIsEditModalOpen(false);
    setEditingBook(null);

    toast({
      title: "Book Updated",
      description: "Book information has been successfully updated.",
    });
  };

  const handleDeleteBook = (bookId: string) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setBooks(updatedBooks);

    toast({
      title: "Book Deleted",
      description: "Book has been removed from the library.",
    });
  };

  const canManageBooks = user?.role === 'admin' || user?.role === 'librarian';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Book Collection</h1>
          <p className="text-muted-foreground">Manage your library's book inventory</p>
        </div>
        {canManageBooks && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Add a new book to your library collection
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    placeholder="Enter book title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    placeholder="Enter author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    placeholder="Enter ISBN"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newBook.category} onValueChange={(value) => setNewBook({...newBook, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={newBook.publisher}
                    onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                    placeholder="Enter publisher"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Published Year</Label>
                  <Input
                    id="publishedYear"
                    type="number"
                    value={newBook.publishedYear}
                    onChange={(e) => setNewBook({...newBook, publishedYear: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalCopies">Total Copies</Label>
                  <Input
                    id="totalCopies"
                    type="number"
                    min="1"
                    value={newBook.totalCopies}
                    onChange={(e) => setNewBook({...newBook, totalCopies: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={newBook.language} onValueChange={(value) => setNewBook({...newBook, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Malayalam">Malayalam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                    placeholder="Enter book description"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBook} className="btn-primary">
                  Add Book
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
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="card-elevated hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="mt-1">by {book.author}</CardDescription>
                </div>
                {canManageBooks && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingBook(book);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{book.category}</Badge>
                  <span className="text-sm text-muted-foreground">{book.language}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>Available: {book.availableCopies}/{book.totalCopies}</span>
                  </span>
                  <span className="text-muted-foreground">ISBN: {book.isbn}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {book.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {book.publisher} • {book.publishedYear}
                  </span>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    book.availableCopies > 0 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {book.availableCopies > 0 ? 'Available' : 'Not Available'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No books found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding some books to your library'
            }
          </p>
        </div>
      )}

      {/* Edit Book Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update book information
            </DialogDescription>
          </DialogHeader>
          {editingBook && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-totalCopies">Total Copies</Label>
                <Input
                  id="edit-totalCopies"
                  type="number"
                  min="1"
                  value={editingBook.totalCopies}
                  onChange={(e) => setEditingBook({...editingBook, totalCopies: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-availableCopies">Available Copies</Label>
                <Input
                  id="edit-availableCopies"
                  type="number"
                  min="0"
                  max={editingBook.totalCopies}
                  value={editingBook.availableCopies}
                  onChange={(e) => setEditingBook({...editingBook, availableCopies: parseInt(e.target.value)})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({...editingBook, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBook} className="btn-primary">
              Update Book
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Books;