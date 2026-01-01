"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatNLe } from "@/lib/tax-utils"
import { Calculator, AlertTriangle, Info, BookOpen, Scale, FileText, CheckCircle2, Clock } from "lucide-react"

interface EOSResult {
  // Basic components
  basicSalary: number
  yearsOfService: number
  monthsOfService: number
  totalServiceYears: number

  // Gratuity calculation
  gratuityRate: number
  gratuityMonths: number
  gratuityAmount: number

  // Notice period
  noticePeriodMonths: number
  noticePeriodPay: number

  // Leave pay
  unusedLeaveDays: number
  dailyRate: number
  leavePay: number

  // Outstanding amounts
  outstandingSalary: number
  outstandingAllowances: number
  outstandingBonus: number

  // Redundancy (if applicable)
  isRedundancy: boolean
  redundancyPay: number

  // Deductions
  advanceSalary: number
  officeLoan: number
  otherDeductions: number
  totalDeductions: number

  // Tax
  taxableAmount: number
  taxOnGratuity: number

  // Final
  grossEOS: number
  netEOS: number
}

type TerminationType = "resignation" | "termination" | "redundancy" | "retirement" | "death"

export function EOSCalculator() {
  // Basic info
  const [basicSalary, setBasicSalary] = useState("")
  const [yearsOfService, setYearsOfService] = useState("")
  const [monthsOfService, setMonthsOfService] = useState("")
  const [terminationType, setTerminationType] = useState<TerminationType>("resignation")

  // Gratuity settings
  const [gratuityRate, setGratuityRate] = useState("1") // months per year

  // Notice period
  const [noticePeriodMonths, setNoticePeriodMonths] = useState("")
  const [noticePeriodServed, setNoticePeriodServed] = useState(true)

  // Leave
  const [unusedLeaveDays, setUnusedLeaveDays] = useState("")

  // Outstanding amounts
  const [outstandingSalary, setOutstandingSalary] = useState("")
  const [outstandingAllowances, setOutstandingAllowances] = useState("")
  const [outstandingBonus, setOutstandingBonus] = useState("")

  // Deductions
  const [advanceSalary, setAdvanceSalary] = useState("")
  const [officeLoan, setOfficeLoan] = useState("")
  const [otherDeductions, setOtherDeductions] = useState("")

  const [result, setResult] = useState<EOSResult | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const calculate = () => {
    const salary = Number.parseFloat(basicSalary) || 0
    const years = Number.parseFloat(yearsOfService) || 0
    const months = Number.parseFloat(monthsOfService) || 0
    const totalServiceYears = years + months / 12

    // Gratuity calculation
    const gratuityRateNum = Number.parseFloat(gratuityRate) || 1
    const gratuityMonths = totalServiceYears * gratuityRateNum
    const gratuityAmount = salary * gratuityMonths

    // Notice period pay (if not served)
    const noticePeriodMonthsNum = Number.parseFloat(noticePeriodMonths) || 0
    const noticePeriodPay = noticePeriodServed ? 0 : salary * noticePeriodMonthsNum

    // Leave pay calculation (daily rate = monthly salary / 22 working days)
    const unusedLeaveDaysNum = Number.parseFloat(unusedLeaveDays) || 0
    const dailyRate = salary / 22
    const leavePay = dailyRate * unusedLeaveDaysNum

    // Outstanding amounts
    const outstandingSalaryNum = Number.parseFloat(outstandingSalary) || 0
    const outstandingAllowancesNum = Number.parseFloat(outstandingAllowances) || 0
    const outstandingBonusNum = Number.parseFloat(outstandingBonus) || 0

    // Redundancy pay (additional 1 month per year for redundancy)
    const isRedundancy = terminationType === "redundancy"
    const redundancyPay = isRedundancy ? salary * totalServiceYears : 0

    // Deductions
    const advanceSalaryNum = Number.parseFloat(advanceSalary) || 0
    const officeLoanNum = Number.parseFloat(officeLoan) || 0
    const otherDeductionsNum = Number.parseFloat(otherDeductions) || 0
    const totalDeductions = advanceSalaryNum + officeLoanNum + otherDeductionsNum

    // Gross EOS
    const grossEOS =
      gratuityAmount +
      noticePeriodPay +
      leavePay +
      outstandingSalaryNum +
      outstandingAllowancesNum +
      outstandingBonusNum +
      redundancyPay

    // Tax on gratuity (if applicable) - Gratuity above NLe 3,600 is taxable as per Finance Act
    // For EOS benefits, gratuity over a certain threshold may be taxable
    // Using simplified calculation: 25% on gratuity above threshold
    const gratuityThreshold = 3600 // Annual exemption
    const taxableGratuity = Math.max(0, gratuityAmount - gratuityThreshold)
    const taxOnGratuity = taxableGratuity * 0.25 // 25% CGT rate applies to terminal benefits

    // Final calculation
    const netEOS = grossEOS - totalDeductions - taxOnGratuity

    setResult({
      basicSalary: salary,
      yearsOfService: years,
      monthsOfService: months,
      totalServiceYears,
      gratuityRate: gratuityRateNum,
      gratuityMonths,
      gratuityAmount,
      noticePeriodMonths: noticePeriodMonthsNum,
      noticePeriodPay,
      unusedLeaveDays: unusedLeaveDaysNum,
      dailyRate,
      leavePay,
      outstandingSalary: outstandingSalaryNum,
      outstandingAllowances: outstandingAllowancesNum,
      outstandingBonus: outstandingBonusNum,
      isRedundancy,
      redundancyPay,
      advanceSalary: advanceSalaryNum,
      officeLoan: officeLoanNum,
      otherDeductions: otherDeductionsNum,
      totalDeductions,
      taxableAmount: taxableGratuity,
      taxOnGratuity,
      grossEOS,
      netEOS,
    })
    setShowBreakdown(true)
  }

  const clearForm = () => {
    setBasicSalary("")
    setYearsOfService("")
    setMonthsOfService("")
    setTerminationType("resignation")
    setGratuityRate("1")
    setNoticePeriodMonths("")
    setNoticePeriodServed(true)
    setUnusedLeaveDays("")
    setOutstandingSalary("")
    setOutstandingAllowances("")
    setOutstandingBonus("")
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
          <div className="w-11 h-11 bg-[#313B2F] rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">End of Service (EOS) Calculator</h2>
            <p className="text-muted-foreground text-sm">Gratuity & Severance Pay</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Calculate employee terminal benefits including gratuity, notice pay, and unused leave.
        </p>
      </div>

      {/* Termination Type Selection */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-4">
        <span className="text-sm font-medium text-foreground block mb-3">Type of Separation:</span>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { id: "resignation", label: "Resignation" },
            { id: "termination", label: "Termination" },
            { id: "redundancy", label: "Redundancy" },
            { id: "retirement", label: "Retirement" },
            { id: "death", label: "Death" },
          ].map((type) => (
            <label
              key={type.id}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-all text-xs font-semibold ${terminationType === type.id
                ? "bg-[#313B2F] text-white border-[#313B2F]"
                : "bg-white text-muted-foreground border-[#e5e7e4] hover:border-[#FBA002] hover:text-foreground"
                }`}
            >
              <input
                type="radio"
                name="terminationType"
                checked={terminationType === type.id}
                onChange={() => setTerminationType(type.id as TerminationType)}
                className="sr-only"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5 space-y-4">
          <h3 className="font-semibold text-foreground border-b border-[#f1f3f0] pb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBA002]" />
            Employee Information
          </h3>

          <FormRow
            label="Basic Monthly Salary"
            placeholder="Enter basic salary (NLe)"
            value={basicSalary}
            onChange={setBasicSalary}
            prefix="NLe"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormRow
              label="Years of Service"
              placeholder="Complete years"
              value={yearsOfService}
              onChange={setYearsOfService}
              suffix="years"
            />
            <FormRow
              label="Additional Months"
              placeholder="Extra months (0-11)"
              value={monthsOfService}
              onChange={setMonthsOfService}
              suffix="months"
            />
          </div>
        </div>

        {/* Gratuity Settings */}
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5 space-y-4">
          <h3 className="font-semibold text-foreground border-b border-[#f1f3f0] pb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBA002]" />
            Gratuity Settings
          </h3>

          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="text-sm font-medium text-foreground md:w-44 shrink-0">Gratuity Rate</label>
            <select
              value={gratuityRate}
              onChange={(e) => setGratuityRate(e.target.value)}
              className="flex-1 h-11 px-3 bg-white border border-[#e5e7e4] rounded-lg text-sm focus:border-[#FBA002] focus:outline-none focus:ring-1 focus:ring-[#FBA002]"
            >
              <option value="0.5">0.5 month per year of service</option>
              <option value="1">1 month per year of service (Standard)</option>
              <option value="1.5">1.5 months per year of service</option>
              <option value="2">2 months per year of service</option>
              <option value="2.5">2.5 months per year of service</option>
              <option value="3">3 months per year of service (Senior Staff)</option>
            </select>
          </div>
        </div>

        {/* Notice Period */}
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5 space-y-4">
          <h3 className="font-semibold text-foreground border-b border-[#f1f3f0] pb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBA002]" />
            Notice Period & Leave
          </h3>

          <FormRow
            label="Notice Period (Months)"
            placeholder="e.g., 1, 2, or 3 months"
            value={noticePeriodMonths}
            onChange={setNoticePeriodMonths}
            suffix="months"
          />

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground md:w-44">Notice Period Served?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={noticePeriodServed}
                  onChange={() => setNoticePeriodServed(true)}
                  className="w-4 h-4 text-[#FBA002] accent-[#FBA002]"
                />
                <span className="text-sm text-foreground">Yes (No pay in lieu)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!noticePeriodServed}
                  onChange={() => setNoticePeriodServed(false)}
                  className="w-4 h-4 text-[#FBA002] accent-[#FBA002]"
                />
                <span className="text-sm text-foreground">No (Pay in lieu)</span>
              </label>
            </div>
          </div>

          <div className="border-t border-[#f1f3f0] my-2"></div>

          <FormRow
            label="Unused Leave Days"
            placeholder="Number of days"
            value={unusedLeaveDays}
            onChange={setUnusedLeaveDays}
            suffix="days"
            hint="Daily rate = Monthly Salary ÷ 22"
          />
        </div>

        {/* Outstanding & Deductions */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#e5e7e4] p-5 space-y-4">
            <h3 className="font-semibold text-green-700 border-b border-[#f1f3f0] pb-2">Outstanding Amounts</h3>
            <FormRow label="Salary Due" placeholder="Amount" value={outstandingSalary} onChange={setOutstandingSalary} prefix="NLe" />
            <FormRow label="Allowances Due" placeholder="Amount" value={outstandingAllowances} onChange={setOutstandingAllowances} prefix="NLe" />
            <FormRow label="Bonus Due" placeholder="Amount" value={outstandingBonus} onChange={setOutstandingBonus} prefix="NLe" />
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7e4] p-5 space-y-4">
            <h3 className="font-semibold text-red-700 border-b border-[#f1f3f0] pb-2">Deductions</h3>
            <FormRow label="Advance Salary" placeholder="Amount" value={advanceSalary} onChange={setAdvanceSalary} prefix="NLe" />
            <FormRow label="Office Loan" placeholder="Amount" value={officeLoan} onChange={setOfficeLoan} prefix="NLe" />
            <FormRow label="Other" placeholder="Amount" value={otherDeductions} onChange={setOtherDeductions} prefix="NLe" />
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={calculate}
          size="lg"
          className="flex-1 bg-[#FBA002] hover:bg-[#E08F00] text-[#313B2F] font-semibold h-12 text-base rounded-xl"
        >
          <Calculator className="h-5 w-5 mr-2" />
          Calculate EOS Benefits
        </Button>
        <Button onClick={clearForm} size="lg" variant="outline" className="sm:w-32 h-12 rounded-xl border-[#e5e7e4]">
          Clear
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="bg-[#313B2F] rounded-xl p-5 text-white">
            <div className="text-white/60 text-sm mb-1">Net EOS Payable</div>
            <div className="text-3xl font-bold mb-4 text-[#FBA002]">{formatNLe(result.netEOS)}</div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <ResultStat label="Gross Benefits" value={formatNLe(result.grossEOS)} />
              <ResultStat label="Total Deductions" value={`- ${formatNLe(result.totalDeductions + result.taxOnGratuity)}`} />
              <ResultStat label="Gratuity Amount" value={formatNLe(result.gratuityAmount)} />
              <ResultStat label="Service Period" value={`${result.totalServiceYears.toFixed(2)} Years`} />
            </div>
          </div>

          <div className="bg-[#f8f9f7] rounded-xl border border-[#e5e7e4] p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">Detailed Breakdown</h3>
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-sm text-[#FBA002] hover:underline"
              >
                {showBreakdown ? "Hide Details" : "Show Details"}
              </button>
            </div>

            {showBreakdown && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">Gratuity</span>
                  <span className="text-right font-medium">{formatNLe(result.gratuityAmount)}</span>
                </div>
                {result.noticePeriodPay > 0 && (
                  <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                    <span className="text-muted-foreground">Notice Pay</span>
                    <span className="text-right font-medium">{formatNLe(result.noticePeriodPay)}</span>
                  </div>
                )}
                {result.leavePay > 0 && (
                  <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                    <span className="text-muted-foreground">Leave Pay ({result.unusedLeaveDays} days)</span>
                    <span className="text-right font-medium">{formatNLe(result.leavePay)}</span>
                  </div>
                )}
                {result.redundancyPay > 0 && (
                  <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                    <span className="text-muted-foreground">Redundancy Pay</span>
                    <span className="text-right font-medium">{formatNLe(result.redundancyPay)}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4] text-red-600">
                  <span className="">Tax (Est. 25%)</span>
                  <span className="text-right font-medium">- {formatNLe(result.taxOnGratuity)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4] text-red-600">
                  <span className="">Other Deductions</span>
                  <span className="text-right font-medium">- {formatNLe(result.totalDeductions)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="bg-[#white] rounded-xl border border-[#e5e7e4] p-4">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#FBA002]" />
            Gratuity Calculation
          </h4>
          <p className="text-muted-foreground">
            Basic Salary × Gratuity Rate × Years of Service.
            Standard rate is typically 1 month per year.
          </p>
        </div>
        <div className="bg-[#white] rounded-xl border border-[#e5e7e4] p-4">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FBA002]" />
            Tax Rules
          </h4>
          <p className="text-muted-foreground">
            Gratuity above NLe 3,600 is taxable (estimated here at 25%, but subject to PAYE assessment).
            Notice pay and leave pay are fully taxable.
          </p>
        </div>
      </div>
    </div>
  )
}

function FormRow({
  label,
  placeholder,
  value,
  onChange,
  prefix,
  suffix,
  hint
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  prefix?: string
  suffix?: string
  hint?: string
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-2">
      <label className="text-sm font-medium text-foreground md:w-44 shrink-0 mt-3">{label}</label>
      <div className="flex-1 w-full">
        <div className="relative">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{prefix}</span>}
          <Input
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`h-11 border-[#e5e7e4] focus:border-[#FBA002] rounded-lg ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-16' : ''}`}
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{suffix}</span>}
        </div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
    </div>
  )
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-white/50 text-xs mb-0.5">{label}</div>
      <div className="text-white font-semibold text-sm">{value}</div>
    </div>
  )
}
