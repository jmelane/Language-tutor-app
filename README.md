# 🌍 Language Tutor App

An AI-powered language learning application with real-time feedback, progress tracking, and conversation persistence.

![Languages](https://img.shields.io/badge/languages-8-blue)
![React](https://img.shields.io/badge/react-18+-blue)
![Tailwind](https://img.shields.io/badge/tailwind-3-blue)

## ✨ Features

- 🗣️ **8 Languages**: Spanish, French, German, Japanese, Italian, Portuguese, Chinese, Korean
- 🤖 **AI-Powered**: Get intelligent feedback from GPT-4 or Claude
- 📊 **Progress Tracking**: Monitor vocabulary, grammar, and conversation skills
- 💾 **Auto-Save**: All conversations and progress saved automatically
- 🎯 **Learning Goals**: Set and track personalized objectives
- 🔄 **Dual Modes**: Chat mode for conversation, Lesson mode for structured learning
- 🌐 **Translation**: Click messages to see English translations
- 📥 **Export Data**: Backup your learning progress

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- An API key from OpenAI or Anthropic

### Installation

The app is already set up! If starting from scratch:

```bash
npm install
```

### Configuration

**⚠️ IMPORTANT: Add your API key before using!**

1. Open `src/config.js`
2. Add your API key:
   ```javascript
   openai: {
     apiKey: 'sk-your-key-here', // Replace this!
   }
   ```
3. Save the file

📖 **Full setup guide**: [QUICK_START.md](./QUICK_START.md)

### Run the App

```bash
npm start
```

Opens at http://localhost:3000

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 3 minutes
- **[API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)** - Complete API configuration guide

## 🎯 How to Use

### Basic Usage

1. **Select Language**: Choose from 8 languages
2. **Start Chatting**: Type in your target language
3. **Get Feedback**: Receive instant corrections and suggestions
4. **Track Progress**: Watch your vocabulary and accuracy improve

### Advanced Features

**Lesson Mode**: Click the mode button for structured lessons
**Translations**: Click tutor messages to see English translation
**Goals**: Add custom learning goals with the + Add button
**Export**: Download your progress with Export Backup

## 🔧 Configuration

### API Providers

Edit `src/config.js` to choose your provider:

```javascript
provider: 'openai',  // or 'anthropic' or 'custom'
```

### Storage Settings

Enable/disable auto-save:

```javascript
STORAGE_CONFIG: {
  enablePersistence: true, // Set false to disable saving
}
```

## 📊 What Gets Saved

Your browser automatically saves:
- ✅ Conversations (per language)
- ✅ User profile and proficiency level
- ✅ Learning goals and progress
- ✅ Vocabulary statistics
- ✅ Grammar accuracy history

**Privacy**: All data stays on your device (localStorage)

## 🏗️ Project Structure

```
src/
├── App.js                    # Main app entry
├── LanguageTutorApp.jsx      # Main component
├── config.js                 # API and storage configuration
├── apiService.js             # AI provider integration
├── storageService.js         # localStorage management
├── index.css                 # Tailwind imports
└── ...
```

## 🎨 Customization

### Add New Languages

Edit `LanguageTutorApp.jsx`:

```javascript
const languages = {
  yourLanguage: { name: 'Your Language', flag: '🏁' },
  // ... existing languages
};
```

### Change UI Colors

Update Tailwind classes in `LanguageTutorApp.jsx`

### Modify Learning Goals

Edit the `generateLearningGoals` function

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Add your key in `src/config.js` |
| Slow responses | Switch to gpt-3.5-turbo in config |
| Data not saving | Check browser doesn't block localStorage |
| Port 3000 in use | Kill the process: `lsof -ti:3000 \| xargs kill -9` |

See [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) for more help.

## 💰 API Costs

Approximate costs per conversation:

| Model | Cost per Chat | 100 Chats |
|-------|--------------|-----------|
| GPT-3.5-turbo | $0.002 | $0.20 |
| GPT-4 | $0.06 | $6.00 |
| Claude Sonnet | $0.015 | $1.50 |

**Tip**: Start with GPT-3.5-turbo for learning!

## 🔒 Security

**⚠️ Never commit API keys to version control!**

For production:
1. Use environment variables
2. Add `.env` to `.gitignore`
3. Use backend proxy for API calls

## 📱 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 not supported

## 🤝 Contributing

This is a personal learning project. Feel free to fork and customize!

## 📝 License

MIT License - Use freely for learning!

## 🙏 Credits

Built with:
- React
- Tailwind CSS
- Lucide React Icons
- OpenAI/Anthropic APIs

---

## 🎓 Learning Tips

### For Beginners
1. Start with greetings and simple phrases
2. Use Chat Mode for natural conversation
3. Don't worry about mistakes - practice is key!

### For Intermediate
1. Switch to Lesson Mode for grammar focus
2. Set specific vocabulary goals
3. Try to use complex sentence structures

### For Advanced
1. Have longer conversations
2. Focus on cultural expressions
3. Ask the AI about nuances and idioms

---

**Ready to start learning? Follow the [QUICK_START.md](./QUICK_START.md) guide!**

Need help? Check [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) for detailed instructions.

**Happy learning! 🎉🌍**
