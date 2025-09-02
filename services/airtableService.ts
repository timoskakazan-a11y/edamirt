

import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_USERS_TABLE_NAME, AIRTABLE_PRODUCTS_TABLE_NAME, AIRTABLE_EMPLOYEES_TABLE_NAME, AIRTABLE_ORDERS_TABLE_NAME, AIRTABLE_REVIEWS_TABLE_NAME, AIRTABLE_BANNERS_TABLE_NAME, AIRTABLE_BETA_CENTER_TABLE_NAME, AIRTABLE_NOTIFICATIONS_TABLE_NAME } from '../constants';
import type { 
    AirtableUserRecord, 
    AirtableUserFields, 
    Product, 
    AirtableProductRecord, 
    CartItem, 
    AirtableEmployeeRecord,
    AirtableOrderRecord,
    AirtableOrderFields,
    OrderStatus,
    Order,
    FullOrderDetails,
    OrderProductInfo,
    AirtableReviewFields,
    Review,
    AirtableReviewRecord,
    AirtableBannerRecord,
    AirtableBetaFeedbackFields,
    Notification,
    AirtableNotificationRecord,
    AirtableNotificationFields,
} from '../types';

const USERS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_USERS_TABLE_NAME)}`;
const PRODUCTS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_PRODUCTS_TABLE_NAME)}`;
const EMPLOYEES_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_EMPLOYEES_TABLE_NAME)}`;
const ORDERS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_ORDERS_TABLE_NAME)}`;
const REVIEWS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_REVIEWS_TABLE_NAME)}`;
const BANNERS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_BANNERS_TABLE_NAME)}`;
const BETA_CENTER_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_BETA_CENTER_TABLE_NAME)}`;
const NOTIFICATIONS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_NOTIFICATIONS_TABLE_NAME)}`;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const commonHeaders = {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
};

const defaultFetchOptions: RequestInit = {
    headers: commonHeaders,
};

const noCacheFetchOptions: RequestInit = {
    headers: commonHeaders,
    cache: 'no-store',
};

// --- MAPPERS ---
const mapAirtableRecordToOrder = (record: AirtableOrderRecord): Order => {
    return {
        id: record.id,
        orderNumber: record.fields['номер заказа'],
        customerName: '', // Not needed for customer-facing banner
        products: record.fields['колво товаров'] || '',
        totalAmount: record.fields['сумма заказа'],
        deliveryTime: record.fields['время на доставку'],
        status: record.fields['статус'],
        address: record.fields['адрес'],
        createdAt: record.createdTime,
        employeeIds: record.fields['работники'] || [],
    };
};


// --- AUTHENTICATION & USER FUNCTIONS ---

export const findUserByEmail = async (email: string): Promise<AirtableUserRecord | null> => {
    const formula = encodeURIComponent(`({email} = "${email}")`);
    const response = await fetch(`${USERS_BASE_URL}?filterByFormula=${formula}`, noCacheFetchOptions);
    if (!response.ok) throw new Error(await response.text());
    const { records } = await response.json();
    return records.length > 0 ? records[0] : null;
};

