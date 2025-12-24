# 📱 Telegram Integration Guide

## Quick Setup (3 Steps)

### 1️⃣ Get Your Chat ID
1. Open Telegram and search for **@userinfobot**
2. Click **Start**
3. Copy the Chat ID number (e.g., `123456789`)

### 2️⃣ Configure Environment
1. Open `.env.local` in your project root
2. Replace `YOUR_CHAT_ID` with your actual Chat ID:
```env
VITE_TELEGRAM_BOT_TOKEN=8594812481:AAE8KXMYymxgcao2jfO28mICd6pYPMQuKlE
VITE_TELEGRAM_CHAT_ID=123456789
```

### 3️⃣ Activate Your Bot
1. Open: https://t.me/Glasswork_bot
2. Click **Start** button
3. Done! ✅

## 🧪 Test Your Setup

Run this command to test if everything works:

```bash
npm run dev
```

Then fill out the contact form on your website. You should receive a message in Telegram!

## 📬 What You'll Receive

When someone submits the contact form, you'll get a beautifully formatted message:

```
🔔 New Contact Form Submission

👤 Name: John Doe
📱 Phone: +972-50-123-4567
📧 Email: john@example.com
🌐 Language: EN

💬 Message:
I'm interested in glass shower doors for my bathroom.
Please contact me for a quote.

⏰ Time: Tuesday, December 24, 2025 at 2:30 PM
```

## 🔐 Security

- ✅ `.env.local` is automatically excluded from Git
- ✅ Bot token is kept secure on the server side
- ✅ All user data is HTML-escaped to prevent injection attacks
- ⚠️ Never share your bot token publicly

## 🛠️ Troubleshooting

**Not receiving messages?**
- ✓ Started chat with @Glasswork_bot?
- ✓ Chat ID is correct in `.env.local`?
- ✓ Bot token matches exactly?
- ✓ Check browser console for errors

**Form not submitting?**
- ✓ Dev server is running?
- ✓ Environment variables loaded? (restart dev server)
- ✓ Internet connection working?

## 🎨 Customization

### Change Bot Name/Picture
Use [@BotFather](https://t.me/BotFather):
- `/setname` - Change bot name
- `/setuserpic` - Set profile picture
- `/setdescription` - Add description
- `/setabouttext` - Set about section

### Customize Message Format
Edit `src/lib/telegram.ts` → `formatContactFormMessage()` function

## 📚 More Info

Full documentation: [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)
