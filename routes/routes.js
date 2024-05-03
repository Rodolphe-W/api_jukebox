const express = require('express');
const router = express.Router();
const controllerMusic = require('./../controller/Music');
const {random} = require('./../controller/Music');
const multer = require('multer');
const fs = require('fs');
const { error } = require('console');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname == "sound"){
            cb(null, './uploads/sound');
        } else if(file.fieldname == "cover"){
            cb(null, './uploads/cover');
        }
      
    },
    filename: async function (req, file, cb) {
        const sequelize = require('../db/dbConnect');
        const nextAutoIncrementValue = await sequelize.query("SELECT seq FROM sqlite_sequence WHERE name='Music'", { raw: true });
        cb(null, `${(nextAutoIncrementValue[0][0].seq+1)}-${file.originalname}`);
    }
});

const updateStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname == "sound"){
            cb(null, './uploads/sound');
        } else if(file.fieldname == "cover"){
            cb(null, './uploads/cover');
        }
      
    },
    filename: async function (req, file, cb) {
        if(file.fieldname == 'cover'){
            if (file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg") {
                const error = new Error('Invalid mime type for cover (png, jpg or jpeg)');
                error.code = 500;
                return cb(error);
            }
        }
        
        if(file.fieldname == 'sound'){
            const mimetype = file.mimetype.split('/');
            if (mimetype[0] != "audio") {
                const error = new Error('Invalid mime type for audio');
                error.code = 500;
                return cb(error);
            }
        }
        const id = req.params.id;
        const Music = require('../model/Music');
        const musics = await Music.findAll();
        const finderMusics = musics.filter((music) => music.id == id);
        if(finderMusics.length != 0){
            const music = finderMusics[0];
            if(fs.existsSync(`./uploads/${(file.fieldname == 'cover')?'cover':'sound'}/${id}-${(file.fieldname == 'cover')? music.cover : music.sound}`)){
                fs.unlinkSync(`./uploads/${(file.fieldname == 'cover')?'cover':'sound'}/${id}-${(file.fieldname == 'cover')? music.cover : music.sound}`);
            }

            return cb(null, `${id}-${file.originalname}`);
              
        } else {
            const error = new Error('Music not found');
            error.code = 404;
            return cb(error);
        }
        
    }
});

const auth = (req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        if(bearerToken == process.env.TOKEN){
            next();
        } else {
            return res.status(403).json({error: "Invalid token"});
        }
    } else {
        return res.status(403).json({error: "Invalid token"});
    }
}
  
const upload = multer({ storage: storage });
const update = multer({ storage: updateStorage })

router.get("/", (req,res) => {
    res.status(200).json({success: "racine API"});
});

router.post('/', (req, res) => {
    res.status(200).json({ success: 'Bravo'});
});


router.get('/music', controllerMusic.find);
router.post('/music',auth, upload.fields([{name: 'sound'},{name: 'cover'}]), controllerMusic.create);
router.get('/music/random', random);
router.get('/music/:id', controllerMusic.findById);
router.delete('/music/:id', auth,controllerMusic.delete);


//router.put('/music/:id', update.fields([{name: 'sound'},{name: 'cover'}]) , controllerMusic.update);

const updateFiles = update.fields([{name: 'sound'},{name: 'cover'}]);
router.put('/music/:id',auth, function(req,res){
    updateFiles(req,res,function(err){
        if (err) {
            return res.status(err.code).send({ error: err.message });
        } else{
            controllerMusic.update(req,res);
        }
    });
});

router.get('/download/:directory/:fileName', controllerMusic.downloadCover);


module.exports = router;