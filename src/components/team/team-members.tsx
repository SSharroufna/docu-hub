"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserPlus, MoreHorizontal, Mail, Shield, User, Crown, Trash2 } from "lucide-react"
import { useState } from "react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member" | "viewer"
  avatar?: string
  status: "active" | "pending" | "inactive"
  joinedAt: string
  lastActive: string
}

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "owner",
    status: "active",
    joinedAt: "2024-01-15",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@company.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-20",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "member",
    status: "active",
    joinedAt: "2024-02-01",
    lastActive: "3 hours ago",
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily@company.com",
    role: "member",
    status: "pending",
    joinedAt: "2024-02-10",
    lastActive: "Never",
  },
]

export function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "member":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleInviteMember = () => {
    if (inviteEmail) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole as TeamMember["role"],
        status: "pending",
        joinedAt: new Date().toISOString().split("T")[0],
        lastActive: "Never",
      }
      setMembers([...members, newMember])
      setInviteEmail("")
      setInviteRole("member")
      setIsInviteOpen(false)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId))
  }

  const handleRoleChange = (memberId: string, newRole: string) => {
    setMembers(
      members.map((member) => (member.id === memberId ? { ...member, role: newRole as TeamMember["role"] } : member)),
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Team Members ({members.length})
          </CardTitle>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer - Can view documents</SelectItem>
                      <SelectItem value="member">Member - Can edit documents</SelectItem>
                      <SelectItem value="admin">Admin - Can manage team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteMember}>Send Invitation</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.name}</p>
                    {member.status === "pending" && <Badge variant="outline">Pending</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge className={getRoleBadgeColor(member.role)}>
                  <span className="flex items-center gap-1">
                    {getRoleIcon(member.role)}
                    {member.role}
                  </span>
                </Badge>

                {member.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, "admin")}>
                        <Shield className="mr-2 h-4 w-4" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, "member")}>
                        <User className="mr-2 h-4 w-4" />
                        Make Member
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, "viewer")}>
                        <User className="mr-2 h-4 w-4" />
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Invitation
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleRemoveMember(member.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
