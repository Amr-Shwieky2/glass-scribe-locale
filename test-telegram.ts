/**
 * Test script for Telegram integration
 * Run this to verify your Telegram bot is working correctly
 */

import { sendTelegramMessage } from './src/lib/telegram';

async function testTelegramBot() {
  console.log('🧪 Testing Telegram Bot Integration...\n');

  const testMessage = `
🔔 <b>Test Message from Fusion Glassworks</b>

This is a test message to verify your Telegram bot integration is working correctly.

✅ If you receive this message, your bot is configured properly!

⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' })}
  `;

  const success = await sendTelegramMessage(testMessage);

  if (success) {
    console.log('✅ SUCCESS! Check your Telegram to see the test message.');
    console.log('📱 Your bot is ready to receive contact form submissions!');
  } else {
    console.log('❌ FAILED! Please check:');
    console.log('   1. Your .env.local file exists');
    console.log('   2. VITE_TELEGRAM_BOT_TOKEN is set correctly');
    console.log('   3. VITE_TELEGRAM_CHAT_ID is set correctly');
    console.log('   4. You have started a chat with your bot (@Glasswork_bot)');
  }
}

testTelegramBot();
