const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var os = require('os');
const { createImage } = require('./image-creator');
const port = process.env.PORT || 5000;

const app = express();

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

app.post('/', async (req, res) => {
  try {
    const data = req.body;
    const errors = {};

    if (!data['title'] || data['title'] === '') {
      errors['title'] = 'Title is required!';
    }

    if (!data['avatar'] || data['avatar'] === '') {
      errors['avatar'] = 'Avatar is required!';
    }

    if (!data['full_name'] || data['full_name'] === '') {
      errors['full_name'] = 'Full name is required!';
    }

    if (!data['creation_time'] || data['creation_time'] === '') {
      errors['creation_time'] = 'Creation time is required!';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(500).json({
        status: 'FAILED',
        message: 'Failed to create a thumbnail image for this post!',
        errors,
      });
    }

    const fileName = await createImage(data);

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Create a thumbnail image successfully!',
      data: `/public/${fileName}`,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 'FAILED',
      message: 'Failed to create a thumbnail image for this post!',
    });
  }
});

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server is listening on port ${port}...`);
  }
});
