import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Bell, Mail, Shield, Palette } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and system settings</p>
      </div>

      {/* Notification Settings */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="due-reminders" className="text-base">Due Date Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded before books are due</p>
            </div>
            <Switch id="due-reminders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="overdue-alerts" className="text-base">Overdue Alerts</Label>
              <p className="text-sm text-muted-foreground">Alerts for overdue books</p>
            </div>
            <Switch id="overdue-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-secondary" />
            <span>Privacy & Security</span>
          </CardTitle>
          <CardDescription>Manage your privacy and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visibility" className="text-base">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your reading activity</p>
            </div>
            <Switch id="profile-visibility" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-sharing" className="text-base">Anonymous Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve the library system</p>
            </div>
            <Switch id="data-sharing" defaultChecked />
          </div>
          
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-accent" />
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch to dark theme</p>
            </div>
            <Switch id="dark-mode" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compact-view" className="text-base">Compact View</Label>
              <p className="text-sm text-muted-foreground">Show more content on screen</p>
            </div>
            <Switch id="compact-view" />
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <span>System</span>
          </CardTitle>
          <CardDescription>System-wide preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save" className="text-base">Auto-save</Label>
              <p className="text-sm text-muted-foreground">Automatically save changes</p>
            </div>
            <Switch id="auto-save" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-effects" className="text-base">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Play sounds for actions</p>
            </div>
            <Switch id="sound-effects" />
          </div>
          
          <div className="pt-4 border-t space-y-2">
            <Button variant="outline" className="w-full">
              Export Data
            </Button>
            <Button variant="destructive" className="w-full">
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;