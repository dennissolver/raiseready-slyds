'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Calculator, TrendingUp, DollarSign, X } from 'lucide-react'

// SDG Valuation Data (from RealChange Impact Index)
const SDG_VALUATIONS = [
  {
    number: 1,
    name: "No Poverty",
    indicator: "Property tenure",
    unit: "household",
    defaultValue: 500,
    description: "Households with long-term property rights",
    maxUnits: 5000
  },
  {
    number: 2,
    name: "Zero Hunger",
    indicator: "Malnutrition reduction",
    unit: "per % reduction",
    defaultValue: 2000,
    description: "% reduction in malnutrition rates vs baseline",
    maxUnits: 100
  },
  {
    number: 3,
    name: "Good Health",
    indicator: "Preventable deaths",
    unit: "per death prevented",
    defaultValue: 400,
    description: "Preventable deaths under 5 years avoided",
    maxUnits: 1000
  },
  {
    number: 4,
    name: "Quality Education",
    indicator: "School enrollment",
    unit: "per child",
    defaultValue: 2000,
    description: "Additional children with access to quality education",
    maxUnits: 10000
  },
  {
    number: 5,
    name: "Gender Equality",
    indicator: "Women's rights",
    unit: "per % increase",
    defaultValue: 400,
    description: "% of women with property tenure above baseline",
    maxUnits: 100
  },
  {
    number: 6,
    name: "Clean Water",
    indicator: "Water access",
    unit: "per % increase",
    defaultValue: 400,
    description: "% with access to safe and affordable water",
    maxUnits: 100
  },
  {
    number: 7,
    name: "Clean Energy",
    indicator: "Energy access",
    unit: "per % increase",
    defaultValue: 100,
    description: "% with access to affordable, reliable clean energy",
    maxUnits: 100
  },
  {
    number: 8,
    name: "Economic Growth",
    indicator: "Employment",
    unit: "per % increase",
    defaultValue: 1000,
    description: "% with stable employment or small businesses",
    maxUnits: 100
  },
  {
    number: 9,
    name: "Infrastructure",
    indicator: "Small businesses",
    unit: "per business",
    defaultValue: 1000,
    description: "Beneficiaries in profitable self-employment",
    maxUnits: 1000
  },
  {
    number: 10,
    name: "Reduced Inequality",
    indicator: "Income growth",
    unit: "per % above average",
    defaultValue: 5000,
    description: "Income growth above national average",
    maxUnits: 50
  },
  {
    number: 11,
    name: "Sustainable Cities",
    indicator: "Adequate housing",
    unit: "per % increase",
    defaultValue: 500,
    description: "% with adequate, safe, affordable housing",
    maxUnits: 100
  },
  {
    number: 13,
    name: "Climate Action",
    indicator: "Policy change",
    unit: "per policy",
    defaultValue: 20000,
    description: "Government policy changes for climate planning",
    maxUnits: 50
  },
  {
    number: 15,
    name: "Life on Land",
    indicator: "Afforestation",
    unit: "per acre",
    defaultValue: 400,
    description: "Acres of avoided deforestation or afforestation",
    maxUnits: 10000
  }
]

interface SDGImpact {
  sdgNumber: number
  units: number
}

