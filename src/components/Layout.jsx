import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Button,
  Divider,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  AddCircleOutline as AddIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  BarChart as AnalyticsIcon,
  DirectionsCar as CarIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useI18n, LANGUAGES } from '../i18n';

const NAV_KEYS = [
  { key: 'nav.home', icon: <HomeIcon />, path: '/' },
  { key: 'nav.report', icon: <AddIcon />, path: '/report' },
  { key: 'nav.track', icon: <SearchIcon />, path: '/track' },
  { key: 'nav.community', icon: <PeopleIcon />, path: '/community' },
  { key: 'nav.insights', icon: <AnalyticsIcon />, path: '/insights' },
];

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t, lang, switchLang } = useI18n();

  const NAV_ITEMS = NAV_KEYS.map((n) => ({ ...n, label: t(n.key) }));

  const currentPath = '/' + location.pathname.split('/')[1];
  const currentIndex = NAV_ITEMS.findIndex((item) => item.path === currentPath);
  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ---------- Top App Bar ---------- */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          <CarIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            {t('nav.appTitle')}
          </Typography>

          {/* Language Switcher */}
          <IconButton
            color="inherit"
            onClick={(e) => setLangAnchor(e.currentTarget)}
            sx={{ mr: isMobile ? 0 : 1 }}
            aria-label="language"
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
          >
            {LANGUAGES.map((l) => (
              <MenuItem
                key={l.code}
                selected={lang === l.code}
                onClick={() => {
                  switchLang(l.code);
                  setLangAnchor(null);
                }}
              >
                {l.nativeLabel}
              </MenuItem>
            ))}
          </Menu>

          {!isMobile &&
            NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 0.5,
                  fontWeight: currentPath === item.path ? 700 : 400,
                  opacity: currentPath === item.path ? 1 : 0.8,
                  borderBottom:
                    currentPath === item.path
                      ? '2px solid rgba(255,255,255,0.9)'
                      : '2px solid transparent',
                  borderRadius: 0,
                  py: 1,
                  '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                {item.label}
              </Button>
            ))}
        </Toolbar>
      </AppBar>

      {/* ---------- Mobile Drawer ---------- */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 270, pt: 2 }}>
          <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CarIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" fontWeight={800} color="primary" lineHeight={1.2}>
                {t('nav.drawerTitle')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('nav.drawerSubtitle')}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <List sx={{ pt: 1 }}>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.path}
                selected={currentPath === item.path}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{ borderRadius: 2, mx: 1, my: 0.3 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* ---------- Main Content ---------- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: isMobile ? 10 : 4,
          pt: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>

      {/* ---------- Mobile Bottom Nav ---------- */}
      {isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
          elevation={8}
        >
          <BottomNavigation
            value={currentIndex >= 0 ? currentIndex : 0}
            onChange={(_, newValue) => navigate(NAV_ITEMS[newValue].path)}
            showLabels
            sx={{
              height: 64,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                py: 1,
              },
              '& .Mui-selected': {
                color: 'primary.main',
              },
            }}
          >
            {NAV_ITEMS.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