export const registerUser = async (userData: Omit<AirtableUserFields, 'корзина' | 'колво товаров' | 'итоговая цена' | 'заказ'>): Promise<AirtableUserRecord> => {
    const response = await fetch(USERS_BASE_URL, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({ fields: userData }),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
};

export const getUserCart = async (userId: string): Promise<CartItem[]> => {
    const userResponse = await fetch(`${USERS_BASE_URL}/${userId}`, noCacheFetchOptions);
    if (!userResponse.ok) throw new Error("Could not fetch user data for cart.");
    const userRecord: AirtableUserRecord = await userResponse.json();

    const productIds = userRecord.fields['корзина'];
    const quantityStr = userRecord.fields['колво товаров'];

    if (!productIds || productIds.length === 0 || !quantityStr) {
        return [];
    }
    
    const products = await getProductsByIds(productIds);
    if (products.length === 0) return [];
    
    const productQuantities = new Map<string, number>();
    quantityStr.split(', ').forEach(itemStr => {
        const parts = itemStr.split(' - ');
        if (parts.length < 2) return;
        const qtyStrWithUnit = parts.pop() || '';
        const name = parts.join(' - ');
        const quantity = parseFloat(qtyStrWithUnit) || 0;
        
        const product = products.find(p => p.name === name);
        if (product) {
            productQuantities.set(product.id, quantity);
        }
    });

    const cartItems: CartItem[] = products.map(product => ({
        ...product,
        quantity: productQuantities.get(product.id) || 0,
    })).filter(item => item.quantity > 0);

    return cartItems;
};


export const updateUserCart = async (userId: string, cartItems: CartItem[], cartTotal: number): Promise<void> => {
    const fieldsToUpdate: Partial<AirtableUserFields> = {
        'корзина': cartItems.map(item => item.id),
        'колво товаров': cartItems.map(item => {
            const unit = item.weightStatus === 'на развес' ? 'кг' : 'шт';
            return `${item.name} - ${item.quantity} ${unit}`;
        }).join(', '),
        'итоговая цена': cartTotal,
    };

    const response = await fetch(`${USERS_BASE_URL}/${userId}`, {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({ fields: fieldsToUpdate }),
    });

    if (!response.ok) throw new Error(await response.text());
};


// --- EMPLOYEE FUNCTIONS ---

export const findEmployeeByPassword = async (password: string): Promise<AirtableEmployeeRecord | null> => {
    const formula = encodeURIComponent(`({пароль} = "${password}")`);
    const response = await fetch(`${EMPLOYEES_BASE_URL}?filterByFormula=${formula}`, noCacheFetchOptions);
    if (!response.ok) throw new Error(await response.text());
    const { records } = await response.json();
    return records.length > 0 ? records[0] : null;
};

export const updateEmployeeStatus = async (employeeId: string, status: 'на линии' | 'не работает'): Promise<void> => {
    const response = await fetch(`${EMPLOYEES_BASE_URL}/${employeeId}`, {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({ fields: { 'статус': status } }),
    });
    if (!response.ok) throw new Error(await response.text());
};

const findAvailableEmployee = async (): Promise<AirtableEmployeeRecord | null> => {
    // 1. Get all employee IDs assigned to active orders.
    const activeOrdersFormula = "AND(NOT({статус} = 'доставлен'), NOT({статус} = 'отменен'))";
    const activeOrdersResponse = await fetch(`${ORDERS_BASE_URL}?filterByFormula=${encodeURIComponent(activeOrdersFormula)}&fields%5B%5D=работники`, noCacheFetchOptions);
    
    if (!activeOrdersResponse.ok) {
        console.error("Airtable Error: Could not fetch active orders to find an available employee.");
        throw new Error("Could not fetch active orders to find employee.");
    }

    const { records: activeOrders }: { records: AirtableOrderRecord[] } = await activeOrdersResponse.json();
    
    const busyEmployeeIds = new Set<string>();
    activeOrders.forEach(order => {
        if (order.fields.работники) {
            order.fields.работники.forEach(id => busyEmployeeIds.add(id));
        }
    });

    // 2. Get all employees who are 'на линии'.
    const onlineEmployeesFormula = "{статус} = 'на линии'";
    const onlineEmployeesResponse = await fetch(`${EMPLOYEES_BASE_URL}?filterByFormula=${encodeURIComponent(onlineEmployeesFormula)}`, noCacheFetchOptions);
    
    if (!onlineEmployeesResponse.ok) {
        throw new Error("Could not fetch online employees.");
    }
    
    const { records: onlineEmployees }: { records: AirtableEmployeeRecord[] } = await onlineEmployeesResponse.json();

    // 3. Find the first online employee who is not busy.
    const availableEmployee = onlineEmployees.find(employee => !busyEmployeeIds.has(employee.id));
    
    return availableEmployee || null;
};

// --- ORDER CREATION & MANAGEMENT ---

export const createOrder = async (userId: string, cartItems: CartItem[], total: number, address: string): Promise<Order> => {
    const employee = await findAvailableEmployee();
    
    const orderData: AirtableOrderFields = {
        'номер заказа': `ED-${Date.now().toString().slice(-6)}`,
        'Table 1': [userId],
        'составляющие': cartItems.map(item => item.id),
        'колво товаров': cartItems.map(item => `${item.name} - ${item.quantity} ${item.weightStatus === 'на развес' ? 'кг' : 'шт'}`).join(', '),
        'сумма заказа': total,
        'время на доставку': 15,
        статус: 'принят',
        адрес: address,
        // 'дата заказа' is a computed "Created time" field in Airtable and should not be set manually.
        'работники': employee ? [employee.id] : [],
    };

    const response = await fetch(ORDERS_BASE_URL, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({ records: [{ fields: orderData }] }),
    });

    if (!response.ok) throw new Error(await response.text());
    const { records }: { records: AirtableOrderRecord[] } = await response.json();
    return mapAirtableRecordToOrder(records[0]);
};

