import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Indian currency (with lakhs and crores)
 * @param value - Number to format
 * @param withSymbol - Whether to include the ₹ symbol (default: true)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with commas and optional ₹ symbol
 */
export function formatIndianCurrency(value: number, withSymbol = true, decimals = 0): string {
  if (isNaN(value)) return withSymbol ? '₹0' : '0';
  
  // Convert to fixed decimal places
  const fixedValue = value.toFixed(decimals);
  
  // Split the number into integer and decimal parts
  const parts = fixedValue.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';
  
  // Format with Indian numbering system (lakhs and crores)
  let formattedInteger = '';
  
  // Add the last 3 digits (thousands)
  const lastThreeDigits = integerPart.length > 3 ? 
    integerPart.substr(integerPart.length - 3) : 
    integerPart;
  
  // Format the remaining digits in groups of 2 (for lakhs, crores, etc.)
  const otherDigits = integerPart.length > 3 ? 
    integerPart.substr(0, integerPart.length - 3) : 
    '';
  
  if (otherDigits !== '') {
    // Insert commas after every 2 digits from right to left
    for (let i = otherDigits.length - 1; i >= 0; i--) {
      formattedInteger = otherDigits[i] + formattedInteger;
      if (i > 0 && (otherDigits.length - i) % 2 === 0) {
        formattedInteger = ',' + formattedInteger;
      }
    }
    formattedInteger += ',' + lastThreeDigits;
  } else {
    formattedInteger = lastThreeDigits;
  }
  
  // Add decimal part if needed
  const result = decimals > 0 ? 
    `${formattedInteger}.${decimalPart}` : 
    formattedInteger;
    
  return withSymbol ? `₹${result}` : result;
}
