# Feature #11: User Blocking & Reporting - Frontend Implementation Guide

## Status: Services Complete, UI Integration Pending

This document provides step-by-step instructions for integrating the blocking and reporting features into the frontend UI.

---

## ✅ Completed Components

### 1. Service Layer
- **blockService.js** - All blocking operations (block, unblock, getBlockedUsers, checkIfBlocked)
- **reportService.js** - All reporting operations (createReport, getReports, getReportStats, etc.)
- **ReportModal.js** - Reusable modal component for reporting content

---

## 📝 Required UI Integrations

### 1. ArticleDetail Page (`src/pages/ArticleDetail.js`)

#### Step 1: Add Imports
```javascript
// Add these to the existing imports at the top
import blockService from '../services/blockService';
import ReportModal from '../components/ReportModal';
```

#### Step 2: Add State Variables
```javascript
// Add these to the existing useState declarations
const [isBlocked, setIsBlocked] = useState(false);
const [showReportModal, setShowReportModal] = useState(false);
```

#### Step 3: Load Block Status
```javascript
// Add this inside the loadArticle function, after setArticle(data):
if (currentUser && data.user_id !== currentUser.id) {
  try {
    const blockStatus = await blockService.checkIfBlocked(data.user_id);
    setIsBlocked(blockStatus.isBlocked);
  } catch (err) {
    console.error('Error checking block status:', err);
  }
}
```

#### Step 4: Add Block/Unblock Handler
```javascript
// Add this new function
const handleBlockToggle = async () => {
  if (!currentUser) {
    alert(t('common.loginRequired'));
    return;
  }

  const confirmMsg = isBlocked
    ? 'Bu kullanıcının engelini kaldırmak istediğinizden emin misiniz?'
    : 'Bu kullanıcıyı engellemek istediğinizden emin misiniz? Engellenmiş kullanıcıların içerikleri gizlenecektir.';

  if (!window.confirm(confirmMsg)) return;

  try {
    if (isBlocked) {
      await blockService.unblockUser(article.user_id);
      setIsBlocked(false);
      alert('Kullanıcının engeli kaldırıldı');
    } else {
      await blockService.blockUser(article.user_id);
      setIsBlocked(true);
      alert('Kullanıcı engellenmiş kullanıcılar listesine eklendi');
    }
  } catch (err) {
    console.error('Block toggle error:', err);
    alert(err.response?.data?.error || t('common.error'));
  }
};
```

#### Step 5: Add Action Buttons to Author Section
Find the author section (around line 422-440) and add this after the author info div:

```javascript
{/* Block and Report Buttons (only show for other users' articles) */}
{currentUser && !isOwnArticle && (
  <div className="flex items-center space-x-2">
    {/* Block/Unblock Button */}
    <button
      onClick={handleBlockToggle}
      className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
        isBlocked
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
      }`}
      title={isBlocked ? 'Engeli Kaldır' : 'Kullanıcıyı Engelle'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <span>{isBlocked ? 'Engeli Kaldır' : 'Engelle'}</span>
    </button>

    {/* Report Button */}
    <button
      onClick={() => setShowReportModal(true)}
      className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm
               bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
               hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      title="İçeriği Bildir"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
      <span>Bildir</span>
    </button>
  </div>
)}
```

#### Step 6: Add ReportModal Component
Add this at the end of the JSX, just before the closing fragment (`</>`):

```javascript
{/* Report Modal */}
<ReportModal
  isOpen={showReportModal}
  onClose={() => setShowReportModal(false)}
  contentType="article"
  contentId={article?.id}
  contentTitle={article?.title}
/>
```

---

### 2. Comments Component Integration

The ArticleDetail page already has the comments section. We need to add block and report buttons for each comment.

#### In the `renderComment` function (around line 233-347):

##### Step 1: Add Report Button to Comment Actions
Find the comment actions div (around line 261-296) and add this after the Reply button:

```javascript
{/* Report Comment Button */}
{currentUser && currentUser.id !== comment.user_id && (
  <button
    onClick={() => {
      // TODO: Implement comment reporting
      // For now, you can add a simple report modal trigger
      alert('Comment reporting - To be implemented');
    }}
    className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center space-x-1"
    title="Yorumu Bildir"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
    <span>Bildir</span>
  </button>
)}
```

##### Step 2: Add Block Button to Comment Header
Find the author info section in renderComment (around line 246-252) and add this after the username link:

```javascript
{/* Block user button in comment */}
{currentUser && currentUser.id !== comment.user_id && (
  <button
    onClick={async () => {
      const isCurrentlyBlocked = false; // TODO: Track block status
      if (window.confirm(isCurrentlyBlocked ? 'Kullanıcının engelini kaldır?' : 'Bu kullanıcıyı engelle?')) {
        try {
          if (isCurrentlyBlocked) {
            await blockService.unblockUser(comment.user_id);
            alert('Kullanıcının engeli kaldırıldı');
          } else {
            await blockService.blockUser(comment.user_id);
            alert('Kullanıcı engellendi');
          }
          // Optionally reload comments
          await loadComments();
        } catch (err) {
          alert(err.response?.data?.error || 'Hata oluştu');
        }
      }
    }}
    className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
    title="Kullanıcıyı Engelle"
  >
    Engelle
  </button>
)}
```

---

### 3. Blocked Users Management Page (`src/pages/BlockedUsers.js`)

Create a new page to manage blocked users.

```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import blockService from '../services/blockService';
import LoadingSpinner from '../components/LoadingSpinner';

