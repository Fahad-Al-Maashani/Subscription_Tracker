import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  UIManager,
  LayoutAnimation,
  I18nManager,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const STORAGE_KEY = '@subscriptions_list';
const LANGUAGE_KEY = '@app_language';
const CURRENCY_KEY = '@selected_currency';

// Exchange rates (base: USD)
const EXCHANGE_RATES = {
  USD: 1.0,
  OMR: 0.385,
  SAR: 3.75,
  AED: 3.67,
  EUR: 0.92,
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  OMR: 'ر.ع.',
  SAR: 'ر.س',
  AED: 'د.إ',
  EUR: '€',
};

// Translations
const translations = {
  en: {
    appTitle: 'Subscriptions',
    totalExpenses: 'Total Monthly Expenses',
    noSubscriptions: 'No subscriptions yet',
    tapToAdd: 'Tap the + button to add your first subscription',
    addSubscription: 'Add Subscription',
    serviceName: 'Service Name',
    serviceNamePlaceholder: 'e.g., Netflix',
    monthlyPrice: 'Monthly Price',
    pricePlaceholder: 'e.g., 15.99',
    dueDay: 'Due Day (1-31)',
    dueDayPlaceholder: 'e.g., 15',
    save: 'Save Subscription',
    delete: 'Delete',
    deleteTitle: 'Delete Subscription',
    deleteConfirm: 'Are you sure you want to delete this subscription?',
    cancel: 'Cancel',
    next: 'Next',
    currency: 'Currency',
    sortBy: 'Sort By',
    language: 'Language',
    name: 'Name',
    price: 'Price',
    dueDate: 'Due Date',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    ascending: 'A-Z',
    descending: 'Z-A',
    lowToHigh: 'Low to High',
    highToLow: 'High to Low',
    validationError: 'Validation Error',
    enterServiceName: 'Please enter a service name',
    enterValidPrice: 'Please enter a valid price',
    enterValidDueDay: 'Due day must be between 1 and 31',
    selectCurrency: 'Select Currency',
    selectLanguage: 'Select Language',
    selectSort: 'Sort Options',
    analytics: 'Analytics',
    insightsAndTrends: 'Insights & Trends',
    noDataForAnalytics: 'No data to analyze',
    addSubscriptionsToSeeAnalytics: 'Add subscriptions to see insights',
    totalMonthly: 'Total Monthly',
    subscriptions: 'Subscriptions',
    average: 'Average',
    fromLastMonth: 'from last month',
    spendingTrend: 'Spending Trend',
    last6Months: 'Last 6 months',
    trendExplanation: 'Your subscription costs over time. Higher points mean more spending.',
    categoryBreakdown: 'Category Breakdown',
    whereyouSpend: 'Where you spend',
    pieExplanation: 'Each slice shows a category. Bigger slice = more money spent there.',
    topCategories: 'Top Categories',
    mostExpensive: 'Most expensive',
    barExplanation: 'Taller bars = higher spending in that category.',
    insights: 'Insights',
    mostExpensiveSub: 'Most Expensive',
    cheapest: 'Most Affordable',
    biggestCategory: 'Top Category',
    ofTotal: 'of total',
    yearlyProjection: 'Yearly Projection',
    perYear: 'per year',
    recommendations: 'Smart Recommendations',
    reviewHighCost: 'Review High-Cost Subscriptions',
    reviewHighCostDesc: 'Consider if you really use all features of your most expensive subscriptions.',
    consolidate: 'Consider Bundling',
    consolidateDesc: 'Look for bundle deals that combine multiple services at a lower price.',
    annualSavings: 'Try Annual Plans',
    annualSavingsDesc: 'Switching to annual billing often saves 15-20% compared to monthly.',
  },
  ar: {
    appTitle: 'الاشتراكات',
    totalExpenses: 'إجمالي المصروفات الشهرية',
    noSubscriptions: 'لا توجد اشتراكات بعد',
    tapToAdd: 'اضغط على زر + لإضافة اشتراكك الأول',
    addSubscription: 'إضافة اشتراك',
    serviceName: 'اسم الخدمة',
    serviceNamePlaceholder: 'مثال: نتفليكس',
    monthlyPrice: 'السعر الشهري',
    pricePlaceholder: 'مثال: 15.99',
    dueDay: 'يوم الاستحقاق (1-31)',
    dueDayPlaceholder: 'مثال: 15',
    save: 'حفظ الاشتراك',
    delete: 'حذف',
    deleteTitle: 'حذف الاشتراك',
    deleteConfirm: 'هل أنت متأكد من حذف هذا الاشتراك؟',
    cancel: 'إلغاء',
    next: 'التالي',
    currency: 'العملة',
    sortBy: 'ترتيب حسب',
    language: 'اللغة',
    name: 'الاسم',
    price: 'السعر',
    dueDate: 'تاريخ الاستحقاق',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    yearly: 'سنوي',
    ascending: 'أ-ي',
    descending: 'ي-أ',
    lowToHigh: 'من الأقل للأعلى',
    highToLow: 'من الأعلى للأقل',
    validationError: 'خطأ في التحقق',
    enterServiceName: 'الرجاء إدخال اسم الخدمة',
    enterValidPrice: 'الرجاء إدخال سعر صحيح',
    enterValidDueDay: 'يجب أن يكون يوم الاستحقاق بين 1 و 31',
    selectCurrency: 'اختر العملة',
    selectLanguage: 'اختر اللغة',
    selectSort: 'خيارات الترتيب',
  },
  de: {
    appTitle: 'Abonnements',
    totalExpenses: 'Monatliche Gesamtausgaben',
    noSubscriptions: 'Noch keine Abonnements',
    tapToAdd: 'Tippen Sie auf +, um Ihr erstes Abonnement hinzuzufügen',
    addSubscription: 'Abonnement hinzufügen',
    serviceName: 'Dienstname',
    serviceNamePlaceholder: 'z.B. Netflix',
    monthlyPrice: 'Monatlicher Preis',
    pricePlaceholder: 'z.B. 15.99',
    dueDay: 'Fälligkeitstag (1-31)',
    dueDayPlaceholder: 'z.B. 15',
    save: 'Abonnement speichern',
    delete: 'Löschen',
    deleteTitle: 'Abonnement löschen',
    deleteConfirm: 'Möchten Sie dieses Abonnement wirklich löschen?',
    cancel: 'Abbrechen',
    next: 'Weiter',
    currency: 'Währung',
    sortBy: 'Sortieren nach',
    language: 'Sprache',
    name: 'Name',
    price: 'Preis',
    dueDate: 'Fälligkeitsdatum',
    weekly: 'Wöchentlich',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    ascending: 'A-Z',
    descending: 'Z-A',
    lowToHigh: 'Niedrig bis Hoch',
    highToLow: 'Hoch bis Niedrig',
    validationError: 'Validierungsfehler',
    enterServiceName: 'Bitte geben Sie einen Dienstnamen ein',
    enterValidPrice: 'Bitte geben Sie einen gültigen Preis ein',
    enterValidDueDay: 'Fälligkeitstag muss zwischen 1 und 31 liegen',
    selectCurrency: 'Währung wählen',
    selectLanguage: 'Sprache wählen',
    selectSort: 'Sortieroptionen',
  },
};