export const getUserActiveOrder = async (userId: string): Promise<Order | null> => {
    // 1. Fetch all orders for the user directly, sorted by most recent first.
    const formula = `FIND("${userId}", ARRAYJOIN({Table 1}))`;
    const sortField = encodeURIComponent('дата заказа');
    const sortParams = `&sort%5B0%5D%5Bfield%5D=${sortField}&sort%5B0%5D%5Bdirection%5D=desc`;

    const ordersResponse = await fetch(`${ORDERS_BASE_URL}?filterByFormula=${encodeURIComponent(formula)}${sortParams}`, noCacheFetchOptions);

    if (!ordersResponse.ok) {
        console.error("Airtable API error while fetching user orders:", await ordersResponse.text());
        return null;
    }

    const { records: orderRecords }: { records: AirtableOrderRecord[] } = await ordersResponse.json();
    if (orderRecords.length === 0) {
        return null; // No orders for this user.
    }

    // 2. Find the first active order (if any).
    const activeOrderRecord = orderRecords.find(rec => rec.fields.статус !== 'доставлен' && rec.fields.статус !== 'отменен');
    if (activeOrderRecord) {
        return mapAirtableRecordToOrder(activeOrderRecord);
    }
    
    // 3. If no active order, find the most recent delivered one for review.
    // Since the records are already sorted by date descending, the first one we find is the latest.
    const deliveredOrderRecord = orderRecords.find(rec => rec.fields.статус === 'доставлен');
    if (deliveredOrderRecord) {
        return mapAirtableRecordToOrder(deliveredOrderRecord);
    }

    // 4. No relevant order found.
    return null;
};

export const getAssignedOrderForEmployee = async (employeeId: string): Promise<FullOrderDetails | null> => {
    // 1. Fetch the employee record to get linked order IDs.
    const employeeResponse = await fetch(`${EMPLOYEES_BASE_URL}/${employeeId}`, noCacheFetchOptions);
    if (!employeeResponse.ok) {
        console.error("Airtable Error fetching employee:", await employeeResponse.text());
        return null;
    }
    const employeeRecord: AirtableEmployeeRecord = await employeeResponse.json();
    const orderIds = employeeRecord.fields['заказ'];

    if (!orderIds || orderIds.length === 0) {
        return null; // No orders linked.
    }

    // 2. Construct a formula to fetch all linked orders at once.
    const formula = `OR(${orderIds.map(id => `RECORD_ID()='${id}'`).join(',')})`;
    const ordersUrl = `${ORDERS_BASE_URL}?filterByFormula=${encodeURIComponent(formula)}`;

    const ordersResponse = await fetch(ordersUrl, noCacheFetchOptions);
    if (!ordersResponse.ok) {
        console.error("Airtable Error fetching linked orders:", await ordersResponse.text());
        return null;
    }

    const { records: linkedOrders }: { records: AirtableOrderRecord[] } = await ordersResponse.json();

    // 3. Find the active order among the linked ones. An employee should only have one active order.
    const activeOrderRecord = linkedOrders.find(
        record => record.fields.статус !== 'доставлен' && record.fields.статус !== 'отменен'
    );

    // 4. If an active order is found, get its full details.
    if (activeOrderRecord) {
        return await getFullOrderDetails(activeOrderRecord.id);
    }
    
    return null;
};


export const getFullOrderDetails = async (orderId: string): Promise<FullOrderDetails | null> => {
    const response = await fetch(`${ORDERS_BASE_URL}/${orderId}`, noCacheFetchOptions);
    if (!response.ok) return null;
    const orderRecord: AirtableOrderRecord = await response.json();

    const productIds = orderRecord.fields['составляющие'] || [];
    const productRecords = await getProductsByIds(productIds);

    const productQuantities = new Map<string, number>();
    const quantityStr = orderRecord.fields['колво товаров'] || '';
    
    quantityStr.split(', ').forEach(itemStr => {
         const parts = itemStr.split(' - ');
        if (parts.length < 2) return;
        const qtyStr = parts.pop() || '';
        const name = parts.join(' - ');
        const quantity = parseFloat(qtyStr) || 0;
        const product = productRecords.find(p => p.name === name);
        if (product) {
            productQuantities.set(product.id, quantity);
        }
    });

    const productsInfo: OrderProductInfo[] = productRecords.map(p => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        barcode: p.barcode || 'N/A',
        quantity: productQuantities.get(p.id) || 0,
        weightStatus: p.weightStatus,
        weightPerPiece: p.weightPerPiece,
        weight: p.weight,
    }));

    const orderBase = mapAirtableRecordToOrder(orderRecord);
    const customerId = orderRecord.fields['Table 1']?.[0] || '';

    return {
        ...orderBase,
        productsInfo,
        customerId,
    };
};

