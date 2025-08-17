import { 
  Box, 
  Card, 
  CardActionArea, 
  CardContent, 
  Grid as Grid, 
  Typography 
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getUserApplications } from '../../applications'
import { ApplicationDefinition } from '../routing/types'

function AppCard({ app }: { app: ApplicationDefinition }) {
  const navigate = useNavigate()
  const Icon = app.icon

  return (
    <Card>
      <CardActionArea onClick={() => navigate(app.basePath)}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ mb: 2, color: 'primary.main', fontSize: 48 }}>
            <Icon fontSize="large" />
          </Box>
          <Typography variant="h6" component="h3" gutterBottom>
            {app.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {app.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export function AppSelector() {
  const userApplications = getUserApplications()

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Select Application
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose the application you want to access
      </Typography>
      
      <Grid container spacing={3}>
        {userApplications.map((app) => (
          <Grid key={app.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <AppCard app={app} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
