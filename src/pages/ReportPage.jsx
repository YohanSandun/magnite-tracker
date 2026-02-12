import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  Snackbar,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  DirectionsCar as CarIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { MODELS, COLORS } from '../constants/vehicleData';
import { createOrder } from '../services/orderService';
import { useI18n } from '../i18n';

export default function ReportPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [form, setForm] = useState({
    orderNumber: '',
    model: '',
    color: '',
    orderDate: '',
    smsReceivedDate: '',
    fullPaymentDate: '',
    vehicleReceivedDate: '',
    vehicleNumberDate: '',
    vehicleNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!form.orderNumber.trim()) return t('report.valOrderRequired');
    if (!form.model) return t('report.valModelRequired');
    if (!form.color) return t('report.valColorRequired');
    if (!form.orderDate) return t('report.valDateRequired');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await createOrder({
        orderNumber: form.orderNumber.trim(),
        model: form.model,
        color: form.color,
        orderDate: form.orderDate,
        smsReceivedDate: form.smsReceivedDate || null,
        fullPaymentDate: form.fullPaymentDate || null,
        vehicleReceivedDate: form.vehicleReceivedDate || null,
        vehicleNumberDate: form.vehicleNumberDate || null,
        vehicleNumber: form.vehicleNumber.trim() || '',
      });
      setSuccess(true);
      setTimeout(() => navigate(`/track/${encodeURIComponent(form.orderNumber.trim())}`), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {t('report.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
        {t('report.description')}
      </Typography>

      {/* ---------- Info Card ---------- */}
      <Alert
        severity="info"
        icon={<InfoIcon />}
        sx={{ mb: 3, borderRadius: 3 }}
      >
        <strong>{t('report.howItWorks')}</strong> {t('report.howItWorksDesc')}
      </Alert>

      {/* ---------- Form ---------- */}
      <Card>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Order Number */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('report.orderNumber')}
                  value={form.orderNumber}
                  onChange={handleChange('orderNumber')}
                  placeholder={t('report.orderNumberPlaceholder')}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">#</InputAdornment>,
                  }}
                  helperText={t('report.orderNumberHelper')}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption" color="text.secondary">
                    {t('report.vehicleDetails')}
                  </Typography>
                </Divider>
              </Grid>

              {/* Model */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t('report.vehicleModel')}
                  value={form.model}
                  onChange={handleChange('model')}
                  required
                >
                  {MODELS.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {m.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {m.priceFormatted}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Color */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t('report.vehicleColor')}
                  value={form.color}
                  onChange={handleChange('color')}
                  required
                >
                  {COLORS.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            bgcolor: c.hex,
                            border: '2px solid rgba(0,0,0,0.1)',
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2">{c.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Order Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('report.orderDate')}
                  type="date"
                  value={form.orderDate}
                  onChange={handleChange('orderDate')}
                  required
                  InputLabelProps={{ shrink: true }}
                  helperText={t('report.orderDateHelper')}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption" color="text.secondary">
                    {t('report.milestoneDatesOptional')}
                  </Typography>
                </Divider>
              </Grid>

              {/* SMS Received Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('report.smsDateLabel')}
                  type="date"
                  value={form.smsReceivedDate}
                  onChange={handleChange('smsReceivedDate')}
                  InputLabelProps={{ shrink: true }}
                  helperText={t('report.smsDateHelper')}
                />
              </Grid>

              {/* Full Payment Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('report.fullPaymentDateLabel')}
                  type="date"
                  value={form.fullPaymentDate}
                  onChange={handleChange('fullPaymentDate')}
                  InputLabelProps={{ shrink: true }}
                  helperText={t('report.fullPaymentDateHelper')}
                />
              </Grid>

              {/* Vehicle Received Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('report.vehicleReceivedDateLabel')}
                  type="date"
                  value={form.vehicleReceivedDate}
                  onChange={handleChange('vehicleReceivedDate')}
                  InputLabelProps={{ shrink: true }}
                  helperText={t('report.vehicleReceivedDateHelper')}
                />
              </Grid>

              {/* Number Plate Received Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('report.numberPlateDateLabel')}
                  type="date"
                  value={form.vehicleNumberDate}
                  onChange={handleChange('vehicleNumberDate')}
                  InputLabelProps={{ shrink: true }}
                  helperText={t('report.numberPlateDateHelper')}
                />
              </Grid>

              {/* Vehicle Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('report.vehicleRegNumber')}
                  value={form.vehicleNumber}
                  onChange={handleChange('vehicleNumber')}
                  placeholder={t('report.vehicleRegPlaceholder')}
                  helperText={t('report.vehicleRegHelper')}
                />
              </Grid>

              {/* Error */}
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Grid>
              )}

              {/* Submit */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? null : <SendIcon />}
                  sx={{ py: 1.5, fontSize: '1rem' }}
                >
                  {loading ? t('report.submitting') : t('report.submitOrderReport')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {t('report.successMessage')}
        </Alert>
      </Snackbar>
    </Box>
  );
}