export default function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    dueDay: '',
  });
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [viewPeriod, setViewPeriod] = useState('monthly');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);

  // Helper function to convert Arabic-Indic numerals to Western Arabic numerals
  const convertArabicNumerals = (str) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let result = str;
    for (let i = 0; i < arabicNumbers.length; i++) {
      result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
    }
    return result;
  };

  // Translation helper
  const t = (key) => translations[language][key] || key;

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Fade in loading screen
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Save subscriptions whenever they change
  useEffect(() => {
    if (subscriptions.length > 0) {
      saveSubscriptions();
    }
  }, [subscriptions]);

  const loadData = async () => {
    const startTime = Date.now();

    try {
      const [storedSubs, storedLang, storedCurrency] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(LANGUAGE_KEY),
        AsyncStorage.getItem(CURRENCY_KEY),
      ]);

      if (storedSubs !== null) {
        setSubscriptions(JSON.parse(storedSubs));
      }
      if (storedLang !== null) {
        setLanguage(storedLang);
      }
      if (storedCurrency !== null) {
        setSelectedCurrency(storedCurrency);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }

    // Ensure minimum loading time for smooth UX
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(2000 - elapsedTime, 0);

    setTimeout(() => {
      // Fade out loading screen
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
      });
    }, remainingTime);
  };

  const saveSubscriptions = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    } catch (error) {
      console.error('Error saving subscriptions:', error);
    }
  };

  const saveLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const saveCurrency = async (curr) => {
    try {
      await AsyncStorage.setItem(CURRENCY_KEY, curr);
      setSelectedCurrency(curr);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  };

  const calculateTotal = () => {
    return subscriptions.reduce((sum, sub) => sum + parseFloat(sub.price), 0);
  };

  const convertCurrency = (amountUSD) => {
    return amountUSD / EXCHANGE_RATES[selectedCurrency];
  };

  const getProjectedTotal = () => {
    const monthlyTotal = calculateTotal();
    if (viewPeriod === 'weekly') return monthlyTotal / 4.33;
    if (viewPeriod === 'yearly') return monthlyTotal * 12;
    return monthlyTotal;
  };

  const addSubscription = () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert(t('validationError'), t('enterServiceName'));
      return;
    }

    // Convert Arabic numerals to English before parsing
    const convertedPrice = convertArabicNumerals(formData.price);
    const convertedDueDay = convertArabicNumerals(formData.dueDay);

    const price = parseFloat(convertedPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert(t('validationError'), t('enterValidPrice'));
      return;
    }

    const dueDay = parseInt(convertedDueDay);
    if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
      Alert.alert(t('validationError'), t('enterValidDueDay'));
      return;
    }

    // Animate the addition
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newSubscription = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      price: price,
      dueDay: dueDay,
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setFormData({ name: '', price: '', dueDay: '' });
    setModalVisible(false);
  };

  const deleteSubscription = (id, name) => {
    Alert.alert(
      t('deleteTitle'),
      t('deleteConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            // Animate the deletion
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSubscriptions(subscriptions.filter(sub => sub.id !== id));
          },
        },
      ]
    );
  };

  const getSortedSubscriptions = () => {
    return [...subscriptions].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'dueDay') {
        return sortOrder === 'asc' ? a.dueDay - b.dueDay : b.dueDay - a.dueDay;
      }
      return 0;
    });
  };

  const formatPrice = (priceUSD) => {
    const converted = convertCurrency(priceUSD);
    const symbol = CURRENCY_SYMBOLS[selectedCurrency];

    if (selectedCurrency === 'USD' || selectedCurrency === 'EUR') {
      return `${symbol}${converted.toFixed(2)}`;
    } else {
      return `${converted.toFixed(2)} ${symbol}`;
    }
  };

  const getDueDateText = (dueDay) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let nextDueDate;
    if (currentDay <= dueDay) {
      nextDueDate = new Date(currentYear, currentMonth, dueDay);
    } else {
      nextDueDate = new Date(currentYear, currentMonth + 1, dueDay);
    }

    const monthNames = language === 'ar'
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : language === 'de'
        ? ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${t('next')}: ${monthNames[nextDueDate.getMonth()]} ${nextDueDate.getDate()}`;
  };

  const isRTL = language === 'ar';
  const sortedSubscriptions = getSortedSubscriptions();

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen fadeAnim={fadeAnim} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerTop, isRTL && styles.rowReverse]}>
          <Text style={styles.headerTitle}>{t('appTitle')}</Text>
          <View style={[styles.headerButtons, isRTL && styles.rowReverse]}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setAnalyticsModalVisible(true)}
            >
              <Ionicons name="stats-chart" size={24} color="#5B67FF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setLanguageModalVisible(true)}
            >
              <Ionicons name="language" size={24} color="#5B67FF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setCurrencyModalVisible(true)}
            >
              <Ionicons name="cash-outline" size={24} color="#5B67FF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setSortModalVisible(true)}
            >
              <Ionicons name="filter" size={24} color="#5B67FF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.totalAmount}>{formatPrice(getProjectedTotal())}</Text>
        <Text style={styles.totalLabel}>{t('totalExpenses')}</Text>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, viewPeriod === 'weekly' && styles.periodButtonActive]}
            onPress={() => setViewPeriod('weekly')}
          >
            <Text style={[styles.periodText, viewPeriod === 'weekly' && styles.periodTextActive]}>
              {t('weekly')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, viewPeriod === 'monthly' && styles.periodButtonActive]}
            onPress={() => setViewPeriod('monthly')}
          >
            <Text style={[styles.periodText, viewPeriod === 'monthly' && styles.periodTextActive]}>
              {t('monthly')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, viewPeriod === 'yearly' && styles.periodButtonActive]}
            onPress={() => setViewPeriod('yearly')}
          >
            <Text style={[styles.periodText, viewPeriod === 'yearly' && styles.periodTextActive]}>
              {t('yearly')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscription List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {sortedSubscriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#999" />
            <Text style={styles.emptyText}>{t('noSubscriptions')}</Text>
            <Text style={styles.emptySubtext}>{t('tapToAdd')}</Text>
          </View>
        ) : (
          sortedSubscriptions.map((subscription) => (
            <AnimatedCard
              key={subscription.id}
              subscription={subscription}
              onDelete={deleteSubscription}
              formatPrice={formatPrice}
              getDueDateText={getDueDateText}
              t={t}
              isRTL={isRTL}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, isRTL && styles.fabRTL]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Add Subscription Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, isRTL && styles.rowReverse]}>
              <Text style={styles.modalTitle}>{t('addSubscription')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>{t('serviceName')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={t('serviceNamePlaceholder')}
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.inputLabel}>{t('monthlyPrice')} (USD)</Text>
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={t('pricePlaceholder')}
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
              />

              <Text style={styles.inputLabel}>{t('dueDay')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={t('dueDayPlaceholder')}
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={formData.dueDay}
                onChangeText={(text) => setFormData({ ...formData, dueDay: text })}
              />

              <TouchableOpacity style={styles.saveButton} onPress={addSubscription}>
                <Text style={styles.saveButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Currency Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={currencyModalVisible}
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>{t('selectCurrency')}</Text>
            {Object.keys(EXCHANGE_RATES).map((curr) => (
              <TouchableOpacity
                key={curr}
                style={[styles.pickerItem, selectedCurrency === curr && styles.pickerItemActive]}
                onPress={() => {
                  saveCurrency(curr);
                  setCurrencyModalVisible(false);
                }}
              >
                <Text style={[styles.pickerItemText, selectedCurrency === curr && styles.pickerItemTextActive]}>
                  {curr} ({CURRENCY_SYMBOLS[curr]})
                </Text>
                {selectedCurrency === curr && <Ionicons name="checkmark" size={24} color="#5B67FF" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCurrencyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>{t('selectLanguage')}</Text>
            {[
              { code: 'en', name: 'English' },
              { code: 'ar', name: 'العربية' },
              { code: 'de', name: 'Deutsch' },
            ].map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.pickerItem, language === lang.code && styles.pickerItemActive]}
                onPress={() => {
                  saveLanguage(lang.code);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={[styles.pickerItemText, language === lang.code && styles.pickerItemTextActive]}>
                  {lang.name}
                </Text>
                {language === lang.code && <Ionicons name="checkmark" size={24} color="#5B67FF" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>{t('selectSort')}</Text>

            <Text style={styles.sortSectionTitle}>{t('sortBy')}</Text>
            {[
              { key: 'name', label: t('name'), icon: 'text' },
              { key: 'price', label: t('price'), icon: 'cash' },
              { key: 'dueDay', label: t('dueDate'), icon: 'calendar' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.pickerItem, sortBy === option.key && styles.pickerItemActive]}
                onPress={() => setSortBy(option.key)}
              >
                <View style={styles.pickerItemContent}>
                  <Ionicons name={option.icon} size={20} color={sortBy === option.key ? '#5B67FF' : '#666'} />
                  <Text style={[styles.pickerItemText, sortBy === option.key && styles.pickerItemTextActive]}>
                    {option.label}
                  </Text>
                </View>
                {sortBy === option.key && <Ionicons name="checkmark" size={24} color="#5B67FF" />}
              </TouchableOpacity>
            ))}

            <Text style={styles.sortSectionTitle}>{t('sortBy')} {sortBy === 'name' ? t('name') : sortBy === 'price' ? t('price') : t('dueDate')}</Text>
            <TouchableOpacity
              style={[styles.pickerItem, sortOrder === 'asc' && styles.pickerItemActive]}
              onPress={() => setSortOrder('asc')}
            >
              <Text style={[styles.pickerItemText, sortOrder === 'asc' && styles.pickerItemTextActive]}>
                {sortBy === 'name' ? t('ascending') : t('lowToHigh')}
              </Text>
              {sortOrder === 'asc' && <Ionicons name="checkmark" size={24} color="#5B67FF" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerItem, sortOrder === 'desc' && styles.pickerItemActive]}
              onPress={() => setSortOrder('desc')}
            >
              <Text style={[styles.pickerItemText, sortOrder === 'desc' && styles.pickerItemTextActive]}>
                {sortBy === 'name' ? t('descending') : t('highToLow')}
              </Text>
              {sortOrder === 'desc' && <Ionicons name="checkmark" size={24} color="#5B67FF" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSortModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={analyticsModalVisible}
        onRequestClose={() => setAnalyticsModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
          <View style={styles.analyticsHeader}>
            <TouchableOpacity onPress={() => setAnalyticsModalVisible(false)}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
          </View>
          <AnalyticsScreen
            subscriptions={subscriptions}
            selectedCurrency={selectedCurrency}
            language={language}
            t={t}
            convertCurrency={convertCurrency}
            formatPrice={formatPrice}
            getCategoryName={(category, lang) => category} // Can be enhanced later
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Loading Screen Component with Pulse Animation
const LoadingScreen = ({ fadeAnim }) => {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Create pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
      <StatusBar style="light" />
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.logoCircle}>
          <Ionicons name="document-text" size={60} color="#FFF" />
          <Text style={styles.dollarSign}>$</Text>
        </View>
      </Animated.View>
      <Text style={styles.loadingTitle}>SubsTrack</Text>
      <Text style={styles.loadingSubtitle}>Track Your Subscriptions</Text>
      <View style={styles.loadingIndicator}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotDelay1]} />
        <View style={[styles.dot, styles.dotDelay2]} />
      </View>
    </Animated.View>
  );
};

// Animated Card Component with Scale Effect
const AnimatedCard = ({ subscription, onDelete, formatPrice, getDueDateText, t, isRTL }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.subscriptionCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[styles.cardContent, isRTL && styles.rowReverse]}
      >
        <View style={styles.subscriptionInfo}>
          <Text style={[styles.subscriptionName, isRTL && styles.textRight]}>{subscription.name}</Text>
          <Text style={[styles.subscriptionDueDate, isRTL && styles.textRight]}>{getDueDateText(subscription.dueDay)}</Text>
        </View>
        <View style={[styles.subscriptionActions, isRTL && styles.rowReverse]}>
          <Text style={styles.subscriptionPrice}>{formatPrice(subscription.price)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(subscription.id, subscription.name)}
          >
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#F2F2F7',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#5B67FF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodTextActive: {
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subscriptionDueDate: {
    fontSize: 14,
    color: '#666',
  },
  subscriptionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  subscriptionPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#34C759',
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#5B67FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B67FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabRTL: {
    right: undefined,
    left: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  formContainer: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputRTL: {
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: '#5B67FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#5B67FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  pickerModal: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 100,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F2F2F7',
  },
  pickerItemActive: {
    backgroundColor: '#E8E9FF',
  },
  pickerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  pickerItemTextActive: {
    color: '#5B67FF',
  },
  sortSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  closeButton: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: '#F2F2F7',
  },
  // Loading Screen Styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#5B67FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dollarSign: {
    position: 'absolute',
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FFF',
    left: 20,
  },
  loadingTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 60,
  },
  loadingIndicator: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    opacity: 0.3,
  },
  dotDelay1: {
    opacity: 0.5,
  },
  dotDelay2: {
    opacity: 0.7,
  },
});
