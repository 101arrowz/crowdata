import express from 'express';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { getPolyfillString, FeatureOptions } from 'polyfill-library';
import { join } from 'path';
import nanoid from 'nanoid';
import { idOptions, polyfills as extraPolyfills } from '../../config';
import submitHandler from './submit';

const polyfills = [
  'fetch',
  'URL'
].concat(...extraPolyfills);
const features: { [k: string]: FeatureOptions } = {};
for (let polyfill of polyfills)
  features[polyfill] = { flags: ['gated'] }

const app = express();
let consent: [string, string][];

try {
  mkdirSync(join(__dirname, 'data', 'submissions'), { recursive: true });
} catch (e) {}
try {
  consent = JSON.parse(readFileSync(join(__dirname, 'data', 'consent.json')).toString());
} catch (e) {
  consent = [];
}

setInterval(
  () => writeFileSync(join(__dirname, 'data', 'consent.json'), JSON.stringify(consent)),
  60000
);

app.post('/id', (req, res) => {
  const name = req.query.name;
  delete req.query.name;
  if (!name || !idOptions.every(([key, poss]) => key in req.query && req.query[key] in poss))
    return res.status(400).end();
  const idData = Object.entries(req.query)
    .sort(
      ([a], [b]) => idOptions.findIndex(([k]) => a === k) - idOptions.findIndex(([k]) => b === k)
    )
    .map(([, v]) => v) as string[];
  const idStr = idData.concat(nanoid(12)).join('/');
  mkdirSync(join(__dirname, 'data', 'submissions', idStr), { recursive: true });
  consent.push([req.ip, name]);
  res.send(idStr);
});

app.get('/polyfill.js', (req, res) => {
  getPolyfillString({
    uaString: req.headers['user-agent'],
    features,
    stream: true
  }).pipe(res);
});

app.use('/submit', submitHandler);

if (!module.parent) app.listen(+process.env.PORT || 5000);
export default app;
