// Theme utility functions

export const getThemeClasses = (isDark: boolean) => ({
  // Background classes
  bg: {
    primary: isDark ? 'bg-[#212121]' : 'bg-gray-50',
    secondary: isDark ? 'bg-[#2f2f2f]' : 'bg-white',
    tertiary: isDark ? 'bg-[#40414f]' : 'bg-gray-100',
    card: isDark ? 'bg-[#2f2f2f]/80' : 'bg-white/80',
    cardHover: isDark ? 'hover:bg-[#2f2f2f]' : 'hover:bg-white',
    input: isDark ? 'bg-white/10' : 'bg-white',
  },
  
  // Text classes
  text: {
    primary: isDark ? 'text-white' : 'text-gray-900',
    secondary: isDark ? 'text-gray-300' : 'text-gray-600',
    tertiary: isDark ? 'text-gray-400' : 'text-gray-500',
    muted: isDark ? 'text-gray-500' : 'text-gray-400',
  },
  
  // Border classes
  border: {
    primary: isDark ? 'border-[#565869]' : 'border-gray-200',
    secondary: isDark ? 'border-[#565869]/60' : 'border-gray-300/60',
    hover: isDark ? 'hover:border-[#10a37f]' : 'hover:border-[#10a37f]',
  },
  
  // Skeleton classes
  skeleton: {
    primary: isDark ? 'bg-gray-600' : 'bg-gray-300',
    secondary: isDark ? 'bg-gray-700' : 'bg-gray-200',
  },
  
  // Placeholder classes
  placeholder: isDark ? 'placeholder-gray-300' : 'placeholder-gray-500',
})

export const getCardClasses = (isDark: boolean) => 
  `${getThemeClasses(isDark).bg.card} backdrop-blur-sm ${getThemeClasses(isDark).border.secondary} ${getThemeClasses(isDark).border.hover} ${getThemeClasses(isDark).bg.cardHover} transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#10a37f]/10 hover:scale-105`

export const getSearchChipClasses = (isDark: boolean, isActive: boolean) => {
  const base = "px-3 py-1 text-xs rounded-full border transition-all duration-200 cursor-pointer select-none outline-none focus:outline-none"
  
  if (isActive) {
    return `${base} bg-[#10a37f] text-white border-[#10a37f] shadow-lg shadow-[#10a37f]/25`
  }
  
  return `${base} ${
    isDark 
      ? 'bg-[#40414f] hover:bg-[#10a37f] text-gray-300 hover:text-white border-[#565869] hover:border-[#10a37f] active:bg-[#10a37f]'
      : 'bg-gray-200 hover:bg-[#10a37f] text-gray-700 hover:text-white border-gray-300 hover:border-[#10a37f] active:bg-[#10a37f]'
  }`
}