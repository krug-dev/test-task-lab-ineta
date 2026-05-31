import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config.js';
import { contactRouter } from './routes/contact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: env.nodeEnv });
});

app.use('/api/contact', contactRouter);

const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    next();
    return;
  }
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
