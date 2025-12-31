# 🔧 Gemini API Setup - Working Configuration

## Changes Applied

I've updated the code to match your working Cerebra implementation:

### 1. Updated API Initialization ✅

**Before**:
```typescript
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
```

**After** (matching Cerebra):
```typescript
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
```

### 2. Using gemini-2.5-flash ✅

**Default model**: `gemini-2.5-flash` (same as Cerebra)

### 3. Supports Both Environment Variable Names ✅

The code now accepts either:
- `GOOGLE_GENERATIVE_AI_API_KEY` (original)
- `GEMINI_API_KEY` (Cerebra style)

---

## Setup Instructions

### Option 1: Use GEMINI_API_KEY (Cerebra style)

Update your `.env.local`:
```env
GEMINI_API_KEY=your_api_key_here
```

### Option 2: Keep GOOGLE_GENERATIVE_AI_API_KEY

Keep your existing `.env.local`:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

**Both work!** The code checks for both.

---

## Test It Now

1. **Restart your dev server** (IMPORTANT!):
```bash
# Stop server (Ctrl+C)
npm run dev
```

2. **Create test workflow**:
   - Text Node: "Say hello"
   - LLM Node
   - Connect and run

3. **Expected console output**:
```
Using model: gemini-2.5-flash
✅ Gemini response: Hello! How can I help you today?
```

---

## What Changed

| Aspect | Before | After |
|--------|--------|-------|
| Model | gemini-1.5-flash | gemini-2.5-flash ✅ |
| Env Var | GOOGLE_GENERATIVE_AI_API_KEY only | Both supported ✅ |
| Initialization | Direct | Matches Cerebra ✅ |

---

## Troubleshooting

### Still getting 404?

1. **Verify API Key**:
   - Check `.env.local` file exists
   - Key should start with `AIza...`
   - No quotes around the key

2. **Restart Server**:
   - Must restart after changing `.env.local`
   - Stop with Ctrl+C
   - Run `npm run dev` again

3. **Check Console**:
   - Look for: `Using model: gemini-2.5-flash`
   - If you see different model, something's wrong

4. **Verify API Key Works**:
   - Test in Cerebra project first
   - If works there, use same key here

---

## Environment File Example

Create/update `.env.local`:
```env
# Option 1: Cerebra style (recommended)
GEMINI_API_KEY=AIzaSyC...your_actual_key_here

# Option 2: Original style (also works)
# GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyC...your_actual_key_here

# Other env vars (if you have them)
# MONGODB_URI=...
# CLERK_SECRET_KEY=...
```

**Note**: Only need ONE of the API key variables, not both.

---

## Success Indicators

✅ **Console shows**:
```
Using model: gemini-2.5-flash
```

✅ **No 404 error**

✅ **LLM node shows AI response**

✅ **Toast shows**: "Workflow Executed!"

---

## If It Works

Once it works, you can optionally:
1. Update LLMNode dropdown to show "Gemini 2.5 Flash"
2. Add other 2.5 models if available
3. Keep using gemini-2.5-flash as default

---

**Status**: Updated to Match Cerebra ✅  
**Model**: gemini-2.5-flash ✅  
**Env Vars**: Both supported ✅  

**Next**: Restart server and test! 🚀

