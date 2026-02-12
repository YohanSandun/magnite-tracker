import { differenceInDays, addDays, format, parseISO } from 'date-fns';

// --------------- Average Calculations ---------------

const avgDaysBetween = (orders, fromKey, toKey) => {
  const valid = orders.filter((o) => o[fromKey] && o[toKey]);
  if (valid.length < 1) return null;
  const total = valid.reduce((sum, o) => {
    return sum + differenceInDays(parseISO(o[toKey]), parseISO(o[fromKey]));
  }, 0);
  return Math.round(total / valid.length);
};

const medianDaysBetween = (orders, fromKey, toKey) => {
  const valid = orders.filter((o) => o[fromKey] && o[toKey]);
  if (valid.length < 1) return null;
  const days = valid
    .map((o) => differenceInDays(parseISO(o[toKey]), parseISO(o[fromKey])))
    .sort((a, b) => a - b);
  const mid = Math.floor(days.length / 2);
  return days.length % 2 === 0 ? Math.round((days[mid - 1] + days[mid]) / 2) : days[mid];
};

// --------------- Prediction Stats ---------------

export const getPredictionStats = (orders) => {
  return {
    orderToSms: avgDaysBetween(orders, 'orderDate', 'smsReceivedDate'),
    smsToPayment: avgDaysBetween(orders, 'smsReceivedDate', 'fullPaymentDate'),
    paymentToReceived: avgDaysBetween(orders, 'fullPaymentDate', 'vehicleReceivedDate'),
    receivedToNumber: avgDaysBetween(orders, 'vehicleReceivedDate', 'vehicleNumberDate'),
    orderToReceived: avgDaysBetween(orders, 'orderDate', 'vehicleReceivedDate'),

    medianOrderToSms: medianDaysBetween(orders, 'orderDate', 'smsReceivedDate'),
    medianOrderToReceived: medianDaysBetween(orders, 'orderDate', 'vehicleReceivedDate'),

    totalOrders: orders.length,
    completedOrders: orders.filter((o) => o.vehicleReceivedDate).length,
    pendingOrders: orders.filter((o) => !o.vehicleReceivedDate).length,
    arrivedInSL: orders.filter((o) => o.smsReceivedDate && !o.vehicleReceivedDate).length,

    sampleSizeOrderToSms: orders.filter((o) => o.orderDate && o.smsReceivedDate).length,
    sampleSizeOrderToReceived: orders.filter((o) => o.orderDate && o.vehicleReceivedDate).length,
  };
};

// --------------- Predict Dates for a Specific Order ---------------

export const predictDatesForOrder = (order, stats) => {
  const predictions = {};

  if (order.orderDate && !order.smsReceivedDate && stats.orderToSms) {
    predictions.smsReceivedDate = format(
      addDays(parseISO(order.orderDate), stats.orderToSms),
      'yyyy-MM-dd'
    );
  }

  const smsDate = order.smsReceivedDate || predictions.smsReceivedDate;
  if (smsDate && !order.fullPaymentDate && stats.smsToPayment) {
    predictions.fullPaymentDate = format(
      addDays(parseISO(smsDate), stats.smsToPayment),
      'yyyy-MM-dd'
    );
  }

  const paymentDate = order.fullPaymentDate || predictions.fullPaymentDate;
  if (paymentDate && !order.vehicleReceivedDate && stats.paymentToReceived) {
    predictions.vehicleReceivedDate = format(
      addDays(parseISO(paymentDate), stats.paymentToReceived),
      'yyyy-MM-dd'
    );
  }

  const receivedDate = order.vehicleReceivedDate || predictions.vehicleReceivedDate;
  if (receivedDate && !order.vehicleNumberDate && stats.receivedToNumber) {
    predictions.vehicleNumberDate = format(
      addDays(parseISO(receivedDate), stats.receivedToNumber),
      'yyyy-MM-dd'
    );
  }

  return predictions;
};

// --------------- Charts & Analytics ---------------

export const getShipmentPatterns = (orders) => {
  const monthly = {};
  orders.forEach((o) => {
    if (o.smsReceivedDate) {
      const month = o.smsReceivedDate.substring(0, 7);
      monthly[month] = (monthly[month] || 0) + 1;
    }
  });
  return Object.entries(monthly)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const getModelDistribution = (orders) => {
  const dist = {};
  orders.forEach((o) => {
    dist[o.model] = (dist[o.model] || 0) + 1;
  });
  return Object.entries(dist).map(([model, count]) => ({ model, count }));
};

export const getColorDistribution = (orders) => {
  const dist = {};
  orders.forEach((o) => {
    dist[o.color] = (dist[o.color] || 0) + 1;
  });
  return Object.entries(dist).map(([color, count]) => ({ color, count }));
};

export const getStatusDistribution = (orders) => {
  let ordered = 0,
    arrived = 0,
    paid = 0,
    received = 0,
    numbered = 0;

  orders.forEach((o) => {
    if (o.vehicleNumberDate) numbered++;
    else if (o.vehicleReceivedDate) received++;
    else if (o.fullPaymentDate) paid++;
    else if (o.smsReceivedDate) arrived++;
    else ordered++;
  });

  return [
    { status: 'Order Placed', count: ordered, fill: '#1B3A5C' },
    { status: 'Arrived in SL', count: arrived, fill: '#0288D1' },
    { status: 'Fully Paid', count: paid, fill: '#ED6C02' },
    { status: 'Vehicle Received', count: received, fill: '#2E7D32' },
    { status: 'Completed', count: numbered, fill: '#4CAF50' },
  ];
};

export const getWaitTimeDistribution = (orders) => {
  const buckets = {
    '< 30 days': 0,
    '30-60 days': 0,
    '60-90 days': 0,
    '90-120 days': 0,
    '120-180 days': 0,
    '180+ days': 0,
  };

  orders.forEach((o) => {
    if (o.orderDate && o.vehicleReceivedDate) {
      const days = differenceInDays(parseISO(o.vehicleReceivedDate), parseISO(o.orderDate));
      if (days < 30) buckets['< 30 days']++;
      else if (days < 60) buckets['30-60 days']++;
      else if (days < 90) buckets['60-90 days']++;
      else if (days < 120) buckets['90-120 days']++;
      else if (days < 180) buckets['120-180 days']++;
      else buckets['180+ days']++;
    }
  });

  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
};
