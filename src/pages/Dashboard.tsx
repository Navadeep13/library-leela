import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Book, Transaction, User as UserType, DashboardStats } from '@/types';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const books: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
    const members: UserType[] = JSON.parse(localStorage.getItem('users') || '[]').filter((u: UserType) => u.role === 'member');
    const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');

    const totalBooks = books.length;
    const totalMembers = members.length;
    const booksIssued = transactions.filter(t => t.status === 'issued').length;
    const overdueBooks = transactions.filter(t => t.status === 'overdue').length;
    const totalFines = transactions.reduce((sum, t) => sum + t.fineAmount, 0);

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5);

    const popularBooks = books
      .sort((a, b) => (b.totalCopies - b.availableCopies) - (a.totalCopies - a.availableCopies))
      .slice(0, 5);

    setStats({
      totalBooks,
      totalMembers,
      booksIssued,
      overdueBooks,
      totalFines,
      recentTransactions,
      popularBooks
    });

    setRecentActivity(recentTransactions);
  };

  const weeklyData = [
    { name: 'Mon', issued: 12, returned: 8 },
    { name: 'Tue', issued: 15, returned: 10 },
    { name: 'Wed', issued: 8, returned: 12 },
    { name: 'Thu', issued: 18, returned: 14 },
    { name: 'Fri', issued: 22, returned: 16 },
    { name: 'Sat', issued: 10, returned: 8 },
    { name: 'Sun', issued: 6, returned: 4 }
  ];

  const categoryData = [
    { name: 'Programming', value: 35, fill: 'hsl(28 100% 54%)' },
    { name: 'History', value: 25, fill: 'hsl(135 58% 25%)' },
    { name: 'Comics', value: 20, fill: 'hsl(217 91% 35%)' },
    { name: 'Literature', value: 15, fill: 'hsl(0 84% 60%)' },
    { name: 'Others', value: 5, fill: 'hsl(240 5% 45%)' }
  ];

  if (!stats) {
    return <div>Loading dashboard...</div>;
  }

  const StatCard = ({ title, value, icon: Icon, description, color }: any) => (
    <Card className="card-elevated hover:shadow-medium transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your library today.
          </p>
        </div>
        <Button className="btn-primary">
          Quick Actions
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          description="Books in collection"
          color="text-primary"
        />
        <StatCard
          title="Active Members"
          value={stats.totalMembers}
          icon={Users}
          description="Registered members"
          color="text-secondary"
        />
        <StatCard
          title="Books Issued"
          value={stats.booksIssued}
          icon={ArrowLeftRight}
          description="Currently issued"
          color="text-accent"
        />
        <StatCard
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={AlertTriangle}
          description="Need attention"
          color="text-destructive"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Weekly Activity</span>
            </CardTitle>
            <CardDescription>Books issued and returned this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issued" fill="hsl(28 100% 54%)" name="Issued" />
                <Bar dataKey="returned" fill="hsl(135 58% 25%)" name="Returned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Book Categories */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Book Categories</CardTitle>
            <CardDescription>Distribution of books by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Popular Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest book transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((transaction) => {
                const book = JSON.parse(localStorage.getItem('books') || '[]')
                  .find((b: Book) => b.id === transaction.bookId);
                const member = JSON.parse(localStorage.getItem('users') || '[]')
                  .find((u: UserType) => u.id === transaction.memberId);
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{book?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.status === 'issued' ? 'Issued to' : 'Returned by'} {member?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'issued' ? 'bg-primary/10 text-primary' :
                        transaction.status === 'returned' ? 'bg-secondary/10 text-secondary' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Popular Books</CardTitle>
            <CardDescription>Most borrowed books this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularBooks.map((book, index) => (
                <div key={book.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {book.totalCopies - book.availableCopies} issued
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;