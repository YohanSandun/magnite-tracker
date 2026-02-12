import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { I18nProvider } from './i18n';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import TrackPage from './pages/TrackPage';
import CommunityPage from './pages/CommunityPage';
import InsightsPage from './pages/InsightsPage';

export default function App() {
  return (
    <I18nProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="track/:orderNumber" element={<TrackPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="insights" element={<InsightsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
    </I18nProvider>
  );
}
