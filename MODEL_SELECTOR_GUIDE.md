# 🤖 Model Selector Feature

## ✅ New Feature Added!

You can now **choose which AI model to speak with** directly from the UI!

---

## 🎯 How to Use It

### 1. Find the Model Selector

Look at the top of your app, next to the language selector. You'll see a **purple dropdown** with 🤖 icons:

```
Language Tutor  |  Spanish 🇪🇸  |  🤖 llama2  |  Beginner
                                    ↑
                              Model Selector
```

### 2. Switch Models On-The-Fly

Simply **click the dropdown** and select a different model:

- 🤖 llama2
- 🤖 llama3
- 🤖 mistral
- 🤖 codellama
- And any other models you have installed!

### 3. Continue Chatting

Your conversation continues with the new model - no need to refresh!

---

## 🚀 What Happens Automatically

### The app will:
1. ✅ **Auto-detect** which models you have installed in Ollama
2. ✅ **Update the dropdown** with available models
3. ✅ **Use the selected model** for all new messages
4. ✅ **Show the current model** in the UI

### The dropdown shows:
- All models installed on your Ollama server
- Updates automatically on app load
- Falls back to common models if can't connect

---

## 🎨 Model Comparison

### llama2 (Default)
- **Size**: 3.8GB
- **Speed**: ⚡⚡ Fast
- **Quality**: ⭐⭐⭐ Good
- **Best for**: Beginners, general learning
- **Languages**: Good multilingual support

### llama3
- **Size**: 4.7GB  
- **Speed**: ⚡ Medium
- **Quality**: ⭐⭐⭐⭐ Excellent
- **Best for**: Best overall quality
- **Languages**: Excellent multilingual support

### mistral
- **Size**: 4.1GB
- **Speed**: ⚡⚡⚡ Very Fast
- **Quality**: ⭐⭐⭐ Good
- **Best for**: Quick responses
- **Languages**: Good for European languages

### codellama
- **Size**: 3.8GB
- **Speed**: ⚡⚡ Fast
- **Quality**: ⭐⭐⭐ Good (technical focus)
- **Best for**: Technical/programming language
- **Languages**: Better at formal/technical language

---

## 💡 Tips for Choosing Models

### For Beginners:
Start with **llama2** - it's fast and good quality

### For Best Quality:
Switch to **llama3** - best responses, worth the wait

### For Speed:
Use **mistral** - fastest responses

### For Technical Language:
Try **codellama** - better at formal/technical terms

### Testing Different Models:
Switch models mid-conversation to compare responses!

---

## 🔧 Installing New Models

Want to try a different model?

### 1. Check Available Models
```bash
ollama list
```

### 2. Install a New Model
```bash
# Install llama3 (best quality):
ollama pull llama3

# Install mistral (fastest):
ollama pull mistral

# Install llama2 (default):
ollama pull llama2

# Check all available models on ollama.com/library
```

### 3. Refresh the App
The new model will appear in the dropdown automatically! (Or refresh the page)

---

## 🎯 Use Cases

### Comparing Models:
1. Start a conversation with **llama2**
2. Switch to **llama3** mid-conversation
3. Compare the responses!

### Optimizing for Speed:
- Use **mistral** for quick practice sessions
- Switch to **llama3** for in-depth explanations

### Different Languages:
- **llama3** is better for non-English languages
- **llama2** works well for Spanish, French, German
- **mistral** is great for European languages

---

## 🔍 How It Works

### Behind the Scenes:
1. App connects to Ollama at: `http://192.168.1.149:11434`
2. Fetches list of installed models
3. Displays them in the dropdown
4. Passes your selected model with each API call
5. Ollama uses that model to generate responses

### The Code:
- ✅ Auto-fetches models on app load
- ✅ Stores selection in state
- ✅ Passes to API service
- ✅ Works with all Ollama models

---

## ❓ Troubleshooting

### Dropdown is Empty
**Fix**: Make sure you have at least one model installed:
```bash
ollama list           # Check installed models
ollama pull llama2    # Install if needed
```

### Model Not Appearing
**Fix**: Refresh the page or check the model name:
```bash
ollama list  # Check exact model names
```

### "Model not found" Error
**Fix**: The model in the dropdown isn't actually installed:
```bash
ollama pull <model-name>
```

### Responses Still Use Old Model
**Fix**: Make sure you selected the new model BEFORE sending a new message

---

## 🌟 Cool Feature Ideas

### Try This:
1. Ask the same question to different models
2. Compare response quality
3. See which model you prefer!

### Example:
```
You: "Explain the subjunctive mood in Spanish"

With llama2: [Good explanation]
With llama3: [More detailed, better examples]
With mistral: [Faster, concise]
```

---

## 📊 Performance by Model

| Model | Response Time | Quality | Size | RAM Usage |
|-------|--------------|---------|------|-----------|
| llama2 | 5-15s | Good | 3.8GB | ~4GB |
| llama3 | 10-25s | Excellent | 4.7GB | ~6GB |
| mistral | 3-10s | Good | 4.1GB | ~4GB |
| codellama | 5-15s | Technical | 3.8GB | ~4GB |

*Times are approximate and depend on your hardware*

---

## 🎉 Benefits

### With This Feature You Can:
- ✅ Compare different AI models
- ✅ Optimize for speed or quality
- ✅ Test which model works best for your language
- ✅ Switch models without restarting
- ✅ Use the best model for different scenarios

### It's Still FREE:
- No extra cost for any model
- All models run locally
- Use as many as you want!

---

## 🚀 Quick Reference

### Switch Models:
1. Click the purple dropdown (🤖 model name)
2. Select new model
3. Continue chatting!

### Install New Model:
```bash
ollama pull <model-name>
```

### Check Available:
```bash
ollama list
```

### Best Overall:
**llama3** - highest quality

### Fastest:
**mistral** - quickest responses

### Good Default:
**llama2** - balanced

---

**Enjoy experimenting with different AI models! 🎓🤖**

Your conversations stay saved regardless of which model you use!

