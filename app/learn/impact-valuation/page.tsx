'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlayCircle, Calculator, BookOpen, Target, TrendingUp, Users } from 'lucide-react'

export default function ImpactValuationHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Understanding Impact Returns
            </h1>
            <p className="text-xl mb-8 opacity-90">
              How RaiseReady Impact quantifies social and environmental value in US$ equivalents
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" className="gap-2">
                <PlayCircle className="w-5 h-5" />
                Watch Overview (3 min)
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-white border-white hover:bg-white/20">
                <Calculator className="w-5 h-5" />
                Try the Calculator
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Problem */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">The Problem We're Solving</h2>
              <p className="text-xl text-muted-foreground">
                Impact investors face an impossible comparison
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-700">Traditional Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "I have two opportunities:"
                  </p>
                  <ul className="space-y-2">
                    <li>🏢 <strong>Project A:</strong> 12% financial return, zero impact</li>
                    <li>🌍 <strong>Project B:</strong> 6% financial return, improves 10,000 lives</li>
                  </ul>
                  <p className="mt-4 text-red-700 font-semibold">
                    Which is better? There's no objective way to compare.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-700">RaiseReady Impact Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "Let me quantify both returns:"
                  </p>
                  <ul className="space-y-2">
                    <li>🏢 <strong>Project A:</strong> 12% total return</li>
                    <li>🌍 <strong>Project B:</strong> 6% financial + 8% impact = 14% total return</li>
                  </ul>
                  <p className="mt-4 text-green-700 font-semibold">
                    Now we can compare apples to apples.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Video Placeholder */}
            <Card className="bg-slate-100">
              <CardContent className="p-8">
                <div className="aspect-video bg-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-20 h-20 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-semibold">Video: "Why Impact Investing Needs Better Metrics"</p>
                    <p className="text-sm text-slate-500">(2 minutes)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 2: The Framework */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">The RealChange Impact SDG Valuation Framework</h2>
              <p className="text-xl text-muted-foreground">
                A transparent methodology for valuing social and environmental impact
              </p>
            </div>

            {/* Core Concept */}
            <Card className="mb-8 border-2 border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-2xl">The Core Formula</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center p-8 bg-white rounded-lg border-2 border-purple-300">
                  <div className="text-3xl font-bold mb-4">
                    Total Return = Financial Return + Impact Return
                  </div>
                  <div className="text-xl text-muted-foreground mb-6">
                    (Both measured in % or US$ equivalent)
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-left">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Financial Return</div>
                      <div className="text-2xl font-bold text-blue-600">6%</div>
                      <div className="text-sm">Cash IRR</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Impact Return</div>
                      <div className="text-2xl font-bold text-green-600">5%</div>
                      <div className="text-sm">USD equivalent</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Total Return</div>
                      <div className="text-2xl font-bold text-purple-600">11%</div>
                      <div className="text-sm">Blended</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why This Matters */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Apples to Apples</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compare impact opportunities using the same metrics as traditional investments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Articulate Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Founders can demonstrate true value creation beyond just financial returns
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Better Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Investors make informed choices aligned with both financial and impact goals
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Framework Attribution */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <p className="text-sm">
                  <strong>Framework Attribution:</strong> The RealChange Impact SDG Valuation Index was developed by Dennis McMahon
                  and has been refined over 9 years of real-world impact project development. This proprietary methodology
                  provides transparent, measurable valuations for all 17 UN Sustainable Development Goals.
                </p>
              </CardContent>
            </Card>

            {/* Video Placeholder */}
            <Card className="mt-8 bg-slate-100">
              <CardContent className="p-8">
                <div className="aspect-video bg-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-20 h-20 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-semibold">Video: "The Framework Explained"</p>
                    <p className="text-sm text-slate-500">(4 minutes)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: SDG Valuations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <TrendingUp className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">How Each SDG Is Valued</h2>
              <p className="text-xl text-muted-foreground">
                Transparent valuations for all 17 Sustainable Development Goals
              </p>
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All SDGs</TabsTrigger>
                <TabsTrigger value="social">Social (1-5)</TabsTrigger>
                <TabsTrigger value="environment">Environment (6-15)</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <SDGAccordion />
              </TabsContent>

              <TabsContent value="social">
                <SDGAccordion filter="social" />
              </TabsContent>

              <TabsContent value="environment">
                <SDGAccordion filter="environment" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Section 4: Real Example */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Users className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">Real Example: Ghana Accra 001</h2>
              <p className="text-xl text-muted-foreground">
                Waste-to-Energy + Affordable Housing Project
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardTitle>The Project Structure</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Investment</h4>
                    <ul className="space-y-2 text-sm">
                      <li>💰 <strong>Total Bond:</strong> $100M</li>
                      <li>🏘️ <strong>Impact Portion:</strong> $25M (1,000 homes)</li>
                      <li>⚡ <strong>Profit Portion:</strong> $75M (waste-to-energy plant)</li>
                      <li>📅 <strong>Term:</strong> 5 years</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Financial Returns</h4>
                    <ul className="space-y-2 text-sm">
                      <li>💵 <strong>Waste plant revenue:</strong> Clean energy sales to grid</li>
                      <li>📊 <strong>Projected IRR:</strong> 6% annually</li>
                      <li>💸 <strong>Total revenue:</strong> $37.5M over 5 years</li>
                      <li>✅ <strong>Status:</strong> Gov't offtake agreement secured</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Calculation Table */}
            <Card className="mb-8">
              <CardHeader className="bg-green-50">
                <CardTitle>Impact Returns Calculation</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left py-2">SDG</th>
                        <th className="text-left py-2">Metric</th>
                        <th className="text-right py-2">Units</th>
                        <th className="text-right py-2">Value/Unit</th>
                        <th className="text-right py-2">Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">SDG 1</td>
                        <td className="py-2">Property tenure</td>
                        <td className="text-right">1,000</td>
                        <td className="text-right">$500</td>
                        <td className="text-right font-semibold">$500,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">SDG 4</td>
                        <td className="py-2">Children in school</td>
                        <td className="text-right">3,000</td>
                        <td className="text-right">$2,000</td>
                        <td className="text-right font-semibold">$6,000,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">SDG 6</td>
                        <td className="py-2">Water access (5,000 people)</td>
                        <td className="text-right">100%</td>
                        <td className="text-right">$100,000</td>
                        <td className="text-right font-semibold">$10,000,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">SDG 7</td>
                        <td className="py-2">Clean energy access</td>
                        <td className="text-right">100%</td>
                        <td className="text-right">$50,000</td>
                        <td className="text-right font-semibold">$2,500,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">SDG 11</td>
                        <td className="py-2">Adequate housing</td>
                        <td className="text-right">100%</td>
                        <td className="text-right">$250,000</td>
                        <td className="text-right font-semibold">$12,500,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2" colSpan={4}>Other SDGs (3, 5, 8, 10, etc.)</td>
                        <td className="text-right font-semibold">$10,690,000</td>
                      </tr>
                      <tr className="bg-green-50 font-bold">
                        <td className="py-3" colSpan={4}>TOTAL IMPACT VALUE</td>
                        <td className="text-right text-green-700 text-lg">$42,190,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* The Math */}
            <Card className="mb-8 border-2 border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-2xl">The Blended Return Calculation</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Financial Returns</div>
                      <div className="space-y-1 text-sm">
                        <div>Investment: $100M</div>
                        <div>Revenue: $37.5M</div>
                        <div>Return: $37.5M / $100M = 37.5% over 5 years</div>
                        <div className="font-bold text-blue-700 text-lg mt-2">Annual: 6.0%</div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Impact Returns</div>
                      <div className="space-y-1 text-sm">
                        <div>Impact Investment: $25M</div>
                        <div>Impact Value Created: $42.19M</div>
                        <div>Return: $42.19M / $25M = 168.76% over 5 years</div>
                        <div className="font-bold text-green-700 text-lg mt-2">Annual: 33.75%</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-100 p-6 rounded-lg text-center border-2 border-purple-300">
                    <div className="text-sm text-muted-foreground mb-2">TOTAL BLENDED RETURN</div>
                    <div className="text-4xl font-bold text-purple-700 mb-2">39.75% Annual</div>
                    <div className="text-sm">6% Financial + 33.75% Impact Equivalent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Element Placeholder */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Calculator className="w-12 h-12 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Try It Yourself</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Adjust the variables and see how returns change in real-time
                    </p>
                    <Button variant="outline" className="gap-2">
                      <Calculator className="w-4 h-4" />
                      Open Interactive Calculator
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Placeholder */}
            <Card className="mt-8 bg-slate-100">
              <CardContent className="p-8">
                <div className="aspect-video bg-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-20 h-20 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-semibold">Video: "Walking Through a Real Project"</p>
                    <p className="text-sm text-slate-500">(6 minutes)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 5: How RaiseReady Uses This */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              How RaiseReady Impact Uses This Framework
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader className="bg-blue-50">
                  <CardTitle>For Investors</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <span>Define your target blended return (financial + impact)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <span>Set minimum thresholds for each component</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <span>See matches: "This project delivers 6% financial + 8% impact = 14% total"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">4.</span>
                      <span>Filter by: "Show projects with &gt;12% blended return"</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-green-50">
                  <CardTitle>For Founders</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">1.</span>
                      <span>Input your SDG impact projections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">2.</span>
                      <span>See how your impact translates to value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">3.</span>
                      <span>AI coach suggests: "Adding water access could increase impact return by 5%"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">4.</span>
                      <span>Match with investors who value YOUR impact areas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Transparency & Flexibility</h4>
                <ul className="space-y-2 text-sm">
                  <li>✓ All calculations shown to both parties</li>
                  <li>✓ Founders can challenge/adjust SDG metrics with justification</li>
                  <li>✓ Investors can input custom SDG values if they prefer different valuations</li>
                  <li>✓ Everything is transparent and auditable</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Section 6: Calculator Teaser */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Calculator className="w-20 h-20 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">
              Ready to Calculate Your Impact Returns?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Use our interactive calculator to test scenarios and understand your potential returns
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/learn/impact-calculator">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Calculator className="w-5 h-5" />
                  Try the Calculator
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="gap-2 text-white border-white hover:bg-white/20">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Section 7: FAQs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>Who created this valuation framework?</AccordionTrigger>
                <AccordionContent>
                  Dennis McMahon developed the RealChange Impact SDG Valuation Index over 9 years of real-world
                  impact project development. The framework has been refined through actual project implementations
                  including housing, waste-to-energy, and agricultural projects across Africa and Asia.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Can I use my own SDG values?</AccordionTrigger>
                <AccordionContent>
                  Yes! While the platform provides default valuations based on research and real-world costs,
                  investors can input custom values based on their own impact thesis. All calculations remain
                  transparent so founders can see how their impact is being valued.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What if my project doesn't fit the SDGs neatly?</AccordionTrigger>
                <AccordionContent>
                  Our AI coach helps you map your impact to the UN SDG framework. Most social and environmental
                  impacts can be categorized under one or more of the 17 SDGs. If you have unique impact metrics,
                  you can add custom measurements with justification.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Is this the only way to measure impact?</AccordionTrigger>
                <AccordionContent>
                  No. This framework provides a common language for comparing opportunities, but it's not the only
                  methodology. You can also track IRIS+ metrics, B Corp scores, or your own custom KPIs. The advantage
                  of this framework is that it enables direct comparison by translating impact into financial equivalents.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How accurate are these valuations?</AccordionTrigger>
                <AccordionContent>
                  The valuations are based on conservative estimates using multiple sources: cost of alternative
                  solutions, willingness-to-pay studies, social value research, and real project data. They're
                  designed to be defensible, transparent, and adjustable. Think of them as starting points for
                  informed discussion rather than absolute truths.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Do investors actually think this way?</AccordionTrigger>
                <AccordionContent>
                  Leading impact investors increasingly need frameworks like this to articulate their strategy,
                  compare opportunities, and report to stakeholders. Family offices, impact funds, and ESG-focused
                  institutions are hungry for better impact measurement. This framework gives them a tool to make
                  those decisions rigorously.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6">
            Join impact founders and investors using RaiseReady Impact
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup/founder">
              <Button size="lg">I'm a Founder</Button>
            </Link>
            <Link href="/signup/investor">
              <Button size="lg" variant="outline">I'm an Investor</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// SDG Accordion Component
