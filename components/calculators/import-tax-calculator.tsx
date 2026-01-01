"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatNLe, TAX_CONSTANTS } from "@/lib/tax-utils"
import { Calculator, AlertTriangle, Info, Package, Ship, Scale } from "lucide-react"

interface ImportResult {
  cost: number
  insurance: number
  freight: number
  cif: number
  importDuty: number
  exciseDuty: number
  importWithholdingTax: number
  ecowasLevy: number
  importGST: number
  totalImportTaxes: number
  totalLandedCost: number
}

export function ImportTaxCalculator() {
  const [cost, setCost] = useState("")
  const [insuranceCost, setInsuranceCost] = useState("")
  const [freightCost, setFreightCost] = useState("")
  const [importDutyRate, setImportDutyRate] = useState("")
  const [importGSTRate, setImportGSTRate] = useState("15")
  const [exciseDutyRate, setExciseDutyRate] = useState("")
  const [result, setResult] = useState<ImportResult | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const calculate = () => {
    const costVal = Number.parseFloat(cost) || 0
    const insurance = Number.parseFloat(insuranceCost) || 0
    const freight = Number.parseFloat(freightCost) || 0
    const dutyRate = Number.parseFloat(importDutyRate) || 0
    const gstRate = Number.parseFloat(importGSTRate) || 15
    const exciseRate = Number.parseFloat(exciseDutyRate) || 0

    // Step 1: Calculate CIF (Cost + Insurance + Freight)
    const cif = costVal + insurance + freight

    // Step 2: Calculate Import Duty (based on HS Code rate)
    const importDuty = cif * (dutyRate / 100)

    // Step 3: Calculate Excise Duty (on CIF + Import Duty)
    const exciseDuty = (cif + importDuty) * (exciseRate / 100)

    // Step 4: Calculate Import Withholding Tax (5% on CIF per Section 114)
    const importWithholdingTax = cif * TAX_CONSTANTS.importWithholdingRate

    // Step 5: Calculate ECOWAS Levy (0.5% on CIF)
    const ecowasLevy = cif * TAX_CONSTANTS.ecowasLevy

    // Step 6: Calculate Import GST (on CIF + Import Duty + Excise Duty)
    const importGST = (cif + importDuty + exciseDuty) * (gstRate / 100)

    // Total Import Taxes
    const totalImportTaxes = importDuty + exciseDuty + importWithholdingTax + ecowasLevy + importGST

    // Total Landed Cost
    const totalLandedCost = cif + totalImportTaxes

    setResult({
      cost: costVal,
      insurance,
      freight,
      cif,
      importDuty,
      exciseDuty,
      importWithholdingTax,
      ecowasLevy,
      importGST,
      totalImportTaxes,
      totalLandedCost,
    })
  }

  const clearForm = () => {
    setCost("")
    setInsuranceCost("")
    setFreightCost("")
    setImportDutyRate("")
    setImportGSTRate("15")
    setExciseDutyRate("")
    setResult(null)
    setShowBreakdown(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#313B2F] rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-[#FBA002]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Import Taxes Calculator</h2>
            <p className="text-muted-foreground text-sm">Duty, GST, Excise & Withholding Tax</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Calculate all taxes for imported goods based on <strong>CIF Value</strong> (Cost, Insurance, Freight).
          Rates depend on the <strong>HS Code</strong> classification.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* CIF Section */}
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5 space-y-4">
          <div className="border-b border-[#f1f3f0] pb-2 mb-2 flex items-center gap-2">
            <Ship className="w-4 h-4 text-[#FBA002]" />
            <h3 className="font-semibold text-foreground">Shipping Details (CIF)</h3>
          </div>

          <FormRow label="Cost (FOB)" placeholder="Item cost" value={cost} onChange={setCost} required />
          <FormRow label="Insurance" placeholder="Insurance cost" value={insuranceCost} onChange={setInsuranceCost} />
          <FormRow label="Freight" placeholder="Shipping cost" value={freightCost} onChange={setFreightCost} />
        </div>

        {/* Rates Section */}
        <div className="bg-white rounded-xl border border-[#e5e7e4] p-5 space-y-4">
          <div className="border-b border-[#f1f3f0] pb-2 mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#FBA002]" />
            <h3 className="font-semibold text-foreground">Tax Rates</h3>
          </div>

          <FormRow
            label="Import Duty (%)"
            placeholder="e.g. 20"
            value={importDutyRate}
            onChange={setImportDutyRate}
            suffix="%"
            helpText="Check HS Code (0-40%)"
          />
          <FormRow
            label="Import GST (%)"
            placeholder="15"
            value={importGSTRate}
            onChange={setImportGSTRate}
            suffix="%"
            helpText="Usually 15%"
          />
          <FormRow
            label="Excise Duty (%)"
            placeholder="0"
            value={exciseDutyRate}
            onChange={setExciseDutyRate}
            suffix="%"
            helpText="If applicable (cars, tobacco, etc)"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={calculate}
            size="lg"
            className="flex-1 bg-[#FBA002] hover:bg-[#E08F00] text-[#313B2F] font-semibold h-12 text-lg rounded-xl"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Import Tax
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
            <div className="text-white/60 text-sm mb-1">Total Landed Cost</div>
            <div className="text-3xl font-bold mb-4 text-[#FBA002]">{formatNLe(result.totalLandedCost)}</div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <ResultStat label="Total Import Taxes" value={formatNLe(result.totalImportTaxes)} />
              <ResultStat label="CIF Value" value={formatNLe(result.cif)} />
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
                  <span className="text-muted-foreground">CIF Value</span>
                  <span className="text-right font-medium">{formatNLe(result.cif)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">Import Duty</span>
                  <span className="text-right font-medium text-[#B54A42]">{formatNLe(result.importDuty)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">Import GST</span>
                  <span className="text-right font-medium text-[#B54A42]">{formatNLe(result.importGST)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">Import WHT (5%)</span>
                  <span className="text-right font-medium text-[#B54A42]">{formatNLe(result.importWithholdingTax)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">Excise Duty</span>
                  <span className="text-right font-medium text-[#B54A42]">{formatNLe(result.exciseDuty)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4]">
                  <span className="text-muted-foreground">ECOWAS Levy (0.5%)</span>
                  <span className="text-right font-medium text-[#B54A42]">{formatNLe(result.ecowasLevy)}</span>
                </div>
                <div className="grid grid-cols-2 py-1 border-b border-[#e5e7e4] text-[#B54A42]">
                  <span className="">Total Taxes</span>
                  <span className="text-right font-bold">{formatNLe(result.totalImportTaxes)}</span>
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
          Import Tax Information
        </h3>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBA002] mt-2 shrink-0"></div>
            Taxes are based on CIF value (Cost + Insurance + Freight)
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBA002] mt-2 shrink-0"></div>
            Import GST is calculated on (CIF + Duty + Excise)
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBA002] mt-2 shrink-0"></div>
            Import WHT (5%) can be used as a tax credit later
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBA002] mt-2 shrink-0"></div>
            Verify your HS Code to get the correct Duty Rate
          </li>
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
  required,
  helpText,
  suffix
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  helpText?: string
  suffix?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
          {suffix ? "" : "NLe"}
        </span>
        <Input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 border-[#e5e7e4] focus:border-[#FBA002] rounded-lg ${suffix ? 'pl-3 pr-10' : 'pl-10'}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{suffix}</span>}
      </div>
      {helpText && <p className="text-xs text-muted-foreground mt-1">{helpText}</p>}
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
