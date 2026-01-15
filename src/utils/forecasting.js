// Regression analysis and forecasting utilities

/**
 * Simple Linear Regression
 * Calculates the best-fit line for predicting future values
 */
export const linearRegression = (data) => {
    const n = data.length;
    if (n < 2) return null;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    data.forEach((point, index) => {
        const x = index;
        const y = point;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
};

/**
 * Predict future values using linear regression
 */
export const predictFutureExpenditure = (historicalData, monthsAhead) => {
    if (!historicalData || historicalData.length < 2) {
        return null;
    }

    const regression = linearRegression(historicalData);
    if (!regression) return null;

    const { slope, intercept } = regression;
    const predictions = [];

    for (let i = 1; i <= monthsAhead; i++) {
        const futureIndex = historicalData.length + i - 1;
        const predicted = slope * futureIndex + intercept;
        predictions.push(Math.max(0, predicted)); // Ensure non-negative
    }

    return predictions;
};

/**
 * Calculate prediction confidence and trend
 */
export const analyzeTrend = (historicalData) => {
    if (!historicalData || historicalData.length < 2) {
        return {
            trend: 'insufficient_data',
            confidence: 0,
            changePercentage: 0,
        };
    }

    const regression = linearRegression(historicalData);
    if (!regression) {
        return {
            trend: 'no_trend',
            confidence: 0,
            changePercentage: 0,
        };
    }

    const { slope } = regression;
    const avgValue = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;

    // Calculate R-squared for confidence
    const predictions = historicalData.map((_, i) => regression.slope * i + regression.intercept);
    const meanValue = historicalData.reduce((a, b) => a + b) / historicalData.length;

    const ssTotal = historicalData.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0);
    const ssResidual = historicalData.reduce((sum, val, i) => sum + Math.pow(val - predictions[i], 2), 0);

    const rSquared = ssTotal === 0 ? 0 : 1 - (ssResidual / ssTotal);
    const confidence = Math.max(0, Math.min(100, rSquared * 100));

    // Determine trend
    const changePercentage = avgValue === 0 ? 0 : (slope / avgValue) * 100;
    let trend = 'stable';

    if (Math.abs(changePercentage) < 2) {
        trend = 'stable';
    } else if (changePercentage > 0) {
        trend = changePercentage > 10 ? 'increasing_rapidly' : 'increasing';
    } else {
        trend = changePercentage < -10 ? 'decreasing_rapidly' : 'decreasing';
    }

    return {
        trend,
        confidence: Math.round(confidence),
        changePercentage: Math.round(changePercentage * 10) / 10,
        slope,
    };
};

/**
 * Generate spending forecast with multiple timeframes
 */
export const generateForecast = (monthlyTotals, currentTotal) => {
    if (!monthlyTotals || monthlyTotals.length === 0) {
        // If no historical data, use current total with slight variations
        return {
            month3: currentTotal * 3,
            month6: currentTotal * 6,
            month12: currentTotal * 12,
            predictions: [currentTotal, currentTotal, currentTotal],
            trend: analyzeTrend([currentTotal]),
        };
    }

    const predictions3 = predictFutureExpenditure(monthlyTotals, 3);
    const predictions6 = predictFutureExpenditure(monthlyTotals, 6);
    const predictions12 = predictFutureExpenditure(monthlyTotals, 12);
    const trend = analyzeTrend(monthlyTotals);

    if (!predictions3 || !predictions6 || !predictions12) {
        return {
            month3: currentTotal * 3,
            month6: currentTotal * 6,
            month12: currentTotal * 12,
            predictions: [currentTotal, currentTotal, currentTotal],
            trend,
        };
    }

    return {
        month3: predictions3.reduce((sum, val) => sum + val, 0),
        month6: predictions6.reduce((sum, val) => sum + val, 0),
        month12: predictions12.reduce((sum, val) => sum + val, 0),
        predictions: predictions12,
        trend,
    };
};

/**
 * Calculate next payment date for a subscription
 */
export const calculateNextPaymentDate = (dueDay, startDate = null, billingCycle = 'monthly') => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let nextPaymentDate = new Date(currentYear, currentMonth, dueDay);

    // If due day has passed this month, move to next month
    if (currentDay > dueDay) {
        if (billingCycle === 'monthly') {
            nextPaymentDate = new Date(currentYear, currentMonth + 1, dueDay);
        } else if (billingCycle === 'yearly') {
            if (startDate) {
                const start = new Date(startDate);
                nextPaymentDate = new Date(currentYear + 1, start.getMonth(), dueDay);
            } else {
                nextPaymentDate = new Date(currentYear + 1, currentMonth, dueDay);
            }
        } else if (billingCycle === 'quarterly') {
            nextPaymentDate = new Date(currentYear, currentMonth + 3, dueDay);
        }
    }

    return nextPaymentDate;
};

/**
 * Calculate days until next payment
 */
export const daysUntilPayment = (dueDay) => {
    const today = new Date();
    const nextPayment = calculateNextPaymentDate(dueDay);
    const diffTime = nextPayment - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
 * Format date for display
 */
export const formatPaymentDate = (date, language = 'en') => {
    const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const monthNamesDe = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

    const d = new Date(date);
    const monthNames = language === 'ar' ? monthNamesAr : language === 'de' ? monthNamesDe : monthNamesEn;

    return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

/**
 * Get payment history summary
 */
export const getPaymentSummary = (subscription) => {
    const nextPayment = calculateNextPaymentDate(subscription.dueDay, subscription.startDate, subscription.billingCycle || 'monthly');
    const daysUntil = daysUntilPayment(subscription.dueDay);

    let frequency = 'monthly';
    if (subscription.billingCycle) {
        frequency = subscription.billingCycle;
    }

    return {
        nextPaymentDate: nextPayment,
        daysUntilPayment: daysUntil,
        frequency,
        startDate: subscription.startDate || new Date().toISOString(),
    };
};
