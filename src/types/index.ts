export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'librarian' | 'member';
  membershipId?: string;
  password: string;
  createdAt: string;
  isActive: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  language: string;
  totalCopies: number;
  availableCopies: number;
  publisher: string;
  publishedYear: number;
  description: string;
  coverImage?: string;
  addedAt: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'issued' | 'returned' | 'overdue';
  renewalCount: number;
}

export interface BookRequest {
  id: string;
  memberId: string;
  bookTitle: string;
  author: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  responseDate?: string;
  adminNotes?: string;
}

export interface Fine {
  id: string;
  transactionId: string;
  memberId: string;
  amount: number;
  reason: string;
  isPaid: boolean;
  createdAt: string;
  paidAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'due_reminder' | 'overdue_alert' | 'return_success' | 'fine_notice';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  booksIssued: number;
  overdueBooks: number;
  totalFines: number;
  recentTransactions: Transaction[];
  popularBooks: Book[];
}