"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatNLe, TAX_CONSTANTS } from "@/lib/tax-utils"
import { Calculator, AlertTriangle, Info, TrendingUp, CheckCircle2 } from "lucide-react"

interface CGTResult {
  sellingPrice: number
  totalCostBase: number
  grossGain: number
  exemption: number
  taxableGain: number
  capitalGainsTax: number
  netProceeds: number
}

export function CapitalGainsTaxCalculator() {
  const [sellingPrice, setSellingPrice] = useState("")
  const [initialCost, setInitialCost] = useState("")
  const [incidentalCost, setIncidentalCost] = useState("")
  const [constructionCost, setConstructionCost] = useState("")
  const [developmentCost, setDevelopmentCost] = useState("")
  const [legalFees, setLegalFees] = useState("")
  const [agencyFees, setAgencyFees] = useState("")
  const [otherFees, setOtherFees] = useState("")
  const [result, setResult] = useState<CGTResult | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const calculate = () => {
    const selling = Number.parseFloat(sellingPrice) || 0
    const initial = Number.parseFloat(initialCost) || 0
    const incidental = Number.parseFloat(incidentalCost) || 0
    const construction = Number.parseFloat(constructionCost) || 0
    const development = Number.parseFloat(developmentCost) || 0
    const legal = Number.parseFloat(legalFees) || 0
    const agency = Number.parseFloat(agencyFees) || 0
    const other = Number.parseFloat(otherFees) || 0

    // Step 1: Calculate Total Cost Base
    const totalCostBase = initial + incidental + construction + development + legal + agency + other

    // Step 2: Calculate Gross Capital Gain
    const grossGain = Math.max(0, selling - totalCostBase)

    // Step 3: Apply Exemption (First NLe 3,600 per transaction is exempt)
    const exemption = Math.min(grossGain, TAX_CONSTANTS.capitalGainsExemption)
    const taxableGain = Math.max(0, grossGain - exemption)

    // Step 4: Calculate CGT at 25%
    const capitalGainsTax = taxableGain * TAX_CONSTANTS.capitalGainsRate

    // Net proceeds to seller
    const netProceeds = selling - capitalGainsTax

    setResult({
      sellingPrice: selling,
      totalCostBase,
      grossGain,
      exemption,
      taxableGain,
      capitalGainsTax,
      netProceeds,
    })
  }

  const clearForm = () => {
    setSellingPrice("")
    setInitialCost("")
    setIncidentalCost("")
    setConstructionCost("")
    setDevelopmentCost("")
    setLegalFees("")
    setAgencyFees("")
    setOtherFees("")
    setResult(null)
    setShowBreakdown(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#313B2F] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Capital Gains Tax Calculator</h2>
            <p className="text-muted-foreground text-sm">25% tax on profit from asset sales</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Capital Gains Tax (CGT) is charged on the <strong>gain only</strong>, not the full price.
          Use this calculator to deduct allowable costs and lower your tax.
        </p>
      </div>

      {/* Exemption Notice */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#FBA002] shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <strong>Tax-Free Exemption:</strong> The first <strong>NLe 3,600</strong> of capital gains per transaction is completely tax-free.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Selling Price */}
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">Selling Price (Proceeds)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">NLe</span>
            <Input
              type="number"
              placeholder="Enter selling price"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="pl-14 h-12 text-lg border-[#e5e7e4] focus:border-[#FBA002] rounded-xl"
            />
          </div>
        </div>

        {/* Cost Base Section */}
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5 space-y-4">
          <div className="border-b border-[#f1f3f0] pb-2 mb-2">
            <h3 className="font-semibold text-foreground">Deductible Costs</h3>
            <p className="text-xs text-muted-foreground">Add all costs to reduce your taxable gain</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormRow label="Initial Cost" placeholder="Purchase price" value={initialCost} onChange={setInitialCost} />
            <FormRow label="Incidental Cost" placeholder="Repair/Maintenance" value={incidentalCost} onChange={setIncidentalCost} />
            <FormRow label="Construction" placeholder="Building costs" value={constructionCost} onChange={setConstructionCost} />
            <FormRow label="Development" placeholder="Improvement costs" value={developmentCost} onChange={setDevelopmentCost} />
            <FormRow label="Legal Fees" placeholder="Lawyer/Transfer fees" value={legalFees} onChange={setLegalFees} />
            <FormRow label="Agency Fees" placeholder="Commission/Broker" value={agencyFees} onChange={setAgencyFees} />
            <FormRow label="Other Fees" placeholder="Miscellaneous" value={otherFees} onChange={setOtherFees} />
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
            Calculate CGT
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
            <div className="text-white/60 text-sm mb-1">Net Proceeds to Seller</div>
            <div className="text-3xl font-bold mb-4 text-[#FBA002]">{formatNLe(result.netProceeds)}</div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <ResultStat label="Capital Gains Tax" value={formatNLe(result.capitalGainsTax)} />
              <ResultStat label="Gross Gain" value={formatNLe(result.grossGain)} />
            </div>
          </div>

          {/* Breakdown */}
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
                  <span className="text-muted-foreground">Selling Price</span>
                  <span className="text-right font-medium">{formatNLe(result.sellingPrice)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">Less: Total Cost Base</span>
                  <span className="text-right font-medium text-green-600">-{formatNLe(result.totalCostBase)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">Less: Exemption</span>
                  <span className="text-right font-medium text-green-600">-{formatNLe(result.exemption)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">Taxable Gain</span>
                  <span className="text-right font-bold text-foreground">{formatNLe(result.taxableGain)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4] text-[#B54A42]">
                  <span className="">CGT Payable (25%)</span>
                  <span className="text-right font-bold">- {formatNLe(result.capitalGainsTax)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Know Your Rights */}
      <div className="bg-[#white] rounded-xl border border-[#e5e7e4] p-5">
        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#FBA002]" />
          Important CGT Rules
        </h3>
        <ul className="grid md:grid-cols-2 gap-3">
          <RightItem text="CGT is only on the GAIN, not the selling price" />
          <RightItem text="Deduct ALL legal, agency, and improvement costs" />
          <RightItem text="First NLe 3,600 of gain is tax-free" />
          <RightItem text="Keep citations and receipts for all expenses" />
        </ul>
      </div>
    </div>
  )
}

function FormRow({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">NLe</span>
        <Input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-11 border-[#e5e7e4] focus:border-[#FBA002] rounded-lg"
        />
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

function RightItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[#FBA002]" />
      <span>{text}</span>
    </li>
  )
}
