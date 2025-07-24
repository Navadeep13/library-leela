import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Users, BookOpen, Shield, Database, Bell, Mail } from 'lucide-react';

const AdminPanel = () => {
  const systemStats = {
    totalUsers: JSON.parse(localStorage.getItem('users') || '[]').length,
    totalBooks: JSON.parse(localStorage.getItem('books') || '[]').length,
    totalTransactions: JSON.parse(localStorage.getItem('transactions') || '[]').length,
    pendingRequests: JSON.parse(localStorage.getItem('bookRequests') || '[]').filter((r: any) => r.status === 'pending').length
  };

  const handleBackupData = () => {
    const data = {
      users: JSON.parse(localStorage.getItem('users') || '[]'),
      books: JSON.parse(localStorage.getItem('books') || '[]'),
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      bookRequests: JSON.parse(localStorage.getItem('bookRequests') || '[]'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `library-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Admin Panel</h1>
        <p className="text-muted-foreground">System administration and management tools</p>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">In collection</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Database className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Bell className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Management */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <span>System Management</span>
            </CardTitle>
            <CardDescription>Backup and maintain system data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleBackupData} className="w-full btn-primary">
              <Database className="h-4 w-4 mr-2" />
              Backup All Data
            </Button>
            <Button onClick={handleClearData} variant="destructive" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span>User Management</span>
            </CardTitle>
            <CardDescription>Manage all system users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => window.location.href = '/user-management'} className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button onClick={() => window.location.href = '/members'} variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              View Members
            </Button>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-secondary" />
              <span>System Health</span>
            </CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Status</span>
              <Badge variant="secondary">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage Usage</span>
              <Badge variant="default">Low</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">System Uptime</span>
              <Badge variant="secondary">99.9%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/user-management'}>
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/books'}>
              <BookOpen className="h-6 w-6" />
              <span>Manage Books</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/reports'}>
              <Database className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/transactions'}>
              <Mail className="h-6 w-6" />
              <span>Transactions</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-sm">System backup created</p>
                <p className="text-xs text-muted-foreground">Automated daily backup</p>
              </div>
              <Badge variant="secondary">Today</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-sm">New user registered</p>
                <p className="text-xs text-muted-foreground">Member account created</p>
              </div>
              <Badge variant="default">2 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-sm">Database optimized</p>
                <p className="text-xs text-muted-foreground">Performance enhancement</p>
              </div>
              <Badge variant="secondary">Yesterday</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;