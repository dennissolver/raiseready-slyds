'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Edit } from 'lucide-react'

function ConfirmThesisContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')

  const [criteria, setCriteria] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadCriteria = async () => {
      if (!sessionId) {
        setLoading(false)
        return
      }

      const { data: session } = await supabase
        .from('investor_discovery_sessions')
        .select('extracted_criteria')
        .eq('id', sessionId)
        .single()

      setCriteria(session?.extracted_criteria)
      setLoading(false)
    }

    loadCriteria()
  }, [sessionId, supabase])

  const handleConfirm = async () => {
    if (!sessionId) return

    setLoading(true)

    const response = await fetch('/api/investor-coach/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, criteria })
    })

    if (response.ok) {
      router.push('/investor/dashboard?thesis=confirmed')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!sessionId || !criteria) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Session not found. Please start a new discovery session.</p>
            <Button onClick={() => router.push('/investor/discovery')} className="mt-4">
              Start Discovery
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Review Your Investment Thesis</CardTitle>
            <CardDescription>
              Based on our conversation, here's what I learned about your investment criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ... rest of content ... */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ConfirmThesisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    }>
      <ConfirmThesisContent />
    </Suspense>
  )
}