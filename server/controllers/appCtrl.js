const boardModel = require('../models/BoardModel');
const imageModel = require('../models/ImageModel');

const request = require('request');

const getBoards = (req, res) => {
  boardModel.find({}, (err, boards) => {
    if (err) {
      res.status(500).send({ err: 'Cannot get Boards' });
    }
    res.send(boards);
  }).populate({ path: 'images', model: imageModel })
};

const createBoard = async (req, res) => {
  const params = req.body;
  if (!params || !params.name) {
    return res.status(400).send({ err: 'No name for new board' });
  }

  try {
    const board = new boardModel({ name: params.name });
    const newBoard = await board.save();
    return res.send(newBoard);
  } catch (err) {
    res.status(500).send({ err: 'Error on creating board' });
  }
};

const saveBoard = async (req, res) => {
  const params = req.body;
  const board = params.board;

  if (!params || !board || !board._id || !board.images) {
    return res.status(400).send({ err: 'Nothing to save' });
  }

  try {
    const db_board = await boardModel.findOne({ _id: board._id });
    const savePromises = [];
    board.images.forEach(image => {
      if (image._id) {
        savePromises.push(imageModel.findOneAndUpdate({ _id: image._id },
          { tags: image.tags || [], fewTags: image.fewTags || [] }, {new: true}));
      } else {
        const db_image = new imageModel({
          url: image.url || '',
          board: board._id,
          tags: image.tags || [],
          fewTags: image.fewTags || []
        });
        savePromises.push(db_image.save());
      }
    });

    const images = await Promise.all(savePromises);
    const im_ids = [];
    images.forEach(image => {
      im_ids.push(image._id)
    });

    await boardModel.updateOne({ _id: board._id }, { $addToSet: { images: im_ids }});

    return res.send(images);
  } catch (err) {
    console.log('DEBUGG err ', err);
    res.status(500).send({ err: 'Error on saving board' });
  }
};

const clearAll = async (req, res) => {
  try {
    if (req.query && req.query.secret && req.query.secret === 'my_secret') {
      await boardModel.deleteMany({});
      await imageModel.deleteMany({});
      return res.send('Done');
    }
    return res.send('Nice try');
  } catch (err) {
    res.status(500).send({ err: 'Cannot perform clean-up' });
  }
};

const imaggaReq = (imageUrl, _id) => new Promise((resolve) => {
  apiKey = process.env.IMAGGA_KEY;
  apiSecret = process.env.IMAGGA_SECRET;

  request.get('https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl), (error, response, body) => {
    if (response && response.statusCode && response.statusCode === 200) {
      return resolve({ url: imageUrl, body, _id } || {});
    }
    return resolve()
  }).auth(apiKey, apiSecret, true);
});

const parseTags = (result) => new Promise(resolve => {
  try {
    const tagsResponse = JSON.parse(result.body);
    if (!tagsResponse.result || !tagsResponse.result.tags) {
      return resolve();
    }
    const tags = tagsResponse.result.tags;
    const allTags = [];
    tags.forEach(tag => allTags.push(tag.tag.en));
    return resolve({ tags: allTags, fewTags: allTags.slice(0, 5), url: result.url, _id: result._id });
  } catch (err) {
    console.log('DEBUGG err ', err);
    return resolve();
  }
});

const getTags = async (req, res) => {
  const params = req.body;
  const images = params.images;

  if (!params || !images || images.length === 0) {
    return res.status(400).send({ err: 'No images' });
  }
  try {
    const tagsPromises = [];
    const tags = [];

    for (const image of images) {
      const res = await imaggaReq(image.url, image._id);
      tagsPromises.push(res);
    }

    tagsPromises.forEach(result => {
      tags.push(parseTags(result));
    });
    const parsedTags = await Promise.all(tags);
    if (!parsedTags) {
      return res.send({ tags: [] })
    }
    res.send(parsedTags);
  } catch (err) {
    res.status(500).send({ err: 'Cannot get tags' });
  }
};

module.exports = {
  getBoards,
  createBoard,
  saveBoard,
  clearAll,

  getTags
};
