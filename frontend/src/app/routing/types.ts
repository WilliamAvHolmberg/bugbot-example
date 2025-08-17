export interface RouteDefinition {
  path: string
  label: string
  icon: React.ComponentType<{ fontSize?: 'small' | 'medium' | 'large' }>
  component: React.ComponentType
  children?: RouteDefinition[]
}

export interface ApplicationDefinition {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ fontSize?: 'small' | 'medium' | 'large' }>
  basePath: string
  routes: RouteDefinition[]
}

export interface NavigationItem {
  path: string
  label: string
  icon: React.ComponentType<{ fontSize?: 'small' | 'medium' | 'large' }>
  children?: NavigationItem[]
}
