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
import { Search, Plus, Edit, Trash2, Users, Phone, Mail, Calendar } from 'lucide-react';
import { User as UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Members = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserType | null>(null);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member' as const,
    password: 'member123'
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const memberUsers = users.filter((u: UserType) => u.role === 'member');
    setMembers(memberUsers);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membershipId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && member.isActive) ||
                         (statusFilter === 'inactive' && !member.isActive);
    return matchesSearch && matchesStatus;
  });

  const generateMembershipId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `LIB${timestamp}`;
  };

  const handleAddMember = () => {
    const member: UserType = {
      id: `mem-${Date.now()}`,
      ...newMember,
      membershipId: generateMembershipId(),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = [...allUsers, member];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadMembers();
    
    setIsAddModalOpen(false);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      role: 'member',
      password: 'member123'
    });

    toast({
      title: "Member Added",
      description: `Member ${member.name} has been successfully added with ID: ${member.membershipId}`,
    });
  };

  const handleEditMember = () => {
    if (!editingMember) return;

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map((u: UserType) => 
      u.id === editingMember.id ? editingMember : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadMembers();
    
    setIsEditModalOpen(false);
    setEditingMember(null);

    toast({
      title: "Member Updated",
      description: "Member information has been successfully updated.",
    });
  };

  const handleDeleteMember = (memberId: string) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.filter((u: UserType) => u.id !== memberId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadMembers();

    toast({
      title: "Member Deleted",
      description: "Member has been removed from the system.",
    });
  };

  const toggleMemberStatus = (memberId: string) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map((u: UserType) => 
      u.id === memberId ? { ...u, isActive: !u.isActive } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadMembers();

    toast({
      title: "Status Updated",
      description: "Member status has been updated.",
    });
  };

  const canManageMembers = user?.role === 'admin' || user?.role === 'librarian';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Library Members</h1>
          <p className="text-muted-foreground">Manage library membership and user accounts</p>
        </div>
        {canManageMembers && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>
                  Register a new library member
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember} className="btn-primary">
                  Add Member
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
            placeholder="Search members by name, email, or membership ID..."
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
            <SelectItem value="all">All Members</SelectItem>
            <SelectItem value="active">Active Members</SelectItem>
            <SelectItem value="inactive">Inactive Members</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="card-elevated hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="mt-1">ID: {member.membershipId}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {canManageMembers && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingMember(member);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{member.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined: {new Date(member.createdAt).toLocaleDateString()}</span>
                </div>

                {canManageMembers && (
                  <div className="pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMemberStatus(member.id)}
                      className="w-full"
                    >
                      {member.isActive ? "Deactivate" : "Activate"} Member
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No members found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding some members to your library'
            }
          </p>
        </div>
      )}

      {/* Edit Member Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update member information
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editingMember.phone}
                  onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-membershipId">Membership ID</Label>
                <Input
                  id="edit-membershipId"
                  value={editingMember.membershipId || ''}
                  onChange={(e) => setEditingMember({...editingMember, membershipId: e.target.value})}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember} className="btn-primary">
              Update Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;