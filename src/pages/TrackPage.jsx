import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Chip,
  Divider,
  InputAdornment,
  CircularProgress,
  Collapse,
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import OrderTimeline from '../components/OrderTimeline';
import { getOrder, updateOrder, getAllOrders } from '../services/orderService';
import { getModelById, getColorById, getOrderStatus, MILESTONES } from '../constants/vehicleData';
import { getPredictionStats, predictDatesForOrder } from '../utils/predictions';
import { useI18n } from '../i18n';

export default function TrackPage() {
  const { orderNumber: paramOrderNumber } = useParams();
  const { t } = useI18n();

  const [searchNumber, setSearchNumber] = useState(paramOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [updates, setUpdates] = useState({});
  const [saving, setSaving] = useState(false);

  // Load order if URL has order number
  useEffect(() => {
    if (paramOrderNumber) {
      handleSearch(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleSearch = async (orderNum) => {
    const num = (orderNum || searchNumber).trim();
    if (!num) {
      setError(t('track.enterOrderNumber'));
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);
    setPredictions({});
    setEditMode(false);

    try {
      const result = await getOrder(num);
      if (!result) {
        setError(t('track.notFound'));
        return;
      }
      setOrder(result);

      // Fetch all orders for predictions
      try {
        const allOrders = await getAllOrders();
        const stats = getPredictionStats(allOrders);
        const preds = predictDatesForOrder(result, stats);
        setPredictions(preds);
      } catch {
        // Non-critical: predictions just won't show
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterEditMode = () => {
    setEditMode(true);
    setUpdates({
      smsReceivedDate: order.smsReceivedDate || '',
      fullPaymentDate: order.fullPaymentDate || '',
      vehicleReceivedDate: order.vehicleReceivedDate || '',
      vehicleNumberDate: order.vehicleNumberDate || '',
      vehicleNumber: order.vehicleNumber || '',
    });
  };

  const handleUpdateChange = (field) => (e) => {
    setUpdates((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveUpdates = async () => {
    setSaving(true);
    setError('');
    try {
      const changedFields = {};
      if (updates.smsReceivedDate !== (order.smsReceivedDate || ''))
        changedFields.smsReceivedDate = updates.smsReceivedDate || null;
      if (updates.fullPaymentDate !== (order.fullPaymentDate || ''))
        changedFields.fullPaymentDate = updates.fullPaymentDate || null;
      if (updates.vehicleReceivedDate !== (order.vehicleReceivedDate || ''))
        changedFields.vehicleReceivedDate = updates.vehicleReceivedDate || null;
      if (updates.vehicleNumberDate !== (order.vehicleNumberDate || ''))
        changedFields.vehicleNumberDate = updates.vehicleNumberDate || null;
      if (updates.vehicleNumber !== (order.vehicleNumber || ''))
        changedFields.vehicleNumber = updates.vehicleNumber;

      if (Object.keys(changedFields).length === 0) {
        setMessage(t('track.noChanges'));
        return;
      }

      await updateOrder(order.orderNumber, changedFields);
      setMessage(t('track.updateSuccess'));
      setEditMode(false);
      // Refresh
      await handleSearch(order.orderNumber);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const model = order ? getModelById(order.model) : null;
  const color = order ? getColorById(order.color) : null;
  const status = order ? getOrderStatus(order) : null;

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {t('track.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('track.description')}
      </Typography>

      {/* ---------- Search ---------- */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}
          >
            <TextField
              fullWidth
              label={t('track.orderNumber')}
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder={t('track.orderNumberPlaceholder')}
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => handleSearch()}
              disabled={loading}
              sx={{ minWidth: 140, height: 56 }}
            >
              {loading ? t('track.searching') : t('common.search')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ---------- Order Details ---------- */}
      {order && !loading && (
        <>
          {/* Order Info Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Order Number
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {order.orderNumber}
                  </Typography>
                </Box>
                  <Chip label={t(status.labelKey)} color={status.color} sx={{ fontWeight: 700 }} />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Model
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {model?.shortName || order.model}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Color
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      {color && (
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: color.hex,
                            border: '1px solid rgba(0,0,0,0.15)',
                          }}
                        />
                      )}
                      <Typography variant="body2" fontWeight={600}>
                        {color?.name || order.color}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {model?.priceFormatted || '—'}
                  </Typography>
                </Grid>
                {order.vehicleNumber && (
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Vehicle Number
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {order.vehicleNumber}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                {t('track.orderTimeline')}
              </Typography>
              {Object.keys(predictions).length > 0 && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }} icon={false}>
                  {t('track.estimatedDatesNote')}
                </Alert>
              )}
              <OrderTimeline order={order} predictions={predictions} />
            </CardContent>
          </Card>

          {/* ---------- Update Section ---------- */}
          <Card>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{t('track.updateMilestones')}</Typography>
                {!editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEnterEditMode}
                    size="small"
                  >
                    {t('common.edit')}
                  </Button>
                )}
              </Box>

              <Collapse in={editMode}>
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('report.smsDateLabel')}
                          type="date"
                          value={updates.smsReceivedDate || ''}
                          onChange={handleUpdateChange('smsReceivedDate')}
                          InputLabelProps={{ shrink: true }}
                          helperText={t('report.smsDateHelper')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('report.fullPaymentDateLabel')}
                          type="date"
                          value={updates.fullPaymentDate || ''}
                          onChange={handleUpdateChange('fullPaymentDate')}
                          InputLabelProps={{ shrink: true }}
                          helperText={t('report.fullPaymentDateHelper')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('report.vehicleReceivedDateLabel')}
                          type="date"
                          value={updates.vehicleReceivedDate || ''}
                          onChange={handleUpdateChange('vehicleReceivedDate')}
                          InputLabelProps={{ shrink: true }}
                          helperText={t('report.vehicleReceivedDateHelper')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('report.numberPlateDateLabel')}
                          type="date"
                          value={updates.vehicleNumberDate || ''}
                          onChange={handleUpdateChange('vehicleNumberDate')}
                          InputLabelProps={{ shrink: true }}
                          helperText={t('report.numberPlateDateHelper')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('report.vehicleRegNumber')}
                          value={updates.vehicleNumber || ''}
                          onChange={handleUpdateChange('vehicleNumber')}
                          placeholder={t('report.vehicleRegPlaceholder')}
                          helperText={t('report.vehicleRegHelper')}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveUpdates}
                            disabled={saving}
                            sx={{ minWidth: 160 }}
                          >
                            {saving ? t('track.saving') : t('track.saveUpdates')}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setEditMode(false)}
                          >
                            {t('common.cancel')}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
              </Collapse>

              {!editMode && (
                <Typography variant="body2" color="text.secondary">
                  {t('track.clickEditToUpdate')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
