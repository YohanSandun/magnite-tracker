import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1B3A5C',
      light: '#2E5C8A',
      dark: '#0D1F33',
    },
    secondary: {
      main: '#C3002F',
      light: '#E63946',
      dark: '#8B0000',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#5A6073',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1B3A5C 0%, #2E5C8A 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0D1F33 0%, #1B3A5C 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1B3A5C 0%, #0D1F33 100%)',
        },
      },
    },
  },
});

export default theme;
