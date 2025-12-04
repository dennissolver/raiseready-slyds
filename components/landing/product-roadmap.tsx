import { Badge } from '@/components/ui/badge'

export function ProductRoadmap() {
  const roadmapPhases = [
    {
      phase: "Available Now",
      color: "green",
      features: [
        { icon: "🚀", name: "AI Deck Analysis", desc: "Instant readiness scoring across 6 dimensions" },
        { icon: "💬", name: "Interactive Coaching", desc: "Chat with AI investor to refine your pitch" },
        { icon: "📊", name: "Detailed Feedback", desc: "Actionable recommendations for every slide" }
      ]
    },
    {
      phase: "Q1 2026",
      color: "orange",
      features: [
        { 
          icon: "🎤", 
          name: "Voice AI Coaching", 
          desc: "Practice your pitch out loud with real-time voice feedback",
          highlight: true 
        },
        { icon: "📹", name: "Video Pitch Practice", desc: "Record your pitch, get delivery feedback" },
        { icon: "📜", name: "Version History", desc: "Track improvements and compare deck scores over time" }
      ]
    },
    {
      phase: "Q2 2026",
      color: "blue",
      features: [
        { icon: "✨", name: "AI Deck Regeneration", desc: "One-click slide improvements based on coaching" },
        { icon: "🎯", name: "Investor Matching", desc: "Connect with investors who fund companies like yours" },
        { icon: "👥", name: "Team Collaboration", desc: "Practice with co-founders, share coaching sessions" }
      ]
    },
    {
      phase: "Future",
      color: "purple",
      features: [
        { icon: "📞", name: "Live AI Investor Calls", desc: "Real-time practice sessions with AI asking tough questions" },
        { icon: "📈", name: "Fundraising Tracker", desc: "Pipeline management from first pitch to closed deal" },
        { icon: "🎨", name: "AI Slide Generator", desc: "Describe your business, AI creates your full deck" }
      ]
    }
  ]

  const colorStyles: Record<string, { badge: string }> = {
    green: { badge: "bg-green-100 text-green-800 border-green-300" },
    orange: { badge: "bg-orange-100 text-orange-800 border-orange-300" },
    blue: { badge: "bg-blue-100 text-blue-800 border-blue-300" },
    purple: { badge: "bg-purple-100 text-purple-800 border-purple-300" }
  }

  return (
    <div className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Product Roadmap</Badge>
          <h2 className="text-4xl font-bold mb-4">Built for Founders, Growing with You</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're constantly adding features to help you raise capital faster and with more confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {roadmapPhases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`font-semibold ${colorStyles[phase.color].badge}`}>
                  {phase.phase}
                </Badge>
                {phaseIndex === 0 && <span className="text-xs text-green-600 font-medium">Live</span>}
              </div>

              <div className="space-y-3">
                {phase.features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      feature.highlight 
                        ? 'border-orange-300 bg-orange-50/50 ring-2 ring-orange-200' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                          {feature.name}
                          {feature.highlight && (
                            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300">
                              Priority
                            </Badge>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-sm text-muted-foreground">Want early access to new features?</span>
            <a href="/signup" className="text-sm font-medium text-primary hover:underline">Sign up now</a>
          </div>
        </div>
      </div>
    </div>
  )
}
