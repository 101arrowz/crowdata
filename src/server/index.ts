import express from 'express';
import multer from 'multer';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import nanoid from 'nanoid';
import ffmpeg from 'fluent-ffmpeg';
import { Readable, ReadableOptions } from 'stream';
import { Decoder, Reader, tools } from 'ts-ebml';

class BufferStream extends Readable {
  constructor(private _object: Buffer, options?: ReadableOptions) {
    super(options);
  }
  _read() {
    this.push(this._object);
    this._object = null;
  }
}

const upload = multer();
const app = express();
app.use(express.json());

app.get('/id', (req, res) => {
  const sex = req.query.sex;
  if (sex !== '0' && sex !== '1' && sex != '2') return res.status(400).end();
  const id = sex + '-' + nanoid(8);
  const dir = join(__dirname, 'data', id);
  mkdirSync(dir);
  res.send(id);
});

app.post('/submitRecording', upload.single('audio'), (req, res) => {
  const id = req.body.id;
  const str = req.body.dataStr || 'data';
  let inc = 0;
  let dir: string;
  if (!id || !existsSync((dir = join(__dirname, 'data', id)))) return res.sendStatus(400);
  let filename: string;
  while (existsSync((filename = join(dir, str + '-' + inc + '.wav')))) inc++;
  const buf = req.file.buffer;
  const re = new Reader();
  re.logging = false;
  re.drop_default_duration = false;
  for (const chunk of new Decoder().decode(buf)) re.read(chunk);
  re.stop();
  const fixedBuf = Buffer.from(tools.concat([Buffer.from(tools.makeMetadataSeekable(re.metadatas, re.duration, re.cues)), buf.slice(re.metadataSize)]).buffer);
  ffmpeg(new BufferStream(fixedBuf)).ffprobe((err, data) => {
    if (err)
      return res.status(400).send(err);
    const conv = ffmpeg(new BufferStream(fixedBuf))
      .audioChannels(1)
      .seekInput(0.1)
      .duration(data.format.duration - 0.2)
      .format('wav')
      .output(filename);
    conv.on('error', err => {
      res.status(400).send(err);
    });
    conv.on('end', () => {
      res.sendStatus(200);
    });
    conv.run();
  })
});

if (!module.parent) app.listen(+process.env.PORT || 5000);
export default app;
