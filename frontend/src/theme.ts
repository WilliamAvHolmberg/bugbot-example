import { createTheme } from '@mui/material/styles'
import '@mui/x-data-grid/themeAugmentation'
import { grey } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563EB' },
    secondary: { main: '#0EA5E9' },
    background: { default: '#F6F7FB', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: 0,
          border: 'none',
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'saturate(180%) blur(8px)',
          WebkitBackdropFilter: 'saturate(180%) blur(8px)',
          color: '#0F172A',
          borderBottom: `1px solid ${grey[200]}`,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${grey[200]}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 12 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${grey[200]}`,
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&.Mui-selected': {
            backgroundColor: '#F1F5F9',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: `1px solid ${grey[200]}`,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
        },
        columnHeaders: {
          backgroundColor: '#FAFBFC',
          borderBottom: `1px solid ${grey[200]}`,
        },
        row: {
          borderBottom: `1px solid ${grey[100]}`,
        },
      },
    },
  },
})


