import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Users, 
  BookCopy, 
  BarChart3, 
  UserPlus, 
  ArrowLeftRight,
  FileText,
  Home,
  Settings,
  Shield
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    icon: Home,
    label: 'Dashboard',
    roles: ['admin', 'librarian', 'member']
  },
  {
    to: '/books',
    icon: BookOpen,
    label: 'Books',
    roles: ['admin', 'librarian', 'member']
  },
  {
    to: '/members',
    icon: Users,
    label: 'Members',
    roles: ['admin', 'librarian']
  },
  {
    to: '/transactions',
    icon: ArrowLeftRight,
    label: 'Issue/Return',
    roles: ['admin', 'librarian']
  },
  {
    to: '/my-books',
    icon: BookCopy,
    label: 'My Books',
    roles: ['member']
  },
  {
    to: '/book-requests',
    icon: FileText,
    label: 'Book Requests',
    roles: ['admin', 'librarian', 'member']
  },
  {
    to: '/reports',
    icon: BarChart3,
    label: 'Reports',
    roles: ['admin', 'librarian']
  },
  {
    to: '/admin',
    icon: Settings,
    label: 'Admin Panel',
    roles: ['admin']
  },
  {
    to: '/user-management',
    icon: Shield,
    label: 'User Management',
    roles: ['admin']
  }
];

const Sidebar = () => {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-card border-r border-border h-full">
      <div className="p-6">
        <nav className="space-y-2">
          {filteredNavItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-primary/5 hover:text-primary",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  )
                }
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;