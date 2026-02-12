export const MODELS = [
  {
    id: 'accenta-auto',
    name: 'Magnite (Accenta) 1.0L Automatic',
    shortName: 'Accenta 1.0L AT',
    variant: 'Accenta',
    engine: '1.0 Litre',
    transmission: 'Automatic',
    price: 7800000,
    priceFormatted: 'Rs. 7,800,000',
  },
  {
    id: 'tekna-plus-auto',
    name: 'Magnite (Tekna+) 1.0L Automatic',
    shortName: 'Tekna+ 1.0L AT',
    variant: 'Tekna+',
    engine: '1.0 Litre',
    transmission: 'Automatic',
    price: 8900000,
    priceFormatted: 'Rs. 8,900,000',
  },
  {
    id: 'n-connecta-turbo',
    name: 'Magnite (N Connecta) 1.0L Turbo CVT',
    shortName: 'N Connecta Turbo',
    variant: 'N Connecta',
    engine: '1.0 Litre Turbo',
    transmission: 'CVT',
    price: 9500000,
    priceFormatted: 'Rs. 9,500,000',
  },
  {
    id: 'tekna-plus-turbo',
    name: 'Magnite (Tekna+) 1.0L Turbo CVT',
    shortName: 'Tekna+ Turbo',
    variant: 'Tekna+',
    engine: '1.0 Litre Turbo',
    transmission: 'CVT',
    price: null,
    priceFormatted: 'Price TBA',
  },
];

export const COLORS = [
  { id: 'blade-silver', name: 'Blade Silver', hex: '#A8A9AD' },
  { id: 'storm-white', name: 'Storm White', hex: '#E8E8E8' },
  { id: 'pearl-white', name: 'Pearl White', hex: '#F5F0E8' },
  { id: 'vivid-blue', name: 'Vivid Blue', hex: '#1A5AB8' },
  { id: 'onyx-black', name: 'Onyx Black', hex: '#1C1C1C' },
  { id: 'flare-garnet-red', name: 'Flare Garnet Red', hex: '#7B1E2D' },
  { id: 'sunrise-copper-orange', name: 'Sunrise Copper Orange', hex: '#B5651D' },
];

export const MILESTONES = [
  {
    key: 'orderDate',
    label: 'Order Placed',
    description: 'Advanced payment made to AMW',
  },
  {
    key: 'smsReceivedDate',
    label: 'Vehicle Arrived in SL',
    description: 'SMS received — vehicle shipped from India to Sri Lanka',
  },
  {
    key: 'fullPaymentDate',
    label: 'Full Payment Made',
    description: 'Remaining balance paid to AMW',
  },
  {
    key: 'vehicleReceivedDate',
    label: 'Vehicle Received',
    description: 'Vehicle collected from AMW',
  },
  {
    key: 'vehicleNumberDate',
    label: 'Number Plate Received',
    description: 'Vehicle registration number issued',
  },
];

export const getModelById = (id) => MODELS.find((m) => m.id === id);
export const getColorById = (id) => COLORS.find((c) => c.id === id);

export const getOrderStatus = (order) => {
  if (order.vehicleNumberDate) return { labelKey: 'status.completed', label: 'Completed', color: 'success', step: 5 };
  if (order.vehicleReceivedDate) return { labelKey: 'status.vehicleReceived', label: 'Vehicle Received', color: 'info', step: 4 };
  if (order.fullPaymentDate) return { labelKey: 'status.fullyPaid', label: 'Fully Paid', color: 'warning', step: 3 };
  if (order.smsReceivedDate) return { labelKey: 'status.arrivedInSL', label: 'Arrived in SL', color: 'secondary', step: 2 };
  return { labelKey: 'status.orderPlaced', label: 'Order Placed', color: 'primary', step: 1 };
};
