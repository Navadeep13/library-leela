import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Download, TrendingUp, Users, BookOpen, ArrowLeftRight } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, Pie, PieChart, Cell } from 'recharts';
import { Transaction, Book, User as UserType } from '@/types';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    generateReport();
  }, [reportType]);

  const generateReport = () => {
    const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
    const books: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
    const users: UserType[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    const now = new Date();
    let startDate: Date;
    
    switch (reportType) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        break;
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    }

    // Filter transactions in date range
    const filteredTransactions = transactions.filter(t => 
      new Date(t.issueDate) >= startDate
    );

    // Generate time series data
    const timeSeriesData = generateTimeSeriesData(filteredTransactions, reportType, startDate, now);
    
    // Calculate statistics
    const stats = {
      totalIssues: filteredTransactions.length,
      totalReturns: filteredTransactions.filter(t => t.status === 'returned').length,
      overdueBooks: transactions.filter(t => t.status === 'overdue' || 
        (t.status === 'issued' && new Date() > new Date(t.dueDate))).length,
      totalFines: filteredTransactions.reduce((sum, t) => sum + t.fineAmount, 0),
      activeMembers: users.filter(u => u.role === 'member' && u.isActive).length,
      totalBooks: books.length
    };

    // Popular books
    const bookIssueCount = filteredTransactions.reduce((acc, t) => {
      acc[t.bookId] = (acc[t.bookId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularBooks = Object.entries(bookIssueCount)
      .map(([bookId, count]) => {
        const book = books.find(b => b.id === bookId);
        return { book: book?.title || 'Unknown', count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Category distribution
    const categoryCount = books.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryCount).map(([category, count]) => ({
      name: category,
      value: count,
      fill: getRandomColor()
    }));

    setReportData({
      timeSeriesData,
      stats,
      popularBooks,
      categoryData
    });
  };

  const generateTimeSeriesData = (transactions: Transaction[], type: string, startDate: Date, endDate: Date) => {
    const data = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      
      if (type === 'daily') {
        dayEnd.setDate(dayEnd.getDate() + 1);
      } else if (type === 'weekly') {
        dayEnd.setDate(dayEnd.getDate() + 7);
      } else {
        dayEnd.setMonth(dayEnd.getMonth() + 1);
      }

      const dayTransactions = transactions.filter(t => {
        const issueDate = new Date(t.issueDate);
        return issueDate >= dayStart && issueDate < dayEnd;
      });

      const issued = dayTransactions.length;
      const returned = dayTransactions.filter(t => t.status === 'returned').length;

      data.push({
        name: type === 'daily' ? dayStart.toLocaleDateString('en-US', { weekday: 'short' }) :
              type === 'weekly' ? `Week ${Math.ceil((dayStart.getDate()) / 7)}` :
              dayStart.toLocaleDateString('en-US', { month: 'short' }),
        issued,
        returned,
        date: dayStart.toISOString()
      });

      if (type === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (type === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return data;
  };

  const getRandomColor = () => {
    const colors = [
      'hsl(28, 100%, 54%)',   // Primary
      'hsl(135, 58%, 25%)',   // Secondary
      'hsl(217, 91%, 35%)',   // Accent
      'hsl(0, 84%, 60%)',     // Destructive
      'hsl(240, 5%, 45%)'     // Muted
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const exportReport = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `library-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVContent = () => {
    if (!reportData) return '';
    
    let content = `Library Report - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    content += 'Statistics\n';
    content += `Total Issues,${reportData.stats.totalIssues}\n`;
    content += `Total Returns,${reportData.stats.totalReturns}\n`;
    content += `Overdue Books,${reportData.stats.overdueBooks}\n`;
    content += `Total Fines,₹${reportData.stats.totalFines}\n`;
    content += `Active Members,${reportData.stats.activeMembers}\n`;
    content += `Total Books,${reportData.stats.totalBooks}\n\n`;
    
    content += 'Time Series Data\n';
    content += 'Period,Books Issued,Books Returned\n';
    reportData.timeSeriesData.forEach((item: any) => {
      content += `${item.name},${item.issued},${item.returned}\n`;
    });
    
    return content;
  };

  if (!reportData) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Library Reports</h1>
          <p className="text-muted-foreground">Analyze library usage and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Report</SelectItem>
              <SelectItem value="weekly">Weekly Report</SelectItem>
              <SelectItem value="monthly">Monthly Report</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Issued</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.totalIssues}</div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Returned</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.totalReturns}</div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <CalendarDays className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.overdueBooks}</div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reportData.stats.totalFines}</div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.activeMembers}</div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.totalBooks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Activity</span>
            </CardTitle>
            <CardDescription>Books issued and returned over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.timeSeriesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issued" fill="hsl(28 100% 54%)" name="Issued" />
                <Bar dataKey="returned" fill="hsl(135 58% 25%)" name="Returned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Book Categories Distribution</CardTitle>
            <CardDescription>Collection breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reportData.categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {reportData.categoryData.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Books */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Most Popular Books</CardTitle>
          <CardDescription>Books with highest circulation in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.popularBooks.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <span className="font-medium">{item.book}</span>
                </div>
                <Badge variant="secondary">{item.count} issues</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;