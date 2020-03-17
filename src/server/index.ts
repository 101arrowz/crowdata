import express from 'express';
import { mkdirSync } from 'fs';
import { getPolyfillString } from 'polyfill-library';
import { join } from 'path';
import nanoid from 'nanoid';
import { idOptions } from '../util/config';
import submitHandler from './submit';

const app = express();

app.post('/id', (req, res) => {
  if (!idOptions.every(([key, poss]) => key in req.query && req.query[key] in poss))
    return res.status(400).end();
  const idData = Object.entries(req.query).sort(([a], [b]) => idOptions.findIndex(([k]) => a === k) - idOptions.findIndex(([k]) => b === k)).map(([,v]) => v) as string[];
  let idStr = join(...idData, nanoid(12));    
  mkdirSync(join(__dirname, 'data', idStr), { recursive: true });
  res.send(idStr);
});

app.get('/polyfill.js', (req, res) => {
  getPolyfillString({
    uaString: req.headers['user-agent'],
    features: {
      'es6': { flags: ['gated'] }
    },
    stream: true
  }).pipe(res);
})

app.use('/submit', submitHandler);

if (!module.parent) app.listen(+process.env.PORT || 5000);
export default app;
