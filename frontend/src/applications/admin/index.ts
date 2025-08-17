import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { ApplicationDefinition } from '../../app/routing/types'
import { adminRoutes } from './routes'

export const adminApplication: ApplicationDefinition = {
  id: 'admin',
  name: 'Admin Panel',
  description: 'User management and system administration',
  icon: AdminPanelSettingsIcon,
  basePath: '/admin',
  routes: adminRoutes
}

export * from './routes'
