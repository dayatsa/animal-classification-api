const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
//TensorFlow.js is an open-source hardware-accelerated JavaScript library
//for training and deploying machine learning models.
const tf = require('@tensorflow/tfjs');
//The module provides native TensorFlow execution
//in backend JavaScript applications under the Node.js runtime.
const tfnode = require('@tensorflow/tfjs-node');
//The fs module provides an API for interacting with the file system.
const fs = require('fs');


app.use(bodyParser.json());

const whitelist = [
  'image/png',
  'image/jpeg',
  'image/jpg'
];


const animals = [
  'horse', 'sheep', 'elephant', 'cat', 'squirrel', 'chicken', 'spider', 'cow', 'dog', 'butterfly'
];


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname);
    cb(null, 'predict.jpg');
  }
});
var upload = multer({ storage: storage });


/**
 * Create New Item
 *
 * @return response()
 */
app.post('/predict', upload.single('image'), async (req, res) => {
  try {
    const image = req.image;

    // if (!whitelist.includes(req.file.mimetype)) {
    //   return next(new Error('file is not allowed'))
    // }

    console.log(req.file.mimetype)
    const result = await imageClassification(req.file.path)

    const data = {
      "result": result,
    }

    res.send(apiResponse('success', 'File predicted successfully.', data));
  } catch (error) {
    console.log(error)
    res.send(apiResponse('fail', 'Error predict image' ))
  }
});


/**
 * Read Image
 *
 * @return tfimage
 */
const readImage = path => {
  //reads the entire contents of a file.
  //readFileSync() is synchronous and blocks execution until finished.
  const imageBuffer = fs.readFileSync(path);
  //Given the encoded bytes of an image,
  //it returns a 3D or 4D tensor of the decoded image. Supports BMP, GIF, JPEG and PNG formats.
  const tfimage = tfnode.node.decodeImage(imageBuffer);
  // console.log(tfimage);
  result = tfimage.resizeBilinear([224,224]) // [7, 7, 3]
  // console.log(result)
  return result.reshape([-1, 224, 224, 3]);
}


/**
 * image Classification
 *
 * @return animal predicted
 */
const imageClassification = async path => {
  const image = readImage(path);
  // Load the model.
  const model = await tf.loadLayersModel('file://model/model.json');
  // Classify the image.
  const predictions = model.predict(image);
  const predictionsArray = Array.from(predictions.dataSync());
  const max = Math.max(...predictionsArray);
  const index = predictionsArray.indexOf(max);
  return animals[index];
}


/**
 * API Response
 *
 * @return response()
 */
function apiResponse(status, message, data) {
  return JSON.stringify({ "status": status, "message":message, data });
}


/*------------------------------------------
--------------------------------------------
Server listening
--------------------------------------------
--------------------------------------------*/
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});

