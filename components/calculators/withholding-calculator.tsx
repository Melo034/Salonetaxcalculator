"use client"

import { useState } from "react"
import { formatNLe, WHT_RATES } from "@/lib/tax-utils"
import { Calculator, AlertTriangle, Hand, CheckCircle2, FileText, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PaymentType = "contractor" | "professional" | "dividend" | "interest" | "rent" | "royalty" | "management"

interface WHTResult {
  grossAmount: number
  whtRate: number
  whtAmount: number
  netPayment: number
}

export function WithholdingCalculator() {
  const [grossAmount, setGrossAmount] = useState("")
  const [paymentType, setPaymentType] = useState<PaymentType>("contractor")
  const [isResident, setIsResident] = useState(true)
  const [result, setResult] = useState<WHTResult | null>(null)

  const calculate = () => {
    const amount = Number.parseFloat(grossAmount) || 0
    const rates = WHT_RATES[paymentType]
    const rate = isResident ? rates.resident : rates.nonResident
    const whtAmount = amount * (rate / 100)

    setResult({
      grossAmount: amount,
      whtRate: rate,
      whtAmount,
      netPayment: amount - whtAmount,
    })
  }

  const clearInputs = () => {
    setGrossAmount("")
    setResult(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#313B2F] rounded-xl flex items-center justify-center">
            <Hand className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Withholding Tax Calculator</h2>
            <p className="text-muted-foreground text-sm">Tax deducted at source • Multiple Rates</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Calculate WHT based on <strong>Section 117 of the Income Tax Act 2000</strong>.
          Payers must remit WHT to NRA within <strong>30 days</strong> of payment.
          <span className="text-[#FBA002] ml-1 text-sm font-semibold">(Finance Act 2024 rates)</span>
        </p>
      </div>

      {/* Residency Status */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#313B2F] rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground mb-3">Recipient Status</div>
            <div className="flex flex-wrap gap-3">
              <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all text-sm font-medium ${isResident
                ? 'border-[#313B2F] bg-[#313B2F] text-white'
                : 'border-[#e5e7e4] hover:border-[#FBA002] bg-white text-muted-foreground'
                }`}>
                <input
                  type="radio"
                  name="residency"
                  checked={isResident}
                  onChange={() => setIsResident(true)}
                  className="sr-only"
                />
                <span className="">Resident</span>
              </label>
              <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all text-sm font-medium ${!isResident
                ? 'border-[#313B2F] bg-[#313B2F] text-white'
                : 'border-[#e5e7e4] hover:border-[#FBA002] bg-white text-muted-foreground'
                }`}>
                <input
                  type="radio"
                  name="residency"
                  checked={!isResident}
                  onChange={() => setIsResident(false)}
                  className="sr-only"
                />
                <span className="">Non-Resident</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Type & Amount */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
            className="w-full h-12 px-3 border border-[#e5e7e4] rounded-xl bg-white text-base focus:border-[#FBA002] focus:ring-1 focus:ring-[#FBA002] focus:outline-none transition-all"
          >
            {Object.entries(WHT_RATES).map(([value, rate]) => (
              <option key={value} value={value}>
                {rate.description}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            Rate: {isResident ? WHT_RATES[paymentType].resident : WHT_RATES[paymentType].nonResident}%
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Gross Payment Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">NLe</span>
            <Input
              type="number"
              value={grossAmount}
              onChange={(e) => setGrossAmount(e.target.value)}
              placeholder="Enter gross payment"
              className="pl-14 h-12 text-lg border-[#e5e7e4] focus:border-[#FBA002] rounded-xl"
            />
          </div>
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
          Calculate WHT
        </Button>
        <Button
          onClick={clearInputs}
          size="lg"
          variant="outline"
          className="sm:w-40 h-12 text-lg rounded-xl border-[#e5e7e4] hover:bg-slate-50"
        >
          Clear
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Main Results Card */}
          <div className="bg-[#313B2F] rounded-xl p-6 text-white overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-white/60 text-xs font-medium mb-1">Gross Payment</div>
                <div className="text-lg font-bold">{formatNLe(result.grossAmount)}</div>
              </div>
              <div>
                <div className="text-white/60 text-xs font-medium mb-1">WHT Rate</div>
                <div className="text-lg font-bold">{result.whtRate}%</div>
              </div>
              <div>
                <div className="text-white/60 text-xs font-medium mb-1">WHT Deducted</div>
                <div className="text-lg font-bold text-[#FBA002]">{formatNLe(result.whtAmount)}</div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-8 h-8 text-[#FBA002]/50" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="text-white/60 text-sm font-medium mb-1">Net Payment to Recipient</div>
              <div className="text-3xl font-bold text-[#FBA002]">
                {formatNLe(result.netPayment)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WHT Rates Table */}
      <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#FBA002]" />
          Withholding Tax Rates
          <span className="text-xs bg-[#FBA002]/10 text-[#9a6600] px-2 py-0.5 rounded-full font-semibold ml-2">
            Updated 2024
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e7e4]">
                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Payment Type</th>
                <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Resident</th>
                <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Non-Resident</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(WHT_RATES).map(([key, rates]) => (
                <tr
                  key={key}
                  className={`border-b border-[#f1f3f0] hover:bg-[#FBA002]/5 transition-colors ${paymentType === key ? 'bg-[#FBA002]/10' : ''
                    }`}
                >
                  <td className="px-3 py-2 text-foreground font-medium">
                    {rates.description}
                    {paymentType === key && (
                      <span className="ml-2 text-[10px] bg-[#313B2F] text-white px-1.5 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#313B2F]/10 text-[#313B2F]">
                      {rates.resident}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#313B2F]/10 text-[#313B2F]">
                      {rates.nonResident}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Contractor rate includes 1% education levy and 0.5% healthcare levy
        </p>
      </div>

      {/* Know Your Rights */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-5">
        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#FBA002]" />
          Know Your Rights - Withholding Tax
        </h3>
        <ul className="grid md:grid-cols-2 gap-3">
          <RightItem text="Request a WHT certificate from anyone deducting tax" />
          <RightItem text="WHT deducted can be used as a credit against final liability" />
          <RightItem text="If WHT exceeds actual tax, you can claim a refund" />
          <RightItem text="Payers must remit WHT to NRA within 30 days" />
          <RightItem text="Non-compliance results in penalties" />
          <RightItem text="Keep all WHT certificates as proof" />
        </ul>
      </div>
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