function SDGAccordion({ filter }: { filter?: 'social' | 'environment' }) {
  const sdgs = [
    {
      number: 1,
      name: "No Poverty",
      category: "social",
      indicator: "Property tenure",
      measure: "Number of households with long-term property rights",
      unit: "Household",
      value: 500,
      example: "1,000 homes × $500 = $500,000 impact value",
      why: "Based on the economic value of secure housing tenure, including increased access to credit, reduced vulnerability, and long-term wealth building."
    },
    {
      number: 4,
      name: "Quality Education",
      category: "social",
      indicator: "School enrollment",
      measure: "Additional children with access to quality education",
      unit: "Per child",
      value: 2000,
      example: "3,000 children × $2,000 = $6,000,000 impact value",
      why: "Based on the lifetime earnings differential and social mobility benefits of quality education access."
    },
    {
      number: 6,
      name: "Clean Water and Sanitation",
      category: "environment",
      indicator: "Water access",
      measure: "% of population with safe water access above baseline",
      unit: "Per % increase",
      value: 400,
      example: "100% access for 5,000 people = $10,000,000 impact value",
      why: "Based on health cost savings, time savings, and productivity gains from reliable clean water access."
    },
    {
      number: 7,
      name: "Affordable and Clean Energy",
      category: "environment",
      indicator: "Energy access",
      measure: "% with access to affordable, reliable clean energy",
      unit: "Per % increase",
      value: 100,
      example: "100% access improvement = $2,500,000 impact value",
      why: "Based on economic productivity gains, health improvements from reduced indoor air pollution, and climate benefits."
    },
    {
      number: 11,
      name: "Sustainable Cities and Communities",
      category: "environment",
      indicator: "Adequate housing",
      measure: "% with access to adequate, safe, affordable housing",
      unit: "Per % increase",
      value: 500,
      example: "100% adequate housing for 5,000 = $12,500,000 impact value",
      why: "Based on health improvements, economic stability, and social cohesion benefits of adequate housing."
    },
    {
      number: 13,
      name: "Climate Action",
      category: "environment",
      indicator: "Policy change",
      measure: "Government policy changes for climate planning",
      unit: "Per policy change",
      value: 20000,
      example: "10 significant policy changes = $1,000,000 impact value",
      why: "Based on the systemic impact of policy changes that enable climate action at scale."
    }
  ]

  const filteredSdgs = filter
    ? sdgs.filter(sdg => sdg.category === filter)
    : sdgs

  return (
    <Accordion type="single" collapsible className="space-y-2">
      {filteredSdgs.map((sdg) => (
        <AccordionItem key={sdg.number} value={`sdg-${sdg.number}`}>
          <AccordionTrigger className="hover:bg-slate-50 px-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                {sdg.number}
              </div>
              <div>
                <div className="font-semibold">SDG {sdg.number}: {sdg.name}</div>
                <div className="text-sm text-muted-foreground">{sdg.indicator}</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-4">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">What We Measure</h5>
                <p className="text-sm text-muted-foreground">{sdg.measure}</p>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">Unit Value</h5>
                <p className="text-lg font-bold text-green-600">${sdg.value.toLocaleString()} {sdg.unit}</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h5 className="font-semibold text-sm mb-2">Example Calculation</h5>
              <p className="text-sm">{sdg.example}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h5 className="font-semibold text-sm mb-2">Why This Value?</h5>
              <p className="text-sm text-muted-foreground">{sdg.why}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
