/**
 * Utility functions for formatting various data types
 */

/**
 * Format a date to a human-readable format
 * @param date Date string or Date object
 * @param options Additional formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  options: {
    includeTime?: boolean;
    locale?: string;
  } = {}
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const { includeTime = false, locale = 'en-IN' } = options;

    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const dateFormatter = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });

    return dateFormatter.format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
};

/**
 * Format a currency amount to Indian Rupee format
 * @param amount Amount to format
 * @param options Additional formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  options: {
    locale?: string;
    currency?: string;
    compact?: boolean;
  } = {}
): string => {
  try {
    const { locale = 'en-IN', currency = 'INR', compact = false } = options;

    if (typeof amount !== 'number' || isNaN(amount)) {
      return '₹0.00';
    }

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...(compact && { notation: 'compact' }),
    });

    return formatter.format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '₹0.00';
  }
};

/**
 * Format a number with appropriate separators
 * @param value Number to format
 * @param options Additional formatting options
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  options: {
    locale?: string;
    decimalPlaces?: number;
    compact?: boolean;
  } = {}
): string => {
  try {
    const { locale = 'en-IN', decimalPlaces = 0, compact = false } = options;

    if (typeof value !== 'number' || isNaN(value)) {
      return '0';
    }

    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      ...(compact && { notation: 'compact' }),
    });

    return formatter.format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return '0';
  }
};

/**
 * Format a percentage value
 * @param value Percentage value (0-100)
 * @param options Additional formatting options
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  options: {
    locale?: string;
    decimalPlaces?: number;
    includeSymbol?: boolean;
  } = {}
): string => {
  try {
    const { locale = 'en-IN', decimalPlaces = 2, includeSymbol = true } = options;

    if (typeof value !== 'number' || isNaN(value)) {
      return includeSymbol ? '0%' : '0';
    }

    const formatter = new Intl.NumberFormat(locale, {
      style: includeSymbol ? 'percent' : 'decimal',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    // If not using the percent style, manually convert to percentage value
    return formatter.format(includeSymbol ? value / 100 : value);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return options.includeSymbol ? '0%' : '0';
  }
};

/**
 * Format a currency amount to Indian Rupee format with traditional Indian notation (lakhs, crores)
 * @param amount Amount to format
 * @param options Additional formatting options
 * @returns Formatted currency string with Indian notation
 */
export const formatIndianCurrency = (
  amount: number | null,
  options: {
    displaySymbol?: boolean;
    decimalPlaces?: number;
  } = {}
): string => {
  try {
    const { displaySymbol = true, decimalPlaces = 0 } = options;
    
    if (amount === null || typeof amount !== 'number' || isNaN(amount)) {
      return displaySymbol ? '₹0' : '0';
    }
    
    // Convert to string and handle negative numbers
    let isNegative = false;
    if (amount < 0) {
      isNegative = true;
      amount = Math.abs(amount);
    }
    
    // Convert to fixed decimal places
    let amountStr = amount.toFixed(decimalPlaces);
    
    // Split into whole and decimal parts
    const parts = amountStr.split('.');
    let whole = parts[0];
    const decimal = parts.length > 1 ? parts[1] : '';
    
    // Format according to Indian numbering system
    // First, get the last 3 digits
    const lastThree = whole.substring(whole.length - 3);
    // Get the other digits
    const otherNumbers = whole.substring(0, whole.length - 3);
    
    // Format with commas (Indian style: 12,34,56,789)
    let formattedWhole = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formattedWhole = formattedWhole ? formattedWhole + ',' + lastThree : lastThree;
    
    // Add decimal part if needed
    let result = formattedWhole;
    if (decimal) {
      result += '.' + decimal;
    }
    
    // Add symbol and handle negative numbers
    if (displaySymbol) {
      result = '₹' + result;
    }
    
    if (isNegative) {
      result = '-' + result;
    }
    
    return result;
  } catch (error) {
    console.error('Error formatting Indian currency:', error);
    return options.displaySymbol ? '₹0' : '0';
  }
};