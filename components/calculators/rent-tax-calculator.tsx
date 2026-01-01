"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatNLe, TAX_CONSTANTS } from "@/lib/tax-utils"
import { Calculator, AlertTriangle, Info, Home, Building2, User } from "lucide-react"

interface RentResult {
  yearlyRent: number
  threshold: number
  afterThreshold: number
  allowance: number // Formerly wear & tear, now 20% rental deduction
  taxableRent: number
  rentTax: number
  netToLandlord: number
}

export function RentTaxCalculator() {
  const [yearlyRent, setYearlyRent] = useState("")
  const [landlordType, setLandlordType] = useState<"individual" | "company">("individual")
  const [result, setResult] = useState<RentResult | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const calculate = () => {
    const rent = Number.parseFloat(yearlyRent) || 0

    if (landlordType === "company") {
      // For companies: 10% flat, no deductions
      const tax = rent * 0.1
      setResult({
        yearlyRent: rent,
        threshold: 0,
        afterThreshold: rent,
        allowance: 0,
        taxableRent: rent,
        rentTax: tax,
        netToLandlord: rent - tax,
      })
    } else {
      // For individual landlords:
      // Step 1: Deduct annual threshold (NLe 1,500,000)
      const afterThreshold = Math.max(0, rent - TAX_CONSTANTS.rentalThreshold)

      // Step 2: Deduct 20% allowance (Finance Act 2024)
      const allowance = afterThreshold * TAX_CONSTANTS.rentalDeduction
      const taxableRent = afterThreshold - allowance

      // Step 3: Apply 10% tax rate
      const tax = taxableRent * TAX_CONSTANTS.rentTaxRate

      setResult({
        yearlyRent: rent,
        threshold: TAX_CONSTANTS.rentalThreshold,
        afterThreshold,
        allowance,
        taxableRent,
        rentTax: tax,
        netToLandlord: rent - tax,
      })
    }
  }

  const clearForm = () => {
    setYearlyRent("")
    setResult(null)
    setShowBreakdown(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#313B2F] rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Rent Tax Calculator</h2>
            <p className="text-muted-foreground text-sm">10% Tax Rate • Updated for Finance Act 2025</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Tenants must withhold <strong>10% tax</strong> from rent paid to landlords.
          Includes new threshold of <strong>{formatNLe(TAX_CONSTANTS.rentalThreshold)}</strong> and <strong>20% deduction</strong> for individuals.
        </p>
      </div>

      {/* Landlord Type Selection */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-4">
        <div className="space-y-3">
          <span className="text-sm font-medium text-foreground block">Landlord Type:</span>
          <div className="flex flex-wrap gap-4">
            <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all text-sm font-medium ${landlordType === "individual"
              ? 'border-[#313B2F] bg-[#313B2F] text-white'
              : 'border-[#e5e7e4] hover:border-[#FBA002] bg-white text-muted-foreground'
              }`}>
              <input
                type="radio"
                name="landlordType"
                checked={landlordType === "individual"}
                onChange={() => setLandlordType("individual")}
                className="sr-only"
              />
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Individual Landlord
              </span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all text-sm font-medium ${landlordType === "company"
              ? 'border-[#313B2F] bg-[#313B2F] text-white'
              : 'border-[#e5e7e4] hover:border-[#FBA002] bg-white text-muted-foreground'
              }`}>
              <input
                type="radio"
                name="landlordType"
                checked={landlordType === "company"}
                onChange={() => setLandlordType("company")}
                className="sr-only"
              />
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Landlord
              </span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            {landlordType === "individual"
              ? `Individual landlords get ${formatNLe(TAX_CONSTANTS.rentalThreshold)} threshold + 20% allowance`
              : "Company landlords pay 10% on full rent amount (no deductions)"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">Yearly Rent</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">NLe</span>
            <Input
              type="number"
              placeholder="Enter yearly rent amount"
              value={yearlyRent}
              onChange={(e) => setYearlyRent(e.target.value)}
              className="pl-14 h-12 text-lg border-[#e5e7e4] focus:border-[#FBA002] rounded-xl"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={calculate}
            size="lg"
            className="flex-1 bg-[#FBA002] hover:bg-[#E08F00] text-[#313B2F] font-semibold h-12 text-lg rounded-xl"
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
          <div className="bg-[#313B2F] rounded-xl p-5 text-white">
            <div className="text-white/60 text-sm mb-1">Net to Landlord</div>
            <div className="text-3xl font-bold mb-4 text-[#FBA002]">{formatNLe(result.netToLandlord)}</div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <ResultStat label="Rent Tax (10%)" value={formatNLe(result.rentTax)} />
              <ResultStat label="Gross Rent" value={formatNLe(result.yearlyRent)} />
            </div>
          </div>

          {/* Show Breakdown */}
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
                  <span className="text-muted-foreground">Yearly Rent</span>
                  <span className="text-right font-medium">{formatNLe(result.yearlyRent)}</span>
                </div>
                {landlordType === "individual" && (
                  <>
                    <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                      <span className="text-muted-foreground">Less: Threshold (Tax Free)</span>
                      <span className="text-right font-medium text-green-600">-{formatNLe(result.threshold)}</span>
                    </div>
                    <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                      <span className="text-muted-foreground">Less: 20% Allowance</span>
                      <span className="text-right font-medium text-green-600">-{formatNLe(result.allowance)}</span>
                    </div>
                    <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                      <span className="text-muted-foreground">Taxable Rent</span>
                      <span className="text-right font-bold text-foreground">{formatNLe(result.taxableRent)}</span>
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4] text-[#B54A42]">
                  <span className="">Tax Payable</span>
                  <span className="text-right font-bold">- {formatNLe(result.rentTax)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="bg-[#white] rounded-xl border border-[#e5e7e4] p-4">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#FBA002]" />
          Rent Tax Rules
        </h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Individual Landlords:</strong> First {formatNLe(TAX_CONSTANTS.rentalThreshold)} is tax-free. Then a 20% deduction is applied for maintenance. The remaining amount is taxed at 10%.</p>
          <p><strong>Company Landlords:</strong> Pay 10% on the total gross rent. No deductions allowed.</p>
        </div>
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
