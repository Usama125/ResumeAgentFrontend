// Simple image utility functions
// Handles profile picture URLs

export const getImageUrl = (profilePicture: string | null): string => {
  if (!profilePicture) return "/placeholder-user.jpg";
  
  // If it's already a full URL (S3 URL), return as is
  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }
  
  // For legacy local URLs, construct full URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  const serverUrl = baseUrl.replace('/api/v1', '');
  return `${serverUrl}${profilePicture}`;
};