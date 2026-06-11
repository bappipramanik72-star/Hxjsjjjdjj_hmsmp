import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// Lazily load or initialize Gemini inside requests
const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    }
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini chat API endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const systemInstruction = 
        "You are Pokemon, the friendly and authoritative Founder of Empire SMP (a Minecraft survival multiplayer server). " +
        "You speak with premium craftsmanship, enthusiasm, and Minecraft expertise. " +
        "You know everything about Empire SMP: " +
        "- Connection IP & Port: play.empiresmp.shop:25589. " +
        "- Ranks: GOD (₹299, Ultimate, netherite kit, tunnel 3x custom enchantments, mine 9 blocks at once), MVP (₹90, netherite kit, 64 op apples), GRINDER (₹60, diamond kit, 7 totems, 20 golden apples), EXPLORER (₹40, diamond starter kit for grinding). " +
        "- Claim Blocks Store: 500 blocks for ₹20, 1000 for ₹35, 1500 for ₹50, 2000 for ₹70. " +
        "- Mace Shop: 1 mace for ₹50, 2 for ₹100, 5 for ₹250. " +
        "- IG Money Store: 100k for ₹40, 200k for ₹80, 400k for ₹150, 500k for ₹170, 1m for ₹340. " +
        "- Discord Join Link: https://discord.gg/U85qPkYvFB. " +
        "- Payments: PayPal, Razorpay, and direct UPI Scan & Pay to Raj (UPI ID: rdraj9871-1@oksbi). " +
        "- Team Members: SHADOWXER01 (Owner), Pokemon (Founder), Randeep Royal (Admin), Raksh X OG (Admin), コ:彡 ADI😈DON (Admin), Jhulan (Developer), Eagle (Helper). " +
        "Answer questions about prices, perks, claim blocks, custom maces, commands, the team, and how to pay or join. " +
        "Always include the discord join link if the user asks how to join or buy. " +
        "Keep answers highly engaging, helpful, and concise.";

      // Filter out system event logs and ensure roles are valid user/model alternation
      const filtered = messages.filter((m: any) => m.role === 'user' || m.role === 'assistant');

      // Build safe alternating contents: starting with 'user', alternating 'model' / 'user'
      const contents: any[] = [];
      let lastRole: 'user' | 'model' | null = null;

      for (const m of filtered) {
        const currentRole = m.role === 'assistant' ? 'model' : 'user';
        
        if (contents.length === 0) {
          // Conversation must start with 'user'
          if (currentRole === 'user') {
            contents.push({
              role: 'user',
              parts: [{ text: m.content }]
            });
            lastRole = 'user';
          }
        } else {
          if (currentRole !== lastRole) {
            contents.push({
              role: currentRole,
              parts: [{ text: m.content }]
            });
            lastRole = currentRole;
          } else {
            // Merge consecutive messages from same role to satisfy api rules
            contents[contents.length - 1].parts[0].text += `\n\n${m.content}`;
          }
        }
      }

      // If list is empty, default safely
      if (contents.length === 0) {
        contents.push({
          role: 'user',
          parts: [{ text: 'Hello!' }]
        });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text || "I'm cooked! Let me try that again." });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ reply: "👋 Pokémon here! My automated queue buffer is offline, but I've received your ticket. Come chat with us on Discord: https://discord.gg/U85qPkYvFB!" });
    }
  });

  // Mock checkout system
  app.post('/api/checkout', (req, res) => {
    const { username, items, paymentMethod } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Minecraft username is required.' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    const orderId = 'EMP-' + Math.floor(100000 + Math.random() * 900000);
    const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);

    res.json({
      success: true,
      orderId,
      ticketId,
      message: paymentMethod === 'upi_qr' 
        ? 'UPI payment initiated. Please scan the QR code to complete the transaction.'
        : `Payment initiated successfully via ${paymentMethod === 'paypal' ? 'PayPal' : 'Razorpay'}.`,
    });
  });

  // Serve static build or mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Empire SMP] Fullstack server operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();
