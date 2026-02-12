import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
  LocalShipping as ShipIcon,
  TrendingUp as TrendIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import StatCard from '../components/StatCard';
import { getAllOrders } from '../services/orderService';
import { getPredictionStats } from '../utils/predictions';
import { getModelById, getColorById, getOrderStatus } from '../constants/vehicleData';
import { format, parseISO } from 'date-fns';
import { useI18n } from '../i18n';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
        setStats(getPredictionStats(data));
      } catch (err) {
        setError(t('home.firebaseError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      {/* ---------- Hero Section ---------- */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #1B3A5C 0%, #2E5C8A 50%, #0D1F33 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              position: 'absolute',
              right: -20,
              top: -20,
              opacity: 0.06,
              fontSize: 200,
              zIndex: 0,
            }}
          >
            <CarIcon sx={{ fontSize: 'inherit' }} />
          </Box>

          <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
            {t('home.communityDriven')}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1, lineHeight: 1.2 }}>
            {t('home.heroTitle1')}
            <br />
            {t('home.heroTitle2')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 3, opacity: 0.85, maxWidth: 500, lineHeight: 1.6 }}
          >
            {t('home.heroDescription')}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate('/report')}
              sx={{
                background: '#43A047',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(67,160,71,0.4)',
                '&:hover': { background: '#388E3C' },
              }}
            >
              {t('home.reportYourOrder')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/track')}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              {t('home.trackYourOrder')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ---------- Stats Section ---------- */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('home.communityOverview')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <StatCard
                icon={<PeopleIcon />}
                title={t('home.totalOrders')}
                value={stats?.totalOrders || 0}
                subtitle={t('home.reportedByCommunity')}
                color="#1B3A5C"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                icon={<TimerIcon />}
                title={t('home.avgWaitTime')}
                value={stats?.orderToReceived ? `${stats.orderToReceived}d` : '—'}
                subtitle={t('home.orderToDelivery')}
                color="#E63946"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                icon={<ShipIcon />}
                title={t('home.arrivedInSL')}
                value={stats?.arrivedInSL || 0}
                subtitle={t('home.awaitingDelivery')}
                color="#0288D1"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                icon={<TrendIcon />}
                title={t('home.delivered')}
                value={stats?.completedOrders || 0}
                subtitle={t('home.vehiclesReceived')}
                color="#2E7D32"
              />
            </Grid>
          </Grid>

          {/* ---------- Average Milestones ---------- */}
          {stats && (stats.orderToSms || stats.smsToPayment || stats.paymentToReceived) && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('home.avgMilestoneDurations')}
              </Typography>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    {stats.orderToSms && (
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', py: 1 }}>
                          <Typography variant="h4" fontWeight={800} color="primary.main">
                            {stats.orderToSms}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('home.daysOrderToArrival')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({stats.sampleSizeOrderToSms} reports)
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {stats.smsToPayment && (
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', py: 1 }}>
                          <Typography variant="h4" fontWeight={800} color="info.main">
                            {stats.smsToPayment}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('home.daysArrivalToPayment')}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {stats.paymentToReceived && (
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', py: 1 }}>
                          <Typography variant="h4" fontWeight={800} color="success.main">
                            {stats.paymentToReceived}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('home.daysPaymentToReceived')}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </>
          )}

          {/* ---------- Recent Activity ---------- */}
          {orders.length > 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{t('home.recentActivity')}</Typography>
                <Button size="small" onClick={() => navigate('/community')}>
                  {t('common.viewAll')}
                </Button>
              </Box>
              <Grid container spacing={2}>
                {orders.slice(0, 6).map((order, i) => {
                  const model = getModelById(order.model);
                  const color = getColorById(order.color);
                  const status = getOrderStatus(order);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Card
                        sx={{
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-2px)' },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {order.maskedOrderNumber}
                            </Typography>
                            <Chip
                              label={t(status.labelKey)}
                              size="small"
                              color={status.color}
                              variant="outlined"
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            {color && (
                              <Box
                                sx={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: '50%',
                                  bgcolor: color.hex,
                                  border: '1px solid rgba(0,0,0,0.15)',
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {model?.shortName || order.model}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {color?.name || order.color}
                          </Typography>
                          {order.orderDate && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              Ordered: {format(parseISO(order.orderDate), 'MMM dd, yyyy')}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}

          {orders.length === 0 && !error && (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <CarIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('home.noOrdersYet')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {t('home.beTheFirst')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/report')}
                >
                  {t('home.reportYourOrder')}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