const createNotification = async (notificationData: AirtableNotificationFields): Promise<void> => {
    const response = await fetch(NOTIFICATIONS_BASE_URL, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({ records: [{ fields: notificationData }] }),
    });
    if (!response.ok) throw new Error(await response.text());
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus, delay?: number): Promise<void> => {
    // To prevent race conditions, fetch the full order details right before updating.
    // This ensures we have the correct customer ID for notifications.
    const orderDetails = status === 'доставлен' ? await getFullOrderDetails(orderId) : null;

    if (status === 'доставлен' && !orderDetails) {
        console.error(`Cannot create notification: failed to fetch details for order ${orderId} before status update.`);
    }

    // Prepare and send the actual status update
    const fieldsToUpdate: Partial<AirtableOrderFields> = { статус: status };
    if (delay) {
        fieldsToUpdate['время на доставку'] = delay;
    }
    if (status === 'доставлен' || status === 'отменен') {
        fieldsToUpdate['работники'] = []; 
    }

    const patchResponse = await fetch(`${ORDERS_BASE_URL}/${orderId}`, {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({ fields: fieldsToUpdate }),
    });
    if (!patchResponse.ok) throw new Error(await patchResponse.text());
    
    // If the update was successful and it was a delivery, create the notification
    if (status === 'доставлен' && orderDetails) {
        try {
            const { customerId, totalAmount, createdAt } = orderDetails;
            if (!customerId) {
                console.error(`Customer ID is missing for order ${orderId}, cannot create notification.`);
                return;
            }

            const iconUrl = await getBannerUrl('увед доставлен');
            if (!iconUrl) {
                console.error("Banner URL 'увед доставлен' not found, cannot create notification.");
                return;
            }

            const orderTotal = totalAmount;
            const orderDate = new Date(createdAt).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            const notificationText = `Ваш заказ на сумму ${orderTotal.toFixed(0)} ₽ от ${orderDate} доставлен!`;

            await createNotification({
                'текст уведомления': notificationText,
                'Table 1': [customerId],
                'иконка': [{ url: iconUrl }],
            });

        } catch (error) {
            console.error("Failed to create 'order delivered' notification after status update:", error);
        }
    }
};


// --- PRODUCT FUNCTIONS ---

const safeGetString = (fieldValue: any): string => {
    if (typeof fieldValue === 'string') return fieldValue;
    if (Array.isArray(fieldValue) && fieldValue.length > 0 && typeof fieldValue[0] === 'string') return fieldValue[0];
    return '';
};

const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
    if (ids.length === 0) return [];
    const formula = `OR(${ids.map(id => `RECORD_ID()='${id}'`).join(',')})`;
    const response = await fetch(`${PRODUCTS_BASE_URL}?filterByFormula=${encodeURIComponent(formula)}`, defaultFetchOptions);
    if (!response.ok) throw new Error(await response.text());
    const data: { records: AirtableProductRecord[] } = await response.json();
    return data.records.map(mapAirtableRecordToProduct).filter((p): p is Product => p !== null);
};


const mapAirtableRecordToProduct = (record: AirtableProductRecord): Product | null => {
    const fields = record.fields;
    const name = safeGetString(fields['Название товара']);
    if (!name || typeof fields.цена !== 'number') return null;
    
    const imageUrl = fields.Фото?.[0]?.thumbnails?.large?.url || fields.Фото?.[0]?.url || 'https://via.placeholder.com/300x200.png?text=No+Image';
    const discountPercentage = (fields['скидка'] || 0) * 100;
    
    const weightStatus = fields['статус по весу'] || 'поштучно';
    let pricePerKg: number | undefined;

    if (weightStatus === 'на развес') {
        pricePerKg = fields.цена;
    }
    
    const weightInGrams = fields['вес на шт'];
    // Assuming 'вес на шт' is in grams, convert to kg for internal calculations.
    const weightPerPieceInKg = weightInGrams ? weightInGrams / 1000 : undefined;

    return {
      id: record.id,
      name: name,
      price: fields.цена,
      category: safeGetString(fields['Категория']) || 'Uncategorized',
      description: safeGetString(fields['Описание товара']) || 'No description available.',
      rating: fields['оценка товара'] || 0,
      imageUrl: imageUrl,
      discount: discountPercentage,
      barcode: safeGetString(fields['штрихкод']),
      availableStock: fields['кол-во'] || 0,
      weight: safeGetString(fields['вес']) || undefined,
      weightPerPiece: weightPerPieceInKg,
      weightStatus: weightStatus,
      pricePerKg: pricePerKg,
    };
};

