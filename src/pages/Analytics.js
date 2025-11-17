import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import analyticsService from '../services/analyticsService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Analytics = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [overview, setOverview] = useState(null);
  const [viewsData, setViewsData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [followerData, setFollowerData] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  // UI states
  const [timeRange, setTimeRange] = useState(30);
  const [sortBy, setSortBy] = useState('views');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, sortBy]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all analytics data in parallel
      const [
        overviewData,
        viewsOverTime,
        engagement,
        followerGrowth,
        popular,
        categories
      ] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getViewsOverTime(timeRange),
        analyticsService.getEngagementMetrics(timeRange),
        analyticsService.getFollowerGrowth(timeRange),
        analyticsService.getPopularArticles(10, sortBy),
        analyticsService.getTopCategories()
      ]);

      setOverview(overviewData);
      setViewsData(viewsOverTime);
      setEngagementData(engagement);
      setFollowerData(followerGrowth);
      setPopularArticles(popular);
      setTopCategories(categories);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.error || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAnalyticsData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('analytics.title', 'Analytics Dashboard')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('analytics.subtitle', 'Track your content performance and audience growth')}
          </p>
        </div>

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title={t('analytics.totalArticles', 'Total Articles')}
              value={overview.overview.totalArticles}
              icon="📝"
              color="blue"
            />
            <StatCard
              title={t('analytics.totalViews', 'Total Views')}
              value={overview.overview.totalViews.toLocaleString()}
              icon="👁️"
              color="green"
            />
            <StatCard
              title={t('analytics.totalLikes', 'Total Likes')}
              value={overview.overview.totalLikes}
              icon="❤️"
              color="red"
            />
            <StatCard
              title={t('analytics.totalComments', 'Total Comments')}
              value={overview.overview.totalComments}
              icon="💬"
              color="purple"
            />
            <StatCard
              title={t('analytics.followers', 'Followers')}
              value={overview.overview.totalFollowers}
              icon="👥"
              color="indigo"
            />
          </div>
        )}

        {/* Last 30 Days Performance */}
        {overview && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('analytics.last30Days', 'Last 30 Days Performance')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {overview.last30Days.articlesPublished}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('analytics.articlesPublished', 'Articles Published')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {overview.last30Days.views.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('analytics.views', 'Views')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {overview.last30Days.likes}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('analytics.likes', 'Likes')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {overview.last30Days.comments}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('analytics.comments', 'Comments')}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                  {t('analytics.engagementRate', 'Engagement Rate')}:
                </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {overview.overview.engagementRate}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {[7, 14, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t(`analytics.${days}days`, `Last ${days} Days`)}
              </button>
            ))}
          </div>
        </div>

        {/* Views Over Time Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.viewsOverTime', 'Views Over Time')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Metrics Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.engagementMetrics', 'Engagement Metrics')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="likes"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
                name={t('analytics.likes', 'Likes')}
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name={t('analytics.comments', 'Comments')}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Follower Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.followerGrowth', 'Follower Growth')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={followerData}>
              <defs>
                <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="totalFollowers"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorFollowers)"
                name={t('analytics.totalFollowers', 'Total Followers')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Articles and Top Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Articles */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('analytics.popularArticles', 'Popular Articles')}
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="views">{t('analytics.byViews', 'By Views')}</option>
                <option value="likes">{t('analytics.byLikes', 'By Likes')}</option>
                <option value="comments">{t('analytics.byComments', 'By Comments')}</option>
                <option value="engagement">{t('analytics.byEngagement', 'By Engagement')}</option>
              </select>
            </div>
            <div className="space-y-4">
              {popularArticles.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  {t('analytics.noArticlesYet', 'No articles yet')}
                </p>
              ) : (
                popularArticles.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            #{index + 1}
                          </span>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>👁️ {article.views.toLocaleString()}</span>
                          <span>❤️ {article.likes}</span>
                          <span>💬 {article.comments}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('analytics.topCategories', 'Top Categories')}
            </h2>
            <div className="space-y-4">
              {topCategories.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  {t('analytics.noCategoriesYet', 'No categories yet')}
                </p>
              ) : (
                topCategories.map((category) => (
                  <div
                    key={category.category}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {category.category}
                      </h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {category.articleCount} {t('analytics.articles', 'articles')}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span>👁️ {category.totalViews.toLocaleString()}</span>
                      <span>❤️ {category.totalLikes}</span>
                      <span>💬 {category.totalComments}</span>
                      <span className="ml-auto">
                        Avg: {category.avgViewsPerArticle} {t('analytics.views', 'views')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
