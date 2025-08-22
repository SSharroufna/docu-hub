import { TeamHeader } from "@/components/team/team-header"
import { TeamMembers } from "@/components/team/team-members"
import { TeamActivity } from "@/components/team/team-activity"
import { TeamSettings } from "@/components/team/team-settings"
import { SharedDocuments } from "@/components/team/shared-documents"

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeamHeader />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TeamMembers />
            <SharedDocuments />
          </div>
          <div className="space-y-8">
            <TeamActivity />
            <TeamSettings />
          </div>
        </div>
      </div>
    </div>
  )
}
