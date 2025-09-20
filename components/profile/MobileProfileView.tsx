"use client"

import { useState, useRef, memo, useMemo, useCallback } from "react"
import {
  Send,
  MapPin,
  Briefcase,
  Award,
  Code,
  MessageCircle,
  User,
  Edit,
  Sparkles,
  Plus,
  BookOpen,
  Globe,
  Heart,
  FileText,
  Star,
  Users,
  Share2,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { calculateTotalExperience } from "@/utils/experienceCalculator"
import { useRouter } from "next/navigation"
import { SimpleChatPanel } from "./SimpleChatPanel"
import EditModeToggle from "@/components/EditModeToggle"
import ProfileSections from "@/components/ProfileSections"
import AIAnalysisModal from '@/components/AIAnalysisModal'
import ProfileVariantWrapper from "./variants/ProfileVariantWrapper"

interface MobileProfileViewProps {
  user: UserType
  chatHistory: Array<{ type: "user" | "ai"; content: string }>
  setChatHistory: React.Dispatch<React.SetStateAction<Array<{ type: "user" | "ai"; content: string }>>>
  suggestedQuestions: string[]
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
  handleSendMessage: (messageText?: string) => Promise<void>
  isCurrentUser?: boolean
  currentStreamingMessage?: string
  isStreaming?: boolean
  messageCount?: number
  messageLimit?: number
  showMessageLimitModal?: boolean
  handleMessageLimitModalConfirm?: () => void
  handleMessageLimitModalCancel?: () => void
  clearChat?: () => void
  onEditPhoto?: () => void
  isEditMode?: boolean
  onEditAbout?: () => void
  onEditSkills?: () => void
  onEditPreferences?: () => void
  onEditExperience?: () => void
  onEditSingleExperience?: (index: number) => void
  onDeleteSingleExperience?: (index: number) => void
  onEditProject?: () => void
  onAddProject?: () => void
  onEditSingleProject?: (index: number) => void
  onDeleteSingleProject?: (index: number) => void
  onDeleteAbout?: () => void
  onDeleteSkills?: () => void
  onDeleteExperience?: () => void
  onDeleteProjects?: () => void
  onEditEducation?: () => void
  onEditSingleEducation?: (index: number) => void
  onDeleteSingleEducation?: (index: number) => void
  onDeleteEducation?: () => void
  onEditContact?: () => void
  onDeleteContact?: () => void
  onEditLanguage?: (index: number) => void
  onDeleteLanguage?: (index: number) => void
  onAddLanguage?: () => void
  onDeleteLanguages?: () => void
  onEditAward?: (index: number) => void
  onDeleteAward?: (index: number) => void
  onAddAward?: () => void
  onDeleteAwards?: () => void
  onEditPublication?: (index: number) => void
  onDeletePublication?: (index: number) => void
  onAddPublication?: () => void
  onDeletePublications?: () => void
  onEditVolunteerExperience?: (index: number) => void
  onDeleteVolunteerExperience?: (index: number) => void
  onAddVolunteerExperience?: () => void
  onDeleteVolunteerExperiences?: () => void
  onEditInterests?: () => void
  onDeleteInterests?: () => void
  onAddInterests?: () => void
  onEditModeToggle?: (editMode: boolean) => void
  onSectionOrderChange?: (sectionOrder: string[]) => void
  onAddSection?: (sectionId: string) => void
  onOpenShare?: () => void
  onOpenSettings?: () => void
}

import { getImageUrl } from '@/utils/imageUtils';
import { formatLinkedInUrl, isLocalProfileUrl } from '@/utils/contactUtils';


// Memoized Chat Section Component
const MobileChatSection = memo(function MobileChatSection({
  chatHistory,
  setChatHistory,
  suggestedQuestions,
  message,
  setMessage,
  isLoading,
  handleSendMessage,
  currentStreamingMessage,
  isStreaming,
  messageCount,
  messageLimit,
  showMessageLimitModal,
  handleMessageLimitModalConfirm,
  handleMessageLimitModalCancel,
  clearChat,
  user,
  isCurrentUser
}: {
  chatHistory: Array<{ type: "user" | "ai"; content: string }>;
  setChatHistory: React.Dispatch<React.SetStateAction<Array<{ type: "user" | "ai"; content: string }>>>;
  suggestedQuestions: string[];
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  handleSendMessage: (messageText?: string) => Promise<void>;
  currentStreamingMessage?: string;
  isStreaming?: boolean;
  messageCount?: number;
  messageLimit?: number;
  showMessageLimitModal?: boolean;
  handleMessageLimitModalConfirm?: () => void;
  handleMessageLimitModalCancel?: () => void;
  clearChat?: () => void;
  user?: UserType;
  isCurrentUser?: boolean;
}) {
  return (
    <SimpleChatPanel
      chatHistory={chatHistory}
      setChatHistory={setChatHistory}
      suggestedQuestions={suggestedQuestions}
      message={message}
      setMessage={setMessage}
      isLoading={isLoading}
      handleSendMessage={handleSendMessage}
      className="h-full"
      currentStreamingMessage={currentStreamingMessage}
      isStreaming={isStreaming}
      messageCount={messageCount}
      messageLimit={messageLimit}
      showMessageLimitModal={showMessageLimitModal}
      handleMessageLimitModalConfirm={handleMessageLimitModalConfirm}
      handleMessageLimitModalCancel={handleMessageLimitModalCancel}
      clearChat={clearChat}
      user={user}
      isCurrentUser={isCurrentUser}
    />
  );
});

export default function MobileProfileView({
  user,
  chatHistory,
  setChatHistory,
  suggestedQuestions,
  message,
  setMessage,
  isLoading,
  handleSendMessage,
  isCurrentUser = false,
  currentStreamingMessage,
  isStreaming,
  messageCount,
  messageLimit,
  onEditPhoto,
  isEditMode = false,
  onEditAbout,
  onEditSkills,
  onEditPreferences,
  onEditExperience,
  onEditSingleExperience,
  onDeleteSingleExperience,
  onEditProject,
  onAddProject,
  onEditSingleProject,
  onDeleteSingleProject,
  onDeleteAbout,
  onDeleteSkills,
  onDeleteExperience,
  onDeleteProjects,
  onEditEducation,
  onEditSingleEducation,
  onDeleteSingleEducation,
  onDeleteEducation,
  onEditContact,
  onDeleteContact,
  onEditLanguage,
  onDeleteLanguage,
  onAddLanguage,
  onDeleteLanguages,
  onEditAward,
  onDeleteAward,
  onAddAward,
  onDeleteAwards,
  onEditPublication,
  onDeletePublication,
  onAddPublication,
  onDeletePublications,
  onEditVolunteerExperience,
  onDeleteVolunteerExperience,
  onAddVolunteerExperience,
  onDeleteVolunteerExperiences,
  onEditInterests,
  onDeleteInterests,
  onAddInterests,
  onEditModeToggle,
  onSectionOrderChange,
  onAddSection,
  onOpenShare,
  onOpenSettings,
  showMessageLimitModal,
  handleMessageLimitModalConfirm,
  handleMessageLimitModalCancel,
  clearChat
}: MobileProfileViewProps) {
  const [mobileView, setMobileView] = useState<'profile' | 'chat'>('profile')
  const [isAIAnalysisModalOpen, setIsAIAnalysisModalOpen] = useState(false)
  const { isDark } = useTheme()

  // Memoized handlers to prevent unnecessary re-renders
  const handleViewToggle = useCallback((view: 'profile' | 'chat') => {
    setMobileView(view)
  }, [])


  // Memoized chat section props
  const chatSectionProps = useMemo(() => ({
    chatHistory,
    setChatHistory,
    suggestedQuestions,
    message,
    setMessage,
    isLoading,
    handleSendMessage,
    currentStreamingMessage,
    isStreaming,
    messageCount,
    messageLimit,
    showMessageLimitModal,
    handleMessageLimitModalConfirm,
    handleMessageLimitModalCancel,
    clearChat,
    user,
    isCurrentUser
  }), [chatHistory, message, isLoading, currentStreamingMessage, isStreaming, messageCount, messageLimit, showMessageLimitModal, user, isCurrentUser])

  return (
    <div className="flex h-[calc(100vh-56px)] relative w-full">
      {/* Mobile Floating Button */}
      <div>
        {mobileView === 'profile' && (
          <button
            onClick={() => handleViewToggle('chat')}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#10a37f] hover:bg-[#0d8f6f] rounded-full shadow-lg z-50 flex items-center justify-center transition-colors"
            title="Start Chat"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        )}
        {mobileView === 'chat' && (
          <button
            onClick={() => handleViewToggle('profile')}
            className="fixed bottom-20 right-6 w-14 h-14 bg-[#10a37f] hover:bg-[#0d8f6f] rounded-full shadow-lg z-50 flex items-center justify-center transition-colors"
            title="View Profile"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Profile View */}
      <div className={`${
        mobileView === 'profile' ? 'w-full h-full overflow-y-auto' : 'hidden'
      }`}>
        <ProfileVariantWrapper
          variant={(user.profile_variant as any) || "default"}
          user={user}
          isEditMode={isEditMode}
          isCurrentUser={isCurrentUser}
          onEditPhoto={onEditPhoto}
          onEditAbout={onEditAbout}
          onEditSkills={onEditSkills}
          onEditPreferences={onEditPreferences}
          onEditExperience={onEditExperience}
          onEditSingleExperience={onEditSingleExperience}
          onDeleteSingleExperience={onDeleteSingleExperience}
          onEditProject={onEditProject}
          onAddProject={onAddProject}
          onEditSingleProject={onEditSingleProject}
          onDeleteSingleProject={onDeleteSingleProject}
          onDeleteAbout={onDeleteAbout}
          onDeleteSkills={onDeleteSkills}
          onDeleteExperience={onDeleteExperience}
          onDeleteProjects={onDeleteProjects}
          onEditEducation={onEditEducation}
          onEditSingleEducation={onEditSingleEducation}
          onDeleteSingleEducation={onDeleteSingleEducation}
          onDeleteEducation={onDeleteEducation}
          onEditContact={onEditContact}
          onDeleteContact={onDeleteContact}
          onEditLanguage={onEditLanguage}
          onDeleteLanguage={onDeleteLanguage}
          onAddLanguage={onAddLanguage}
          onDeleteLanguages={onDeleteLanguages}
          onEditAward={onEditAward}
          onDeleteAward={onDeleteAward}
          onAddAward={onAddAward}
          onDeleteAwards={onDeleteAwards}
          onEditPublication={onEditPublication}
          onDeletePublication={onDeletePublication}
          onAddPublication={onAddPublication}
          onDeletePublications={onDeletePublications}
          onEditVolunteerExperience={onEditVolunteerExperience}
          onDeleteVolunteerExperience={onDeleteVolunteerExperience}
          onAddVolunteerExperience={onAddVolunteerExperience}
          onDeleteVolunteerExperiences={onDeleteVolunteerExperiences}
          onEditInterests={onEditInterests}
          onDeleteInterests={onDeleteInterests}
          onAddInterests={onAddInterests}
          onSectionOrderChange={onSectionOrderChange}
          onAddSection={onAddSection}
          onOpenAIAnalysis={() => setIsAIAnalysisModalOpen(true)}
          onOpenSettings={onOpenSettings}
          onEditModeToggle={onEditModeToggle}
          onOpenShare={onOpenShare}
        />
      </div>

      {/* Chat View */}
      <div className={`${
        mobileView === 'chat' ? 'w-full' : 'hidden'
      } h-full`}>
        <MobileChatSection {...chatSectionProps} />
      </div>
      
      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={isAIAnalysisModalOpen}
        onClose={() => setIsAIAnalysisModalOpen(false)}
        userId={user.id}
        userName={user.name}
        isOwnProfile={isCurrentUser}
        onImproveProfile={() => onEditModeToggle?.(true)}
      />
    </div>
  )
}