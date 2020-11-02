const mongoose = require('mongoose');

const BoardShema = new mongoose.Schema({
  name: {
    type: String,
  },
  images: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ImageModel'
  }
});

module.exports = mongoose.model('BoardModel', BoardShema);
