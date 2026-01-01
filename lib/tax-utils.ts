// Sierra Leone Tax Calculation Utilities
// Based on Income Tax Act 2000, Finance Acts 2024 & 2025
// Last Updated: January 2025
// Sources: National Revenue Authority, Ministry of Finance Sierra Leone

export function formatNLe(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'NLe 0.00'
  }
  return `NLe ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function calculatePAYETax(monthlyChargeable: number, isResident: boolean): number {
  if (!isResident) {
    return monthlyChargeable * 0.25 // Flat 25% for non-residents
  }

  // Progressive tax bands per Income Tax Act 2000 First Schedule
  // Band 1: First NLe 600 - 0%
  // Band 2: Next NLe 600 (601-1,200) - 15%
  // Band 3: Next NLe 600 (1,201-1,800) - 20%
  // Band 4: Next NLe 600 (1,801-2,400) - 25%
  // Band 5: Above NLe 2,400 - 30%

  let tax = 0
  let remaining = monthlyChargeable

  // Band 1: 0-600 at 0%
  if (remaining <= 600) {
    return 0
  }
  remaining -= 600

  // Band 2: 600-1200 at 15%
  if (remaining <= 600) {
    return remaining * 0.15
  }
  tax += 600 * 0.15 // NLe 90
  remaining -= 600

  // Band 3: 1200-1800 at 20%
  if (remaining <= 600) {
    return tax + remaining * 0.2
  }
  tax += 600 * 0.2 // NLe 120, cumulative NLe 210
  remaining -= 600

  // Band 4: 1800-2400 at 25%
  if (remaining <= 600) {
    return tax + remaining * 0.25
  }
  tax += 600 * 0.25 // NLe 150, cumulative NLe 360
  remaining -= 600

  // Band 5: Above 2400 at 30%
  tax += remaining * 0.3

  return tax
}

// NASSIT Contribution Rates per NASSIT Act 2001
export const NASSIT_RATES = {
  employee: 0.05, // 5% of basic salary
  employer: 0.1, // 10% of basic salary
  governmentExtra: 0.025, // +2.5% for past service (govt employees)
  militaryExtra: 0.02, // +2% for early retirement (military/police at 55)
  selfEmployed: 0.15, // 15% of declared income
}

// Withholding Tax Rates per Finance Act 2024 (Updated January 10, 2024)
// Note: Major increases from 10% to 15% for dividends, professional & management fees
export const WHT_RATES = {
  contractor: { resident: 5.5, nonResident: 10.5, description: "Contractors (incl. 0.5% health)" },
  professional: { resident: 10, nonResident: 10, description: "Professional Services" },
  dividend: { resident: 15, nonResident: 15, description: "Dividends" },
  interest: { resident: 15, nonResident: 15, description: "Interest" },
  rent: { resident: 10, nonResident: 10, description: "Rent Payments" },
  royalty: { resident: 25, nonResident: 25, description: "Royalties" },
  management: { resident: 10, nonResident: 10, description: "Management Fees" },
}

// Tax Constants per Finance Acts 2024/2025
export const TAX_CONSTANTS = {
  // Income Tax
  allowanceThreshold: 500, // First NLe 500 of allowances is tax-free
  minimumWage: 800, // Minimum wage increased from NLe 600 to NLe 800

  // Rent Tax
  rentalThreshold: 7200, // Annual rental threshold NLe 7,200 (Tax-free)
  rentalDeduction: 0.1, // 10% tax deductible allowance on gross rental income (Wear & Tear)
  rentTaxRate: 0.1, // 10%
  wearAndTear: 0.1, // 10% wear and tear allowance for individual landlords

  // GST (updated Finance Act 2024)
  gstRate: 0.15, // 15% GST
  gstThreshold: 500000, // GST registration threshold NLe 500,000 (increased from 100,000)

  // Capital Gains Tax
  capitalGainsRate: 0.25, // 25% CGT
  capitalGainsExemption: 3600, // First NLe 3,600 per transaction/annum exempt

  // Import Duties
  importWithholdingRate: 0.05, // 5% Import Withholding Tax
  ecowasLevy: 0.005, // 0.5% ECOWAS Levy (for non-ECOWAS goods)

  // Corporate Tax
  corporateRate: 0.25, // 25% standard corporate rate
  manufacturingRate: 0.15, // 15% for manufacturing outside Western Area
  minimumAlternateRate: 0.02, // 2% minimum alternate tax on turnover (reduced from 3%)

  // Education and Health Levies
  educationLevy: 0.01, // 1% Education Levy
  healthLevy: 0.005, // 0.5% Free Health Levy
}

// PAYE Tax Bands for display
export const PAYE_BANDS = [
  { min: 0, max: 600, rate: 0, cumulative: 0, description: "First NLe 600" },
  { min: 600, max: 1200, rate: 15, cumulative: 90, description: "Next NLe 600 (601-1,200)" },
  { min: 1200, max: 1800, rate: 20, cumulative: 210, description: "Next NLe 600 (1,201-1,800)" },
  { min: 1800, max: 2400, rate: 25, cumulative: 360, description: "Next NLe 600 (1,801-2,400)" },
  { min: 2400, max: Number.POSITIVE_INFINITY, rate: 30, cumulative: "360+", description: "Above NLe 2,400" },
]

export const EOS_CONSTANTS = {
  retirementAge: 60,
  earlyRetirementAge: 55, // Military/Police
  minContributionMonths: 180, // 15 years for full pension
  invalidityMinMonths: 60, // 5 years for invalidity
  survivorsMinMonths: 12, // 1 year for survivors
  minPensionRate: 0.3, // 30% of average earnings
  maxPensionRate: 0.8, // 80% of average earnings
  gratuityMonths: 12, // 12 months of initial pension as gratuity
  best60MonthsAverage: 60, // Best 60 months for average calculation
}

// Calculate EOS Pension
export function calculatePension(
  averageMonthlyEarnings: number,
  contributionMonths: number,
  retirementType: "normal" | "early" | "invalidity",
  age: number = 60,
): {
  monthlyPension: number
  gratuity: number
  pensionRate: number
  eligible: boolean
  message: string
} {
  // Check eligibility
  const minMonths =
    retirementType === "invalidity" ? EOS_CONSTANTS.invalidityMinMonths : EOS_CONSTANTS.minContributionMonths

  if (contributionMonths < minMonths) {
    return {
      monthlyPension: 0,
      gratuity: 0,
      pensionRate: 0,
      eligible: false,
      message: `Not eligible. Need ${minMonths} months of contributions. You have ${contributionMonths} months.`,
    }
  }

  // Calculate pension rate: 30% base + incremental for years over 15
  // Up to maximum of 80%
  let pensionRate = EOS_CONSTANTS.minPensionRate
  const yearsOfContribution = Math.floor(contributionMonths / 12)

  if (yearsOfContribution > 15) {
    // Add 2% for each additional year up to 80%
    const additionalYears = yearsOfContribution - 15
    pensionRate = Math.min(0.3 + additionalYears * 0.02, EOS_CONSTANTS.maxPensionRate)
  }

  // Apply early retirement reduction (if applicable)
  // Standard NASSIT rule: ~4% reduction for each year below 60
  if (retirementType === "early") {
    const yearsEarly = Math.max(0, 60 - age)
    const reduction = yearsEarly * 0.04 // 4% per year
    pensionRate = Math.max(0, pensionRate * (1 - reduction))
  }

  const monthlyPension = averageMonthlyEarnings * pensionRate
  const gratuity = monthlyPension * EOS_CONSTANTS.gratuityMonths

  return {
    monthlyPension,
    gratuity,
    pensionRate,
    eligible: true,
    message: `Eligible for ${(pensionRate * 100).toFixed(1)}% of average earnings`,
  }
}

// Business Tax Categories per Finance Act 2025
export const BUSINESS_CATEGORIES = [
  {
    name: "Micro",
    minTurnover: 0,
    maxTurnover: 10000,
    taxTreatment: "TAX EXEMPT",
    description: "Businesses with annual turnover up to NLe 10,000 are exempt from income tax"
  },
  {
    name: "Small",
    minTurnover: 10000,
    maxTurnover: 500000,
    taxTreatment: "3% Turnover OR Normal Rates",
    description: "Option to pay 3% of turnover or calculate using normal corporate tax rates"
  },
  {
    name: "Medium",
    minTurnover: 500000,
    maxTurnover: 6000000,
    taxTreatment: "Normal Corporate Rates (25%)",
    description: "Standard corporate tax rate of 25% applies"
  },
  {
    name: "Large",
    minTurnover: 6000000,
    maxTurnover: Number.POSITIVE_INFINITY,
    taxTreatment: "Normal Corporate Rates (25%)",
    description: "Standard corporate tax rate of 25% applies"
  },
]

// Investment Incentives per Finance Act 2025
export const INVESTMENT_INCENTIVES = {
  minimumLocalOwnership: 0.2, // 20% minimum local ownership required
  taxHolidayYears: 5, // 5-year tax exemption
  minimumEmployees: 100, // Minimum 100 full-time workers
  minimumInvestment: 5000000, // Minimum $5 million USD investment
}

// Penalty Rates per Revenue Administration Act 2017
export const PENALTY_RATES = {
  within30Days: 0.1, // 10%
  within90Days: 0.15, // 15%
  after90Days: 0.25, // 25%
  incorrectReturn: 0.25, // 25% of difference
}

// Key Deadlines
export const TAX_DEADLINES = {
  payeNassit: "15th of following month",
  gstReturns: "Within 21 days after tax period",
  annualReturn: "Within 120 days (April 30)",
  whtRemittance: "Within 30 days of payment",
  cgtFiling: "Within 30 days of disposal",
}
