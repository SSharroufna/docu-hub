"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Shield, Bell, Users } from "lucide-react"
import { useState } from "react"

export function TeamSettings() {
  const [settings, setSettings] = useState({
    teamName: "My Team",
    defaultPermission: "member",
    allowExternalSharing: true,
    requireApproval: false,
    emailNotifications: true,
    slackIntegration: false,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Team Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Basic Settings
          </h4>
          <div>
            <label className="text-sm text-muted-foreground">Team Name</label>
            <Input
              value={settings.teamName}
              onChange={(e) => updateSetting("teamName", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Default Member Permission</label>
            <Select
              value={settings.defaultPermission}
              onValueChange={(value) => updateSetting("defaultPermission", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security & Permissions
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Allow External Sharing</p>
              <p className="text-xs text-muted-foreground">Members can share documents outside the team</p>
            </div>
            <Switch
              checked={settings.allowExternalSharing}
              onCheckedChange={(checked) => updateSetting("allowExternalSharing", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Require Approval for New Members</p>
              <p className="text-xs text-muted-foreground">Admin approval required for invitations</p>
            </div>
            <Switch
              checked={settings.requireApproval}
              onCheckedChange={(checked) => updateSetting("requireApproval", checked)}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Send email updates for team activity</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Slack Integration</p>
              <p className="text-xs text-muted-foreground">Post updates to Slack channel</p>
            </div>
            <Switch
              checked={settings.slackIntegration}
              onCheckedChange={(checked) => updateSetting("slackIntegration", checked)}
            />
          </div>
        </div>

        <Button className="w-full">Save Settings</Button>
      </CardContent>
    </Card>
  )
}
