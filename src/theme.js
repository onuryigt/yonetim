import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E90FF', // Ana renk
    },
    secondary: {
      main: '#ff4081', // İkincil renk
    },
    background: {
      default: '#2C3E50', // Arkaplan rengi
      paper: '#34495E', // Kartların arkaplan rengi
    },
    text: {
      primary: '#ECF0F1', // Yazı rengi
    },
  },
  typography: {
    h5: {
      fontWeight: '600', // Kart başlıklarının font ağırlığı
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#2C3E50',
          color: '#ECF0F1',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#34495E',
          color: '#ECF0F1',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ECF0F1',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#ECF0F1',
        },
      },
    },
  },
});

export default theme;