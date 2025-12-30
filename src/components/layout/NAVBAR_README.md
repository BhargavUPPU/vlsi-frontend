# Navbar System - Setup Guide

## 🎯 Overview

The navbar system consists of **3 sections**:

1. **Header Image** - College name and logos (only on home page)
2. **Navbar** - Navigation menu (visible on all pages)
3. **Running Notifications** - Scrolling marquee (only on home page)

---

## 📦 Components Created

### 1. HeaderImage.jsx
- Location: `src/components/layout/HeaderImage.jsx`
- Shows college name, accreditation info, and two logos
- **Only visible on home page**
- Responsive design

**To Add Your Logos:**
Replace the placeholder divs around lines 10 and 31 with:
```jsx
<Image src="/college-logo.png" alt="College Logo" fill className="object-contain" />
```

### 2. RunningNotifications.jsx
- Location: `src/components/layout/RunningNotifications.jsx`
- Fetches from `/runningNotifications` API
- Uses `react-fast-marquee` (production-level)
- **Pauses on hover**
- **Links are light blue and underlined** when notification has a link
- **Opens in new tab** on click
- **Only visible on home page**

**Features:**
- Speed: 40px/s
- Smooth scrolling
- Auto-fetches from backend
- Handles messages with and without links

### 3. Navbar.js (Updated)
- Location: `src/components/layout/Navbar.js`
- **Compact design** - reduced height to `h-14`
- Visible on **all pages**
- Shows logo on non-home pages
- Centered navigation on home page
- Auth buttons (Student Login, ADMIN Login, Sign out)
- Fully responsive with mobile menu

---

## 🔧 How It Works

### Home Page (`/`)
```
┌─────────────────────────────────────────┐
│     HeaderImage (college info)          │
├─────────────────────────────────────────┤
│     Navbar (navigation menu)            │
├─────────────────────────────────────────┤
│  RunningNotifications (scrolling)       │
├─────────────────────────────────────────┤
│         Main Content                    │
└─────────────────────────────────────────┘
```

### Other Pages (`/about`, `/events`, etc.)
```
┌─────────────────────────────────────────┐
│     Navbar (with logo on left)          │
├─────────────────────────────────────────┤
│         Main Content                    │
└─────────────────────────────────────────┘
```

---

## 📄 File Structure

```
src/
├── components/
│   └── layout/
│       ├── HeaderImage.jsx      ← NEW
│       ├── RunningNotifications.jsx  ← NEW
│       ├── Navbar.js            ← UPDATED
│       └── Footer.jsx
├── app/
│   ├── page.js                  ← UPDATED (home page)
│   └── (dashboard)/
│       └── layout.js            ← UPDATED (other pages)
```

---

## 🎨 Customization

### Running Notifications Speed
Edit `RunningNotifications.jsx` line 24:
```jsx
speed={40}  // Change this number (higher = faster)
```

### Notification Colors
Edit `RunningNotifications.jsx` line 22:
```jsx
className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"
```

### Navbar Height
Edit `Navbar.js` line 29:
```jsx
className="flex justify-between items-center h-14"
```

---

## 🔗 API Integration

The running notifications automatically fetch from:
```
GET /runningNotifications
```

**Prisma Schema:**
```prisma
model runningNotifications {
  id        String   @id @default(cuid())
  message   String   @db.Text
  link      String?  ← Optional link
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## ✅ Production Features

1. ✅ **React Fast Marquee** - Production-level scrolling
2. ✅ **Pause on Hover** - Notifications stop when user hovers
3. ✅ **Conditional Rendering** - Header/notifications only on home
4. ✅ **Responsive Design** - Works on all screen sizes
5. ✅ **API Integration** - Real-time data from backend
6. ✅ **Link Detection** - Automatically styles clickable links
7. ✅ **New Tab Opening** - Links open in new window
8. ✅ **Clean Design** - Compact, professional appearance

---

## 🚀 Testing

1. Visit home page: `http://localhost:3000`
   - Should see: Header Image → Navbar → Running Notifications
   
2. Visit any other page: `http://localhost:3000/about`
   - Should see: Only Navbar (with logo)

3. Hover over notifications
   - Scrolling should pause

4. Click notification with link
   - Should open in new tab

---

## 📝 Notes

- Header and Running Notifications are **home page only**
- Navbar is **global** (all pages)
- Running Notifications won't show if API returns empty array
- All components use production-level libraries and best practices

Your navbar system is complete! 🎉
