# Language Tutor - API Setup Guide

This guide will help you configure an AI API for your Language Tutor application.

## 🚀 Quick Start

The app now supports multiple AI providers. Choose the one that works best for you:

- **OpenAI** (GPT-4, GPT-3.5-turbo) - Most popular, great quality
- **Anthropic Claude** - Excellent for conversations, nuanced responses
- **Custom API** - Use your own endpoint

---

## 📋 Step-by-Step Setup

### 1. Choose Your AI Provider

Edit `/src/config.js` and set the `provider` field:

```javascript
provider: 'openai',  // Options: 'openai', 'anthropic', 'custom'
```

### 2. Get Your API Key

#### Option A: OpenAI (Recommended)

1. Visit https://platform.openai.com/
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-`)

**Pricing**: Pay-as-you-go
- GPT-3.5-turbo: ~$0.002 per conversation
- GPT-4: ~$0.06 per conversation

#### Option B: Anthropic Claude

1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy your API key

**Pricing**: Pay-as-you-go
- Claude 3 Sonnet: ~$0.015 per conversation
- Claude 3 Opus: ~$0.075 per conversation

#### Option C: Custom API

If you have your own AI endpoint, configure the custom settings in `config.js`.

### 3. Add Your API Key to the Config File

Open `/src/config.js` and replace the placeholder with your actual API key:

**For OpenAI:**
```javascript
openai: {
  apiKey: 'sk-your-actual-api-key-here', // Replace this!
  endpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4', // or 'gpt-3.5-turbo' for cheaper option
  maxTokens: 1000,
  temperature: 0.7,
}
```

**For Anthropic:**
```javascript
anthropic: {
  apiKey: 'sk-ant-your-actual-api-key-here', // Replace this!
  endpoint: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-sonnet-20240229',
  maxTokens: 1000,
  temperature: 0.7,
}
```

### 4. Save and Restart

1. Save the `config.js` file
2. Restart your development server if it's running
3. Test the chat feature!

---

## 🔧 Configuration Options

### Model Selection

**OpenAI Models:**
- `gpt-4` - Best quality, higher cost
- `gpt-4-turbo` - Faster, good balance
- `gpt-3.5-turbo` - Fastest, cheapest

**Anthropic Models:**
- `claude-3-opus-20240229` - Best quality
- `claude-3-sonnet-20240229` - Balanced (recommended)
- `claude-3-haiku-20240307` - Fastest, cheapest

### Temperature (0.0 - 1.0)

- **0.7** (default) - Good balance of creativity and consistency
- **0.3-0.5** - More focused and consistent responses
- **0.8-1.0** - More creative and varied responses

### Max Tokens

- **1000** (default) - Good for most conversations
- **500** - Shorter, more concise responses (cheaper)
- **2000** - Longer, more detailed responses (more expensive)

---

## 💾 Data Persistence Features

Your app now automatically saves:

✅ **Conversations** - All your chats in each language
✅ **Progress** - Vocabulary count, grammar accuracy, message count
✅ **Learning Goals** - Your custom goals and progress
✅ **Stats** - Historical performance data

### Data Management

**Export Your Data:**
- Click "📥 Export Backup" in the sidebar
- Downloads a JSON file with all your data
- Keep this as a backup!

**Clear All Data:**
- Click "🗑️ Clear All Data" to reset everything
- **Warning**: This cannot be undone!
- Good for starting fresh or privacy

### Where is My Data Stored?

All data is saved in your **browser's localStorage**:
- ✅ Stays on your device
- ✅ Private and secure
- ✅ No server required
- ⚠️ Clearing browser data will delete it
- ⚠️ Different browsers = different storage

---

## 🔒 Security Best Practices

### ⚠️ IMPORTANT: Never Share Your API Key!

Your API key is like a password. Keep it safe:

❌ **DON'T:**
- Commit `config.js` with your real API key to GitHub
- Share your API key in public forums
- Use the same key in public/production apps

✅ **DO:**
- Keep API keys in environment variables for production
- Use `.gitignore` to exclude `config.js`
- Monitor your API usage regularly
- Set spending limits in your API provider dashboard

### For Production Use

Instead of hardcoding keys, use environment variables:

1. Create a `.env` file:
```
REACT_APP_OPENAI_API_KEY=your-key-here
```

2. Update `config.js`:
```javascript
apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE',
```

3. Add `.env` to `.gitignore`

---

## 🐛 Troubleshooting

### Error: "API key not configured"

**Solution**: Make sure you've replaced `'YOUR_OPENAI_API_KEY_HERE'` with your actual API key in `/src/config.js`.

### Error: "401 Unauthorized"

**Solution**: Your API key is invalid or expired. Get a new one from your provider's dashboard.

### Error: "429 Too Many Requests"

**Solution**: You've hit rate limits. Wait a few minutes or upgrade your API plan.

### Error: "Network request failed"

**Solution**: 
- Check your internet connection
- Verify the API endpoint URL is correct
- Check if your API provider is having outages

### Responses are slow

**Solutions**:
- Use a faster model (gpt-3.5-turbo instead of gpt-4)
- Reduce maxTokens to 500
- Check your internet speed

### API costs too much

**Solutions**:
- Switch to gpt-3.5-turbo (~10x cheaper than gpt-4)
- Reduce maxTokens
- Set spending limits in your API dashboard
- Use Claude Haiku (cheaper alternative)

---

## 📊 Monitoring API Usage

### OpenAI Dashboard
- Visit https://platform.openai.com/usage
- See your daily/monthly usage
- Set spending limits
- View detailed logs

### Anthropic Dashboard
- Visit https://console.anthropic.com/usage
- Monitor your API calls
- Check your billing
- Set alerts

---

## 🎉 You're All Set!

Once you've configured your API key, you can:

1. ✅ Chat with your AI tutor in 8 languages
2. ✅ Get real-time feedback on your language skills
3. ✅ Track your progress over time
4. ✅ Set and achieve learning goals
5. ✅ Export your conversation history

---

## 💡 Tips for Best Results

### For Better Conversations:
- Start with simple sentences if you're a beginner
- Use the "Lesson Mode" for structured learning
- Try to use words from your vocabulary goals
- Don't worry about mistakes - the AI will help!

### For Better Feedback:
- Write longer responses (at least 2-3 sentences)
- Use different grammar structures
- Ask the AI specific questions about grammar
- Review the corrections and try again

### For Progress Tracking:
- Export backups regularly
- Practice consistently (daily is best)
- Complete learning goals to build momentum
- Review your stats to see improvement

---

## 📞 Need Help?

- Check the [React documentation](https://react.dev)
- Review the [Tailwind CSS docs](https://tailwindcss.com/docs)
- OpenAI Support: https://help.openai.com
- Anthropic Support: https://support.anthropic.com

---

## 🔄 Updating the App

If you update the app code:

1. Pull the latest changes
2. Check if `config.js` changed
3. Re-add your API key if needed
4. Run `npm install` for new dependencies
5. Restart the dev server

---

**Happy Learning! 🎓🌍**