const BlockedUsers = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      setLoading(true);
      const data = await blockService.getBlockedUsers();
      setBlockedUsers(data);
    } catch (err) {
      console.error('Error loading blocked users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId, username) => {
    if (!window.confirm(`${username} kullanıcısının engelini kaldırmak istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await blockService.unblockUser(userId);
      alert('Kullanıcının engeli kaldırıldı');
      await loadBlockedUsers();
    } catch (err) {
      console.error('Error unblocking user:', err);
      alert(err.response?.data?.error || 'Hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Engellenmiş Kullanıcılar
          </h1>

          {blockedUsers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Henüz hiç kullanıcı engellemediniz
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedUsers.map((blocked) => (
                <div
                  key={blocked.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <Link
                    to={`/user/${blocked.blocked_id}`}
                    className="flex items-center space-x-3 flex-1 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {(blocked.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {blocked.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Engellenme: {new Date(blocked.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleUnblock(blocked.blocked_id, blocked.username)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Engeli Kaldır
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockedUsers;
```

#### Add Route for Blocked Users Page

In `src/App.js`, add the route:

```javascript
import BlockedUsers from './pages/BlockedUsers';

// Inside the Routes component:
<Route path="/blocked-users" element={<PrivateRoute><BlockedUsers /></PrivateRoute>} />
```

#### Add Navigation Link

In the user settings or profile navigation, add a link to `/blocked-users`.

---

### 4. User Profile Page Integration

Add block/unblock button to the user profile page (`src/pages/UserProfile.js` or similar).

#### Add to the profile header section:

```javascript
{currentUser && currentUser.id !== profileUser.id && (
  <button
    onClick={handleBlockToggle}
    className={`px-4 py-2 rounded-lg transition-colors ${
      isBlocked
        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        : 'bg-red-600 text-white hover:bg-red-700'
    }`}
  >
    {isBlocked ? 'Engeli Kaldır' : 'Kullanıcıyı Engelle'}
  </button>
)}
```

---

## 🎨 Styling Notes

All buttons use Tailwind CSS classes consistent with your existing design:
- Primary action: `bg-purple-600 hover:bg-purple-700`
- Danger action: `bg-red-600 hover:bg-red-700`
- Secondary: `bg-gray-100 dark:bg-gray-700`
- Text colors: `text-gray-900 dark:text-white`

---

## 🔄 Optional Enhancements

### 1. Real-time Block Status Tracking
Instead of checking block status on every component, consider creating a React Context:

```javascript
// contexts/BlockContext.js
const BlockContext = createContext();

export const BlockProvider = ({ children }) => {
  const [blockedUserIds, setBlockedUserIds] = useState([]);

  const loadBlocked = async () => {
    const users = await blockService.getBlockedUsers();
    setBlockedUserIds(users.map(u => u.blocked_id));
  };

  return (
    <BlockContext.Provider value={{ blockedUserIds, loadBlocked }}>
      {children}
    </BlockContext.Provider>
  );
};
```

### 2. Comment Reporting Modal
Create a separate state for comment reporting in ArticleDetail:

```javascript
const [reportingComment, setReportingComment] = useState(null);

// In render:
<ReportModal
  isOpen={!!reportingComment}
  onClose={() => setReportingComment(null)}
  contentType="comment"
  contentId={reportingComment?.id}
  contentTitle={`Comment by ${reportingComment?.username}`}
/>
```

### 3. Admin Dashboard
Create an admin page to view and manage reports (for admin users only).

---

## 📋 Testing Checklist

- [ ] Block user from article page
- [ ] Unblock user from article page
- [ ] Report article
- [ ] Block user from comment section
- [ ] Report comment
- [ ] View blocked users list
- [ ] Unblock user from blocked users page
- [ ] Block user from profile page
- [ ] Verify blocked users' content is hidden (requires backend content filtering)

---

## 🔗 Related Files

- Services: `src/services/blockService.js`, `src/services/reportService.js`
- Components: `src/components/ReportModal.js`
- Pages to modify: `src/pages/ArticleDetail.js`, `src/pages/UserProfile.js`
- New page: `src/pages/BlockedUsers.js`
- Backend API docs: `BLOCKING_REPORTING_API.md` (in backend repo)

---

## 📝 Notes

- All UI text is in Turkish to match the application language
- The blocking is one-way (if A blocks B, B can still see A's content unless B also blocks A)
- Reported content is NOT automatically hidden - it requires admin review
- Error messages from the backend are already in Turkish

---

## ✅ Next Steps

1. **Integrate into ArticleDetail** - Add block/report buttons following the guide above
2. **Create BlockedUsers page** - Use the provided template
3. **Add to User Profile** - Add block/unblock button to profile pages
4. **Test All Functionality** - Use the testing checklist
5. **Optional: Create Admin Dashboard** - For viewing and managing reports

Estimated time: 3-4 hours for full frontend integration
