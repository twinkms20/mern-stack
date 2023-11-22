const express = require('express');
require('./config');
const multer = require('multer');

const Item = require('./item');

const app = express();

app.use(express.json());

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.pdf');
    },
  }),
}).single('user_file');

app.post('/create', async (req, resp) => {
  let data = new Item(req.body);
  let result = await data.save();
  resp.send(result);
});

app.get('/getAll', async (req, resp) => {
  let data = await Item.find();
  resp.send(data);
});

app.delete('/delete/:_id', async (req, resp) => {
  console.log(req.params);
  let data = await Item.deleteOne(req.params);
  resp.send(data);
});

app.put('/update/:_id', async (req, resp) => {
  console.log(req.params);
  let data = await Item.updateOne(req.params, { $set: req.body });
  resp.send(data);
});

app.get('/search/:key', async (req, resp) => {
  let data = await Item.find({
    $or: [{ name: { $regex: req.params.key } }],
  });
  resp.send(data);
});

app.post('/upload', upload, (req, resp) => {
  resp.send('upload');
});

app.listen(9000);
