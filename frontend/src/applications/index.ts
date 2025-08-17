import { ApplicationDefinition } from '../app/routing/types'
import { adminApplication } from './admin'

// Registry of all available applications
export const applications: ApplicationDefinition[] = [
  adminApplication
]

// Helper to get application by ID
export function getApplicationById(id: string): ApplicationDefinition | undefined {
  return applications.find(app => app.id === id)
}

// Helper to get applications user has access to (for now, returns all)
export function getUserApplications(): ApplicationDefinition[] {
  // TODO: Filter based on user permissions
  return applications
}
