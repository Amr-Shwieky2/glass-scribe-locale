# Telegram Bot Setup Instructions

## Step 1: Get Your Chat ID

To receive messages from the contact form, you need to get your Telegram Chat ID:

1. **Open Telegram** and search for `@userinfobot`
2. **Start a chat** with the bot by clicking "Start"
3. **Copy your Chat ID** (it will be a number like `123456789`)

## Step 2: Configure Environment Variables

1. Open the file `.env.local` in the root of your project
2. Replace `YOUR_CHAT_ID` with the Chat ID you got from @userinfobot

Example:
```
VITE_TELEGRAM_BOT_TOKEN=8594812481:AAE8KXMYymxgcao2jfO28mICd6pYPMQuKlE
VITE_TELEGRAM_CHAT_ID=123456789
```

## Step 3: Test the Bot

1. **Start your bot** by opening this link: https://t.me/Glasswork_bot
2. **Click "Start"** to activate the bot
3. **Test the contact form** on your website
4. You should receive a formatted message in Telegram with all the form details

## Message Format

When someone submits the contact form, you'll receive a message like this:

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

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `.env.local` to GitHub (it's already in .gitignore)
- Keep your bot token secure
- Only share the Chat ID with trusted team members
- If your token is compromised, revoke it via @BotFather and create a new bot

## Troubleshooting

**Not receiving messages?**
1. Make sure you've started a chat with @Glasswork_bot
2. Verify your Chat ID is correct
3. Check browser console for errors
4. Ensure `.env.local` file exists and variables are set correctly

**Messages not formatted correctly?**
- The bot uses HTML formatting. Special characters are automatically escaped.

## Bot Commands (via @BotFather)

To customize your bot:
- `/setdescription` - Set bot description
- `/setabouttext` - Set about section
- `/setuserpic` - Set bot profile picture
- `/setcommands` - Set bot commands
- `/deletebot` - Delete the bot (careful!)
