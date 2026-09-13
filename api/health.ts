import { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ 
    status: "ok", 
    service: "auto-pecas-balcao-rio-claro", 
    hasKey: !!process.env.GEMINI_API_KEY
  });
}
