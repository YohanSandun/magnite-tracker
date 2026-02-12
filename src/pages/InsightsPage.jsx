import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Timer as TimerIcon,
  People as PeopleIcon,
  TrendingUp as TrendIcon,
  LocalShipping as ShipIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import StatCard from '../components/StatCard';
import { getAllOrders } from '../services/orderService';
import {
  getPredictionStats,
  getShipmentPatterns,
  getModelDistribution,
  getColorDistribution,
  getStatusDistribution,
  getWaitTimeDistribution,
} from '../utils/predictions';
import { getModelById, getColorById } from '../constants/vehicleData';
import { useI18n } from '../i18n';

const PIE_COLORS = ['#1B3A5C', '#E63946', '#0288D1', '#2E7D32', '#ED6C02', '#9C27B0', '#00BCD4'];

export default function InsightsPage() {
  const { t } = useI18n();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (orders.length === 0) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {t('insights.title')}
        </Typography>
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              {t('insights.noDataYet')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('insights.noDataDesc')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const shipmentData = getShipmentPatterns(orders);
  const modelData = getModelDistribution(orders).map((d) => ({
    ...d,
    name: getModelById(d.model)?.shortName || d.model,
  }));
  const colorData = getColorDistribution(orders).map((d) => ({
    ...d,
    name: getColorById(d.color)?.name || d.color,
    fill: getColorById(d.color)?.hex || '#888',
  }));
  const statusData = getStatusDistribution(orders);
  const waitData = getWaitTimeDistribution(orders);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {t('insights.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('insights.description')}
      </Typography>

      {/* ---------- Key Stats ---------- */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<PeopleIcon />}
            title={t('insights.totalReports')}
            value={stats.totalOrders}
            color="#1B3A5C"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<TimerIcon />}
            title={t('insights.avgWait')}
            value={stats.orderToReceived ? `${stats.orderToReceived}d` : '—'}
            subtitle={stats.medianOrderToReceived ? `${t('insights.median')}: ${stats.medianOrderToReceived}d` : ''}
            color="#E63946"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<ShipIcon />}
            title={t('insights.avgToArrive')}
            value={stats.orderToSms ? `${stats.orderToSms}d` : '—'}
            subtitle={stats.medianOrderToSms ? `${t('insights.median')}: ${stats.medianOrderToSms}d` : ''}
            color="#0288D1"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<TrendIcon />}
            title={t('insights.completed')}
            value={stats.completedOrders}
            subtitle={`${stats.pendingOrders} ${t('insights.pending')}`}
            color="#2E7D32"
          />
        </Grid>
      </Grid>

      {/* ---------- Milestone Breakdown ---------- */}
      {(stats.orderToSms || stats.smsToPayment || stats.paymentToReceived || stats.receivedToNumber) && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('insights.avgDaysBetweenMilestones')}
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: t('insights.orderToArrivedSL'), value: stats.orderToSms, color: '#1B3A5C' },
                { label: t('insights.arrivedToPayment'), value: stats.smsToPayment, color: '#0288D1' },
                { label: t('insights.paymentToReceived'), value: stats.paymentToReceived, color: '#ED6C02' },
                { label: t('insights.receivedToNumber'), value: stats.receivedToNumber, color: '#2E7D32' },
              ]
                .filter((m) => m.value !== null)
                .map((m) => (
                  <Grid item xs={6} sm={3} key={m.label}>
                    <Box sx={{ textAlign: 'center', py: 1 }}>
                      <Typography variant="h4" fontWeight={800} sx={{ color: m.color }}>
                        {m.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {m.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* ---------- Shipment Arrivals Chart ---------- */}
        {shipmentData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('insights.monthlyShipmentArrivals')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('insights.vehiclesArrivingPerMonth')}
                </Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={shipmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => {
                        const [y, m] = val.split('-');
                        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
                      }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(val) => [val, t('common.vehicles')]}
                      labelFormatter={(val) => `Month: ${val}`}
                    />
                    <Bar dataKey="count" fill="#1B3A5C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* ---------- Wait Time Distribution ---------- */}
        {waitData.some((d) => d.count > 0) && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('insights.waitTimeDistribution')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('insights.waitTimeDesc')}
                </Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={waitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(val) => [val, t('common.orders')]} />
                    <Bar dataKey="count" fill="#E63946" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* ---------- Order Status Distribution ---------- */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('insights.orderStatusDistribution')}
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData.filter((d) => d.count > 0)}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ status, count }) => `${status} (${count})`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {statusData
                      .filter((d) => d.count > 0)
                      .map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ---------- Model Popularity ---------- */}
        {modelData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('insights.modelPopularity')}
                </Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={modelData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, count }) => `${name} (${count})`}
                      labelLine={{ strokeWidth: 1 }}
                    >
                      {modelData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* ---------- Color Popularity ---------- */}
        {colorData.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('insights.colorPopularity')}
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={colorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val) => [val, t('common.orders')]} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {colorData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
