import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { sourceConfigs } from '../util/config';
import { Readable, ReadableOptions } from 'stream';

class BufferStream extends Readable {
  constructor(private _o: Buffer, options?: ReadableOptions) {
    super(options);
  }
  _read() {
    this.push(this._o);
    this._o = null;
  }
}

const app = express();
const upload = multer();

app.use(upload.single('data'));

const validate = (extension?: string) => {
  extension = extension ? '.' + extension : '';
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const id = req.body.id;
    const info = req.body.info;
    let inc = 0;
    let dir: string;
    if (!id || !info || !(info instanceof Array) || !info.every((e, i) => e in sourceConfigs[i][1]) || !existsSync((dir = join(__dirname, 'data', id)))) return res.status(400).end();
    let filename: string;
    const filepath = join(dir, ...info);
    mkdirSync(join(filepath), { recursive: true });
    while (existsSync((filename = join(filepath, inc + extension)))) inc++;
    req.filename = filename;
    next();
  }
}

app.post('/audio', validate('wav'), (req, res) => {
  const buf = req.file.buffer;
  const conv = ffmpeg(new BufferStream(buf))
    .audioChannels(1)
    .format('wav')
    .output(req.filename);
  conv.on('error', () => {
    res.status(400).end();
  });
  conv.on('end', () => {
    res.status(200).end();
  });
  conv.run();
});
app.post('/text', validate())

export default app;