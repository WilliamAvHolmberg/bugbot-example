import { Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import { useLocation, useNavigate } from 'react-router-dom'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const go = (to: string) => () => {
    navigate(to)
    onNavigate?.()
  }
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Toolbar />
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography variant="overline" color="text.secondary">Navigation</Typography>
      </Box>
      <List sx={{ px: 1 }}>
        <ListItemButton selected={pathname === '/'} onClick={go('/')} sx={{ mb: 0.5 }}>
          <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton selected={pathname.startsWith('/users')} onClick={go('/users')} sx={{ mb: 0.5 }}>
          <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
        <ListItemButton disabled>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="caption" color="text.secondary">v0.1</Typography>
      </Box>
    </Box>
  )
}


