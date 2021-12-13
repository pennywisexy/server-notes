/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dataPath = path.join(__dirname, '.', 'data', 'users.json');
console.log(path.resolve('data','users.json'));
const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = 'utf8',
) => {
    fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
        throw err;
    }

    callback(returnJson ? JSON.parse(data) : data);
    });
};
  
const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = 'utf8',
) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
        throw err;
    }

    callback();
    });
};
  
// READ
router.get('/users', (req, res) => {
   readFile((data) => {
   res.send(JSON.stringify(data));
    }, true);
   // res.json(require('./data/users.json'))
});
// ADD
router.post('/users', (req, res) => {
    readFile((data) => {
    data[req.body.id] = req.body;
    writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(JSON.stringify(data));
    });
    }, true);
});
  
// UPDATE
router.put('/users/:id', (req, res) => {
    readFile((data) => {
    data[req.params.id].note = req.body.note;
    data[req.params.id].hashtag = req.body.hashtag;
    writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(JSON.stringify(data));
    });
    }, true);
});
// DELETE
router.delete('/users/:id', (req, res) => {
    readFile(data => {
    delete data[req.params.id];
    writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(JSON.stringify(data));
    });
    }, true);
});

// router.get('/', (req, res) => {
//     res.json(require('./data/users.json'));
//   });
// const server = app.listen(3001, () => console.log('listening on port %s...', server.address().port));

app.use('/.netlify/functions/server', router);
module.exports.handler = serverless(app);
