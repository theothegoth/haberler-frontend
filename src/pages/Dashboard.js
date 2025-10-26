import { useState, useMemo } from 'react';
import Modal from 'react-modal';
import he from 'he';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import AddChannelForm from '../components/AddChannelForm';
import ErrorMessage from '../components/ErrorMessage';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import StatsCard from '../components/StatsCard';
import ChannelList from '../components/ChannelList';
import useUserVideos from '../hooks/useUserVideos';
import useUserChannels from '../hooks/useUserChannels';
import { videoCategories } from '../utils/videoCategories';

Modal.setAppElement('#root');

function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { videos, loading, error, refetch } = useUserVideos();
  const { channels, loading: channelsLoading, removeChannel, refetch: refetchChannels } = useUserChannels();

  const openModal = (videoId) => {
    setSelectedVideoId(videoId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedVideoId(null);
  };

  const handleRemoveChannel = async (channelId) => {
    if (window.confirm(t('dashboard.channelList.confirmRemove'))) {
      const result = await removeChannel(channelId);
      if (result.success) {
        refetch();
        refetchChannels();
      } else {
        alert(result.error);
      }
    }
  };

  const handleChannelAdded = () => {
    refetch();
    refetchChannels();
  };

  // Get unique categories from current videos
  const availableCategories = useMemo(() => {
    const categorySet = new Set();
    videos.forEach(video => {
      if (video.category) {
        categorySet.add(video.category.toString());
      }
    });
    return Array.from(categorySet).sort((a, b) => Number(a) - Number(b));
  }, [videos]);

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    let result = videos;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(video => video.category === Number(selectedCategory));
    }

    // Filter by channel
    if (selectedChannelFilter) {
      result = result.filter(video => video.channelId === selectedChannelFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.channelTitle.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'oldest':
          return new Date(a.publishedAt) - new Date(b.publishedAt);
        case 'popular':
          return (b.likeCount || 0) - (a.likeCount || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [videos, selectedCategory, selectedChannelFilter, searchQuery, sortBy]);

  // Calculate stats
  const stats = useMemo(() => ({
    totalChannels: channels.length,
    totalVideos: videos.length,
    todayVideos: videos.filter(v => {
      const videoDate = new Date(v.publishedAt);
      const today = new Date();
      return videoDate.toDateString() === today.toDateString();
    }).length,
    categories: availableCategories.length,
  }), [channels, videos, availableCategories]);

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      yıl: 31536000,
      ay: 2592000,
      hafta: 604800,
      gün: 86400,
      saat: 3600,
      dakika: 60,
    };

    for (const [name, count] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / count);
      if (interval >= 1) {
        return `${interval} ${name} önce`;
      }
    }
    return 'Az önce';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Hoş geldiniz, {user?.username}!</h1>
              <p className="text-blue-100 mt-1">Haber videolarınızı buradan takip edin</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-blue-700 p-2 rounded-lg hover:bg-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title={t("dashboard.stats.totalChannels")}
              value={stats.totalChannels}
              color="blue"
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              }
            />
            <StatsCard
              title={t("dashboard.stats.totalVideos")}
              value={stats.totalVideos}
              color="green"
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatsCard
              title={t("dashboard.stats.todayVideos")}
              value={stats.todayVideos}
              color="purple"
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatsCard
              title="Kategoriler"
              value={stats.categories}
              color="orange"
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Kanallarım
              </h2>
              {channelsLoading ? (
                <div className="text-center py-4 text-gray-500">Yükleniyor...</div>
              ) : (
                <ChannelList
                  channels={channels}
                  onChannelClick={setSelectedChannelFilter}
                  selectedChannel={selectedChannelFilter}
                  onRemoveChannel={handleRemoveChannel}
                />
              )}
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 min-w-0">
            {/* Add Channel Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Yeni Kanal Ekle</h2>
              <AddChannelForm onAdded={handleChannelAdded} />
            </div>

            {/* Filters & Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 sticky top-0 z-10">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("dashboard.filters.search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Category Filter */}
                {availableCategories.length > 0 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">📁 Tüm Kategoriler</option>
                    {availableCategories.map(categoryId => {
                      const categoryName = videoCategories[categoryId] || `Kategori ${categoryId}`;
                      return (
                        <option key={categoryId} value={categoryId}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </select>
                )}

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">🕐 En Yeni</option>
                  <option value="oldest">📅 En Eski</option>
                  <option value="popular">⭐ Popüler</option>
                </select>

                {/* View Toggle */}
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setSelectedLayout('list')}
                    className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                      selectedLayout === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title={t("dashboard.filters.viewMode.listTitle")}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedLayout('grid')}
                    className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                      selectedLayout === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Gazete görünüm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <VideoCardSkeleton key={i} />)}
              </div>
            )}

            {/* Error State */}
            {error && !loading && <ErrorMessage message={error} onRetry={refetch} />}

            {/* Empty State */}
            {!loading && !error && filteredAndSortedVideos.length === 0 && (
              <div className="text-center mt-12 max-w-2xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                  <svg
                    className="mx-auto h-16 w-16 text-blue-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {searchQuery ? 'Sonuç bulunamadı' : 'Henüz kanal eklemediniz'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery
                      ? 'Arama kriterlerinize uygun video bulunamadı. Farklı kelimeler deneyin.'
                      : t('dashboard.noVideosMessage')}
                  </p>
                  {!searchQuery && (
                    <p className="text-sm text-gray-500">
                      Örnek: @CNN, @BBCNews, @HaberturkTV veya kanal URL'si
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* List View */}
            {!loading && !error && filteredAndSortedVideos.length > 0 && selectedLayout === 'list' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedVideos.map(video => (
                  <article
                    key={video.videoId}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                  >
                    <div className="relative">
                      <button
                        onClick={() => openModal(video.videoId)}
                        className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </button>
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </span>
                      )}
                      {video.category && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">
                          {videoCategories[video.category] || 'Kategori'}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {he.decode(video.title)}
                      </h2>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        <span className="truncate font-medium">{video.channelTitle}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {formatTimeAgo(video.publishedAt)}
                        </span>
                        {video.likeCount > 0 && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {video.likeCount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Grid View */}
            {!loading && !error && filteredAndSortedVideos.length > 0 && selectedLayout === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {filteredAndSortedVideos.map(video => {
                  const like = video.likeCount || 0;
                  let colSpan = 2, rowSpan = 1;
                  if (like > 10000) { colSpan = 3; rowSpan = 2; }
                  else if (like > 1000) { colSpan = 2; rowSpan = 2; }
                  else if (like > 100) { colSpan = 1; rowSpan = 1; }

                  return (
                    <article
                      key={video.videoId}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
                    >
                      <div className="relative h-full">
                        <button
                          onClick={() => openModal(video.videoId)}
                          className="w-full h-full focus:outline-none"
                        >
                          <img
                            src={video.thumbnail}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <h2 className="text-white text-sm font-semibold line-clamp-2">
                            {he.decode(video.title)}
                          </h2>
                          <p className="text-gray-300 text-xs mt-1">{video.channelTitle}</p>
                        </div>
                        {video.category && (
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            {videoCategories[video.category]}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={t("dashboard.modal.title")}
        className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl outline-none animate-fadeIn overflow-hidden"
        overlayClassName="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn"
        style={{
          content: {
            maxHeight: '90vh',
            margin: 'auto',
            border: 'none'
          }
        }}
      >
        {/* Header with gradient */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Video İzle</h3>
              <p className="text-gray-200 text-xs">YouTube Video Player</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-white hover:bg-white hover:bg-opacity-20 transition-all duration-200 p-2 rounded-full group"
            aria-label="Kapat"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Container with glow effect */}
        {selectedVideoId && (
          <div className="relative bg-black">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full border-0 relative z-10"
              style={{ height: '70vh', maxHeight: '650px' }}
            />
          </div>
        )}

        {/* Footer with info */}
        <div className="px-6 py-3 bg-gray-800 bg-opacity-50 backdrop-blur-sm border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Tam ekran için video üzerine çift tıklayın</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-xs font-medium border border-green-500 border-opacity-30">
                HD Kalite
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
