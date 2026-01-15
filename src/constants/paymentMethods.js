// Payment method types and configurations
export const PAYMENT_METHODS = [
    { id: 'credit_card', name: 'Credit Card', nameAr: 'بطاقة ائتمان', nameDe: 'Kreditkarte', icon: 'card' },
    { id: 'debit_card', name: 'Debit Card', nameAr: 'بطاقة خصم', nameDe: 'Debitkarte', icon: 'card-outline' },
    { id: 'paypal', name: 'PayPal', nameAr: 'باي بال', nameDe: 'PayPal', icon: 'logo-paypal' },
    { id: 'apple_pay', name: 'Apple Pay', nameAr: 'آبل باي', nameDe: 'Apple Pay', icon: 'logo-apple' },
    { id: 'google_pay', name: 'Google Pay', nameAr: 'جوجل باي', nameDe: 'Google Pay', icon: 'logo-google' },
    { id: 'bank_account', name: 'Bank Account', nameAr: 'حساب بنكي', nameDe: 'Bankkonto', icon: 'business' },
    { id: 'other', name: 'Other', nameAr: 'أخرى', nameDe: 'Andere', icon: 'wallet' },
];

export const CARD_TYPES = [
    { id: 'visa', name: 'Visa', icon: 'card', color: '#1A1F71' },
    { id: 'mastercard', name: 'Mastercard', icon: 'card', color: '#EB001B' },
    { id: 'amex', name: 'American Express', icon: 'card', color: '#006FCF' },
    { id: 'discover', name: 'Discover', icon: 'card', color: '#FF6000' },
];

export const getPaymentMethodById = (id) => {
    return PAYMENT_METHODS.find(pm => pm.id === id) || PAYMENT_METHODS[PAYMENT_METHODS.length - 1];
};

export const getPaymentMethodName = (id, language = 'en') => {
    const method = getPaymentMethodById(id);
    if (language === 'ar') return method.nameAr;
    if (language === 'de') return method.nameDe;
    return method.name;
};
