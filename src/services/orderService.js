import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const COLLECTION = 'orders';

// --------------- Helpers ---------------
const toTimestamp = (dateStr) => {
  if (!dateStr) return null;
  return Timestamp.fromDate(new Date(dateStr + 'T00:00:00'));
};

const fromTimestamp = (ts) => {
  if (!ts) return null;
  const d = ts.toDate();
  return d.toISOString().split('T')[0];
};

const sanitizeOrder = (data) => ({
  orderNumber: data.orderNumber,
  model: data.model,
  color: data.color,
  orderDate: fromTimestamp(data.orderDate),
  smsReceivedDate: fromTimestamp(data.smsReceivedDate),
  fullPaymentDate: fromTimestamp(data.fullPaymentDate),
  vehicleReceivedDate: fromTimestamp(data.vehicleReceivedDate),
  vehicleNumberDate: fromTimestamp(data.vehicleNumberDate),
  vehicleNumber: data.vehicleNumber || '',
  createdAt: data.createdAt?.toDate?.() || null,
  updatedAt: data.updatedAt?.toDate?.() || null,
});

// --------------- CRUD Operations ---------------

/**
 * Create a new order.
 */
export const createOrder = async (orderData) => {
  const { orderNumber, model, color, orderDate, smsReceivedDate, fullPaymentDate, vehicleReceivedDate, vehicleNumberDate, vehicleNumber } = orderData;

  // Check if order already exists
  const docRef = doc(db, COLLECTION, orderNumber);
  const existing = await getDoc(docRef);
  if (existing.exists()) {
    throw new Error('An order with this number already exists. Use the Track page to update it.');
  }

  await setDoc(docRef, {
    orderNumber,
    model,
    color,
    orderDate: toTimestamp(orderDate),
    smsReceivedDate: toTimestamp(smsReceivedDate),
    fullPaymentDate: toTimestamp(fullPaymentDate),
    vehicleReceivedDate: toTimestamp(vehicleReceivedDate),
    vehicleNumberDate: toTimestamp(vehicleNumberDate),
    vehicleNumber: vehicleNumber || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return orderNumber;
};

/**
 * Get a single order by order number (public data, no edit code hash).
 */
export const getOrder = async (orderNumber) => {
  const docRef = doc(db, COLLECTION, orderNumber);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return sanitizeOrder(snap.data());
};

/**
 * Update an order by order number.
 */
export const updateOrder = async (orderNumber, updates) => {
  const docRef = doc(db, COLLECTION, orderNumber);
  const updateData = { updatedAt: serverTimestamp() };

  if (updates.smsReceivedDate !== undefined) {
    updateData.smsReceivedDate = toTimestamp(updates.smsReceivedDate);
  }
  if (updates.fullPaymentDate !== undefined) {
    updateData.fullPaymentDate = toTimestamp(updates.fullPaymentDate);
  }
  if (updates.vehicleReceivedDate !== undefined) {
    updateData.vehicleReceivedDate = toTimestamp(updates.vehicleReceivedDate);
  }
  if (updates.vehicleNumberDate !== undefined) {
    updateData.vehicleNumberDate = toTimestamp(updates.vehicleNumberDate);
  }
  if (updates.vehicleNumber !== undefined) {
    updateData.vehicleNumber = updates.vehicleNumber;
  }

  await updateDoc(docRef, updateData);
};

/**
 * Get all orders for community view (no edit code hashes).
 */
export const getAllOrders = async () => {
  const q = query(collection(db, COLLECTION), orderBy('orderDate', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...sanitizeOrder(data),
      maskedOrderNumber: '****' + data.orderNumber.slice(-4),
    };
  });
};
