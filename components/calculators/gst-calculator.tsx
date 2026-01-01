"use client"

import { useState } from "react"
import { formatNLe, TAX_CONSTANTS } from "@/lib/tax-utils"
import { Calculator, AlertTriangle, Percent, CheckCircle2, ArrowRight, ShoppingCart, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GSTResult {
  originalAmount: number
  gstAmount: number
  totalAmount: number
  mode: "add" | "extract"
}

export function GSTCalculator() {
  const [amount, setAmount] = useState("")
  const [mode, setMode] = useState<"add" | "extract">("add")
  const [result, setResult] = useState<GSTResult | null>(null)

  const calculate = () => {
    const amountNum = Number.parseFloat(amount) || 0

    if (mode === "add") {
      // Adding GST: Amount × 15%
      const gstAmount = amountNum * TAX_CONSTANTS.gstRate
      setResult({
        originalAmount: amountNum,
        gstAmount,
        totalAmount: amountNum + gstAmount,
        mode: "add",
      })
    } else {
      // Extracting GST from gross: Gross ÷ 1.15
      const originalAmount = amountNum / (1 + TAX_CONSTANTS.gstRate)
      const gstAmount = amountNum - originalAmount
      setResult({
        originalAmount,
        gstAmount,
        totalAmount: amountNum,
        mode: "extract",
      })
    }
  }

  const clearInputs = () => {
    setAmount("")
    setResult(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#313B2F] rounded-xl flex items-center justify-center">
            <Percent className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">GST Calculator</h2>
            <p className="text-muted-foreground text-sm">Goods & Services Tax • 15% Rate</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Calculate GST based on the <strong>Goods and Services Tax Act 2009</strong>.
          GST is charged at <strong>15%</strong> on the supply of taxable goods and services.
        </p>
      </div>

      {/* Registration Threshold Notice */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#313B2F] rounded-xl flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div>
            <p className="font-semibold text-foreground">GST Registration Threshold</p>
            <p className="text-sm text-muted-foreground">
              Businesses with annual turnover above <strong>NLe 500,000</strong> must register for GST.
              <span className="text-xs text-[#FBA002] font-semibold ml-1">(Updated Finance Act 2024)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
        <label className="block text-sm font-semibold text-foreground mb-4">Calculation Mode</label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className={`relative flex items-center gap-3 cursor-pointer px-4 py-4 rounded-xl border transition-all ${mode === "add"
            ? 'border-[#313B2F] bg-[#313B2F] text-white'
            : 'border-[#e5e7e4] hover:border-[#FBA002] hover:bg-white text-muted-foreground'
            }`}>
            <input
              type="radio"
              name="gst-mode"
              checked={mode === "add"}
              onChange={() => setMode("add")}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${mode === "add" ? 'border-[#FBA002]' : 'border-slate-300'
              }`}>
              {mode === "add" && <div className="w-2.5 h-2.5 rounded-full bg-[#FBA002]" />}
            </div>
            <div className="flex-1">
              <span className={`font-semibold block ${mode === 'add' ? 'text-white' : 'text-foreground'}`}>Add GST</span>
              <span className={`text-xs ${mode === 'add' ? 'text-white/70' : 'text-muted-foreground'}`}>Calculate total from net amount</span>
            </div>
          </label>

          <label className={`relative flex items-center gap-3 cursor-pointer px-4 py-4 rounded-xl border transition-all ${mode === "extract"
            ? 'border-[#313B2F] bg-[#313B2F] text-white'
            : 'border-[#e5e7e4] hover:border-[#FBA002] hover:bg-white text-muted-foreground'
            }`}>
            <input
              type="radio"
              name="gst-mode"
              checked={mode === "extract"}
              onChange={() => setMode("extract")}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${mode === "extract" ? 'border-[#FBA002]' : 'border-slate-300'
              }`}>
              {mode === "extract" && <div className="w-2.5 h-2.5 rounded-full bg-[#FBA002]" />}
            </div>
            <div className="flex-1">
              <span className={`font-semibold block ${mode === 'extract' ? 'text-white' : 'text-foreground'}`}>Extract GST</span>
              <span className={`text-xs ${mode === 'extract' ? 'text-white/70' : 'text-muted-foreground'}`}>Find GST in gross amount</span>
            </div>
          </label>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
        <label className="block text-sm font-semibold text-foreground mb-3">
          {mode === "add" ? "Net Amount (excl. GST)" : "Gross Amount (incl. GST)"}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">NLe</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={mode === "add" ? "Enter net amount" : "Enter gross amount"}
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
          Calculate GST
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
          <div className="bg-[#313B2F] rounded-xl p-6 text-white overflow-hidden relative">
            <div className="grid sm:grid-cols-3 gap-4 relative z-10">
              <div className="text-center sm:text-left">
                <div className="text-white/60 text-sm font-medium mb-1">
                  {result.mode === "add" ? "Net Amount" : "Original Amount"}
                </div>
                <div className="text-2xl font-bold">{formatNLe(result.originalAmount)}</div>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/10">
                  <ArrowRight className="w-5 h-5 text-[#FBA002]" />
                  <span className="font-bold text-[#FBA002]">15% GST</span>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="text-white/60 text-sm font-medium mb-1">
                  {result.mode === "add" ? "Total Amount" : "Gross Amount"}
                </div>
                <div className="text-2xl font-bold">{formatNLe(result.totalAmount)}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center relative z-10">
              <div className="text-white/60 text-sm font-medium mb-1">GST Amount</div>
              <div className="text-4xl font-bold text-[#FBA002]">
                {formatNLe(result.gstAmount)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GST Formula */}
      <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#FBA002]" />
          GST Calculation Formulas
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-[#f8f9f7] rounded-lg p-3 border border-[#e5e7e4]">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">To Add GST</div>
            <div className="text-sm font-mono text-foreground font-semibold">Net × 1.15 = Gross</div>
          </div>
          <div className="bg-[#f8f9f7] rounded-lg p-3 border border-[#e5e7e4]">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">To Extract GST</div>
            <div className="text-sm font-mono text-foreground font-semibold">Gross ÷ 1.15 = Net</div>
          </div>
          <div className="bg-[#f8f9f7] rounded-lg p-3 border border-[#e5e7e4]">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">GST Amount</div>
            <div className="text-sm font-mono text-foreground font-semibold">Gross - Net = GST</div>
          </div>
        </div>
      </div>

      {/* GST Exempt Items */}
      <div className="bg-white rounded-xl border border-[#e5e7e4] p-5">
        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#313B2F] rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-[#FBA002]" />
          </div>
          GST Exempt Items (0% Rate)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            <ExemptItem text="Rice and wheat flour" />
            <ExemptItem text="Baby food and infant formula" />
            <ExemptItem text="Medical services and medicines" />
            <ExemptItem text="Educational services" />
            <ExemptItem text="Petrol, diesel, and kerosene" />
          </ul>
          <ul className="space-y-2">
            <ExemptItem text="Financial services" />
            <ExemptItem text="Water (unpackaged)" />
            <ExemptItem text="Agricultural inputs" />
            <ExemptItem text="Solar equipment" />
            <ExemptItem text="Public passenger transport" />
          </ul>
        </div>
      </div>

      {/* Know Your Rights */}
      <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-5">
        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#FBA002]" />
          Know Your Rights - GST
        </h3>
        <ul className="grid md:grid-cols-2 gap-3">
          <RightItem text="GST should be clearly shown on receipts from registered businesses" />
          <RightItem text="Essential items like rice, medicine, and education are GST-exempt" />
          <RightItem text="Businesses with turnover below NLe 500,000 do NOT need to charge GST" />
          <RightItem text="You can report businesses not issuing proper GST receipts to NRA" />
          <RightItem text="GST returns must be filed within 21 days after each tax period" />
          <RightItem text="Input tax credits can be claimed on business purchases" />
        </ul>
      </div>
    </div>
  )
}

function ExemptItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-foreground">
      <CheckCircle2 className="w-4 h-4 text-[#FBA002] shrink-0" />
      <span>{text}</span>
    </li>
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
