import { Box, Typography, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';

export default function StatCard({ icon, title, value, subtitle, color = 'primary.main' }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2.5 } } }}>
        {isSmall ? (
          /* ── Mobile: stacked layout ── */
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: `${color}15`,
                color: color,
                mb: 0.75,
                '& .MuiSvgIcon-root': { fontSize: '1.2rem' },
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
              display="block"
              sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}
            >
              {title}
            </Typography>
            <Typography
              fontWeight={800}
              color={color}
              sx={{ fontSize: '1.35rem', lineHeight: 1.2, mt: 0.25 }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ fontSize: '0.6rem', lineHeight: 1.2, mt: 0.25 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        ) : (
          /* ── Desktop: side-by-side layout ── */
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: `${color}15`,
                color: color,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {title}
              </Typography>
              <Typography variant="h5" fontWeight={800} color={color} sx={{ lineHeight: 1.2, mt: 0.3 }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
