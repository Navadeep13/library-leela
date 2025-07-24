import { User, Book, Transaction } from '@/types';

export const initialUsers: User[] = [
  // Admin accounts
  {
    id: 'admin-1',
    name: 'Rajesh Kumar',
    email: 'admin@library.com',
    phone: '+91-9876543210',
    role: 'admin',
    password: 'admin123',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  // Librarian accounts
  {
    id: 'lib-1',
    name: 'Priya Sharma',
    email: 'librarian@library.com',
    phone: '+91-9876543211',
    role: 'librarian',
    password: 'lib123',
    createdAt: '2024-01-02T00:00:00Z',
    isActive: true
  },
  // Member accounts
  {
    id: 'mem-1',
    name: 'Arjun Patel',
    email: 'arjun@example.com',
    phone: '+91-9876543212',
    role: 'member',
    membershipId: 'LIB001',
    password: 'member123',
    createdAt: '2024-01-03T00:00:00Z',
    isActive: true
  },
  {
    id: 'mem-2',
    name: 'Kavya Nair',
    email: 'kavya@example.com',
    phone: '+91-9876543213',
    role: 'member',
    membershipId: 'LIB002',
    password: 'member123',
    createdAt: '2024-01-04T00:00:00Z',
    isActive: true
  },
  {
    id: 'mem-3',
    name: 'Rohan Gupta',
    email: 'rohan@example.com',
    phone: '+91-9876543214',
    role: 'member',
    membershipId: 'LIB003',
    password: 'member123',
    createdAt: '2024-01-05T00:00:00Z',
    isActive: true
  }
];

export const initialBooks: Book[] = [
  // Indian History Books
  {
    id: 'book-1',
    title: 'The Discovery of India',
    author: 'Jawaharlal Nehru',
    isbn: '978-0143031032',
    category: 'History',
    language: 'English',
    totalCopies: 5,
    availableCopies: 3,
    publisher: 'Penguin Classics',
    publishedYear: 1946,
    description: 'A classic work on Indian history and culture by India\'s first Prime Minister.',
    addedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'book-2',
    title: 'India After Gandhi',
    author: 'Ramachandra Guha',
    isbn: '978-0060958583',
    category: 'History',
    language: 'English',
    totalCopies: 4,
    availableCopies: 2,
    publisher: 'HarperCollins',
    publishedYear: 2007,
    description: 'The definitive biography of modern India since independence.',
    addedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'book-3',
    title: 'The Mahabharata: A Modern Rendering',
    author: 'Ramesh Menon',
    isbn: '978-0595377282',
    category: 'Mythology',
    language: 'English',
    totalCopies: 6,
    availableCopies: 4,
    publisher: 'iUniverse',
    publishedYear: 2006,
    description: 'A contemporary retelling of the great Indian epic.',
    addedAt: '2024-01-03T00:00:00Z'
  },
  
  // Programming Books
  {
    id: 'book-4',
    title: 'Python Programming for Beginners',
    author: 'Sundeep Saradhi Kanthety',
    isbn: '978-9355510389',
    category: 'Programming',
    language: 'English',
    totalCopies: 8,
    availableCopies: 6,
    publisher: 'BPB Publications',
    publishedYear: 2022,
    description: 'A comprehensive guide to Python programming for Indian students.',
    addedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: 'book-5',
    title: 'Data Structures and Algorithms in Python',
    author: 'Narasimha Karumanchi',
    isbn: '978-8192107592',
    category: 'Programming',
    language: 'English',
    totalCopies: 7,
    availableCopies: 5,
    publisher: 'CareerMonk Publications',
    publishedYear: 2020,
    description: 'Indian author\'s comprehensive guide to DSA concepts.',
    addedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'book-6',
    title: 'Web Development with React',
    author: 'Sanchit Gera',
    isbn: '978-9389898429',
    category: 'Programming',
    language: 'English',
    totalCopies: 5,
    availableCopies: 3,
    publisher: 'BPB Publications',
    publishedYear: 2021,
    description: 'Learn React development with practical Indian examples.',
    addedAt: '2024-01-06T00:00:00Z'
  },

  // Cartoon Books
  {
    id: 'book-7',
    title: 'Doraemon: Gadget Cat from the Future Volume 1',
    author: 'Fujiko F. Fujio',
    isbn: '978-1421526867',
    category: 'Comics',
    language: 'English',
    totalCopies: 10,
    availableCopies: 7,
    publisher: 'VIZ Media',
    publishedYear: 2010,
    description: 'Classic Japanese manga series loved by Indian children.',
    addedAt: '2024-01-07T00:00:00Z'
  },
  {
    id: 'book-8',
    title: 'Pokemon Adventures Red & Blue Volume 1',
    author: 'Hidenori Kusaka',
    isbn: '978-1421530543',
    category: 'Comics',
    language: 'English',
    totalCopies: 8,
    availableCopies: 5,
    publisher: 'VIZ Media',
    publishedYear: 2009,
    description: 'Pokemon manga series popular among Indian youth.',
    addedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: 'book-9',
    title: 'Chacha Chaudhary: The Brain Beats Computer',
    author: 'Pran Kumar Sharma',
    isbn: '978-8189999725',
    category: 'Comics',
    language: 'Hindi/English',
    totalCopies: 12,
    availableCopies: 9,
    publisher: 'Diamond Comics',
    publishedYear: 2018,
    description: 'Famous Indian comic character loved across generations.',
    addedAt: '2024-01-09T00:00:00Z'
  },
  {
    id: 'book-10',
    title: 'Suppandi: The Ultimate Collection',
    author: 'Tinkle Team',
    isbn: '978-8184827564',
    category: 'Comics',
    language: 'English',
    totalCopies: 10,
    availableCopies: 8,
    publisher: 'Amar Chitra Katha',
    publishedYear: 2019,
    description: 'Collection of funny Suppandi stories from Tinkle magazine.',
    addedAt: '2024-01-10T00:00:00Z'
  },

  // Literature
  {
    id: 'book-11',
    title: 'The God of Small Things',
    author: 'Arundhati Roy',
    isbn: '978-0006550686',
    category: 'Literature',
    language: 'English',
    totalCopies: 6,
    availableCopies: 4,
    publisher: 'HarperCollins',
    publishedYear: 1997,
    description: 'Booker Prize-winning novel by Indian author.',
    addedAt: '2024-01-11T00:00:00Z'
  },
  {
    id: 'book-12',
    title: 'Gitanjali',
    author: 'Rabindranath Tagore',
    isbn: '978-8129116482',
    category: 'Poetry',
    language: 'English',
    totalCopies: 5,
    availableCopies: 3,
    publisher: 'Rupa Publications',
    publishedYear: 1913,
    description: 'Nobel Prize-winning collection of poems.',
    addedAt: '2024-01-12T00:00:00Z'
  },

  // Science & Technology
  {
    id: 'book-13',
    title: 'Wings of Fire',
    author: 'A.P.J. Abdul Kalam',
    isbn: '978-8173711466',
    category: 'Biography',
    language: 'English',
    totalCopies: 7,
    availableCopies: 5,
    publisher: 'Universities Press',
    publishedYear: 1999,
    description: 'Autobiography of India\'s Missile Man.',
    addedAt: '2024-01-13T00:00:00Z'
  },
  {
    id: 'book-14',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    isbn: '978-0134610993',
    category: 'Technology',
    language: 'English',
    totalCopies: 4,
    availableCopies: 2,
    publisher: 'Pearson',
    publishedYear: 2020,
    description: 'Comprehensive textbook on AI concepts.',
    addedAt: '2024-01-14T00:00:00Z'
  },

  // Children's Books
  {
    id: 'book-15',
    title: 'Akbar and Birbal Stories',
    author: 'Various',
    isbn: '978-8183520447',
    category: 'Children',
    language: 'English',
    totalCopies: 8,
    availableCopies: 6,
    publisher: 'Om Books International',
    publishedYear: 2016,
    description: 'Traditional Indian wisdom stories for children.',
    addedAt: '2024-01-15T00:00:00Z'
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'trans-1',
    bookId: 'book-1',
    memberId: 'mem-1',
    issueDate: '2024-01-15T00:00:00Z',
    dueDate: '2024-01-29T00:00:00Z',
    status: 'issued',
    fineAmount: 0,
    renewalCount: 0
  },
  {
    id: 'trans-2',
    bookId: 'book-4',
    memberId: 'mem-2',
    issueDate: '2024-01-10T00:00:00Z',
    dueDate: '2024-01-24T00:00:00Z',
    returnDate: '2024-01-22T00:00:00Z',
    status: 'returned',
    fineAmount: 0,
    renewalCount: 0
  },
  {
    id: 'trans-3',
    bookId: 'book-7',
    memberId: 'mem-3',
    issueDate: '2024-01-05T00:00:00Z',
    dueDate: '2024-01-19T00:00:00Z',
    status: 'overdue',
    fineAmount: 50,
    renewalCount: 0
  }
];

export const initializeData = () => {
  // Initialize users if not exists
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
  
  // Initialize books if not exists
  if (!localStorage.getItem('books')) {
    localStorage.setItem('books', JSON.stringify(initialBooks));
  }
  
  // Initialize transactions if not exists
  if (!localStorage.getItem('transactions')) {
    localStorage.setItem('transactions', JSON.stringify(initialTransactions));
  }
  
  // Initialize other data structures
  if (!localStorage.getItem('bookRequests')) {
    localStorage.setItem('bookRequests', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('fines')) {
    localStorage.setItem('fines', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
};