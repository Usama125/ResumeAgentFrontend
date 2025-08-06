"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface ClearChatModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ClearChatModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: ClearChatModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Clear Chat History
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to clear the chat history? This action cannot be undone.
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
            onClick={onConfirm}
            variant="destructive"
            className="flex-1"
          >
            Clear Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}