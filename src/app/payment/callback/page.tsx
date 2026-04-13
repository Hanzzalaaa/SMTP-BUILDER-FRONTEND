'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface PaymentResult {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    plan: string
    subscriptionEnd: string
    premiumActivatedAt: string | null
    quota: number
  } 
}

// Wraps the main logic in a suspense boundary to satisfy Next.js requirements for useSearchParams
function PaymentCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'error'>('verifying')
  const [message, setMessage] = useState('Verifying your payment...')
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const reference =  searchParams.get('reference') || searchParams.get('tx_ref')
    const paystackStatus = searchParams.get('status')

    if (!reference) {
      setStatus('error')
      setMessage('Payment reference not found. Please contact support.')
      return
    }

    // If Paystack already indicates failure, don't bother verifying
    if (paystackStatus === 'cancelled' || paystackStatus === 'failed') {
      setStatus('failed')
      setMessage('Payment was cancelled or failed. You can try again.')
      return
    }

    verifyPayment(reference)
  }, [searchParams])

  // Countdown timer for redirect and remove tokens from localStorage and cookies
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
        // Remove from cookies
        document.cookie = 'access_token=; Max-Age=0; path=/; SameSite=Lax';
        document.cookie = 'auth_token=; Max-Age=0; path=/; SameSite=Lax';
      }
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (status === 'success' && countdown === 0) {
      router.push('/login')
    }
  }, [status, countdown, router])

  const verifyPayment = async (reference: string) => {
    try {
      console.log(reference)
      const result = await apiClient.verifySubscription(reference);

      if (
        typeof result === 'object' &&
        result !== null &&
        'success' in result &&
        typeof (result as { success: boolean }).success === 'boolean'
      ) {
        if ((result as { success: boolean }).success) {
          setStatus('success');
          setMessage((result as { message?: string }).message || 'Payment successful! Your account has been upgraded.');
          setPaymentResult(result as PaymentResult);
        } else {
          setStatus('failed');
          setMessage(
            (result as { message?: string }).message || 'Payment verification failed. Please contact support.'
          );
        }
      } 
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred while verifying your payment.')
    }
  }

  const handleRetryPayment = () => {
    router.push('/pricing')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleContactSupport = () => {
    window.open('mailto:support@yourapp.com?subject=Payment Issue', '_blank')
  }

  const renderIcon = () => {
    switch (status) {
      case 'verifying':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />
      case 'error':
        return <AlertCircle className="w-16 h-16 text-orange-500" />
      default:
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'verifying':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
      case 'error':
        return 'border-orange-200 bg-orange-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className={`max-w-md w-full bg-white rounded-lg shadow-lg border-2 ${getStatusColor()} p-8`}>
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {renderIcon()}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'verifying' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
            {status === 'error' && 'Payment Error'}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Success Details */}
          {status === 'success' && paymentResult?.user && (
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-green-800 mb-2">Subscription Details:</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><span className="font-medium">Plan:</span> {paymentResult.user.plan}</p>
                <p><span className="font-medium">Email:</span> {paymentResult.user.email}</p>
                {paymentResult.user.subscriptionEnd && (
                  <p><span className="font-medium">Valid Until:</span> {new Date(paymentResult.user.subscriptionEnd).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          )}

          {/* Countdown for success */}
          {status === 'success' && countdown > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === 'success' && (
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            )}

            {status === 'failed' && (
              <div className="space-y-2">
                <button
                  onClick={handleRetryPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleContactSupport}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Contact Support
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Retry Verification
                </button>
                <button
                  onClick={handleContactSupport}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Contact Support
                </button>
              </div>
            )}

            {status === 'verifying' && (
              <button
                disabled
                className="w-full bg-gray-400 text-white font-medium py-3 px-4 rounded-lg cursor-not-allowed"
              >
                Please wait...
              </button>
            )}
          </div>

          {/* Additional help text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Having issues? Contact our support team at{' '}
              <a 
                href="mailto:support@yourapp.com" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                support@yourapp.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  // Wrap the content in Suspense to satisfy Next.js requirements for useSearchParams
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}