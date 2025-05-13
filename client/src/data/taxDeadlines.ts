/**
 * Tax Deadlines for Indian Income Tax
 * Important dates for the current assessment year
 */

export interface TaxDeadline {
  title: string;
  description: string;
  date: string;
  category: 'filing' | 'payment' | 'verification' | 'other';
  applicableTo: string[];
  isHighPriority: boolean;
}

// Assessment Year 2025-26 (Financial Year 2024-25) Tax Deadlines
export const currentTaxDeadlines: TaxDeadline[] = [
  {
    title: "Due date for filing ITR (no audit)",
    description: "Last date to file Income Tax Returns for individuals and entities not requiring audit",
    date: "July 31, 2025",
    category: "filing",
    applicableTo: ["Individual", "HUF", "Non-audit cases"],
    isHighPriority: true
  },
  {
    title: "Due date for filing ITR (with audit)",
    description: "Last date to file Income Tax Returns for entities requiring audit",
    date: "October 31, 2025",
    category: "filing",
    applicableTo: ["Companies", "Partnership Firms", "Businesses requiring audit"],
    isHighPriority: true
  },
  {
    title: "Due date for Tax Audit Report",
    description: "Last date to get Tax Audit Report completed",
    date: "September 30, 2025",
    category: "other",
    applicableTo: ["Businesses requiring audit", "Professionals with income above threshold"],
    isHighPriority: true
  },
  {
    title: "Advance Tax - First Installment",
    description: "Due date for 15% of estimated tax liability",
    date: "June 15, 2024",
    category: "payment",
    applicableTo: ["Individuals", "Businesses", "Professionals"],
    isHighPriority: true
  },
  {
    title: "Advance Tax - Second Installment",
    description: "Due date for 45% of estimated tax liability (cumulative)",
    date: "September 15, 2024",
    category: "payment",
    applicableTo: ["Individuals", "Businesses", "Professionals"],
    isHighPriority: true
  },
  {
    title: "Advance Tax - Third Installment",
    description: "Due date for 75% of estimated tax liability (cumulative)",
    date: "December 15, 2024",
    category: "payment",
    applicableTo: ["Individuals", "Businesses", "Professionals"],
    isHighPriority: true
  },
  {
    title: "Advance Tax - Fourth Installment",
    description: "Due date for 100% of estimated tax liability (cumulative)",
    date: "March 15, 2025",
    category: "payment",
    applicableTo: ["Individuals", "Businesses", "Professionals"],
    isHighPriority: true
  },
  {
    title: "Belated ITR Filing",
    description: "Last date for filing belated returns with late fee",
    date: "December 31, 2025",
    category: "filing",
    applicableTo: ["All taxpayers who missed regular deadline"],
    isHighPriority: false
  },
  {
    title: "ITR Verification Deadline",
    description: "Last date to verify your Income Tax Return after filing",
    date: "Within 30 days of filing",
    category: "verification",
    applicableTo: ["All taxpayers"],
    isHighPriority: true
  },
  {
    title: "Revised ITR Filing",
    description: "Last date to file revised return if mistakes found in original return",
    date: "December 31, 2025",
    category: "filing",
    applicableTo: ["All taxpayers who need to revise filed returns"],
    isHighPriority: false
  },
  {
    title: "TDS Payment - Salary",
    description: "Monthly payment of Tax Deducted at Source from salary",
    date: "7th of next month",
    category: "payment",
    applicableTo: ["Employers"],
    isHighPriority: true
  },
  {
    title: "TDS Filing - Form 24Q",
    description: "Quarterly filing of TDS returns for salary (Q1)",
    date: "July 31, 2024",
    category: "filing",
    applicableTo: ["Employers"],
    isHighPriority: true
  },
  {
    title: "TDS Filing - Form 24Q",
    description: "Quarterly filing of TDS returns for salary (Q2)",
    date: "October 31, 2024",
    category: "filing",
    applicableTo: ["Employers"],
    isHighPriority: true
  },
  {
    title: "TDS Filing - Form 24Q",
    description: "Quarterly filing of TDS returns for salary (Q3)",
    date: "January 31, 2025",
    category: "filing",
    applicableTo: ["Employers"],
    isHighPriority: true
  },
  {
    title: "TDS Filing - Form 24Q",
    description: "Quarterly filing of TDS returns for salary (Q4)",
    date: "May 31, 2025",
    category: "filing",
    applicableTo: ["Employers"],
    isHighPriority: true
  }
];

// Assessment Year 2024-25 (Financial Year 2023-24) Tax Deadlines
export const previousTaxDeadlines: TaxDeadline[] = [
  {
    title: "Due date for filing ITR (no audit)",
    description: "Last date to file Income Tax Returns for individuals and entities not requiring audit",
    date: "July 31, 2024",
    category: "filing",
    applicableTo: ["Individual", "HUF", "Non-audit cases"],
    isHighPriority: true
  },
  {
    title: "Due date for filing ITR (with audit)",
    description: "Last date to file Income Tax Returns for entities requiring audit",
    date: "October 31, 2024",
    category: "filing",
    applicableTo: ["Companies", "Partnership Firms", "Businesses requiring audit"],
    isHighPriority: true
  }
];

// Get tax deadlines by category
export function getDeadlinesByCategory(category: TaxDeadline['category']) {
  return currentTaxDeadlines.filter(deadline => deadline.category === category);
}

// Get upcoming deadlines (next 60 days)
export function getUpcomingDeadlines() {
  const today = new Date();
  const sixtyDaysLater = new Date(today);
  sixtyDaysLater.setDate(today.getDate() + 60);
  
  return currentTaxDeadlines.filter(deadline => {
    // Special handling for recurring deadlines
    if (deadline.date.includes('next month')) {
      return true;
    }
    
    const deadlineDate = new Date(deadline.date);
    return deadlineDate >= today && deadlineDate <= sixtyDaysLater;
  });
}

// Get high priority deadlines
export function getHighPriorityDeadlines() {
  return currentTaxDeadlines.filter(deadline => deadline.isHighPriority);
}