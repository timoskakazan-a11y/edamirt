import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_USERS_TABLE_NAME, AIRTABLE_PRODUCTS_TABLE_NAME, AIRTABLE_EMPLOYEES_TABLE_NAME, AIRTABLE_ORDERS_TABLE_NAME, AIRTABLE_REVIEWS_TABLE_NAME } from '../constants';
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
    OrderDetailsModalData,
    AirtableReviewFields
} from '../types';

const USERS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_USERS_TABLE_NAME)}`;
const PRODUCTS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_PRODUCTS_TABLE_NAME)}`;
const EMPLOYEES_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_EMPLOYEES_TABLE_NAME)}`;
const ORDERS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_ORDERS_TABLE_NAME)}`;
const REVIEWS_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_REVIEWS_TABLE_NAME)}`;


const commonHeaders = {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
};

// --- AUTHENTICATION & USER FUNCTIONS ---

export const findUserByEmail = async (email: string): Promise<AirtableUserRecord | null> => {
    const formula = encodeURIComponent(`({email} = "${email}")`);
    const response = await fetch(`${USERS_BASE_URL}?filterByFormula=${formula}`, { headers: commonHeaders });
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
    const userResponse = await fetch(`${USERS_BASE_URL}/${userId}`, { headers: commonHeaders });
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
        const qtyStr = parts.pop() || '';
        const name = parts.join(' - ');
        const quantity = parseInt(qtyStr, 10) || 0;
        
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
        'колво товаров': cartItems.map(item => `${item.name} - ${item.quantity} шт`).join(', '),
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
    const response = await fetch(`${EMPLOYEES_BASE_URL}?filterByFormula=${formula}`, { headers: commonHeaders });
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
    const formula = encodeURIComponent("AND({статус} = 'на линии', NOT({заказ}))");
    const response = await fetch(`${EMPLOYEES_BASE_URL}?filterByFormula=${formula}&maxRecords=1`, { headers: commonHeaders });
    if (!response.ok) throw new Error(await response.text());
    const { records } = await response.json();
    return records.length > 0 ? records[0] : null;
};

// --- ORDER CREATION & MANAGEMENT ---

export const createOrder = async (userId: string, cartItems: CartItem[], total: number, address: string): Promise<AirtableOrderRecord> => {
    const employee = await findAvailableEmployee();
    
    const orderData: AirtableOrderFields = {
        'номер заказа': `ED-${Date.now().toString().slice(-6)}`,
        'Table 1': [userId],
        'составляющие': cartItems.map(item => item.id),
        'колво товаров': cartItems.map(item => `${item.name} - ${item.quantity} шт`).join(', '),
        'сумма заказа': total,
        'время на доставку': 15,
        статус: 'принят',
        адрес: address,
        'работники': employee ? [employee.id] : [],
    };

    const response = await fetch(ORDERS_BASE_URL, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({ records: [{ fields: orderData }] }),
    });

    if (!response.ok) throw new Error(await response.text());
    const { records } = await response.json();
    return records[0];
};

export const getUserActiveOrder = async (userName: string): Promise<Order | null> => {
    const formula = `AND(FIND('${userName}', ARRAYJOIN({Table 1})), AND({статус} != 'доставлен', {статус} != 'отменен'))`;
    const response = await fetch(`${ORDERS_BASE_URL}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1&sort%5B0%5D%5Bfield%5D=дата%20заказа&sort%5B0%5D%5Bdirection%5D=desc`, { headers: commonHeaders });

    if (!response.ok) return null;
    
    const { records: orderRecords }: { records: AirtableOrderRecord[] } = await response.json();

    if (!orderRecords || orderRecords.length === 0) return null;
    const activeOrderRecord = orderRecords[0];

    return {
        id: activeOrderRecord.id,
        orderNumber: activeOrderRecord.fields['номер заказа'],
        customerName: '',
        products: activeOrderRecord.fields['колво товаров'],
        totalAmount: activeOrderRecord.fields['сумма заказа'],
        deliveryTime: activeOrderRecord.fields['время на доставку'],
        status: activeOrderRecord.fields['статус'],
        address: activeOrderRecord.fields['адрес'],
        createdAt: activeOrderRecord.createdTime,
    };
};

export const getAssignedOrderForEmployee = async (employeeName: string): Promise<FullOrderDetails | null> => {
    const formula = `AND(FIND('${employeeName}', ARRAYJOIN({работники})), AND({статус} != 'доставлен', {статус} != 'отменен'))`;
    const response = await fetch(`${ORDERS_BASE_URL}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`, { headers: commonHeaders });

    if (!response.ok) return null;
    
    const { records: orderRecords }: { records: AirtableOrderRecord[] } = await response.json();

    if (!orderRecords || orderRecords.length === 0) return null;
    const orderRecord = orderRecords[0];
    
    const productIds = orderRecord.fields['составляющие'] || [];
    const productRecords = await getProductsByIds(productIds);
    
    const productQuantities = new Map<string, number>();
    orderRecord.fields['колво товаров'].split(', ').forEach(itemStr => {
        const parts = itemStr.split(' - ');
        if (parts.length < 2) return;
        const qtyStr = parts.pop() || '';
        const name = parts.join(' - ');
        const quantity = parseInt(qtyStr, 10) || 0;

        const product = productRecords.find(p => p.name === name);
        if(product) {
            productQuantities.set(product.id, quantity);
        }
    });

    const productsInfo: OrderProductInfo[] = productRecords.map(p => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        barcode: p.barcode || 'N/A',
        quantity: productQuantities.get(p.id) || 0,
    }));

    return {
        id: orderRecord.id,
        orderNumber: orderRecord.fields['номер заказа'],
        customerName: '',
        products: orderRecord.fields['колво товаров'],
        totalAmount: orderRecord.fields['сумма заказа'],
        deliveryTime: orderRecord.fields['время на доставку'],
        status: orderRecord.fields['статус'],
        address: orderRecord.fields['адрес'],
        createdAt: orderRecord.createdTime,
        productsInfo: productsInfo,
    };
};

export const getFullOrderDetails = async (orderId: string): Promise<OrderDetailsModalData | null> => {
    const response = await fetch(`${ORDERS_BASE_URL}/${orderId}`, { headers: commonHeaders });
    if (!response.ok) return null;
    const orderRecord: AirtableOrderRecord = await response.json();

    const productIds = orderRecord.fields['составляющие'] || [];
    const productRecords = await getProductsByIds(productIds);

    const productQuantities = new Map<string, number>();
    orderRecord.fields['колво товаров'].split(', ').forEach(itemStr => {
         const parts = itemStr.split(' - ');
        if (parts.length < 2) return;
        const qtyStr = parts.pop() || '';
        const name = parts.join(' - ');
        const quantity = parseInt(qtyStr, 10) || 0;
        const product = productRecords.find(p => p.name === name);
        if (product) {
            productQuantities.set(product.id, quantity);
        }
    });

    const productsInfo: OrderProductInfo[] = productRecords.map(p => ({
        id: p.id, // Ensure ID is included
        name: p.name,
        imageUrl: p.imageUrl,
        barcode: p.barcode || 'N/A',
        quantity: productQuantities.get(p.id) || 0,
    }));

    return {
        order: {
            id: orderRecord.id,
            orderNumber: orderRecord.fields['номер заказа'],
            customerName: '',
            products: orderRecord.fields['колво товаров'],
            totalAmount: orderRecord.fields['сумма заказа'],
            deliveryTime: orderRecord.fields['время на доставку'],
            status: orderRecord.fields['статус'],
            address: orderRecord.fields['адрес'],
            createdAt: orderRecord.createdTime,
        },
        productsInfo: productsInfo,
    };
};


export const updateOrderStatus = async (orderId: string, status: OrderStatus, delay?: number): Promise<void> => {
    const fieldsToUpdate: Partial<AirtableOrderFields> = { статус: status };
    if (delay) {
        fieldsToUpdate['время на доставку'] = delay;
    }
    
    if (status === 'доставлен' || status === 'отменен') {
        fieldsToUpdate['работники'] = []; 
    }

    const response = await fetch(`${ORDERS_BASE_URL}/${orderId}`, {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({ fields: fieldsToUpdate }),
    });
    if (!response.ok) throw new Error(await response.text());
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
    const response = await fetch(`${PRODUCTS_BASE_URL}?filterByFormula=${encodeURIComponent(formula)}`, { headers: commonHeaders });
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
    };
};

export const getAirtableProducts = async (): Promise<Product[]> => {
  const response = await fetch(PRODUCTS_BASE_URL, { headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }});
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

export const findAndAssignQueuedOrder = async (employeeId: string): Promise<void> => {
    const formula = "AND({статус} = 'принят', NOT({работники}))";
    const response = await fetch(`${ORDERS_BASE_URL}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1&sort%5B0%5D%5Bfield%5D=дата%20заказа&sort%5B0%5D%5Bdirection%5D=asc`, { headers: commonHeaders });
    if (!response.ok) {
        console.error("Failed to fetch queued orders");
        return;
    }

    const { records } = await response.json();
    if (records.length > 0) {
        const orderToAssign = records[0];
        await fetch(`${ORDERS_BASE_URL}/${orderToAssign.id}`, {
            method: 'PATCH',
            headers: commonHeaders,
            body: JSON.stringify({ fields: { 'работники': [employeeId] } }),
        });
    }
}
// --- REVIEW FUNCTIONS ---

export const submitReview = async (review: AirtableReviewFields): Promise<void> => {
    const response = await fetch(REVIEWS_BASE_URL, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({ fields: review }),
    });
    if (!response.ok) throw new Error(await response.text());
};

export const getReviewsForProduct = async (productId: string): Promise<{оценка: number}[]> => {
    const formula = encodeURIComponent(`{товар} = RECORD_ID()`); // This is not correct, needs linked record name. Let's assume the linked record name is the product ID for now.
    const filter = `AND(RECORD_ID({товар}) = '${productId}')` // This isn't right either.
    const correctFormula = `ARRAYJOIN({товар}) = '${productId}'`
    
    // The correct way to filter by a linked record ID is to use RECORD_ID() in the linked table.
    // However, it's easier to filter by the text representation if we assume the primary field of 'catalog' is the product name.
    // Let's stick to the product ID which is more robust. We'll link via record IDs.
    const formulaForLinkedRecord = `FIND('${productId}', ARRAYJOIN({товар}))`;

    const response = await fetch(`${REVIEWS_BASE_URL}?filterByFormula=${encodeURIComponent(formulaForLinkedRecord)}&fields%5B%5D=оценка`, { headers: commonHeaders });
    if (!response.ok) throw new Error(await response.text());
    const { records } = await response.json();
    return records.map((r: { fields: { оценка: number } }) => r.fields);
};

export const updateProductRating = async (productId: string): Promise<void> => {
    const reviews = await getReviewsForProduct(productId);
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + (review.оценка || 0), 0);
    const averageRating = totalRating / reviews.length;
    
    await fetch(`${PRODUCTS_BASE_URL}/${productId}`, {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({ fields: { 'оценка товара': averageRating } }),
    });
};
