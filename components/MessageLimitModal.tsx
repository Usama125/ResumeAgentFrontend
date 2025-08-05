"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface MessageLimitModalProps {
  isOpen: boolean
  onClose: () => void
  onStartNewConversation: () => void
  messageLimit: number
}

export function MessageLimitModal({ 
  isOpen, 
  onClose, 
  onStartNewConversation, 
  messageLimit 
}: MessageLimitModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Message Limit Reached
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can send <span className="font-semibold text-gray-900 dark:text-white">{messageLimit} messages</span> in a single conversation. 
            Start a new conversation to proceed.
          </p>
        </div>
        
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={onStartNewConversation}
            className="flex-1 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white"
          >
            Start New Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}