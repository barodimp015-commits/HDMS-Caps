import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Database, Mail, Shield, Globe } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic system configuration and display settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="MSU Herbarium Data Management System" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Input
                id="site-description"
                defaultValue="Digitizing plant specimens for research, conservation, and education."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="maintenance-mode" />
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>User authentication and access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="require-approval" defaultChecked />
              <Label htmlFor="require-approval">Require admin approval for new users</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-approve-specimens" />
              <Label htmlFor="auto-approve-specimens">Auto-approve specimen submissions</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Database and data handling configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="auto-backup" defaultChecked />
              <Label htmlFor="auto-backup">Enable automatic backups</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="backup-frequency">Backup Frequency (hours)</Label>
              <Input id="backup-frequency" type="number" defaultValue="24" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max-image-size">Maximum Image Size (MB)</Label>
              <Input id="max-image-size" type="number" defaultValue="10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Email and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" defaultChecked />
              <Label htmlFor="email-notifications">Enable email notifications</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" type="email" defaultValue="admin@msu.edu" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notify-new-users" defaultChecked />
              <Label htmlFor="notify-new-users">Notify on new user registrations</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
