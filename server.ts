import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Supabase. Use service role key if available, else anon key.
// Ko-fi webhooks need to bypass RLS to insert into the supporters table.
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse urlencoded bodies (Ko-fi sends application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Also parse JSON just in case
app.use(express.json());

// API route for Ko-fi webhook
app.post('/api/webhook/kofi', async (req, res) => {
  try {
    // Ko-fi sends the payload in a 'data' field as a JSON string
    const dataStr = req.body.data;
    if (!dataStr) {
      return res.status(400).send('No data field found');
    }

    const payload = JSON.parse(dataStr);

    // Filter out private donations or missing names/amounts
    if (payload.is_public === true) {
      const { from_name, amount, message } = payload;
      
      const { error } = await supabase
        .from('supporters')
        .insert([{
          name: from_name,
          amount: parseFloat(amount) || 0,
          message: message || '',
          // created_at is handled by the database default
        }]);

      if (error) {
        console.error('Error inserting supporter:', error);
      }
    }

    // Must return 200 OK so Ko-fi knows it was received
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    // Even on error, it's often good practice to return 200 so Ko-fi doesn't keep retrying excessively,
    // but returning 500 helps debugging if needed.
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
