const mongoose = require('mongoose');

const ImageShema = new mongoose.Schema({
  url: {
    type: String
  },
  tags: {
    type: [String],
  },
  fewTags: [String],
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardModel'
  }
});

module.exports = mongoose.model('ImageModel', ImageShema);
