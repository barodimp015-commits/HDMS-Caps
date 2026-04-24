"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, UserPlus, Database, FileCheck, Settings, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QuickActionsDropdown() {
  const { toast } = useToast()

  const handleAction = (action: string) => {
    toast({
      title: "Action triggered",
      description: `${action} has been initiated.`,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleAction("Add New User")}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Add New User</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Add Specimen")}>
            <Database className="mr-2 h-4 w-4" />
            <span>Add Specimen</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Review Approvals")}>
            <FileCheck className="mr-2 h-4 w-4" />
            <span>Review Approvals</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleAction("Export Data")}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Data</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("System Settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>System Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
