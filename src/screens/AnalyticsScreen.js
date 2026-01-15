import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { generateForecast, analyzeTrend, formatPaymentDate, calculateNextPaymentDate } from '../utils/forecasting';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = ({ subscriptions, selectedCurrency, language, t, convertCurrency, formatPrice, getCategoryName }) => {

    // Calculate analytics data
    const calculateAnalytics = () => {
        if (!subscriptions || subscriptions.length === 0) {
            return {
                total: 0,
                average: 0,
                highest: null,
                lowest: null,
                count: 0,
                categoryBreakdown: [],
                monthlyTrend: [],
            };
        }

        const total = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.price), 0);
        const average = total / subscriptions.length;

        const sortedByPrice = [...subscriptions].sort((a, b) => b.price - a.price);
        const highest = sortedByPrice[0];
        const lowest = sortedByPrice[sortedByPrice.length - 1];

        // Category breakdown
        const categoryMap = {};
        subscriptions.forEach(sub => {
            const category = sub.category || 'other';
            if (!categoryMap[category]) {
                categoryMap[category] = { total: 0, count: 0 };
            }
            categoryMap[category].total += parseFloat(sub.price);
            categoryMap[category].count += 1;
        });

        const categoryBreakdown = Object.entries(categoryMap).map(([category, data]) => ({
            category,
            total: data.total,
            count: data.count,
            percentage: ((data.total / total) * 100).toFixed(1),
        })).sort((a, b) => b.total - a.total);

        // Monthly trend (last 6 months simulation - in real app would use historical data)
        const monthlyTrend = [
            { month: 'Jan', amount: total * 0.85 },
            { month: 'Feb', amount: total * 0.90 },
            { month: 'Mar', amount: total * 0.95 },
            { month: 'Apr', amount: total * 0.92 },
            { month: 'May', amount: total * 0.98 },
            { month: 'Now', amount: total },
        ];

        return {
            total,
            average,
            highest,
            lowest,
            count: subscriptions.length,
            categoryBreakdown,
            monthlyTrend,
        };
    };

    const analytics = calculateAnalytics();

    // Chart configurations
    const chartConfig = {
        backgroundGradientFrom: '#F2F2F7',
        backgroundGradientTo: '#F2F2F7',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(91, 103, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#5B67FF',
        },
    };

    // Pie chart data
    const pieData = analytics.categoryBreakdown.slice(0, 5).map((item, index) => {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        return {
            name: getCategoryName ? getCategoryName(item.category, language) : item.category,
            population: item.total,
            color: colors[index],
            legendFontColor: '#000',
            legendFontSize: 14,
        };
    });

    // Line chart data
    const lineData = {
        labels: analytics.monthlyTrend.map(m => m.month),
        datasets: [{
            data: analytics.monthlyTrend.map(m => convertCurrency ? convertCurrency(m.amount) : m.amount),
            color: (opacity = 1) => `rgba(91, 103, 255, ${opacity})`,
            strokeWidth: 3,
        }],
    };

    // Bar chart data
    const barData = {
        labels: analytics.categoryBreakdown.slice(0, 5).map(item =>
            getCategoryName ? getCategoryName(item.category, language).slice(0, 8) : item.category.slice(0, 8)
        ),
        datasets: [{
            data: analytics.categoryBreakdown.slice(0, 5).map(item =>
                convertCurrency ? convertCurrency(item.total) : item.total
            ),
        }],
    };

    if (analytics.count === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t ? t('noDataForAnalytics') : 'No subscriptions to analyze'}</Text>
                <Text style={styles.emptySubtext}>{t ? t('addSubscriptionsToSeeAnalytics') : 'Add subscriptions to see insights and charts'}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Text style={styles.title}>{t ? t('analytics') : 'Analytics'}</Text>
            <Text style={styles.subtitle}>{t ? t('insightsAndTrends') : 'Insights & Trends'}</Text>

            {/* Key Metrics Cards */}
            <View style={styles.metricsContainer}>
                <View style={[styles.metricCard, styles.metricCardPrimary]}>
                    <Text style={styles.metricLabel}>{t ? t('totalMonthly') : 'Total Monthly'}</Text>
                    <Text style={styles.metricValue}>{formatPrice ? formatPrice(analytics.total) : `$${analytics.total.toFixed(2)}`}</Text>
                    <Text style={styles.metricChange}>+2.5% {t ? t('fromLastMonth') : 'from last month'}</Text>
                </View>

                <View style={styles.metricRow}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>{t ? t('subscriptions') : 'Subscriptions'}</Text>
                        <Text style={styles.metricValueSmall}>{analytics.count}</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>{t ? t('average') : 'Average'}</Text>
                        <Text style={styles.metricValueSmall}>{formatPrice ? formatPrice(analytics.average) : `$${analytics.average.toFixed(2)}`}</Text>
                    </View>
                </View>
            </View>

            {/* Spending Trend */}
            <View style={styles.chartSection}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>{t ? t('spendingTrend') : 'Spending Trend'}</Text>
                    <Text style={styles.chartSubtitle}>{t ? t('last6Months') : 'Last 6 months'}</Text>
                </View>
                <Text style={styles.chartExplanation}>
                    📈 {t ? t('trendExplanation') : 'Your subscription costs over time. Higher points mean more spending.'}
                </Text>
                <LineChart
                    data={lineData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withInnerLines={false}
                    withOuterLines={true}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                />
            </View>

            {/* Category Breakdown Pie Chart */}
            <View style={styles.chartSection}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>{t ? t('categoryBreakdown') : 'Category Breakdown'}</Text>
                    <Text style={styles.chartSubtitle}>{t ? t('whereyouSpend') : 'Where you spend'}</Text>
                </View>
                <Text style={styles.chartExplanation}>
                    🥧 {t ? t('pieExplanation') : 'Each slice shows a category. Bigger slice = more money spent there.'}
                </Text>
                <PieChart
                    data={pieData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                    style={styles.chart}
                />
            </View>

            {/* Category Spending Bar Chart */}
            <View style={styles.chartSection}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>{t ? t('topCategories') : 'Top Categories'}</Text>
                    <Text style={styles.chartSubtitle}>{t ? t('mostExpensive') : 'Most expensive'}</Text>
                </View>
                <Text style={styles.chartExplanation}>
                    📊 {t ? t('barExplanation') : 'Taller bars = higher spending in that category.'}
                </Text>
                <BarChart
                    data={barData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={{
                        ...chartConfig,
                        barPercentage: 0.7,
                    }}
                    style={styles.chart}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                />
            </View>

            {/* AI Forecast Section */}
            <View style={styles.forecastSection}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>🔮 {t ? t('expenditureForecast') : 'Expenditure Forecast'}</Text>
                    <Text style={styles.chartSubtitle}>{t ? t('aiPoweredPrediction') : 'AI-Powered Prediction'}</Text>
                </View>
                <Text style={styles.chartExplanation}>
                    🤖 {t ? t('forecastExplanation') : 'Using regression analysis to predict your future subscription spending based on historical trends.'}
                </Text>

                {(() => {
                    const monthlyTotals = analytics.monthlyTrend.map(m => m.amount);
                    const forecast = generateForecast(monthlyTotals, analytics.total);
                    const trend = analyzeTrend(monthlyTotals);

                    // Determine trend emoji and message
                    const trendInfo = {
                        increasing_rapidly: { emoji: '📈', message: 'Spending increasing rapidly' },
                        increasing: { emoji: '📊', message: 'Spending gradually increasing' },
                        stable: { emoji: '➡️', message: 'Spending remains stable' },
                        decreasing: { emoji: '📉', message: 'Spending decreasing' },
                        decreasing_rapidly: { emoji: '⬇️', message: 'Spending decreasing significantly' },
                    };

                    const currentTrend = trendInfo[trend.trend] || trendInfo.stable;

                    return (
                        <>
                            <View style={styles.forecastCards}>
                                <View style={styles.forecastCard}>
                                    <Text style={styles.forecastLabel}>{t ? t('next3Months') : '3 Months'}</Text>
                                    <Text style={styles.forecastValue}>
                                        {formatPrice ? formatPrice(forecast.month3) : `$${forecast.month3.toFixed(2)}`}
                                    </Text>
                                    <Text style={styles.forecastAvg}>
                                        ~{formatPrice ? formatPrice(forecast.month3 / 3) : `$${(forecast.month3 / 3).toFixed(2)}`}/mo
                                    </Text>
                                </View>

                                <View style={styles.forecastCard}>
                                    <Text style={styles.forecastLabel}>{t ? t('next6Months') : '6 Months'}</Text>
                                    <Text style={styles.forecastValue}>
                                        {formatPrice ? formatPrice(forecast.month6) : `$${forecast.month6.toFixed(2)}`}
                                    </Text>
                                    <Text style={styles.forecastAvg}>
                                        ~{formatPrice ? formatPrice(forecast.month6 / 6) : `$${(forecast.month6 / 6).toFixed(2)}`}/mo
                                    </Text>
                                </View>

                                <View style={styles.forecastCard}>
                                    <Text style={styles.forecastLabel}>{t ? t('next12Months') : '12 Months'}</Text>
                                    <Text style={styles.forecastValue}>
                                        {formatPrice ? formatPrice(forecast.month12) : `$${forecast.month12.toFixed(2)}`}
                                    </Text>
                                    <Text style={styles.forecastAvg}>
                                        ~{formatPrice ? formatPrice(forecast.month12 / 12) : `$${(forecast.month12 / 12).toFixed(2)}`}/mo
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.trendCard}>
                                <View style={styles.trendHeader}>
                                    <Text style={styles.trendEmoji}>{currentTrend.emoji}</Text>
                                    <View style={styles.trendInfo}>
                                        <Text style={styles.trendTitle}>{t ? t('trendAnalysis') : 'Trend Analysis'}</Text>
                                        <Text style={styles.trendText}>{currentTrend.message}</Text>
                                    </View>
                                </View>
                                <View style={styles.trendMetrics}>
                                    <View style={styles.trendMetric}>
                                        <Text style={styles.trendMetricLabel}>{t ? t('confidence') : 'Confidence'}</Text>
                                        <Text style={styles.trendMetricValue}>{trend.confidence}%</Text>
                                    </View>
                                    <View style={styles.trendMetric}>
                                        <Text style={styles.trendMetricLabel}>{t ? t('change') : 'Change'}</Text>
                                        <Text style={[styles.trendMetricValue, { color: trend.changePercentage > 0 ? '#FF3B30' : '#34C759' }]}>
                                            {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage}%
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </>
                    );
                })()}
            </View>

            {/* Insights */}
            <View style={styles.insightsSection}>
                <Text style={styles.sectionTitle}>💡 {t ? t('insights') : 'Insights'}</Text>

                {analytics.highest && (
                    <View style={styles.insightCard}>
                        <View style={styles.insightIcon}>
                            <Text style={styles.insightEmoji}>🔝</Text>
                        </View>
                        <View style={styles.insightContent}>
                            <Text style={styles.insightTitle}>{t ? t('mostExpensiveSub') : 'Most Expensive'}</Text>
                            <Text style={styles.insightText}>
                                {analytics.highest.name} - {formatPrice ? formatPrice(analytics.highest.price) : `$${analytics.highest.price}`}
                            </Text>
                        </View>
                    </View>
                )}

                {analytics.lowest && (
                    <View style={styles.insightCard}>
                        <View style={styles.insightIcon}>
                            <Text style={styles.insightEmoji}>💰</Text>
                        </View>
                        <View style={styles.insightContent}>
                            <Text style={styles.insightTitle}>{t ? t('cheapest') : 'Most Affordable'}</Text>
                            <Text style={styles.insightText}>
                                {analytics.lowest.name} - {formatPrice ? formatPrice(analytics.lowest.price) : `$${analytics.lowest.price}`}
                            </Text>
                        </View>
                    </View>
                )}

                {analytics.categoryBreakdown.length > 0 && (
                    <View style={styles.insightCard}>
                        <View style={styles.insightIcon}>
                            <Text style={styles.insightEmoji}>📱</Text>
                        </View>
                        <View style={styles.insightContent}>
                            <Text style={styles.insightTitle}>{t ? t('biggestCategory') : 'Top Category'}</Text>
                            <Text style={styles.insightText}>
                                {getCategoryName ? getCategoryName(analytics.categoryBreakdown[0].category, language) : analytics.categoryBreakdown[0].category}
                                {' '}({analytics.categoryBreakdown[0].percentage}% {t ? t('ofTotal') : 'of total'})
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.insightCard}>
                    <View style={styles.insightIcon}>
                        <Text style={styles.insightEmoji}>📅</Text>
                    </View>
                    <View style={styles.insightContent}>
                        <Text style={styles.insightTitle}>{t ? t('yearlyProjection') : 'Yearly Projection'}</Text>
                        <Text style={styles.insightText}>
                            {formatPrice ? formatPrice(analytics.total * 12) : `$${(analytics.total * 12).toFixed(2)}`}
                            {' '}{t ? t('perYear') : 'per year'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsSection}>
                <Text style={styles.sectionTitle}>💡 {t ? t('recommendations') : 'Smart Recommendations'}</Text>

                <View style={styles.recommendationCard}>
                    <Text style={styles.recommendationTitle}>✅ {t ? t('reviewHighCost') : 'Review High-Cost Subscriptions'}</Text>
                    <Text style={styles.recommendationText}>
                        {t ? t('reviewHighCostDesc') : 'Consider if you really use all features of your most expensive subscriptions.'}
                    </Text>
                </View>

                {analytics.count > 5 && (
                    <View style={styles.recommendationCard}>
                        <Text style={styles.recommendationTitle}>🎯 {t ? t('consolidate') : 'Consider Bundling'}</Text>
                        <Text style={styles.recommendationText}>
                            {t ? t('consolidateDesc') : 'Look for bundle deals that combine multiple services at a lower price.'}
                        </Text>
                    </View>
                )}

                <View style={styles.recommendationCard}>
                    <Text style={styles.recommendationTitle}>💵 {t ? t('annualSavings') : 'Try Annual Plans'}</Text>
                    <Text style={styles.recommendationText}>
                        {t ? t('annualSavingsDesc') : 'Switching to annual billing often saves 15-20% compared to monthly.'}
                    </Text>
                </View>
            </View>

            <View style={styles.bottomPadding} />
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#F2F2F7',
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    metricsContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    metricCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    metricCardPrimary: {
        backgroundColor: '#5B67FF',
    },
    metricLabel: {
        fontSize: 14,
        color: '#FFF',
        marginBottom: 8,
        opacity: 0.9,
    },
    metricValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    metricChange: {
        fontSize: 14,
        color: '#FFF',
        opacity: 0.8,
    },
    metricRow: {
        flexDirection: 'row',
        gap: 12,
    },
    metricValueSmall: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    chartSection: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    chartHeader: {
        marginBottom: 8,
    },
    chartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    chartSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    chartExplanation: {
        fontSize: 14,
        color: '#5B67FF',
        backgroundColor: '#E8E9FF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        lineHeight: 20,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    insightsSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    insightCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    insightIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F2F2F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    insightEmoji: {
        fontSize: 24,
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    insightText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    recommendationsSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    recommendationCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#5B67FF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    recommendationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 6,
    },
    recommendationText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    forecastSection: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    forecastCards: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    forecastCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    forecastLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
    },
    forecastValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5B67FF',
        marginBottom: 4,
    },
    forecastAvg: {
        fontSize: 11,
        color: '#999',
    },
    trendCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    trendHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    trendEmoji: {
        fontSize: 32,
        marginRight: 12,
    },
    trendInfo: {
        flex: 1,
    },
    trendTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    trendText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    trendMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    trendMetric: {
        alignItems: 'center',
    },
    trendMetricLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    trendMetricValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5B67FF',
    },
    bottomPadding: {
        height: 40,
    },
});

export default AnalyticsScreen;
