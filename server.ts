import crypto from 'crypto';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

// ── Fail-fast on missing required server secrets ──────────────────────────────
const isDev = process.env.NODE_ENV !== 'production';
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  console.error('[startup] FATAL: VITE_SUPABASE_URL must be set.');
  process.exit(1);
}

if (!supabaseServiceKey) {
  if (isDev) {
    console.warn('[startup] WARNING: SUPABASE_SERVICE_ROLE_KEY not set — Ko-fi webhook disabled in dev.');
  } else {
    console.error('[startup] FATAL: SUPABASE_SERVICE_ROLE_KEY must be set in production.');
    process.exit(1);
  }
}

// Service role key is required so the Ko-fi webhook can bypass RLS.
// Never fall back to the anon key — that would silently break RLS enforcement.
const supabase = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// ── Security headers (helmet defaults cover CSP, HSTS, X-Frame-Options, etc.) ─
app.use(helmet());

// ── Body parsers ──────────────────────────────────────────────────────────────
// Ko-fi sends application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Ko-fi webhook ─────────────────────────────────────────────────────────────
app.post('/api/webhook/kofi', async (req, res) => {
  try {
    const dataStr = req.body.data;
    if (!dataStr) {
      return res.status(400).send('No data field found');
    }

    const payload = JSON.parse(dataStr);

    // Verify the Ko-fi verification token to reject forged webhook calls.
    // Set KOFI_VERIFICATION_TOKEN in your environment to the value shown in
    // your Ko-fi dashboard under: More > API (Webhooks) > Verification Token.
    const expectedToken = process.env.KOFI_VERIFICATION_TOKEN;
    if (expectedToken) {
      const receivedToken = payload.verification_token ?? '';
      // Use constant-time comparison to prevent timing-based token guessing.
      const expected = Buffer.from(expectedToken);
      const received = Buffer.from(receivedToken);
      const tokensMatch =
        expected.length === received.length &&
        crypto.timingSafeEqual(expected, received);

      if (!tokensMatch) {
        console.warn('[kofi] Rejected webhook: invalid verification token');
        return res.status(401).send('Unauthorized');
      }
    } else {
      // Warn loudly in logs but don't hard-block — allows local development
      // without a Ko-fi account. Set KOFI_VERIFICATION_TOKEN in production.
      console.warn('[kofi] WARNING: KOFI_VERIFICATION_TOKEN is not set. Webhook is unauthenticated.');
    }

    if (payload.is_public === true && supabase) {
      const { from_name, amount, message } = payload;

      const { error } = await supabase
        .from('supporters')
        .insert([{
          name: from_name,
          amount: parseFloat(amount) || 0,
          message: message || '',
        }]);

      if (error) {
        console.error('[kofi] Error inserting supporter:', error.message);
      }
    }

    // Ko-fi expects 200 OK to acknowledge receipt.
    res.status(200).send('OK');
  } catch (error) {
    console.error('[kofi] Webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