export function ImpactCalculator() {
  const [activeTab, setActiveTab] = useState<'founder' | 'investor'>('founder')

  return (
    <div className="w-full max-w-6xl mx-auto" id="calculator">
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8 text-purple-600" />
            <div>
              <CardTitle className="text-2xl">SDG Impact Returns Calculator</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Model your project's impact returns or investment thesis
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'founder' | 'investor')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="founder">For Founders</TabsTrigger>
              <TabsTrigger value="investor">For Investors</TabsTrigger>
            </TabsList>

            <TabsContent value="founder">
              <FounderCalculator />
            </TabsContent>

            <TabsContent value="investor">
              <InvestorCalculator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function FounderCalculator() {
  const [investment, setInvestment] = useState<number>(25000000)
  const [impactPercentage, setImpactPercentage] = useState<number>(25)
  const [financialReturn, setFinancialReturn] = useState<number>(6)
  const [projectYears, setProjectYears] = useState<number>(5)

  const [selectedSDGs, setSelectedSDGs] = useState<SDGImpact[]>([
    { sdgNumber: 1, units: 1000 },
    { sdgNumber: 4, units: 3000 },
    { sdgNumber: 6, units: 100 }
  ])

  const impactInvestment = investment * (impactPercentage / 100)
  const profitInvestment = investment * ((100 - impactPercentage) / 100)

  // Calculate impact value
  const totalImpactValue = selectedSDGs.reduce((total, sdg) => {
    const sdgData = SDG_VALUATIONS.find(s => s.number === sdg.sdgNumber)
    if (!sdgData) return total
    return total + (sdg.units * sdgData.defaultValue)
  }, 0)

  const impactReturnPct = impactInvestment > 0 ? (totalImpactValue / impactInvestment) * 100 : 0
  const impactReturnAnnual = impactReturnPct / projectYears
  const blendedReturn = financialReturn + impactReturnAnnual

  const addSDG = (sdgNumber: number) => {
    const sdgData = SDG_VALUATIONS.find(s => s.number === sdgNumber)
    if (!selectedSDGs.find(s => s.sdgNumber === sdgNumber) && sdgData) {
      setSelectedSDGs([...selectedSDGs, { sdgNumber, units: Math.min(100, sdgData.maxUnits / 10) }])
    }
  }

  const updateSDGUnits = (sdgNumber: number, units: number) => {
    setSelectedSDGs(selectedSDGs.map(sdg =>
      sdg.sdgNumber === sdgNumber ? { ...sdg, units } : sdg
    ))
  }

  const removeSDG = (sdgNumber: number) => {
    setSelectedSDGs(selectedSDGs.filter(sdg => sdg.sdgNumber !== sdgNumber))
  }

  return (
    <div className="space-y-6">
      {/* Investment Inputs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="investment">Total Investment (USD)</Label>
          <Input
            id="investment"
            type="number"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Total project investment needed
          </p>
        </div>

        <div>
          <Label htmlFor="years">Project Period (Years)</Label>
          <Input
            id="years"
            type="number"
            value={projectYears}
            onChange={(e) => setProjectYears(Number(e.target.value))}
            min={1}
            max={30}
            className="mt-1"
          />
        </div>
      </div>

      {/* Impact/Profit Split */}
      <div>
        <Label htmlFor="impact-split">
          Impact Investment: {impactPercentage}% (${(impactInvestment).toLocaleString()})
        </Label>
        <Slider
          id="impact-split"
          value={[impactPercentage]}
          onValueChange={(v) => setImpactPercentage(v[0])}
          min={10}
          max={90}
          step={5}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Profit: {100 - impactPercentage}% (${profitInvestment.toLocaleString()})</span>
        </div>
      </div>

      {/* Financial Return */}
      <div>
        <Label htmlFor="financial-return">
          Projected Financial Return: {financialReturn}% annually
        </Label>
        <Slider
          id="financial-return"
          value={[financialReturn]}
          onValueChange={(v) => setFinancialReturn(v[0])}
          min={0}
          max={20}
          step={0.5}
          className="mt-2"
        />
      </div>

      {/* SDG Selection */}
      <div>
        <Label className="mb-2 block">Select Your SDG Impact Areas</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
          {SDG_VALUATIONS.map(sdg => (
            <Button
              key={sdg.number}
              variant={selectedSDGs.find(s => s.sdgNumber === sdg.number) ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (selectedSDGs.find(s => s.sdgNumber === sdg.number)) {
                  removeSDG(sdg.number)
                } else {
                  addSDG(sdg.number)
                }
              }}
              className="h-12"
            >
              <div className="text-center">
                <div className="font-bold">SDG {sdg.number}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Selected SDGs Configuration */}
        {selectedSDGs.length > 0 && (
          <div className="space-y-3">
            {selectedSDGs.map(sdg => {
              const sdgData = SDG_VALUATIONS.find(s => s.number === sdg.sdgNumber)
              if (!sdgData) return null
              const impactValue = sdg.units * sdgData.defaultValue

              return (
                <Card key={sdg.sdgNumber} className="bg-slate-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm">SDG {sdg.sdgNumber}: {sdgData.name}</div>
                        <div className="text-xs text-muted-foreground">{sdgData.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSDG(sdg.sdgNumber)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor={`sdg-${sdg.sdgNumber}`} className="text-xs">
                          Units: {sdg.units.toLocaleString()} {sdgData.unit}
                        </Label>
                        <Slider
                          id={`sdg-${sdg.sdgNumber}`}
                          value={[sdg.units]}
                          onValueChange={(v) => updateSDGUnits(sdg.sdgNumber, v[0])}
                          min={1}
                          max={sdgData.maxUnits}
                          step={sdgData.maxUnits > 1000 ? 100 : sdgData.maxUnits > 100 ? 10 : 1}
                          className="mt-1"
                        />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Impact Value</div>
                        <div className="font-bold text-green-600">${impactValue.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Results */}
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Projected Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Financial Return</div>
              <div className="text-3xl font-bold text-blue-600">{financialReturn.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Annual cash IRR</div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Impact Return</div>
              <div className="text-3xl font-bold text-green-600">{impactReturnAnnual.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">
                ${totalImpactValue.toLocaleString()} impact value
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-300">
              <div className="text-sm text-muted-foreground mb-1">Total Blended Return</div>
              <div className="text-3xl font-bold text-purple-600">{blendedReturn.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Annual combined return</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg">
            <div className="text-sm font-semibold mb-2">Summary:</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Total Investment: ${investment.toLocaleString()} over {projectYears} years</li>
              <li>• Impact Investment: ${impactInvestment.toLocaleString()} creates ${totalImpactValue.toLocaleString()} in social value</li>
              <li>• Impact ROI: {impactReturnPct.toFixed(0)}% total ({impactReturnAnnual.toFixed(1)}% annually)</li>
              <li>• This positions you competitively for investors seeking {blendedReturn.toFixed(0)}%+ blended returns</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg" className="gap-2">
          <DollarSign className="w-5 h-5" />
          Save This Projection to My Profile
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Sign up to save your calculations and match with investors
        </p>
      </div>
    </div>
  )
}

function InvestorCalculator() {
  const [targetFinancial, setTargetFinancial] = useState<number>(8)
  const [targetImpact, setTargetImpact] = useState<number>(4)
  const [prioritySDGs, setPrioritySDGs] = useState<number[]>([1, 4, 6, 11])

  const totalTarget = targetFinancial + targetImpact

  const toggleSDG = (sdgNumber: number) => {
    if (prioritySDGs.includes(sdgNumber)) {
      setPrioritySDGs(prioritySDGs.filter(n => n !== sdgNumber))
    } else {
      if (prioritySDGs.length < 5) {
        setPrioritySDGs([...prioritySDGs, sdgNumber])
      }
    }
  }

  // Calculate required project profile
  const exampleInvestment = 25000000
  const exampleImpactInvestment = exampleInvestment * 0.25
  const requiredImpactValue = exampleImpactInvestment * (targetImpact / 100) * 5

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          Define your investment thesis by setting your target returns and priority SDGs.
          We'll show you what kind of projects match your criteria.
        </p>
      </div>

      {/* Return Targets */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="target-financial">
            Target Financial Return: {targetFinancial}% annually
          </Label>
          <Slider
            id="target-financial"
            value={[targetFinancial]}
            onValueChange={(v) => setTargetFinancial(v[0])}
            min={0}
            max={20}
            step={0.5}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum cash IRR you require
          </p>
        </div>

        <div>
          <Label htmlFor="target-impact">
            Minimum Impact Return: {targetImpact}% annually (equivalent)
          </Label>
          <Slider
            id="target-impact"
            value={[targetImpact]}
            onValueChange={(v) => setTargetImpact(v[0])}
            min={0}
            max={40}
            step={0.5}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum social/environmental value creation (in $ equivalent)
          </p>
        </div>
      </div>

      {/* Total Target */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Your Total Target Return</div>
            <div className="text-4xl font-bold text-purple-600 mb-2">{totalTarget.toFixed(1)}%</div>
            <div className="text-sm">
              {targetFinancial}% financial + {targetImpact}% impact equivalent
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority SDGs */}
      <div>
        <Label className="mb-2 block">Select Your Priority SDGs (up to 5)</Label>
        <p className="text-xs text-muted-foreground mb-3">
          Projects aligned with these SDGs will rank higher in your matches
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {SDG_VALUATIONS.map(sdg => (
            <Button
              key={sdg.number}
              variant={prioritySDGs.includes(sdg.number) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSDG(sdg.number)}
              disabled={!prioritySDGs.includes(sdg.number) && prioritySDGs.length >= 5}
              className="h-12"
            >
              <div className="text-center">
                <div className="font-bold">SDG {sdg.number}</div>
              </div>
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {prioritySDGs.length}/5 SDGs selected
        </p>
      </div>

      {/* Required Project Profile */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Example: What Projects Match Your Criteria?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">For a $25M investment project:</div>
              <ul className="text-sm space-y-2">
                <li className="flex justify-between">
                  <span>Required financial return:</span>
                  <span className="font-bold text-blue-600">{targetFinancial}% annually</span>
                </li>
                <li className="flex justify-between">
                  <span>Required impact value over 5 years:</span>
                  <span className="font-bold text-green-600">${requiredImpactValue.toLocaleString()}</span>
                </li>
                <li className="flex justify-between">
                  <span>Total blended return:</span>
                  <span className="font-bold text-purple-600">{totalTarget}% annually</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm font-semibold mb-2">Your Priority SDGs:</div>
              {prioritySDGs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {prioritySDGs.map(sdgNum => {
                    const sdg = SDG_VALUATIONS.find(s => s.number === sdgNum)
                    return sdg ? (
                      <div key={sdgNum} className="bg-purple-100 px-3 py-1 rounded-full text-xs font-medium">
                        SDG {sdg.number}: {sdg.name}
                      </div>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select SDGs above to see your priorities</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>💡 Matching Logic:</strong> Projects with strong alignment to your priority SDGs
                and delivering {totalTarget}%+ blended returns will appear as "Strong Matches" in your dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg" className="gap-2">
          <DollarSign className="w-5 h-5" />
          Save This Thesis to My Profile
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Sign up to save your investment criteria and see matched founders
        </p>
      </div>
    </div>
  )
}