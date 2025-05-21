
export interface ColorTheme {
  name: string;
  primary: string;
  background: string;
}

export const colorThemes: ColorTheme[] = [
  { name: 'Default', primary: 'hsl(260, 84%, 50%)', background: 'hsl(260, 25%, 98%)' },
  { name: 'Purple', primary: '#9b87f5', background: '#1A1F2C' },
  { name: 'Ocean', primary: '#0EA5E9', background: '#0c1e2b' },
  { name: 'Forest', primary: '#16a34a', background: '#0f1f14' },
  { name: 'Sunset', primary: '#F97316', background: '#261311' },
  { name: 'Berry', primary: '#D946EF', background: '#261129' },
];

export const applyColorTheme = (themeName: string, darkMode: boolean = false) => {
  const theme = colorThemes.find(t => t.name === themeName);
  if (!theme) return;
  
  // Apply CSS variable changes directly to document root
  document.documentElement.style.setProperty('--theme-primary', theme.primary);
  document.documentElement.style.setProperty('--theme-background', theme.background);
  
  // Update primary and background variables based on the theme
  if (themeName !== 'Default') {
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--background', theme.background);
  } else {
    // Reset to default theme values from CSS
    if (darkMode) {
      document.documentElement.style.setProperty('--primary', 'hsl(260, 70%, 60%)');
      document.documentElement.style.setProperty('--background', 'hsl(260, 20%, 10%)');
    } else {
      document.documentElement.style.setProperty('--primary', 'hsl(260, 84%, 50%)');
      document.documentElement.style.setProperty('--background', 'hsl(260, 25%, 98%)');
    }
  }
};

export const toggleDarkMode = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('darkMode', isDark.toString());
};

export const getThemeForCurrentMode = (themeName: string, isDark: boolean) => {
  const theme = colorThemes.find(t => t.name === themeName);
  if (!theme) return null;
  
  // Provide appropriate colors based on the theme and current mode
  return {
    ...theme,
    primary: theme.primary,
    background: isDark ? theme.background : theme.name === 'Default' 
      ? 'hsl(260, 25%, 98%)'
      : theme.background
  };
};
