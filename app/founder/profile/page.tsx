'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/hooks/use-auth'
import { Loader2, Save, ArrowRight, User, Briefcase, Target, DollarSign, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const SDG_OPTIONS = [
  { value: 1, label: 'No Poverty' },
  { value: 2, label: 'Zero Hunger' },
  { value: 3, label: 'Good Health and Well-being' },
  { value: 4, label: 'Quality Education' },
  { value: 5, label: 'Gender Equality' },
  { value: 6, label: 'Clean Water and Sanitation' },
  { value: 7, label: 'Affordable and Clean Energy' },
  { value: 8, label: 'Decent Work and Economic Growth' },
  { value: 9, label: 'Industry, Innovation and Infrastructure' },
  { value: 10, label: 'Reduced Inequalities' },
  { value: 11, label: 'Sustainable Cities and Communities' },
  { value: 12, label: 'Responsible Consumption and Production' },
  { value: 13, label: 'Climate Action' },
  { value: 14, label: 'Life Below Water' },
  { value: 15, label: 'Life on Land' },
  { value: 16, label: 'Peace, Justice and Strong Institutions' },
  { value: 17, label: 'Partnerships for the Goals' },
]

export default function FounderProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const { isLoading: authLoading, user } = useAuth({
    requireAuth: true,
    requiredRole: 'founder',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    // Personal & Team
    name: '',
    company_name: '',
    tagline: '',
    country: '',
    team_size: '',
    team_background: '',

    // Booleans for quick assessment
    has_domain_expertise: false,
    has_startup_experience: false,
    has_prototype: false,
    has_customers: false,
    has_revenue: false,

    // Venture details
    problem_statement: '',
    solution_statement: '',
    target_market: '',

    // Funding
    funding_stage: '',
    funding_ask_stage: '',
    funding_ask_amount: '',
    use_of_funds: '',

    // Traction
    traction_details: '',

    // Impact
    impact_focus: [] as number[],
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data: founderData, error: founderError } = await supabase
        .from('founders')
        .select('*')
        .eq('id', user.id)
        .single()

      if (founderError) throw founderError

      if (founderData) {
        setFormData({
          name: founderData.name || '',
          company_name: founderData.company_name || '',
          tagline: founderData.tagline || '',
          country: founderData.country || '',
          team_size: founderData.team_size?.toString() || '',
          team_background: founderData.team_background || '',
          has_domain_expertise: founderData.has_domain_expertise || false,
          has_startup_experience: founderData.has_startup_experience || false,
          has_prototype: founderData.has_prototype || false,
          has_customers: founderData.has_customers || false,
          has_revenue: founderData.has_revenue || false,
          problem_statement: founderData.problem_statement || '',
          solution_statement: founderData.solution_statement || '',
          target_market: founderData.target_market || '',
          funding_stage: founderData.funding_stage || '',
          funding_ask_stage: founderData.funding_ask_stage || '',
          funding_ask_amount: founderData.funding_ask_amount || '',
          use_of_funds: founderData.use_of_funds || '',
          traction_details: founderData.traction_details || '',
          impact_focus: (founderData.impact_focus || []).map(String).map(Number).filter(n => !isNaN(n)),
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('founders')
        .update({
          name: formData.name,
          company_name: formData.company_name,
          tagline: formData.tagline,
          country: formData.country,
          team_size: formData.team_size ? parseInt(formData.team_size) : null,
          team_background: formData.team_background,
          has_domain_expertise: formData.has_domain_expertise,
          has_startup_experience: formData.has_startup_experience,
          has_prototype: formData.has_prototype,
          has_customers: formData.has_customers,
          has_revenue: formData.has_revenue,
          problem_statement: formData.problem_statement,
          solution_statement: formData.solution_statement,
          target_market: formData.target_market,
          funding_stage: formData.funding_stage,
          funding_ask_stage: formData.funding_ask_stage,
          funding_ask_amount: formData.funding_ask_amount,
          use_of_funds: formData.use_of_funds,
          traction_details: formData.traction_details,
          impact_focus: formData.impact_focus.map(String),
          profile_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Profile saved!',
        description: 'Your information has been updated successfully.',
      })
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast({
        title: 'Error saving profile',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleContinue = async () => {
    await handleSave()
    router.push('/founder/discovery')
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  const sections = [
    {
      title: 'Personal & Team',
      icon: User,
      fields: ['name', 'company_name', 'tagline', 'country', 'team_size', 'team_background'],
    },
    {
      title: 'Your Venture',
      icon: Briefcase,
      fields: ['problem_statement', 'solution_statement', 'target_market'],
    },
    {
      title: 'Current Stage',
      icon: TrendingUp,
      fields: ['funding_stage', 'traction_details', 'checkboxes'],
    },
    {
      title: 'Funding & Impact',
      icon: Target,
      fields: ['funding_ask_stage', 'funding_ask_amount', 'use_of_funds', 'impact_focus'],
    },
  ]

  const completionPercentage = Math.round(
    (Object.values(formData).filter(v =>
      Array.isArray(v) ? v.length > 0 : Boolean(v)
    ).length / Object.keys(formData).length) * 100
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Founder Profile</h1>
          <p className="text-muted-foreground mb-4">
            Complete your profile to help our AI coach provide personalized guidance
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 rounded-full h-3 transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-blue-600">
              {completionPercentage}% Complete
            </span>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {sections.map((section, idx) => {
            const Icon = section.icon
            return (
              <button
                key={idx}
                onClick={() => setActiveSection(idx)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  activeSection === idx
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${
                  activeSection === idx ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <p className="text-xs font-medium text-center">{section.title}</p>
              </button>
            )
          })}
        </div>

        {/* Form Sections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(sections[activeSection].icon, { className: 'w-5 h-5' })}
              {sections[activeSection].title}
            </CardTitle>
            <CardDescription>
              {activeSection === 0 && 'Tell us about yourself and your team'}
              {activeSection === 1 && 'Describe the problem you\'re solving'}
              {activeSection === 2 && 'Where are you in your journey?'}
              {activeSection === 3 && 'Your funding needs and impact goals'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Section 0: Personal & Team */}
            {activeSection === 0 && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="Acme Impact Co"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tagline">Company Tagline *</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Clean water for everyone, everywhere"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Kenya"
                    />
                  </div>
                  <div>
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      type="number"
                      value={formData.team_size}
                      onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                      placeholder="3"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="team_background">Team Background & Expertise *</Label>
                  <Textarea
                    id="team_background"
                    value={formData.team_background}
                    onChange={(e) => setFormData({ ...formData, team_background: e.target.value })}
                    placeholder="Describe your team's relevant experience, domain expertise, and complementary skills..."
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Section 1: Your Venture */}
            {activeSection === 1 && (
              <>
                <div>
                  <Label htmlFor="problem_statement">Problem Statement *</Label>
                  <Textarea
                    id="problem_statement"
                    value={formData.problem_statement}
                    onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                    placeholder="What problem are you solving? Who experiences this problem? How big is it?"
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="solution_statement">Your Solution *</Label>
                  <Textarea
                    id="solution_statement"
                    value={formData.solution_statement}
                    onChange={(e) => setFormData({ ...formData, solution_statement: e.target.value })}
                    placeholder="How does your solution work? What makes it different or better than alternatives?"
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="target_market">Target Market *</Label>
                  <Textarea
                    id="target_market"
                    value={formData.target_market}
                    onChange={(e) => setFormData({ ...formData, target_market: e.target.value })}
                    placeholder="Who are your customers? What geography? How large is the market opportunity?"
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Section 2: Current Stage */}
            {activeSection === 2 && (
              <>
                <div>
                  <Label htmlFor="funding_stage">Current Funding Stage *</Label>
                  <Select
                    value={formData.funding_stage}
                    onValueChange={(value) => setFormData({ ...formData, funding_stage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="series-b">Series B</SelectItem>
                      <SelectItem value="series-c">Series C+</SelectItem>
                      <SelectItem value="revenue">Revenue/Bootstrapped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="traction_details">Traction & Metrics</Label>
                  <Textarea
                    id="traction_details"
                    value={formData.traction_details}
                    onChange={(e) => setFormData({ ...formData, traction_details: e.target.value })}
                    placeholder="Customers, revenue, users, partnerships, pilots, testimonials, key metrics..."
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Quick Assessment</Label>
                  <div className="space-y-2">
                    {[
                      { key: 'has_domain_expertise', label: 'Team has relevant domain expertise' },
                      { key: 'has_startup_experience', label: 'Team has startup/entrepreneurial experience' },
                      { key: 'has_prototype', label: 'Working prototype or MVP exists' },
                      { key: 'has_customers', label: 'Paying customers or committed users' },
                      { key: 'has_revenue', label: 'Generating revenue' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={item.key}
                          checked={formData[item.key as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, [item.key]: checked })
                          }
                        />
                        <label htmlFor={item.key} className="text-sm cursor-pointer">
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Section 3: Funding & Impact */}
            {activeSection === 3 && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="funding_ask_stage">Funding Round Seeking *</Label>
                    <Select
                      value={formData.funding_ask_stage}
                      onValueChange={(value) => setFormData({ ...formData, funding_ask_stage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select round" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B</SelectItem>
                        <SelectItem value="bridge">Bridge Round</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="funding_ask_amount">Amount Seeking *</Label>
                    <Input
                      id="funding_ask_amount"
                      value={formData.funding_ask_amount}
                      onChange={(e) => setFormData({ ...formData, funding_ask_amount: e.target.value })}
                      placeholder="$500K - $2M"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="use_of_funds">Use of Funds *</Label>
                  <Textarea
                    id="use_of_funds"
                    value={formData.use_of_funds}
                    onChange={(e) => setFormData({ ...formData, use_of_funds: e.target.value })}
                    placeholder="How will you use the funding? (e.g., 40% product development, 30% team expansion, 20% marketing, 10% operations)"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Primary SDG Focus (select all that apply) *</Label>
                  <div className="grid md:grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                    {SDG_OPTIONS.map((sdg) => (
                      <div key={sdg.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sdg-${sdg.value}`}
                          checked={formData.impact_focus.includes(sdg.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                impact_focus: [...formData.impact_focus, sdg.value],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                impact_focus: formData.impact_focus.filter((v) => v !== sdg.value),
                              })
                            }
                          }}
                        />
                        <label htmlFor={`sdg-${sdg.value}`} className="text-sm cursor-pointer">
                          {sdg.value}. {sdg.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Progress
                    </>
                  )}
                </Button>

                {activeSection < sections.length - 1 ? (
                  <Button onClick={() => setActiveSection(activeSection + 1)}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleContinue} className="bg-green-600 hover:bg-green-700">
                    Continue to Discovery
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Helper Note */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Why we need this:</strong> The more detail you provide, the better our AI coach can understand your venture and provide personalized guidance during your discovery session.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}