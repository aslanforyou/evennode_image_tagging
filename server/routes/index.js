const express = require('express');
const router = express.Router();
const appCtrl = require('../controllers/appCtrl');


router.get('/', appCtrl.getBoards);
router.post('/', appCtrl.createBoard);
router.put('/', appCtrl.saveBoard);
router.delete('/', appCtrl.clearAll);

router.post('/tags', appCtrl.getTags);


module.exports = router;
