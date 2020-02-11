import api from '.';
import express from 'express';
import { join } from 'path';
import Bundler from 'parcel-bundler';
const bundler = new Bundler(join(__dirname, '..', 'index.html'), {
  watch: true
});
const app = express();
app.use('/api', api);
app.use(bundler.middleware());
const PORT = +process.env.PORT || 1234;
app.listen(PORT);
bundler.on('pwaBuildEnd' as 'buildEnd', () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
