"use client"

import { TaxCalculatorPlatform } from "@/components/tax-calculator-platform"
import {
  BookOpen, Scale, Shield, ExternalLink, Calculator, TrendingUp, Users, FileText,
  CheckCircle2, ArrowRight, Building2, Landmark, Truck,
  Home, Clock, AlertTriangle, GraduationCap, ChevronDown, ChevronUp
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function TaxCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main>
        {/* Trust Indicators */}
        <TrustBanner />

        {/* Calculator Platform */}
        <section id="calculators" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="badge-accent mb-3 inline-block">7+ Tax Calculators</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Calculate Your Taxes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Based on the Income Tax Act 2000 and Finance Acts 2024-2025.
              </p>
            </div>
            <TaxCalculatorPlatform />
          </div>
        </section>

        {/* ===== NEW: Learn About Taxes Section ===== */}
        <LearnAboutTaxesSection />

        {/* Know Your Rights Section */}
        <KnowYourRightsSection />

        {/* Penalties Warning */}
        <PenaltiesSection />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  return (
    <header className="relative min-h-[75vh] flex items-center overflow-hidden gradient-hero">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#FBA002]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FBA002] text-[#313B2F] rounded-full px-4 py-2 mb-8 font-semibold text-sm">
            <GraduationCap className="w-4 h-4" />
            <span>Updated for 2025 • Finance Act Compliant</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Sierra Leone <br />
            <span className="text-[#FBA002]">Tax Guide</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
            Know your rights. Calculate accurately.
            Protect yourself from being cheated.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-[#FBA002] text-[#313B2F] hover:bg-[#FCBC4D] font-semibold px-8 py-6 text-lg rounded-xl shadow-lg"
              onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Start Calculating
            </Button>
            <Button
              size="lg"
              className="bg-white text-[#313B2F] hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg"
              onClick={() => document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Learn About Taxes
            </Button>
          </div>

          {/* Legal References */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#FBA002]" />
              <span className="text-white/80 text-sm">Income Tax Act 2000</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#FBA002]" />
              <span className="text-white/80 text-sm">Finance Acts 2024/2025</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// ============================================
// TRUST BANNER
// ============================================
function TrustBanner() {
  return (
    <section className="relative -mt-6 z-10">
      <div className="container mx-auto px-4">
        <div className="glass-strong rounded-2xl shadow-elevated p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <TrustItem
              icon={<Shield className="w-5 h-5" />}
              title="100% Accurate"
              subtitle="Based on official legislation"
            />
            <TrustItem
              icon={<Landmark className="w-5 h-5" />}
              title="NRA Compliant"
              subtitle="Official tax rates"
            />
            <TrustItem
              icon={<Users className="w-5 h-5" />}
              title="Free Forever"
              subtitle="No registration required"
            />
            <TrustItem
              icon={<Clock className="w-5 h-5" />}
              title="Always Updated"
              subtitle="Latest Finance Acts"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustItem({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#313B2F] flex items-center justify-center text-[#FBA002]">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  )
}

// ============================================
// LEARN ABOUT TAXES SECTION (NEW)
// ============================================
function LearnAboutTaxesSection() {
  const taxTopics = [
    {
      id: "paye",
      title: "PAYE (Pay As You Earn)",
      icon: <TrendingUp className="w-5 h-5" />,
      summary: "Income tax deducted from employee salaries by employers.",
      content: `
**What is PAYE?**
Pay As You Earn (PAYE) is the system used to collect income tax from employees in Sierra Leone. Your employer deducts tax from your salary before paying you.

**How is it calculated?**
• First NLe 600 per month: 0% (Tax-free)
• Next NLe 600 (NLe 601 - 1,200): 15%
• Next NLe 600 (NLe 1,201 - 1,800): 20%
• Next NLe 600 (NLe 1,801 - 2,400): 25%
• Above NLe 2,400: 30%

**Key Points:**
• NASSIT (5%) is deducted from basic salary ONLY, not allowances
• First NLe 500 of total allowances is tax-free
• Leave allowance is taxed separately at 25%
• Non-residents pay a flat 25% on all income

**Legal Basis:** Income Tax Act 2000, First Schedule
      `
    },
    {
      id: "nassit",
      title: "NASSIT Contributions",
      icon: <Users className="w-5 h-5" />,
      summary: "National Social Security and Insurance Trust pension contributions.",
      content: `
**What is NASSIT?**
The National Social Security and Insurance Trust (NASSIT) provides social security benefits. Registration is mandatory for all employers and employees.

**Contribution Rates:**
• Employee: 5% of basic salary
• Employer: 10% of basic salary
• Self-Employed: 15% of declared income
• Govt Employees (Past Service): +2.5%
• Military/Police (Early Retirement): +2%

**Benefits:**
• Retirement Pension: Age 60+ (Min 180 months contributions)
• Invalidity Pension: Permanent incapacity
• Survivors Benefits: For dependents
• Gratuity: 12 months of initial pension as lump sum

**Legal Basis:** NASSIT Act 2001
      `
    },
    {
      id: "gst",
      title: "GST (Goods & Services Tax)",
      icon: <Building2 className="w-5 h-5" />,
      summary: "15% tax on the supply of goods and services.",
      content: `
**What is GST?**
Goods and Services Tax is a 15% consumption tax charged on most goods and services in Sierra Leone.

**Who Must Register?**
Businesses with annual turnover above NLe 500,000 must register for GST (Updated from NLe 100,000 in Finance Act 2024).

**GST-Exempt Items (0%):**
• Rice and wheat flour
• Baby food and infant formula
• Medical services and medicines
• Educational services
• Petrol, diesel, and kerosene
• Financial services
• Water (unpackaged)
• Agricultural inputs
• Solar equipment
• Public passenger transport

**Your Rights:**
• GST should be clearly shown on receipts
• You can report businesses not issuing proper receipts to NRA
• GST returns must be filed within 21 days after each tax period

**Legal Basis:** Goods and Services Tax Act 2009
      `
    },
    {
      id: "wht",
      title: "Withholding Tax (WHT)",
      icon: <FileText className="w-5 h-5" />,
      summary: "Tax deducted at source from various payments.",
      content: `
**What is Withholding Tax?**
WHT is tax deducted at source from payments to contractors and professionals. Remit to NRA within 30 days.

**Payment Type | Resident | Non-Resident**
• Contractors: 5.5% | 10.5% (incl. 0.5% healthcare)
• Professional Services: 10% | 10%
• Dividends: 15% | 15%
• Interest: 15% | 15%
• Rent: 10% | 10%
• Royalties: 25% | 25%
• Management Fees: 10% | 10%

**Note:** Contractor 5.5% rate includes 5% WHT + 0.5% Healthcare levy.

**Legal Basis:** Section 117, Income Tax Act 2000
      `
    },
    {
      id: "rent",
      title: "Rent Tax",
      icon: <Home className="w-5 h-5" />,
      summary: "10% tax on rental income from properties.",
      content: `
**What is Rent Tax?**
Rent tax is 10% withheld by tenants from rent payments made to landlords.

**Key Rules:**
• Rate: 10% on taxable rental income
• Threshold: NLe 7,200 per year is tax-free (Exempt)
• Wear & Tear: 10% deduction from taxable base

**Calculation Example:**
1. gross Rent
2. Less: Threshold (NLe 7,200)
3. Less: 10% Wear & Tear on balance
4. Apply 10% Tax on remainder

**Legal Basis:** Section 120, Income Tax Act 2000
      `
    },
    {
      id: "cgt",
      title: "Capital Gains Tax (CGT)",
      icon: <TrendingUp className="w-5 h-5" />,
      summary: "25% tax on gains from selling assets like property.",
      content: `
**What is Capital Gains Tax?**
CGT is charged at 25% on the profit (gain) made when you sell a chargeable asset like land, buildings, or shares.

**Important: Tax is on GAINS only, not the selling price!**

**Calculation:**
1. Selling Price
2. Less: Cost Base (purchase price + all costs)
3. = Gross Gain
4. Less: Exemption (First NLe 3,600 per transaction)
5. = Taxable Gain
6. CGT = Taxable Gain × 25%

**What Reduces Your Gain:**
• Original purchase price
• Legal fees (buying and selling)
• Agency/broker fees
• Construction costs
• Development costs
• Any improvement costs

**Your Rights:**
• Keep all receipts and documents
• The buyer deducts and remits CGT
• Request the calculation breakdown
• CGT must be filed within 30 days of sale

**Legal Basis:** Sections 57-61B, Income Tax Act 2000
      `
    },
    {
      id: "import",
      title: "Import Taxes",
      icon: <Truck className="w-5 h-5" />,
      summary: "Customs duties and taxes on imported goods.",
      content: `
**What are Import Taxes?**
When you import goods into Sierra Leone, you pay several types of taxes based on the CIF value (Cost + Insurance + Freight).

**Types of Import Taxes:**
1. **Import Duty** - Varies by HS Code (0% to 40%)
2. **Import Withholding Tax** - 5% on CIF
3. **ECOWAS Levy** - 0.5% on CIF
4. **Import GST** - 15% (on CIF + Duty + Excise)
5. **Excise Duty** - On alcohol, tobacco, vehicles (varies)

**Calculation Order:**
1. CIF = Cost + Insurance + Freight
2. Import Duty = CIF × HS Code Rate
3. Excise Duty = (CIF + Import Duty) × Excise Rate
4. Import WHT = CIF × 5%
5. ECOWAS Levy = CIF × 0.5%
6. Import GST = (CIF + Import Duty + Excise) × 15%

**Your Rights:**
• Request a detailed customs assessment
• Import WHT is creditable against your income tax
• ECOWAS goods may qualify for reduced rates
• Some items are GST-exempt

**Legal Basis:** Customs Tariff Act 1978, Section 114 Income Tax Act 2000
      `
    },
    {
      id: "business",
      title: "Corporate & Business Tax",
      icon: <Building2 className="w-5 h-5" />,
      summary: "Tax obligations for businesses based on turnover.",
      content: `
**Business Categories (Finance Act 2025):**
• **Micro** (Turnover < NLe 10,000): TAX EXEMPT
• **Small** (NLe 10,000 - 500,000): 3% Turnover Tax OR Normal Rates
• **Medium** (NLe 500,000 - 6,000,000): Normal Corporate Rates
• **Large** (> NLe 6,000,000): Normal Corporate Rates

**Tax Rates:**
• Standard Corporate Rate: 25%
• Manufacturing (outside Western Area): 15%
• Minimum Alternate Tax: 2% of turnover

**Penalties:**
• Late Payment (within 30 days): 10%
• Late Payment (after 90 days): 25%
• Incorrect Return: 25% of difference
      `
    },
  ]

  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  return (
    <section id="learn" className="py-16 md:py-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FBA002] text-[#313B2F] rounded-full px-4 py-2 mb-4 font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm">Tax Education</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Learn About Taxes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Understanding how taxes work in Sierra Leone will help you protect yourself and make informed decisions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {taxTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-xl border border-[#e5e7e4] overflow-hidden shadow-soft"
            >
              <button
                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#f8f9f7] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#313B2F] flex items-center justify-center text-[#FBA002] shrink-0">
                  {topic.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-lg">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.summary}</p>
                </div>
                {expandedTopic === topic.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>

              {expandedTopic === topic.id && (
                <div className="px-5 pb-5 animate-fade-in">
                  <div className="pt-4 border-t border-[#e5e7e4]">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {topic.content.split('\n').map((line, idx) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <h4 key={idx} className="font-semibold text-foreground mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>
                        }
                        if (line.startsWith('•')) {
                          return <p key={idx} className="ml-4 mb-1">{line}</p>
                        }
                        if (line.startsWith('|')) {
                          return null // Skip table lines for now
                        }
                        if (line.trim() === '') {
                          return <br key={idx} />
                        }
                        return <p key={idx} className="mb-2">{line}</p>
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#313B2F] rounded-2xl text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Need More Information?</h3>
              <p className="text-white/70 text-sm">
                Visit the official National Revenue Authority website for detailed tax guides, forms, and the latest updates.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#FBA002] text-[#313B2F] hover:bg-[#FCBC4D] font-semibold px-6"
            >
              <Link href="https://nra.gov.sl" target="_blank" rel="noopener noreferrer">
                Visit NRA Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// KNOW YOUR RIGHTS SECTION
// ============================================
function KnowYourRightsSection() {
  const rightsCards = [
    {
      title: "For Employees",
      icon: <Users className="w-5 h-5" />,
      items: [
        "NASSIT (5%) is deducted from Basic Salary ONLY",
        "First NLe 500 of allowances is tax-free",
        "Request payslip showing all deductions",
        "Verify NASSIT contributions on your statement",
      ]
    },
    {
      title: "For Landlords",
      icon: <Home className="w-5 h-5" />,
      items: [
        "NLe 7,200 annual threshold (tax-free)",
        "10% wear & tear deduction applies",
        "Rent tax is 10% on taxable rent only",
        "Request WHT certificate from tenants",
      ]
    },
    {
      title: "For Property Sellers",
      icon: <Building2 className="w-5 h-5" />,
      items: [
        "CGT is 25% on GAINS only, not selling price",
        "First NLe 3,600 of gains is exempt",
        "All costs reduce your taxable gain",
        "Keep receipts for all expenses",
      ]
    },
    {
      title: "For Importers",
      icon: <Truck className="w-5 h-5" />,
      items: [
        "Taxes based on CIF value",
        "Know your HS Code duty rate (0-40%)",
        "Import WHT (5%) is creditable",
        "Request detailed customs assessment",
      ]
    },
  ]

  return (
    <section className="py-16 md:py-20 gradient-mesh">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#313B2F] text-white rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-[#FBA002]" />
            <span className="text-sm font-semibold">Consumer Protection</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Know Your Rights
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Don't get cheated. Understanding your tax obligations is your first line of defense.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {rightsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border border-[#e5e7e4] hover-lift"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#313B2F] flex items-center justify-center text-[#FBA002]">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-foreground">{card.title}</h3>
              </div>
              <ul className="space-y-2">
                {card.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 fshrink-0 text-[#FBA002]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// PENALTIES SECTION
// ============================================
function PenaltiesSection() {
  const penalties = [
    { period: "Within 30 days", penalty: "10%", description: "Initial penalty" },
    { period: "31-90 days", penalty: "15%", description: "Extended delay" },
    { period: "After 90 days", penalty: "25%", description: "Severe penalty" },
    { period: "Incorrect Return", penalty: "25%", description: "Of difference owed" },
  ]

  return (
    <section className="py-16 md:py-20 bg-[#FFFAF0]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-elevated p-8 md:p-10 border border-[#f0e6dc]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#B54A42] rounded-xl flex items-center justify-center text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Late Payment Penalties</h2>
                <p className="text-muted-foreground">Avoid these by paying on time</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {penalties.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#FFF8F0] rounded-xl p-4 text-center border border-[#f0e6dc]"
                >
                  <div className="text-sm text-muted-foreground mb-1">{item.period}</div>
                  <div className="text-3xl font-bold text-[#B54A42] mb-1">{item.penalty}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#FBA002]/10 border border-[#FBA002]/30 rounded-lg">
              <p className="text-sm text-[#7a5a00] text-center">
                <strong>Tip:</strong> Set calendar reminders for tax deadlines. PAYE and NASSIT are due by the 15th of the following month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
  return (
    <section className="py-16 md:py-20 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Calculate Your Taxes?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Free, accurate, and always up-to-date with Sierra Leone tax laws.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#FBA002] text-[#313B2F] hover:bg-[#FCBC4D] font-semibold px-8 py-6 text-lg rounded-xl"
              onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Start Calculating Free
            </Button>
            <Button
              size="lg"
              className="bg-white text-[#313B2F] hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg"
              asChild
            >
              <Link href="https://nra.gov.sl" target="_blank" rel="noopener noreferrer">
                Visit NRA Website
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="bg-[#232B21] text-slate-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-[#FBA002] rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#313B2F]" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Sierra Leone Tax Guide</div>
                <div className="text-sm text-slate-400">Know Your Rights</div>
              </div>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Free tax calculators and educational resources to help Sierra Leoneans
              understand and calculate their taxes accurately.
            </p>
            <div className="flex gap-3">
              <span className="badge-primary bg-[#FBA002]/20 text-[#FBA002]">Finance Act 2024</span>
              <span className="badge-accent bg-white/10 text-slate-300">Finance Act 2025</span>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="https://nra.gov.sl" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#FBA002] transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  National Revenue Authority
                </Link>
              </li>
              <li>
                <Link href="https://nassit.org.sl" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#FBA002] transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  NASSIT
                </Link>
              </li>
              <li>
                <Link href="https://mof.gov.sl" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#FBA002] transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Ministry of Finance
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal Basis</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#FBA002]" />
                Income Tax Act 2000
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FBA002]" />
                Finance Act 2024
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FBA002]" />
                Finance Act 2025
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FBA002]" />
                NASSIT Act 2001
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3a423a]">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} Sierra Leone Tax Guide. For educational purposes only.
            </p>
            <p className="text-sm text-slate-500">
              Last Updated: January 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
