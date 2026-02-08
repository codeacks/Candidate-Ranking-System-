import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Outfit, Inter, sans-serif',
  headings: {
    fontFamily: 'Outfit, Inter, sans-serif',
    fontWeight: '700',
  },
  colors: {
    // Custom branding colors can be added here
  },
  defaultRadius: 'md',
  components: {
    Card: {
      defaultProps: {
        className: 'glass hover-card',
      },
    },
    Button: {
      styles: {
        root: {
          transition: 'all 0.2s ease',
        },
      },
    },
    Paper: {
      defaultProps: {
        className: 'glass',
      },
    }
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" zIndex={2077} />
      <Dashboard />
    </MantineProvider>
  );
}

export default App;
