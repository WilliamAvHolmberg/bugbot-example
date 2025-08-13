import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from './authContext'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
        <Typography color="text.secondary">Checking authentication…</Typography>
      </Box>
    )
  }
  if (!isAuthenticated) {
    return <AuthForm />
  }
  return <>{children}</>
}

function AuthForm() {
  const { sendOtp, verifyOtp, otpStep, otpEmail, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const onSend = async () => {
    clearError()
    await sendOtp(email)
  }
  const onVerify = async () => {
    await verifyOtp(otpEmail ?? email, code)
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <Paper sx={{ p: 3, minWidth: 360 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Sign in</Typography>
          {otpStep !== 'email-sent' ? (
            <>
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth autoFocus />
              <Button variant="contained" onClick={onSend} disabled={!email}>Send OTP</Button>
            </>
          ) : (
            <>
              <Typography color="text.secondary" variant="body2">We sent a code to {otpEmail}</Typography>
              <TextField label="One-time code" value={code} onChange={(e) => setCode(e.target.value)} fullWidth autoFocus />
              <Stack direction="row" spacing={1}>
                <Button onClick={() => sendOtp(otpEmail ?? email)}>Resend</Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="contained" onClick={onVerify} disabled={!code}>Verify</Button>
              </Stack>
            </>
          )}
          {error ? (
            <Typography color="error" variant="body2">{error}</Typography>
          ) : null}
        </Stack>
      </Paper>
    </Box>
  )
}



