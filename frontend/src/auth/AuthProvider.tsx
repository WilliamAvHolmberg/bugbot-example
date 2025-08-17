import { useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { usePostApiAuthSendOtp, usePostApiAuthVerifyOtp, useGetApiAuthMe, usePostApiAuthLogout } from '../api/generated'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext, type AuthContextType, type AuthState, type AuthUser } from './authContext'

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()

  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    otpStep: 'idle',
    otpEmail: null,
    error: null,
  })

  const me = useGetApiAuthMe({
    query: { retry: false, staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 },
    fetch: { credentials: 'include' },
  })

  const sendOtpMutation = usePostApiAuthSendOtp({ fetch: { credentials: 'include' } })
  const verifyOtpMutation = usePostApiAuthVerifyOtp({ fetch: { credentials: 'include' } })
  const logoutMutation = usePostApiAuthLogout({ fetch: { credentials: 'include' } })

  // derive auth state from /me
  const derived = useMemo(() => {
    if (me.isLoading) {
      return { isLoading: true, isAuthenticated: false, user: null as AuthUser | null }
    }
    // OpenAPI may not describe the /me shape precisely; narrow defensively
    const raw = me.data?.data as unknown
    const data = raw && typeof raw === 'object'
      ? (raw as Partial<{ isAuthenticated: boolean; userId: string; email: string }>)
      : undefined
    const isAuthenticated = !!(data?.isAuthenticated && data?.userId && data?.email)
    const user = isAuthenticated ? ({ userId: data!.userId!, email: data!.email! } as AuthUser) : null
    return { isLoading: false, isAuthenticated, user }
  }, [me.isLoading, me.data])

  // Merge into state to expose a stable object across renders
  const exposeState: AuthState = {
    ...state,
    user: derived.user,
    isAuthenticated: derived.isAuthenticated,
    isLoading: derived.isLoading,
  }

  const sendOtp = async (email: string): Promise<boolean> => {
    setState((s) => ({ ...s, error: null, otpEmail: email }))
    try {
      await sendOtpMutation.mutateAsync({ data: { email } })
      setState((s) => ({ ...s, otpStep: 'email-sent', otpEmail: email }))
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP'
      setState((s) => ({ ...s, error: msg, otpStep: 'idle' }))
      return false
    }
  }

  const verifyOtp = async (email: string, otpCode: string): Promise<boolean> => {
    setState((s) => ({ ...s, error: null, otpStep: 'verifying' }))
    try {
      await verifyOtpMutation.mutateAsync({ data: { email, otpCode } })
      await me.refetch()
      setState((s) => ({ ...s, otpStep: 'idle', otpEmail: null }))
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP code'
      setState((s) => ({ ...s, error: msg, otpStep: 'email-sent' }))
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // ignore
    }
    queryClient.clear()
    setState((s) => ({ ...s, user: null, isAuthenticated: false, otpStep: 'idle', otpEmail: null, error: null }))
    await me.refetch()
  }

  const clearError = () => setState((s) => ({ ...s, error: null }))
  const backToEmail = () => setState((s) => ({ ...s, otpStep: 'idle' }))
  const refetchAuth = () => me.refetch()

  const value: AuthContextType = {
    ...exposeState,
    sendOtp,
    verifyOtp,
    logout,
    clearError,
    backToEmail,
    refetchAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}



