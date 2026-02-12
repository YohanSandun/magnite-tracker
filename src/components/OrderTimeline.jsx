import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as PendingIcon,
  AutoAwesome as PredictedIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { MILESTONES } from '../constants/vehicleData';
import { useI18n } from '../i18n';

// Map milestone keys to i18n translation keys
const MILESTONE_I18N = {
  orderDate: { label: 'milestones.orderPlaced', desc: 'milestones.orderPlacedDesc' },
  smsReceivedDate: { label: 'milestones.arrivedInSL', desc: 'milestones.arrivedInSLDesc' },
  fullPaymentDate: { label: 'milestones.fullPayment', desc: 'milestones.fullPaymentDesc' },
  vehicleReceivedDate: { label: 'milestones.vehicleReceived', desc: 'milestones.vehicleReceivedDesc' },
  vehicleNumberDate: { label: 'milestones.numberPlate', desc: 'milestones.numberPlateDesc' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
}

export default function OrderTimeline({ order, predictions = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useI18n();

  // Determine active step (first milestone without a date)
  const activeStep = MILESTONES.findIndex((m) => !order[m.key]);

  return (
    <Box>
      <Stepper
        activeStep={activeStep === -1 ? MILESTONES.length : activeStep}
        orientation="vertical"
        sx={{
          '& .MuiStepConnector-line': {
            minHeight: 28,
            borderColor: 'divider',
          },
        }}
      >
        {MILESTONES.map((milestone, index) => {
          const actualDate = order[milestone.key];
          const predictedDate = predictions[milestone.key];
          const isCompleted = !!actualDate;
          const isPredicted = !isCompleted && !!predictedDate;

          return (
            <Step key={milestone.key} completed={isCompleted}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isCompleted
                        ? 'success.main'
                        : isPredicted
                        ? 'warning.light'
                        : 'grey.300',
                      color: 'white',
                      transition: 'all 0.3s',
                    }}
                  >
                    {isCompleted ? (
                      <CheckIcon sx={{ fontSize: 20 }} />
                    ) : isPredicted ? (
                      <PredictedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <PendingIcon sx={{ fontSize: 20, color: 'grey.500' }} />
                    )}
                  </Box>
                )}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={isCompleted ? 700 : 500}
                    color={isCompleted ? 'text.primary' : 'text.secondary'}
                  >
                    {t(MILESTONE_I18N[milestone.key]?.label) || milestone.label}
                  </Typography>

                  {isCompleted && (
                    <Chip
                      label={formatDate(actualDate)}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  )}

                  {isPredicted && (
                    <Chip
                      label={`~${formatDate(predictedDate)} (${t('track.estimated')})`}
                      size="small"
                      color="warning"
                      variant="outlined"
                      icon={<PredictedIcon sx={{ fontSize: 14 }} />}
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {t(MILESTONE_I18N[milestone.key]?.desc) || milestone.description}
                </Typography>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