export const getAirtableProducts = async (): Promise<Product[]> => {
  const response = await fetch(PRODUCTS_BASE_URL, defaultFetchOptions);
  if (!response.ok) throw new Error(await response.text());
  const data: { records: AirtableProductRecord[] } = await response.json();
  return data.records.map(mapAirtableRecordToProduct).filter((p): p is Product => p !== null);
};

export const updateProductStock = async (items: CartItem[]): Promise<void> => {
    const recordsToUpdate = items.map(item => ({
        id: item.id,
        fields: { 'кол-во': item.availableStock - item.quantity },
    }));

    if (recordsToUpdate.length === 0) return;

    for (let i = 0; i < recordsToUpdate.length; i += 10) {
        const chunk = recordsToUpdate.slice(i, i + 10);
        const response = await fetch(PRODUCTS_BASE_URL, {
            method: 'PATCH',
            headers: commonHeaders,
            body: JSON.stringify({ records: chunk }),
        });
        if (!response.ok) throw new Error(await response.text());
    }
};

export const findAndAssignQueuedOrder = async (employeeId: string): Promise<FullOrderDetails | null> => {
    const formula = "AND({статус} = 'принят', NOT({работники}))";
    const sortField = encodeURIComponent('дата заказа');
    const sortOptions = `&sort[0][field]=${sortField}&sort[0][direction]=asc`;
    const response = await fetch(`${ORDERS_BASE_URL}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1${sortOptions}`, noCacheFetchOptions);

    if (!response.ok) {
        console.error("Failed to fetch queued orders", await response.text());
        return null;
    }

    const { records } = await response.json();
    if (records.length > 0) {
        const orderToAssign = records[0];
        const patchResponse = await fetch(`${ORDERS_BASE_URL}/${orderToAssign.id}`, {
            method: 'PATCH',
            headers: commonHeaders,
            body: JSON.stringify({ fields: { 'работники': [employeeId] } }),
        });
        
        if (!patchResponse.ok) {
            console.error("Failed to assign order", await patchResponse.text());
            return null;
        }
        
        return await getFullOrderDetails(orderToAssign.id);
    }
    return null;
}

// --- BANNER FUNCTIONS ---

export const getBannerUrl = async (bannerName: string): Promise<string | null> => {
    const formula = encodeURIComponent(`({Название} = "${bannerName}")`);
    const response = await fetch(`${BANNERS_BASE_URL}?filterByFormula=${formula}&maxRecords=1`, defaultFetchOptions);
    if (!response.ok) {
        console.error("Airtable Error: Could not fetch banner.", await response.text());
        return null;
    }
    const { records }: { records: AirtableBannerRecord[] } = await response.json();
    if (records.length > 0 && records[0].fields.Плашка && records[0].fields.Плашка.length > 0) {
        return records[0].fields.Плашка[0].url;
    }
    return null;
};

export const getSplashImages = async (): Promise<{ orangeUrl: string | null; watermelonUrl: string | null; ownerLogoUrl: string | null }> => {
    const formula = encodeURIComponent(`OR({Название} = "апельсин заставка", {Название} = "арбуз заставка", {Название} = "лого владелец")`);
    const response = await fetch(`${BANNERS_BASE_URL}?filterByFormula=${formula}`, defaultFetchOptions);
    if (!response.ok) {
        console.error("Airtable Error: Could not fetch splash screen images.", await response.text());
        return { orangeUrl: null, watermelonUrl: null, ownerLogoUrl: null };
    }
    const { records }: { records: AirtableBannerRecord[] } = await response.json();
    
    let orangeUrl: string | null = null;
    let watermelonUrl: string | null = null;
    let ownerLogoUrl: string | null = null;

    for (const record of records) {
        const imageUrl = record.fields.Плашка?.[0]?.url;
        if (imageUrl) {
            if (record.fields.Название === 'апельсин заставка') {
                orangeUrl = imageUrl;
            } else if (record.fields.Название === 'арбуз заставка') {
                watermelonUrl = imageUrl;
            } else if (record.fields.Название === 'лого владелец') {
                ownerLogoUrl = imageUrl;
            }
        }
    }

    return { orangeUrl, watermelonUrl, ownerLogoUrl };
};

