import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import multer from 'multer';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req: Request, res: Response) {
  console.log(req.body);
  console.log(req.files);
  res.json({ message: "Successfully uploaded files" });
}

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});