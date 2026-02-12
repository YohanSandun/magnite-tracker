import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { getAllOrders } from '../services/orderService';
import { MODELS, COLORS, getModelById, getColorById, getOrderStatus } from '../constants/vehicleData';
import { useI18n } from '../i18n';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
}

export default function CommunityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useI18n();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filterModel, setFilterModel] = useState('all');
  const [filterColor, setFilterColor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError(t('home.firebaseError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterModel !== 'all' && o.model !== filterModel) return false;
      if (filterColor !== 'all' && o.color !== filterColor) return false;
      if (filterStatus !== 'all') {
        const s = getOrderStatus(o);
        if (filterStatus === 'completed' && s.step < 5) return false;
        if (filterStatus === 'in-progress' && s.step >= 5) return false;
        if (filterStatus === 'waiting' && s.step > 1) return false;
      }
      return true;
    });
  }, [orders, filterModel, filterColor, filterStatus]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {t('community.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('community.description')}
      </Typography>

      {/* ---------- Filters ---------- */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label={t('common.model')}
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                size="small"
              >
                <MenuItem value="all">{t('community.allModels')}</MenuItem>
                {MODELS.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.shortName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                select
                label={t('common.color')}
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
                size="small"
              >
                <MenuItem value="all">{t('community.allColors')}</MenuItem>
                {COLORS.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          bgcolor: c.hex,
                          border: '1px solid rgba(0,0,0,0.12)',
                        }}
                      />
                      {c.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                select
                label={t('common.status')}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="small"
              >
                <MenuItem value="all">{t('community.allStatuses')}</MenuItem>
                <MenuItem value="waiting">{t('status.orderPlaced')}</MenuItem>
                <MenuItem value="in-progress">{t('community.inProgress')}</MenuItem>
                <MenuItem value="completed">{t('status.completed')}</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orders.length > 0
                ? t('community.noMatchingOrders')
                : t('home.beTheFirst')}
            </Typography>
          </CardContent>
        </Card>
      ) : isMobile ? (
        /* ---------- Mobile: Card List ---------- */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Showing {filteredOrders.length} of {orders.length} orders
          </Typography>
          {filteredOrders.map((order, i) => {
            const model = getModelById(order.model);
            const color = getColorById(order.color);
            const status = getOrderStatus(order);
            return (
              <Card key={i}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" fontFamily="monospace">
                      {order.maskedOrderNumber}
                    </Typography>
                    <Chip label={t(status.labelKey)} size="small" color={status.color} variant="outlined" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {color && (
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          bgcolor: color.hex,
                          border: '1px solid rgba(0,0,0,0.12)',
                        }}
                      />
                    )}
                    <Typography variant="body2" fontWeight={600}>
                      {model?.shortName || order.model}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      · {color?.name || order.color}
                    </Typography>
                  </Box>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t('common.ordered')}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(order.orderDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t('community.arrivedSL')}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(order.smsReceivedDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t('community.paid')}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(order.fullPaymentDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t('community.received')}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(order.vehicleReceivedDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        /* ---------- Desktop: Table ---------- */
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Showing {filteredOrders.length} of {orders.length} orders
          </Typography>
          <Card>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>{t('common.order')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('common.model')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('common.color')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('common.ordered')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('community.arrivedSL')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('community.paid')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('community.received')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('common.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order, i) => {
                    const model = getModelById(order.model);
                    const color = getColorById(order.color);
                    const status = getOrderStatus(order);
                    return (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
                            {order.maskedOrderNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{model?.shortName || order.model}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            {color && (
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: color.hex,
                                  border: '1px solid rgba(0,0,0,0.12)',
                                }}
                              />
                            )}
                            <Typography variant="body2">{color?.name || order.color}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>{formatDate(order.smsReceivedDate)}</TableCell>
                        <TableCell>{formatDate(order.fullPaymentDate)}</TableCell>
                        <TableCell>{formatDate(order.vehicleReceivedDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(status.labelKey)}
                            size="small"
                            color={status.color}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Box>
  );
}
