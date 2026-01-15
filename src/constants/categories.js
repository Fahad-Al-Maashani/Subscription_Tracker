// Category definitions with colors and icons
export const CATEGORIES = [
    { id: 'entertainment', name: 'Entertainment', nameAr: 'ترفيه', nameDe: 'Unterhaltung', color: '#FF6B6B', icon: 'film' },
    { id: 'productivity', name: 'Productivity', nameAr: 'إنتاجية', nameDe: 'Produktivität', color: '#4ECDC4', icon: 'briefcase' },
    { id: 'health', name: 'Health & Fitness', nameAr: 'صحة ولياقة', nameDe: 'Gesundheit', color: '#45B7D1', icon: 'fitness' },
    {
        id: 'education', name: 'Education', nameAr: 'تعليم', nameDe: 'Bildung', color:

            '#96CEB4', icon: 'school'
    },
    { id: 'news', name: 'News & Media', nameAr: 'أخبار ووسائط', nameDe: 'Nachrichten', color: '#FFEAA7', icon: 'newspaper' },
    { id: 'music', name: 'Music', nameAr: 'موسيقى', nameDe: 'Musik', color: '#DFE6E9', icon: 'musical-notes' },
    { id: 'cloud', name: 'Cloud Storage', nameAr: 'تخزين سحابي', nameDe: 'Cloud-Speicher', color: '#74B9FF', icon: 'cloud' },
    { id: 'gaming', name: 'Gaming', nameAr: 'ألعاب', nameDe: 'Spiele', color: '#A29BFE', icon: 'game-controller' },
    { id: 'shopping', name: 'Shopping', nameAr: 'تسوق', nameDe: 'Einkaufen', color: '#FD79A8', icon: 'cart' },
    { id: 'transport', name: 'Transport', nameAr: 'نقل', nameDe: 'Transport', color: '#FDCB6E', icon: 'car' },
    { id: 'utilities', name: 'Utilities', nameAr: 'مرافق', nameDe: 'Nebenkosten', color: '#6C5CE7', icon: 'flash' },
    { id: 'other', name: 'Other', nameAr: 'أخرى', nameDe: 'Andere', color: '#B2BEC3', icon: 'apps' },
];

export const getCategoryById = (id) => {
    return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};

export const getCategoryName = (id, language = 'en') => {
    const category = getCategoryById(id);
    if (language === 'ar') return category.nameAr;
    if (language === 'de') return category.nameDe;
    return category.name;
};
