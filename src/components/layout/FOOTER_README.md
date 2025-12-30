# Footer Component - Customization Guide

## 📍 Adding Your Background Image

The footer is designed to support a custom background image. Here's how to add it:

### Step 1: Add Your Image
1. Place your background image in the `public` folder
2. Rename it to `footer-background.png` (or any name you prefer)

### Step 2: The Image is Already Configured
The footer component already references the background image at line 34:
```javascript
backgroundImage: 'url("/footer-background.png")',
```

If you used a different filename or format, update this line:
```javascript
backgroundImage: 'url("/your-custom-image.jpg")',
```

### Supported Formats
- PNG (recommended for transparency)
- JPG/JPEG
- WebP
- SVG

---

## 🗺️ Updating Google Maps

The footer includes an embedded Google Map showing the college location.

### To Update the Map:

1. Open [Google Maps](https://www.google.com/maps)
2. Search for your location
3. Click the "Share" button
4. Select "Embed a map"
5. Copy the `src` URL from the iframe code
6. In `Footer.js`, find line 30 and replace the `mapEmbedUrl` value:

```javascript
const mapEmbedUrl = "YOUR_GOOGLE_MAPS_EMBED_URL_HERE";
```

**Current URL** (placeholder):
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.8384!2d83.3778!3d17.7826...
```

---

## 📧 Updating Contact Information

### Email
Line 25 in `Footer.js`:
```javascript
email: "vlsidclub@gvpce.ac.in",
```

### Address
Lines 22-24:
```javascript
address: "Gayatri Vidya Parishad College of Engineering (Autonomous), Madhurawada, Visakhapatnam - 530048, Andhra Pradesh, India",
```

---

## 🔗 Updating Social Media Links

Lines 16-20 in `Footer.js`:

```javascript
const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/your_handle", color: "hover:bg-pink-600" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@your_channel", color: "hover:bg-red-600" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/your_page", color: "hover:bg-blue-600" },
];
```

---

## 🎨 Customizing Colors

The footer uses a blue gradient theme. To customize:

### Background Gradient
Line 29:
```javascript
className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden"
```

Change colors:
```javascript
className="relative bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white overflow-hidden"
```

### Social Icon Hover Colors
Already configured in the `socialLinks` array (line 16-20)

---

## 📐 Layout Structure

The footer is divided into 4 columns on desktop:

1. **Logo & Social Media** - Left column
2. **Quick Links** - Navigation links
3. **Contact Information** - Address & Email
4. **Location** - Google Maps embed

On mobile, these stack vertically.

---

## ✨ Features

- ✅ Responsive design (4 cols → 1 col on mobile)
- ✅ Framer Motion animations on scroll
- ✅ Hoverable social media icons
- ✅ Interactive Google Map
- ✅ Clickable email link
- ✅ Gradient background with overlay support
- ✅ Copyright bar at bottom

---

## 🚀 Quick Checklist

- [ ] Add background image to `/public/footer-background.png`
- [ ] Update Google Maps embed URL
- [ ] Update email address
- [ ] Update college address
- [ ] Add your social media links (Instagram, YouTube, LinkedIn)
- [ ] Test on mobile devices
- [ ] Verify map loads correctly

---

Your footer is now ready! 🎉
