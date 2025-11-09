# Apply Blocking & Reporting UI - Quick Integration Steps

## 1. Add Route for BlockedUsers Page

### File: `src/App.js`

**Step 1:** Add import (around line 27):
```javascript
import BlockedUsers from './pages/BlockedUsers';
```

**Step 2:** Add route (around line 120, after SavedArticles route):
```javascript
<Route
  path="/blocked-users"
  element={
    <PrivateRoute>
      <BlockedUsers />
    </PrivateRoute>
  }
/>
```

---

## 2. Add Link to Navigation

### File: `src/components/Navigation.js`

Find the navigation menu (settings or profile dropdown) and add:

```javascript
<Link
  to="/blocked-users"
  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
>
  Engellenmiş Kullanıcılar
</Link>
```

---

## 3. Integrate into ArticleDetail Page

###File: `src/pages/ArticleDetail.js`

#### Step 1: Add imports (top of file)
```javascript
import blockService from '../services/blockService';
import ReportModal from '../components/ReportModal';
```

#### Step 2: Add state variables (with other useState)
```javascript
const [isBlocked, setIsBlocked] = useState(false);
const [showReportModal, setShowReportModal] = useState(false);
```

#### Step 3: Check block status in loadArticle function
Add this inside `loadArticle` after `setArticle(data)`:

```javascript
// Check if author is blocked
if (currentUser && data.user_id !== currentUser.id) {
  try {
    const blockStatus = await blockService.checkIfBlocked(data.user_id);
    setIsBlocked(blockStatus.isBlocked);
  } catch (err) {
    console.error('Error checking block status:', err);
  }
}
```

#### Step 4: Add block/unblock handler
```javascript
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
      alert('Kullanıcı engellendi');
    }
  } catch (err) {
    console.error('Block toggle error:', err);
    alert(err.response?.data?.error || t('common.error'));
  }
};
```

#### Step 5: Add action buttons to author section
Find the author meta info section (around line 422-441) and add this AFTER the closing div of author info and BEFORE the Like button:

```javascript
{/* Block and Report Buttons - Only show for other users' articles */}
{currentUser && !isOwnArticle && (
  <div className="flex items-center gap-2">
    <button
      onClick={handleBlockToggle}
      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
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

    <button
      onClick={() => setShowReportModal(true)}
      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm
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

#### Step 6: Add ReportModal at the end
Add this just before the closing `</>` fragment (around line 609):

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

## 4. Add Translation Keys (Optional)

### File: `src/locales/tr.json`

Add these keys if not already present:

```json
{
  "block": {
    "blockUser": "Kullanıcıyı Engelle",
    "unblockUser": "Engeli Kaldır",
    "blockedUsers": "Engellenmiş Kullanıcılar",
    "confirmBlock": "Bu kullanıcıyı engellemek istediğinizden emin misiniz?",
    "confirmUnblock": "Bu kullanıcının engelini kaldırmak istediğinizden emin misiniz?"
  },
  "report": {
    "reportContent": "İçeriği Bildir",
    "reportArticle": "Haberi Bildir",
    "reportComment": "Yorumu Bildir"
  }
}
```

---

## Quick Test Checklist

After applying these changes:

1. ✅ Navigate to `/blocked-users` - should see empty state
2. ✅ View an article by another user - should see Block and Report buttons
3. ✅ Click "Engelle" - should confirm and block the user
4. ✅ Check `/blocked-users` - should see the blocked user
5. ✅ Click "Engeli Kaldır" on article - should unblock
6. ✅ Click "Bildir" button - should open report modal
7. ✅ Submit a report - should show success message

---

## Visual Location Guide

### ArticleDetail.js Structure:
```
<div className="flex items-center justify-between mb-6 pb-6 border-b">
  <div className="flex items-center space-x-4">
    {/* Author avatar and name - EXISTING */}
  </div>

  {/* ADD BLOCK/REPORT BUTTONS HERE (if not own article) */}

  {/* Like Button - EXISTING */}
  {/* View Count - EXISTING */}
  {/* Bookmark Button - EXISTING */}
</div>
```

The buttons should appear between the author info and the like/view/bookmark stats.

---

## Notes

- All error messages and UI text are in Turkish
- Block/unblock actions show native browser confirm dialogs
- Report modal is reusable for both articles and comments
- Blocking is one-way (blocking user A doesn't mean A blocked you)
- No automatic content filtering yet (requires backend SQL updates)

---

## Still Need Help?

Refer to the comprehensive guide: `FEATURE_11_FRONTEND_GUIDE.md`
