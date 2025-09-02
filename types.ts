

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  rating: number;
  discount?: number;
  barcode?: string;
  availableStock: number;
  weight?: string;
  weightStatus?: 'на развес' | 'поштучно';
  pricePerKg?: number;
  weightPerPiece?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

// Represents the currently logged-in user in the app state
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'employee';
  status?: 'на линии' | 'не работает'; // Added for employee status
}

// From 'Table 1' (Users)
export interface AirtableUserFields {
  name: string;
  email: string;
  phone: string;
  'card number'?: string; 
  password?: string;
  'корзина'?: string[];
  'колво товаров'?: string;
  'итоговая цена'?: number;
  'заказ'?: string[]; // Link to 'заказ' table
}

export interface AirtableUserRecord {
  id: string;
  fields: AirtableUserFields;
}

// Represents the fields from the 'работники' (employees) table
export interface AirtableEmployeeFields {
  'имя': string;
  'почта': string;
  'пароль': string;
  'статус': 'на линии' | 'не работает';
  'заказ'?: string[]; // Link to 'заказ' table
}

export interface AirtableEmployeeRecord {
  id: string;
  fields: AirtableEmployeeFields;
}

// More specific type for Airtable attachments, including thumbnails
interface AirtableAttachment {
  url: string;
  thumbnails?: {
    small: { url: string };
    large: { url: string };
  };
}

// Represents the fields from the 'catalog' table in Airtable
export interface AirtableProductFields {
  'Название товара': any;
  'Описание товара'?: any;
  цена: number;
  Категория?: any;
  'оценка товара'?: number;
  Фото?: AirtableAttachment[];
  скидка?: number;
  штрихкод?: any;
  'кол-во'?: number;
  'вес'?: any;
  'статус по весу'?: 'на развес' | 'поштучно';
  'вес на шт'?: number;
}

export interface AirtableProductRecord {
  id:string;
  fields: AirtableProductFields;
}


// --- NEW ORDER TYPES ---

export type OrderStatus = 'принят' | 'сборка' | 'фасовка' | 'ожидает курьера' | 'доставляется' | 'доставлен' | 'отменен' | 'перенесен';

// Represents an order in the app state
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  products: string; // The text description like "Мандарин - 2 шт"
  totalAmount: number;
  deliveryTime: number; // in minutes
  status: OrderStatus;
  address: string;
  createdAt: string;
  employeeIds?: string[];
}

export interface OrderProductInfo {
    id: string; // Crucial for reviews
    name: string;
    imageUrl: string;
    barcode: string;
    quantity: number;
    weightStatus?: 'на развес' | 'поштучно';
    weightPerPiece?: number; // Weight in kg
    weight?: string; // e.g. "500-700 г"
}

// The full order details for the courier
export interface FullOrderDetails extends Order {
    productsInfo: OrderProductInfo[];
    customerId: string;
}

// Represents the fields from the 'заказ' (orders) table
export interface AirtableOrderFields {
  'номер заказа': string;
  'Table 1': string[]; // Link to customer
  'составляющие': string[]; // Link to products
  'колво товаров'?: string;
  'сумма заказа': number;
  'время на доставку': number;
  статус: OrderStatus;
  адрес: string;
  'дата заказа'?: string;
  'работники'?: string[]; // Link to employee
}

export interface AirtableOrderRecord {
  id: string;
  fields: AirtableOrderFields;
  createdTime: string;
}

// --- REVIEW TYPES ---
export interface Review {
    rating: number;
    text?: string;
    createdAt: string;
}

export interface AirtableReviewFields {
    почта: string;
    товар: string[]; // Record ID of the product
    оценка: number;
    'текст отзыва'?: string;
}

export interface AirtableReviewRecord {
  id: string;
  fields: AirtableReviewFields;
  createdTime: string;
}


export interface ReviewableProduct {
    id: string;
    name: string;
    imageUrl: string;
}

// Banner Types
export interface AirtableBannerFields {
    Название: string;
    Плашка: { url: string }[];
}

export interface AirtableBannerRecord {
    id: string;
    fields: AirtableBannerFields;
}

// Beta Feedback Types
export interface AirtableBetaFeedbackFields {
    'тема обращения': string;
    текст: string;
    'текст ошибки'?: string;
}

// --- NOTIFICATION TYPES ---
export interface Notification {
    id: string;
    text: string;
    iconUrl: string;
    createdAt: string;
}

export interface AirtableNotificationFields {
    'текст уведомления': string;
    'иконка': { url: string }[];
    'Table 1': string[]; // Link to Users
}

export interface AirtableNotificationRecord {
    id: string;
    fields: AirtableNotificationFields;
    createdTime: string;
}