// --- BETA FEEDBACK FUNCTIONS ---

export const submitBetaFeedback = async (feedback: AirtableBetaFeedbackFields): Promise<void> => {
    const response = await fetch(BETA_CENTER_BASE_URL, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({ fields: feedback }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Airtable Error submitting feedback:", errorData);
        throw new Error("Не удалось отправить обращение. Пожалуйста, попробуйте позже.");
    }
};

// --- REVIEW FUNCTIONS ---

export const getReviewedProductIdsForUser = async (userEmail: string): Promise<string[]> => {
    const formula = encodeURIComponent(`({почта} = "${userEmail}")`);
    const fields = encodeURIComponent('товар');
    const response = await fetch(`${REVIEWS_BASE_URL}?filterByFormula=${formula}&fields%5B%5D=${fields}`, noCacheFetchOptions);
    
    if (!response.ok) {
        console.error("Failed to fetch user reviews:", await response.text());
        return []; // Return empty array on error to not break the flow
    }
    const { records } = await response.json();
    
    const productIds = new Set<string>();
    records.forEach((record: { fields: { товар?: string[] } }) => {
        if (record.fields.товар) {
            record.fields.товар.forEach(id => productIds.add(id));
        }
    });
    
    return Array.from(productIds);
};

export const submitReview = async (review: AirtableReviewFields): Promise<void> => {
    const response = await fetch(REVIEWS_BASE_URL, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({ fields: review }),
    });
    if (!response.ok) throw new Error(await response.text());
};

export const getReviewsForProduct = async (productId: string): Promise<Review[]> => {
    const response = await fetch(REVIEWS_BASE_URL, noCacheFetchOptions);
    
    if (!response.ok) {
        console.error("Airtable API Error: Failed to fetch reviews.", await response.text());
        throw new Error("Не удалось загрузить отзывы.");
    }

    const { records }: { records: AirtableReviewRecord[] } = await response.json();
    
    const productReviews = records.filter(record => {
        const linkedProductIds = record.fields.товар;
        return Array.isArray(linkedProductIds) && linkedProductIds.includes(productId);
    });
    
    productReviews.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

    return productReviews.map((r) => ({
        rating: r.fields.оценка,
        text: r.fields['текст отзыва'],
        createdAt: r.createdTime
    }));
};


export const updateProductRating = async (productId: string, newRatingValue: number): Promise<void> => {
    await sleep(500); 
    
    const allReviews = await getReviewsForProduct(productId);

    if (allReviews.length === 0) {
        const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}`, {
            method: 'PATCH',
            headers: commonHeaders,
            body: JSON.stringify({ fields: { 'оценка товара': newRatingValue } }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to update product rating for ${productId}: ${errorText}`);
            throw new Error('Could not update product rating.');
        }
        return;
    }

    const totalRating = allReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = totalRating / allReviews.length;
    const roundedRating = Math.round(averageRating * 10) / 10;
    const finalRating = Math.min(roundedRating, 5);

    const response = await fetch(`${PRODUCTS_BASE_URL}/${productId}`, {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({ fields: { 'оценка товара': finalRating } }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to update product rating for ${productId}: ${errorText}`);
        throw new Error('Could not update product rating.');
    }
};

// --- NOTIFICATION FUNCTIONS ---
export const getNotificationsForUser = async (userId: string): Promise<Notification[]> => {
    const formula = encodeURIComponent(`FIND("${userId}", ARRAYJOIN({Table 1}))`);
    const sortField = encodeURIComponent('время отправления');
    const sortParams = `&sort%5B0%5D%5Bfield%5D=${sortField}&sort%5B0%5D%5Bdirection%5D=desc`;
    const response = await fetch(`${NOTIFICATIONS_BASE_URL}?filterByFormula=${formula}${sortParams}`, noCacheFetchOptions);
    if (!response.ok) {
        console.error("Airtable Error: Could not fetch notifications.", await response.text());
        return [];
    }
    const { records }: { records: AirtableNotificationRecord[] } = await response.json();
    
    return records.map(record => ({
        id: record.id,
        text: record.fields['текст уведомления'],
        iconUrl: record.fields.иконка?.[0]?.url || '',
        createdAt: record.createdTime,
    }));
};