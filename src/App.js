import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationBlockerProvider } from './context/NavigationBlockerContext';
import Navigation from './components/Navigation';
import VerificationBanner from './components/VerificationBanner';
import NavigationBlockerDialog from './components/NavigationBlockerDialog';
import InstallPWA from './components/InstallPWA';
import CookieConsent from './components/CookieConsent';
import OfflineFallback from './components/OfflineFallback';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better performance (code splitting)
// Critical pages loaded immediately
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Lazy load other pages
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const VerifyEmailRequired = lazy(() => import('./pages/VerifyEmailRequired'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WriteNews = lazy(() => import('./pages/WriteNews'));
const EditArticle = lazy(() => import('./pages/EditArticle'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
const MyArticles = lazy(() => import('./pages/MyArticles'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Explore = lazy(() => import('./pages/Explore'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const SavedArticles = lazy(() => import('./pages/SavedArticles'));
const AdvancedSearch = lazy(() => import('./pages/AdvancedSearch'));
const BlockedUsers = lazy(() => import('./pages/BlockedUsers'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Drafts = lazy(() => import('./pages/Drafts'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const ManageArticleImages = lazy(() => import('./pages/ManageArticleImages'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ThemeProvider>
        <AuthProvider>
          <NavigationBlockerProvider>
          <OfflineFallback>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <VerificationBanner />
            <NavigationBlockerDialog />
            <InstallPWA />
            <CookieConsent />
            <Suspense fallback={<LoadingSpinner fullPage={true} size="lg" />}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/verify-email-required" element={<VerifyEmailRequired />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/watch"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <NewsFeed />
                </PrivateRoute>
              }
            />
            <Route
              path="/write"
              element={
                <PrivateRoute>
                  <WriteNews />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-article/:id"
              element={
                <PrivateRoute>
                  <EditArticle />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-articles"
              element={
                <PrivateRoute>
                  <MyArticles />
                </PrivateRoute>
              }
            />
            <Route
              path="/article/:articleId/images"
              element={
                <PrivateRoute>
                  <ManageArticleImages />
                </PrivateRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <PrivateRoute>
                  <Explore />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/saved-articles"
              element={
                <PrivateRoute>
                  <SavedArticles />
                </PrivateRoute>
              }
            />
            <Route
              path="/blocked-users"
              element={
                <PrivateRoute>
                  <BlockedUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/:userId"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/article/:id"
              element={
                <PrivateRoute>
                  <ArticleDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <AdvancedSearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              }
            />
            <Route
              path="/drafts"
              element={
                <PrivateRoute>
                  <Drafts />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <AdminUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/articles"
              element={
                <PrivateRoute>
                  <AdminArticles />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <PrivateRoute>
                  <AdminReports />
                </PrivateRoute>
              }
            />
          </Routes>
          </Suspense>
        </div>
          </OfflineFallback>
          </NavigationBlockerProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;
