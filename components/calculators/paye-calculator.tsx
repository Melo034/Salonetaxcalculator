"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatNLe, calculatePAYETax, PAYE_BANDS, TAX_CONSTANTS, NASSIT_RATES } from "@/lib/tax-utils"
import { Info, Calculator, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Coins, FileText, HelpCircle } from "lucide-react"

interface PAYEResult {
  grossIncome: number
  nassitEmployee: number
  nassitEmployer: number
  taxableAllowances: number
  chargeableIncome: number
  payeTax: number
  taxOnLeaveAllowance: number
  totalDeductions: number
  takeHomePay: number
  effectiveRate: number
}

export function PAYECalculator() {
  const [basicSalary, setBasicSalary] = useState("")
  const [rentAllowance, setRentAllowance] = useState("")
  const [transportAllowance, setTransportAllowance] = useState("")
  const [clothingAllowance, setClothingAllowance] = useState("")
  const [medicalAllowance, setMedicalAllowance] = useState("")
  const [otherAllowances, setOtherAllowances] = useState("")
  const [leaveAllowance, setLeaveAllowance] = useState("")
  const [overtime, setOvertime] = useState("")
  const [bonus, setBonus] = useState("")
  const [otherIncome, setOtherIncome] = useState("")
  const [advanceSalary, setAdvanceSalary] = useState("")
  const [officeLoan, setOfficeLoan] = useState("")
  const [otherDeductions, setOtherDeductions] = useState("")
  const [isResident, setIsResident] = useState(true)
  const [result, setResult] = useState<PAYEResult | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showAllowances, setShowAllowances] = useState(true)
  const [showOtherIncome, setShowOtherIncome] = useState(false)
  const [showDeductions, setShowDeductions] = useState(false)

  const calculate = () => {
    const basic = Number.parseFloat(basicSalary) || 0
    const rent = Number.parseFloat(rentAllowance) || 0
    const transport = Number.parseFloat(transportAllowance) || 0
    const clothing = Number.parseFloat(clothingAllowance) || 0
    const medical = Number.parseFloat(medicalAllowance) || 0
    const otherAllow = Number.parseFloat(otherAllowances) || 0
    const leave = Number.parseFloat(leaveAllowance) || 0
    const ot = Number.parseFloat(overtime) || 0
    const bon = Number.parseFloat(bonus) || 0
    const other = Number.parseFloat(otherIncome) || 0
    const advance = Number.parseFloat(advanceSalary) || 0
    const loan = Number.parseFloat(officeLoan) || 0
    const otherDed = Number.parseFloat(otherDeductions) || 0

    const nassitEmployee = basic * NASSIT_RATES.employee
    const nassitEmployer = basic * NASSIT_RATES.employer
    const totalAllowances = rent + transport + clothing + medical + otherAllow
    const taxableAllowances = Math.max(0, totalAllowances - TAX_CONSTANTS.allowanceThreshold)
    const taxOnLeaveAllowance = leave * 0.25
    const netBasic = basic - nassitEmployee
    const otherIncomeTotal = ot + bon + other
    const chargeableIncome = netBasic + taxableAllowances + otherIncomeTotal
    const payeTax = calculatePAYETax(chargeableIncome, isResident)
    const totalDeductions = advance + loan + otherDed
    const grossIncome = basic + totalAllowances + leave + otherIncomeTotal
    const takeHomePay = grossIncome - nassitEmployee - payeTax - taxOnLeaveAllowance - totalDeductions
    const effectiveRate = grossIncome > 0 ? ((payeTax + taxOnLeaveAllowance) / grossIncome) * 100 : 0

    setResult({
      grossIncome, nassitEmployee, nassitEmployer, taxableAllowances, chargeableIncome,
      payeTax, taxOnLeaveAllowance, totalDeductions, takeHomePay, effectiveRate,
    })
  }

  const clearForm = () => {
    setBasicSalary("")
    setRentAllowance("")
    setTransportAllowance("")
    setClothingAllowance("")
    setMedicalAllowance("")
    setOtherAllowances("")
    setLeaveAllowance("")
    setOvertime("")
    setBonus("")
    setOtherIncome("")
    setAdvanceSalary("")
    setOfficeLoan("")
    setOtherDeductions("")
    setResult(null)
    setShowBreakdown(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#313B2F] rounded-xl flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">PAYE Tax Calculator</h2>
            <p className="text-muted-foreground text-xs sm:text-sm">Pay As You Earn • Monthly</p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Based on the <strong>Income Tax Act 2000</strong> and <strong>Finance Acts 2024/2025</strong>.
        </p>
      </div>

      {/* Residency Toggle */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <FileText className="w-5 h-5 text-[#FBA002] mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground mb-2 text-sm sm:text-base">Tax Residency Status</div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <label className={`flex items-center justify-center gap-2 cursor-pointer px-3 py-2 rounded-lg border-2 transition-all text-xs sm:text-sm ${isResident ? 'border-[#313B2F] bg-[#313B2F] text-white' : 'border-[#e5e7e4] hover:border-[#c8cdc6]'
                }`}>
                <input type="radio" name="residency" checked={isResident} onChange={() => setIsResident(true)} className="sr-only" />
                <span className="font-medium">Resident</span>
              </label>
              <label className={`flex items-center justify-center gap-2 cursor-pointer px-3 py-2 rounded-lg border-2 transition-all text-xs sm:text-sm ${!isResident ? 'border-[#313B2F] bg-[#313B2F] text-white' : 'border-[#e5e7e4] hover:border-[#c8cdc6]'
                }`}>
                <input type="radio" name="residency" checked={!isResident} onChange={() => setIsResident(false)} className="sr-only" />
                <span className="font-medium whitespace-nowrap">Non-Resident (Flat 25%)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Basic Salary */}
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-3 sm:p-4">
          <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
            Basic Salary <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs sm:text-sm">NLe</span>
            <Input
              type="number"
              placeholder="Enter monthly basic salary"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-11 border-[#e5e7e4] focus:border-[#FBA002] rounded-lg text-sm sm:text-base"
            />
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 shrink-0" />
            <span>NASSIT (5%) is deducted from basic salary only</span>
          </p>
        </div>

        {/* Allowances Section */}
        <CollapsibleSection
          title="Allowances"
          subtitle={`First NLe ${TAX_CONSTANTS.allowanceThreshold} is tax-free`}
          isOpen={showAllowances}
          onToggle={() => setShowAllowances(!showAllowances)}
          badge="Tax Relief"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput label="Rent Allowance" value={rentAllowance} onChange={setRentAllowance} />
            <FormInput label="Transport Allowance" value={transportAllowance} onChange={setTransportAllowance} />
            <FormInput label="Clothing Allowance" value={clothingAllowance} onChange={setClothingAllowance} />
            <FormInput label="Medical Allowance" value={medicalAllowance} onChange={setMedicalAllowance} />
            <FormInput label="Other Allowances" value={otherAllowances} onChange={setOtherAllowances} />
            <FormInput label="Leave Allowance" value={leaveAllowance} onChange={setLeaveAllowance} hint="Taxed at flat 25%" />
          </div>
        </CollapsibleSection>

        {/* Other Income Section */}
        <CollapsibleSection
          title="Other Income"
          subtitle="Additional earnings"
          isOpen={showOtherIncome}
          onToggle={() => setShowOtherIncome(!showOtherIncome)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <FormInput label="Overtime" value={overtime} onChange={setOvertime} />
            <FormInput label="Bonus" value={bonus} onChange={setBonus} />
            <FormInput label="Other Income" value={otherIncome} onChange={setOtherIncome} />
          </div>
        </CollapsibleSection>

        {/* Deductions Section */}
        <CollapsibleSection
          title="Deductions"
          subtitle="Deducted from take-home"
          isOpen={showDeductions}
          onToggle={() => setShowDeductions(!showDeductions)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <FormInput label="Advance Salary" value={advanceSalary} onChange={setAdvanceSalary} />
            <FormInput label="Office Loan" value={officeLoan} onChange={setOfficeLoan} />
            <FormInput label="Other Deductions" value={otherDeductions} onChange={setOtherDeductions} />
          </div>
        </CollapsibleSection>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={calculate}
            size="lg"
            className="flex-1 bg-[#FBA002] hover:bg-[#E08F00] text-[#313B2F] font-semibold h-12 text-base rounded-xl"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Tax
          </Button>
          <Button onClick={clearForm} size="lg" variant="outline" className="sm:w-32 h-12 rounded-xl border-[#e5e7e4]">
            Clear
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Main Results Card */}
          <div className="bg-[#313B2F] rounded-xl p-4 sm:p-5 text-white">
            <div className="text-white/60 text-xs sm:text-sm mb-1">Your Monthly Take Home Pay</div>
            <div className="text-2xl sm:text-3xl font-bold mb-4 text-[#FBA002] warp-break-word">{formatNLe(result.takeHomePay)}</div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <ResultStat label="PAYE Tax" value={formatNLe(result.payeTax)} />
              <ResultStat label="NASSIT (5%)" value={formatNLe(result.nassitEmployee)} />
              <ResultStat label="Leave Tax" value={formatNLe(result.taxOnLeaveAllowance)} />
              <ResultStat label="Effective Rate" value={`${result.effectiveRate.toFixed(1)}%`} />
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#f8f9f7] border border-[#e5e7e4] rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Gross Income</div>
              <div className="text-lg sm:text-xl font-bold text-foreground warp-break-word">{formatNLe(result.grossIncome)}</div>
            </div>
            <div className="bg-[#f8f9f7] border border-[#e5e7e4] rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Employer NASSIT (10%)</div>
              <div className="text-lg sm:text-xl font-bold text-foreground warp-break-word">{formatNLe(result.nassitEmployer)}</div>
            </div>
          </div>

          {/* Breakdown Toggle */}
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between p-3 bg-[#f8f9f7] hover:bg-[#f1f3f0] rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2 text-foreground font-medium text-sm">
              <Info className="h-4 w-4 text-[#FBA002]" />
              Calculation Breakdown
            </span>
            {showBreakdown ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {showBreakdown && (
            <div className="bg-[#f8f9f7] rounded-lg p-4 space-y-2 animate-fade-in text-sm">
              <h4 className="font-semibold text-foreground mb-3">Step-by-Step Calculation</h4>
              <BreakdownStep number={1} text={`Gross Income: ${formatNLe(result.grossIncome)}`} />
              <BreakdownStep number={2} text={`NASSIT Deduction (5% of Basic): ${formatNLe(result.nassitEmployee)}`} />
              <BreakdownStep number={3} text={`Taxable Allowances: ${formatNLe(result.taxableAllowances)}`} />
              <BreakdownStep number={4} text={`Chargeable Income: ${formatNLe(result.chargeableIncome)}`} />
              <BreakdownStep number={5} text={`PAYE Tax: ${formatNLe(result.payeTax)}`} />
              <BreakdownStep number={6} text={`Leave Allowance Tax (25%): ${formatNLe(result.taxOnLeaveAllowance)}`} />
            </div>
          )}
        </div>
      )}

      {/* PAYE Tax Bands Reference */}
      <div className="bg-white rounded-xl border border-[#e5e7e4] p-3 sm:p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm sm:text-base">
          <FileText className="w-4 h-4 text-[#FBA002] shrink-0" />
          <span>PAYE Tax Bands (Monthly)</span>
        </h3>
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-125 px-3 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#e5e7e4]">
                  <th className="px-2 sm:px-3 py-2 text-left font-semibold text-muted-foreground">Income Band</th>
                  <th className="px-2 sm:px-3 py-2 text-center font-semibold text-muted-foreground">Rate</th>
                  <th className="px-2 sm:px-3 py-2 text-center font-semibold text-muted-foreground">Cumulative Tax</th>
                </tr>
              </thead>
              <tbody>
                {PAYE_BANDS.map((band, index) => (
                  <tr key={index} className="border-b border-[#f1f3f0]">
                    <td className="px-2 sm:px-3 py-2 text-foreground">{band.description}</td>
                    <td className="px-2 sm:px-3 py-2 text-center">
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${band.rate === 0 ? 'bg-green-100 text-green-700' :
                          band.rate <= 20 ? 'bg-[#FBA002]/15 text-[#9a6600]' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {band.rate}%
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-center text-muted-foreground whitespace-nowrap">NLe {band.cumulative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>Non-Resident Rate: Flat 25% on all income</span>
        </p>
      </div>

      {/* Know Your Rights */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-3 sm:p-5">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
          <AlertTriangle className="h-4 w-4 text-[#FBA002] shrink-0" />
          <span>Know Your Rights - PAYE</span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <RightItem text="NASSIT is deducted from Basic Salary ONLY" />
          <RightItem text="First NLe 500 of allowances is tax-free" />
          <RightItem text="Leave allowance is taxed at 25%" />
          <RightItem text="Request payslip showing all deductions" />
          <RightItem text="PAYE due by 15th of following month" />
          <RightItem text="Verify NASSIT contributions regularly" />
        </ul>
      </div>
    </div>
  )
}

// Sub-components
function FormInput({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] sm:text-xs">NLe</span>
        <Input type="number" placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} className="pl-8 sm:pl-10 h-9 sm:h-10 border-[#e5e7e4] focus:border-[#FBA002] rounded-lg text-xs sm:text-sm" />
      </div>
      {hint && <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

function CollapsibleSection({ title, subtitle, isOpen, onToggle, badge, children }: { title: string; subtitle: string; isOpen: boolean; onToggle: () => void; badge?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7e4] overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-[#f8f9f7] transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-foreground text-xs sm:text-sm truncate">{title}</span>
          {badge && <span className="px-1.5 sm:px-2 py-0.5 bg-[#FBA002]/15 text-[#9a6600] text-[10px] sm:text-xs font-semibold rounded-full shrink-0">{badge}</span>}
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">{subtitle}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {isOpen && <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0"><div className="pt-3 border-t border-[#f1f3f0]">{children}</div></div>}
    </div>
  )
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-white/50 text-[10px] sm:text-xs mb-0.5">{label}</div>
      <div className="text-white font-semibold text-xs sm:text-sm warp-break-word">{value}</div>
    </div>
  )
}

function BreakdownStep({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-5 h-5 bg-[#FBA002]/20 rounded-full flex items-center justify-center shrink-0">
        <span className="text-[10px] sm:text-xs font-bold text-[#9a6600]">{number}</span>
      </div>
      <span className="text-muted-foreground text-xs sm:text-sm warp-break-word">{text}</span>
    </div>
  )
}

function RightItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 shrink-0 text-[#FBA002]" />
      <span>{text}</span>
    </li>
  )
}
