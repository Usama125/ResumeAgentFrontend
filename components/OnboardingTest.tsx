"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import OnboardingService from '@/services/onboarding'
import { useAuth } from '@/context/AuthContext'

// Test component to verify onboarding integration
export default function OnboardingTest() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testOnboardingStatus = async () => {
    try {
      setLoading(true)
      addResult('Testing onboarding status...')
      
      const status = await OnboardingService.getOnboardingStatus()
      addResult(`✅ Status: ${JSON.stringify(status, null, 2)}`)
      
      // Test step accessibility
      for (let i = 1; i <= 4; i++) {
        const accessible = OnboardingService.isStepAccessible(i, status)
        const completed = OnboardingService.isStepCompleted(i, status)
        addResult(`Step ${i}: ${accessible ? '✅ Accessible' : '❌ Not Accessible'}, ${completed ? '✅ Completed' : '⏳ Not Completed'}`)
      }
      
    } catch (error: any) {
      addResult(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testStep2Validation = async () => {
    try {
      setLoading(true)
      addResult('Testing Step 2 with minimal data...')
      
      const response = await OnboardingService.completeStep2({
        additional_info: "Test additional info",
        is_looking_for_job: true,
        current_employment_mode: ["remote"]
      })
      
      addResult(`✅ Step 2 Response: ${JSON.stringify(response)}`)
    } catch (error: any) {
      addResult(`❌ Step 2 Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testStep3Validation = async () => {
    try {
      setLoading(true)
      addResult('Testing Step 3 with minimal data...')
      
      const response = await OnboardingService.completeStep3({
        preferred_work_mode: ["remote"],
        preferred_employment_type: ["full-time"],
        preferred_location: "Remote"
      })
      
      addResult(`✅ Step 3 Response: ${JSON.stringify(response)}`)
    } catch (error: any) {
      addResult(`❌ Step 3 Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testStep4Validation = async () => {
    try {
      setLoading(true)
      addResult('Testing Step 4 with minimal data...')
      
      const response = await OnboardingService.completeStep4({
        current_salary: "50000",
        expected_salary: "60000-70000",
        notice_period: "2 weeks",
        availability: "immediate"
      })
      
      addResult(`✅ Step 4 Response: ${JSON.stringify(response)}`)
    } catch (error: any) {
      addResult(`❌ Step 4 Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Onboarding Integration Test</CardTitle>
        <p className="text-sm text-gray-600">
          User: {user?.name} | Onboarding Completed: {user?.onboarding_completed ? '✅' : '❌'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={testOnboardingStatus} disabled={loading}>
            Test Status Check
          </Button>
          <Button onClick={testStep2Validation} disabled={loading}>
            Test Step 2
          </Button>
          <Button onClick={testStep3Validation} disabled={loading}>
            Test Step 3
          </Button>
          <Button onClick={testStep4Validation} disabled={loading}>
            Test Step 4
          </Button>
          <Button onClick={clearResults} variant="outline">
            Clear Results
          </Button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
          <h4 className="font-semibold mb-2">Test Results:</h4>
          {results.length === 0 ? (
            <p className="text-gray-500">No tests run yet...</p>
          ) : (
            <div className="space-y-1">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}