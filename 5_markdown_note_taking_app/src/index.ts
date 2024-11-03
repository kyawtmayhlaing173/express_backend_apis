import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import multer from 'multer';
import { marked } from "marked";
import * as fs from 'fs';
import path from "path";
import OpenAI from 'openai';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const upload = multer({
  dest: 'uploads/', fileFilter: (req: Request, file: Express.Multer.File, callback: any) => {
    console.log(file.mimetype, file.filename, file.originalname);
    if (file.mimetype === 'text/markdown') {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(new Error('Only .md format allowed!'));
    }
  }
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload_files", upload.single('markdown'), uploadFiles);

function uploadFiles(req: Request, res: Response) {
  console.log(req.file);
  res.json({ message: "Successfully uploaded files" });
}

async function checkGrammar(req: Request, res: Response) {
  const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });
  res.json({ chatCompletion });
}

app.get("/markdown", async (req, res) => {
  try {
    const data = await fs.promises.readFile('./uploads/c8a470704fe125dd63f0d601f9215f92', 'utf8');
    const htmlContent = await marked.parse(data, {
      gfm: true,
      breaks: true,
    });
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(htmlContent));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

app.get("/check-grammar", checkGrammar);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});