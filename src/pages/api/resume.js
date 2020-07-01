import getConfig from 'next/config';
import Uploader from '@codeday/uploader-node';
import formidable from 'formidable';
import fs from 'fs';
import { updateStudentResume } from '../../utils/airtable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const { serverRuntimeConfig } = getConfig();
const uploader = new Uploader(serverRuntimeConfig.uploader.base);

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  const [{ id }, { file }] = await new Promise((resolve, reject) => form.parse(req, (err, ...rest) => {
    if (err) return reject(err);
    return resolve(rest);
  }));

  const upload = await uploader.file(await fs.promises.readFile(file.path), file.name);
  await fs.promises.unlink(file.path);

  await updateStudentResume(id, upload.url);
  res.send(upload.url);
};
