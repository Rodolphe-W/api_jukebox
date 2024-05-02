const express = require('express');
const router = express.Router();
const controllerMusic = require('./../controller/Music');
const {random} = require('./../controller/Music');

router.get("/", (req,res) => {
    res.status(200).json({success: "racine API"});
});

router.post('/', (req, res) => {
    res.status(200).json({ success: 'Bravo'});
});


router.get('/music', controllerMusic.find);
router.post('/music', controllerMusic.create);
router.get('/music/random', random);
router.get('/music/:id', controllerMusic.findById);
router.delete('/music/:id', controllerMusic.delete);
router.put('/music/:id', controllerMusic.update);

module.exports = router;