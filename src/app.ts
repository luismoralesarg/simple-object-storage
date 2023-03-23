import * as fs from 'fs';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

const OBJECT_STORAGE_DIRECTORY = '../object-storage/';
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/objects/:bucketName/:key', async (req: Request, res: Response) => {
  const { bucketName, key } = req.params;
  const filePath = `${OBJECT_STORAGE_DIRECTORY}${bucketName}/${key}`;
  try {
    const data = fs.readFileSync(filePath);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/objects/:bucketName/:key', async (req: Request, res: Response) => {
  const { bucketName, key } = req.params;
  const { body } = req;
  const directoryPath = `${OBJECT_STORAGE_DIRECTORY}${bucketName}`;

  try {
    // Create the bucket directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }

    // Write the object to the file system
    const filePath = `${directoryPath}/${key}`;
    fs.writeFileSync(filePath, body);

    res.status(200).send('Object stored successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

export {
  app,
};

app.listen(3000, () => {
  console.log('Object storage service API listening on port 3000!');
});
