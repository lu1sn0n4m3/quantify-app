/**
 * Format Utilities
 * 
 * Utility functions for formatting data values throughout the application.
 * 
 * Functions:
 * - currency: Formats numbers as USD currency strings (e.g., 128450 -> "$128,450")
 * 
 * Used by: TotalBalanceCard and other components that display financial values
 */
export const currency = (n: number) =>
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(n);

