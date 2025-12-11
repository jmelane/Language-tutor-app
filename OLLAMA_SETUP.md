# 🦙 Ollama Setup Guide - FREE Local AI!

## ✅ You're Already Configured!

Your app is already set to use Ollama at: **http://192.168.1.149:11434**

No API keys needed - it's completely FREE! 🎉

---

## 🚀 Quick Test

1. **Check Ollama is Running:**
   ```bash
   curl http://192.168.1.149:11434/api/tags
   ```
   This should list your installed models.

2. **Make Sure You Have a Model Installed:**
   ```bash
   ollama list
   ```

3. **If You Need to Install a Model:**
   ```bash
   # Recommended for language learning:
   ollama pull llama2        # Good balance (3.8GB)
   
   # Or try these alternatives:
   ollama pull mistral       # Faster, smaller (4.1GB)
   ollama pull llama3        # Best quality (4.7GB)
   ollama pull codellama     # Good for technical language
   ```

4. **Test Your App:**
   - Refresh http://localhost:3000
   - Select a language
   - Type a message
   - Wait a bit (first response can be slow)
   - Get your FREE AI tutoring!

---

## ⚙️ Current Configuration

Your `src/config.js` is set to:

```javascript
provider: 'ollama',
ollama: {
  endpoint: 'http://192.168.1.149:11434/api/chat',
  model: 'llama2',
}
```

---

## 🎯 Recommended Models for Language Learning

### Best for Beginners:
**Llama 2** (Currently configured)
- Size: ~3.8GB
- Speed: Fast
- Quality: Good
- Command: `ollama pull llama2`

### Best Overall:
**Llama 3**
- Size: ~4.7GB
- Speed: Medium
- Quality: Excellent
- Command: `ollama pull llama3`
- **To use**: Change model in config.js to `'llama3'`

### Fastest:
**Mistral**
- Size: ~4.1GB
- Speed: Very Fast
- Quality: Good
- Command: `ollama pull mistral`
- **To use**: Change model in config.js to `'mistral'`

### Best for Multiple Languages:
**Llama 3**
- Better at non-English languages
- More culturally aware
- Better grammar explanations

---

## 🔧 Change Models

To switch models:

1. Install the model:
   ```bash
   ollama pull llama3
   ```

2. Edit `src/config.js`:
   ```javascript
   ollama: {
     endpoint: 'http://192.168.1.149:11434/api/chat',
     model: 'llama3',  // Changed from 'llama2'
   }
   ```

3. Save and refresh your browser!

---

## 🐛 Troubleshooting

### Error: "Failed to connect to Ollama"

**Check 1: Is Ollama Running?**
```bash
curl http://192.168.1.149:11434/api/tags
```
Should show list of models. If not, Ollama is not running.

**Check 2: Is the Model Installed?**
```bash
ollama list
```
Should show `llama2` (or your configured model).

**Check 3: Can You Reach the Server?**
```bash
ping 192.168.1.149
```
Make sure you can reach the server from your computer.

**Check 4: Firewall?**
Make sure port 11434 is not blocked.

### Responses Are Slow

**Normal!** Local AI is slower than cloud APIs:
- First response: 10-30 seconds (loading model)
- Subsequent responses: 5-15 seconds
- Depends on your hardware

**Speed it up:**
- Use a smaller model (mistral)
- Make sure Ollama has enough RAM
- Use a computer with GPU

### Responses Are Poor Quality

**Try a better model:**
```bash
ollama pull llama3
```
Then update config.js to use `'llama3'`

### Wrong Language Responses

Ollama models work best with English. For other languages:
- Use Llama 3 (better multilingual support)
- Keep prompts simple
- The model will improve with practice

---

## 💰 Cost Comparison

### Ollama (Your Setup)
- **Cost**: FREE ✅
- **Speed**: Slower (5-30 seconds)
- **Quality**: Good
- **Privacy**: 100% private, runs locally

### OpenAI GPT-3.5
- **Cost**: $0.002 per chat
- **Speed**: Fast (1-3 seconds)
- **Quality**: Very good
- **Privacy**: Sent to OpenAI servers

### OpenAI GPT-4
- **Cost**: $0.06 per chat
- **Speed**: Medium (3-5 seconds)
- **Quality**: Excellent
- **Privacy**: Sent to OpenAI servers

**Verdict**: Ollama is perfect if you:
- Want FREE usage ✅
- Care about privacy ✅
- Don't mind slower responses ✅
- Have decent hardware ✅

---

## 🔄 Switching to Cloud APIs Later

If you want to switch to OpenAI or Claude later:

1. Edit `src/config.js`:
   ```javascript
   provider: 'openai',  // Changed from 'ollama'
   ```

2. Add your API key in the openai section

3. Save and refresh!

Your conversations will be saved either way!

---

## 📊 Model Comparison

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| llama2 | 3.8GB | ⚡⚡ | ⭐⭐⭐ | Beginners |
| llama3 | 4.7GB | ⚡ | ⭐⭐⭐⭐ | Best overall |
| mistral | 4.1GB | ⚡⚡⚡ | ⭐⭐⭐ | Speed |
| codellama | 3.8GB | ⚡⚡ | ⭐⭐⭐ | Technical |

---

## 🎯 Best Practices with Ollama

### For Better Results:
1. **Be patient** - First response takes time
2. **Keep it simple** - Shorter prompts work better
3. **One language at a time** - Don't mix languages
4. **Practice consistently** - The model is good enough!

### For Better Performance:
1. Close other applications
2. Make sure Ollama has enough RAM
3. Use SSD for faster model loading
4. Consider GPU acceleration if available

---

## 🎉 You're Ready!

Your setup is complete and FREE:
- ✅ Ollama configured
- ✅ No API keys needed
- ✅ Completely private
- ✅ Unlimited usage

Just make sure you have a model installed and start chatting!

**Test command:**
```bash
ollama list  # Shows your installed models
```

If you see `llama2` (or another model), you're good to go! 🚀

---

## 📝 Quick Commands Reference

```bash
# List installed models
ollama list

# Install a model
ollama pull llama2
ollama pull llama3
ollama pull mistral

# Remove a model
ollama rm llama2

# Check Ollama status
curl http://192.168.1.149:11434/api/tags

# Test Ollama directly
curl http://192.168.1.149:11434/api/generate -d '{
  "model": "llama2",
  "prompt": "Hello in Spanish?",
  "stream": false
}'
```

---

**Happy FREE Language Learning! 🎓🌍**

