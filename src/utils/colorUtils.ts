
export const getColorBadgeStyle = (color: string) => {
    // Convert hex to RGB to calculate luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Use white text for dark backgrounds, black text for light backgrounds
    const textColor = luminance > 0.5 ? 'black' : 'white';
    
    return {
      backgroundColor: color,
      color: textColor,
    };
  };
  