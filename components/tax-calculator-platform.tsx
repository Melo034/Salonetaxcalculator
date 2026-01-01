"use client"

import { useState } from "react"
import { PAYECalculator } from "@/components/calculators/paye-calculator"
import { RentTaxCalculator } from "@/components/calculators/rent-tax-calculator"
import { ImportTaxCalculator } from "@/components/calculators/import-tax-calculator"
import { CapitalGainsTaxCalculator } from "@/components/calculators/capital-gains-calculator"
import { GSTCalculator } from "@/components/calculators/gst-calculator"
import { WithholdingCalculator } from "@/components/calculators/withholding-calculator"
import { EOSCalculator } from "@/components/calculators/eos-calculator"
import { NASSITCalculator } from "@/components/calculators/nassit-calculator"
import { cn } from "@/lib/utils"
import { DollarSign, Clock, Percent, Hand, Home, TrendingUp, Package, ChevronRight, Landmark, Award, Menu } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CalculatorType = "paye" | "nassit" | "eos" | "gst" | "withholding" | "rent" | "capital-gains" | "import"

interface NavItem {
  id: CalculatorType
  label: string
  icon: React.ReactNode
  description: string
  badge?: string
}

const navItems: NavItem[] = [
  {
    id: "paye",
    label: "PAYE Tax",
    icon: <DollarSign className="w-5 h-5" />,
    description: "Income tax on salaries",
    badge: "Popular"
  },
  {
    id: "nassit",
    label: "NASSIT Pension",
    icon: <Award className="w-5 h-5" />,
    description: "Retirement benefits",
    badge: "New"
  },
  {
    id: "eos",
    label: "End of Service",
    icon: <Clock className="w-5 h-5" />,
    description: "Gratuity & severance"
  },
  {
    id: "gst",
    label: "GST (15%)",
    icon: <Percent className="w-5 h-5" />,
    description: "Goods & Services Tax"
  },
  {
    id: "withholding",
    label: "Withholding Tax",
    icon: <Hand className="w-5 h-5" />,
    description: "WHT on payments"
  },
  {
    id: "rent",
    label: "Rent Tax",
    icon: <Home className="w-5 h-5" />,
    description: "Rental income tax"
  },
  {
    id: "capital-gains",
    label: "Capital Gains",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Property/asset sales"
  },
  {
    id: "import",
    label: "Import Taxes",
    icon: <Package className="w-5 h-5" />,
    description: "Customs & duties"
  },
]

export function TaxCalculatorPlatform() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>("paye")

  return (
    <div id="calculator-platform" className="flex flex-col lg:flex-row gap-0 bg-white rounded-2xl shadow-elevated overflow-hidden border border-[#e5e7e4]">

      {/* Mobile Navigation (Dropdown) */}
      <div className="lg:hidden p-4 bg-[#313B2F] border-b border-white/10">
        <label className="text-white/80 text-sm font-medium mb-2 block">Select Calculator</label>
        <Select value={activeCalculator} onValueChange={(value) => setActiveCalculator(value as CalculatorType)}>
          <SelectTrigger className="w-full h-12 bg-white/10 border-white/20 text-white focus:ring-[#FBA002]">
            <div className="flex items-center gap-2">
              {navItems.find(n => n.id === activeCalculator)?.icon}
              <SelectValue placeholder="Select calculator" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white border-[#e5e7e4]">
            {navItems.map((item) => (
              <SelectItem key={item.id} value={item.id} className="cursor-pointer focus:bg-[#FBA002]/10">
                <div className="flex items-center gap-2">
                  <span className="text-[#313B2F]">{item.icon}</span>
                  <span className="font-medium text-[#313B2F]">{item.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block relative w-72 shrink-0 bg-[#313B2F]">
        <div className="p-5">
          {/* Header */}
          <div className="mb-5 pb-4 border-b border-white/10">
            <h3 className="text-white font-semibold text-lg">Tax Calculators</h3>
            <p className="text-white/50 text-sm mt-1">Select a calculator</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" role="tablist">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveCalculator(item.id)}
                role="tab"
                aria-selected={activeCalculator === item.id}
                aria-controls={`${item.id}-panel`}
                tabIndex={activeCalculator === item.id ? 0 : -1}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group",
                  activeCalculator === item.id
                    ? "bg-[#FBA002] text-[#313B2F]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    activeCalculator === item.id
                      ? "bg-[#313B2F] text-[#FBA002]"
                      : "bg-white/10 text-white/70"
                  )}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium text-sm truncate",
                      activeCalculator === item.id ? "text-[#313B2F]" : "text-white"
                    )}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                        activeCalculator === item.id
                          ? "bg-[#313B2F]/20 text-[#313B2F]"
                          : "bg-[#FBA002]/30 text-[#FBA002]"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs truncate block",
                    activeCalculator === item.id ? "text-[#313B2F]/70" : "text-white/40"
                  )}>
                    {item.description}
                  </span>
                </div>

                {/* Arrow */}
                <ChevronRight className={cn(
                  "w-4 h-4 shrink-0 transition-all",
                  activeCalculator === item.id
                    ? "text-[#313B2F] opacity-100"
                    : "opacity-0"
                )} />
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Landmark className="w-4 h-4 text-[#FBA002]" />
              <span>NRA Compliant • 2025 Rates</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Calculator Content */}
      <div
        className="flex-1 p-6 md:p-8 overflow-auto bg-[#FAF8F5] min-h-150"
        role="tabpanel"
        id={`${activeCalculator}-panel`}
      >
        <div className="max-w-3xl mx-auto">
          {/* Calculator Components */}
          <div className="animate-fade-in">
            {activeCalculator === "paye" && <PAYECalculator />}
            {activeCalculator === "nassit" && <NASSITCalculator />}
            {activeCalculator === "eos" && <EOSCalculator />}
            {activeCalculator === "gst" && <GSTCalculator />}
            {activeCalculator === "withholding" && <WithholdingCalculator />}
            {activeCalculator === "rent" && <RentTaxCalculator />}
            {activeCalculator === "capital-gains" && <CapitalGainsTaxCalculator />}
            {activeCalculator === "import" && <ImportTaxCalculator />}
          </div>
        </div>
      </div>
    </div>
  )
}
