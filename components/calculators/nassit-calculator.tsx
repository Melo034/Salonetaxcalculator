"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatNLe, calculatePension, EOS_CONSTANTS } from "@/lib/tax-utils"
import { Calculator, AlertTriangle, Info, Clock, User, Award, CheckCircle2 } from "lucide-react"

interface PensionResult {
    monthlyPension: number
    gratuity: number
    pensionRate: number
    eligible: boolean
    message: string
}

export function NASSITCalculator() {
    const [avgEarnings, setAvgEarnings] = useState("")
    const [monthsContributed, setMonthsContributed] = useState("")
    const [retirementType, setRetirementType] = useState<"normal" | "early" | "invalidity">("normal")
    const [age, setAge] = useState("")
    const [result, setResult] = useState<PensionResult | null>(null)

    const calculate = () => {
        const earnings = Number.parseFloat(avgEarnings) || 0
        const months = Number.parseFloat(monthsContributed) || 0
        const ageNum = Number.parseFloat(age) || 60

        const calculation = calculatePension(earnings, months, retirementType, ageNum)
        setResult(calculation)
    }

    const clearForm = () => {
        setAvgEarnings("")
        setMonthsContributed("")
        setAge("")
        setRetirementType("normal")
        setResult(null)
    }

    const yearsContributed = (Number.parseFloat(monthsContributed) || 0) / 12

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#313B2F] rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5 text-[#FBA002]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">NASSIT Pension Calculator</h2>
                        <p className="text-muted-foreground text-sm">Estimate your retirement benefits</p>
                    </div>
                </div>
                <p className="text-muted-foreground text-sm">
                    Based on the <strong>NASSIT Act 2001</strong>. Pension is calculated on the average earnings of your best 5 years.
                </p>
            </div>

            {/* Retirement Type */}
            <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-4">
                <span className="text-sm font-medium text-foreground block mb-3">Retirement Type:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { id: "normal", label: "Normal Retirement (60+)" },
                        { id: "early", label: "Early Retirement (55+)" },
                        { id: "invalidity", label: "Invalidity Pension" },
                    ].map((type) => (
                        <label
                            key={type.id}
                            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg cursor-pointer border transition-all text-sm font-medium ${retirementType === type.id
                                ? "bg-[#313B2F] text-white border-[#313B2F]"
                                : "bg-white text-muted-foreground border-[#e5e7e4] hover:border-[#FBA002] hover:text-foreground"
                                }`}
                        >
                            <input
                                type="radio"
                                name="retirementType"
                                checked={retirementType === type.id}
                                onChange={() => setRetirementType(type.id as any)}
                                className="sr-only"
                            />
                            {type.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#e5e7e4] p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Average Monthly Earnings (Best 5 Years)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">NLe</span>
                            <Input
                                type="number"
                                placeholder="Average monthly salary"
                                value={avgEarnings}
                                onChange={(e) => setAvgEarnings(e.target.value)}
                                className="pl-12 h-11 border-[#e5e7e4] focus:border-[#FBA002] rounded-lg"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Average of your best 60 months (5 years) of insurable earnings
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Total Months Contributed</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                    <Clock className="w-4 h-4" />
                                </span>
                                <Input
                                    type="number"
                                    placeholder="Total months (e.g. 180)"
                                    value={monthsContributed}
                                    onChange={(e) => setMonthsContributed(e.target.value)}
                                    className="pl-10 h-11 border-[#e5e7e4] focus:border-[#FBA002] rounded-lg"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">
                                {yearsContributed.toFixed(1)} years (Min 15 years required)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Current Age</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                    <User className="w-4 h-4" />
                                </span>
                                <Input
                                    type="number"
                                    placeholder="Your age (e.g. 55)"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="pl-10 h-11 border-[#e5e7e4] focus:border-[#FBA002] rounded-lg"
                                />
                            </div>
                            {retirementType === "early" && (
                                <p className="text-xs text-[#B54A42] mt-1.5 font-medium">
                                    Required for Early Retirement calculation
                                </p>
                            )}
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
                        Calculate Pension
                    </Button>
                    <Button onClick={clearForm} size="lg" variant="outline" className="sm:w-32 h-12 rounded-xl border-[#e5e7e4]">
                        Clear
                    </Button>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="space-y-4 animate-fade-in-up">
                    {result.eligible ? (
                        <>
                            {/* Main Results Card */}
                            <div className="bg-[#313B2F] rounded-xl p-5 text-white">
                                <div className="text-white/60 text-sm mb-1">Estimated Monthly Pension</div>
                                <div className="text-3xl font-bold mb-4 text-[#FBA002]">{formatNLe(result.monthlyPension)}</div>

                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                                    <div>
                                        <div className="text-white/50 text-xs mb-0.5">Lump Sum Gratuity</div>
                                        <div className="text-white font-semibold text-lg">{formatNLe(result.gratuity)}</div>
                                        <div className="text-white/40 text-[10px]">(12 months pension)</div>
                                    </div>
                                    <div>
                                        <div className="text-white/50 text-xs mb-0.5">Pension Replacement Rate</div>
                                        <div className="text-white font-semibold text-lg">{(result.pensionRate * 100).toFixed(1)}%</div>
                                        <div className="text-white/40 text-[10px]">of average earnings</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#f8f9f7] border border-[#e5e7e4] rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
                                    <CheckCircle2 className="w-5 h-5" />
                                    You are eligible for pension
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Based on your {yearsContributed.toFixed(1)} years of service, you have qualified for a pension rate of {(result.pensionRate * 100).toFixed(1)}%.
                                </p>
                                <div className="text-xs bg-white p-3 rounded border border-[#e5e7e4]">
                                    <strong>Note:</strong> You can choose to take a reduced monthly pension to get a gratuity lump sum (12 months pension worth). The calculation above shows the standard gratuity option.
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-900">
                            <div className="flex items-center gap-2 mb-2 font-bold text-lg">
                                <AlertTriangle className="w-5 h-5" />
                                Not Yet Eligible
                            </div>
                            <p className="mb-3">{result.message}</p>
                            <p className="text-sm bg-white/50 p-3 rounded">
                                You need a minimum of <strong>180 months (15 years)</strong> of contributions for a full retirement pension.
                                If you have less, you may be eligible for a "Social Security Grant" (lump sum return of contributions with interest) instead.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Info Section */}
            <div className="bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-xl p-5 mt-4">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-[#FBA002]" />
                    Key Pension Facts
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FBA002] mt-1.5 shrink-0" />
                        <span><strong>Full Pension Age:</strong> 60 years old (must be retired)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FBA002] mt-1.5 shrink-0" />
                        <span><strong>Early Retirement:</strong> From age 55 (reduced pension)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FBA002] mt-1.5 shrink-0" />
                        <span><strong>Minimum Contribution:</strong> 180 months (15 years)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FBA002] mt-1.5 shrink-0" />
                        <span><strong>Pension Formula:</strong> 30% for first 15 years + 2% for every additional year (Max 80%)</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
