import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Stack, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { UsersTable } from '../components/UsersTable'
import { usePostApiUsers, getGetApiUsersQueryKey } from '../../../../../api/generated'

export function UsersPage() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const createUser = usePostApiUsers()
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({ open: false, msg: '', severity: 'success' })
  const queryClient = useQueryClient()

  const onCreate = () => {
    createUser.mutate(
      { data: { email, name } },
      {
        onSuccess: () => {
          setOpen(false)
          setEmail('')
          setName('')
          setSnack({ open: true, msg: 'User created', severity: 'success' })
          // Invalidate all /api/users queries (any params)
          queryClient.invalidateQueries({ queryKey: getGetApiUsersQueryKey(undefined) })
        },
        onError: () => setSnack({ open: true, msg: 'Failed to create user', severity: 'error' }),
      }
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="h6">Users</Typography>
            <Typography variant="body2" color="text.secondary">Explore, search, and manage users seamlessly.</Typography>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            New User
          </Button>
        </Box>
        <UsersTable />
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus fullWidth />
            <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onCreate} disabled={createUser.isPending || !email || !name}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}


