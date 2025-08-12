import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { usePostApiAuthSendOtp, usePostApiAuthVerifyOtp, useGetApiAuthMe, usePostApiAuthLogout } from '../api/generated'
import { useQueryClient } from '@tanstack/react-query'

export type AuthUser = { userId: string; email: string }

export type OtpStep = 'idle' | 'email-sent' | 'verifying'

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  otpStep: OtpStep
  otpEmail: string | null
  error: string | null
}

export interface AuthActions {
  sendOtp: (email: string) => Promise<boolean>
  verifyOtp: (email: string, otpCode: string) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
  refetchAuth: () => void
}

export type AuthContextType = AuthState & AuthActions

const AuthContext = createContext<AuthContextType | null>(null)

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
    const data = me.data?.data
    const isAuthenticated = !!data?.isAuthenticated && !!data?.userId && !!data?.email
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
  const refetchAuth = () => me.refetch()

  const value: AuthContextType = {
    ...exposeState,
    sendOtp,
    verifyOtp,
    logout,
    clearError,
    refetchAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}



