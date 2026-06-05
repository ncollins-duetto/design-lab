import { createTheme } from '@mui/material/styles';

/** Duetto / Travel Distribution design tokens aligned with legacy calendar CSS */
export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#006461',
      dark: '#004d4a',
      light: '#47c5bc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#47c5bc',
      dark: '#006461',
    },
    error: {
      main: '#D32F2F',
      light: '#FFEBEE',
    },
    warning: {
      main: '#FFB90F',
      light: '#FFF8E6',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1C1C',
      secondary: '#4F5B60',
      disabled: '#AEB4BA',
    },
    divider: '#DDE1E2',
  },
  typography: {
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontSize: 16,
      fontWeight: 400,
      color: '#4F5B60',
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 11,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: 14,
          fontWeight: 400,
        },
        contained: {
          '&.MuiButton-colorPrimary:hover': {
            backgroundColor: '#004d4a',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: 14,
          color: '#006461',
          '&.Mui-selected': {
            backgroundColor: '#354549',
            color: '#fff',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#354549',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
  },
});
