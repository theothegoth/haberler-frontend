import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationBlockerProvider } from './context/NavigationBlockerContext';
import Navigation from './components/Navigation';
import VerificationBanner from './components/VerificationBanner';
import NavigationBlockerDialog from './components/NavigationBlockerDialog';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailRequired from './pages/VerifyEmailRequired';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import WriteNews from './pages/WriteNews';
import EditArticle from './pages/EditArticle';
import NewsFeed from './pages/NewsFeed';
import MyArticles from './pages/MyArticles';
import UserProfile from './pages/UserProfile';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import ArticleDetail from './pages/ArticleDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ThemeProvider>
        <AuthProvider>
          <NavigationBlockerProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <VerificationBanner />
            <NavigationBlockerDialog />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/verify-email-required" element={<VerifyEmailRequired />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/dashboard"
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
              path="/user/:userId"
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
          </Routes>
        </div>
          </NavigationBlockerProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;
