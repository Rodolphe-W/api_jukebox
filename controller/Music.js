const { error } = require("console");
const data = require("./../model/data.json");
const sequelize = require('../db/dbConnect');
const Music = require("../model/Music");
const fs = require('fs');
const controllerMusic = {
    find: async (req,res) => {
        const data = await Music.findAll();
        if(req.query.search){
            const query = req.query.search;
            const result = data.filter(song => song.title.toLowerCase().includes(query.toLowerCase()));
            if(result.length === 0) {
                return res.status(404).json({error: "Not found"});
            } else {
                return res.status(200).json({result})
            }
        } else {
            res.status(200).json({result: data});
        }
    },

    delete: async(req,res) => {
        const id = req.params.id;
        let data = await Music.findAll();
        if(isNaN(id)){
            return res.status(405).json({error: "Param is not a number"});
        }
        if(data.filter((music) => music.id == id).length == 0){
            return res.status(404).json({error: "Music not found"});
        }
        const music = data.filter((music) => music.id == id)[0];
        fs.unlinkSync(`./uploads/cover/${music.cover}`);
        fs.unlinkSync(`./uploads/sound/${music.sound}`);
        await Music.destroy({where: {id}});
        data = await Music.findAll();
        return res.status(200).json({message: `${id} have been delete`, result: data});
    },

    create: async (req,res)=> {
        if(!req.files.cover || !req.files.sound || !req.body.title || !req.body.category || !req.body.artist) {
            return res.status(400).json({error: `One or more param are not found (${(!req.files.cover) ? 'cover,' : ''} ${(!req.files.sound) ? 'sound,' : ''} ${(!req.body.title) ? 'title,' : ''} ${(!req.body.category) ? 'category' : ''}) ${(!req.body.artist) ? 'artist' : ''}`})
        }
        const nextAutoIncrementValue = await sequelize.query("SELECT seq FROM sqlite_sequence WHERE name='Music'", { raw: true });
        const id = nextAutoIncrementValue[0][0].seq+1;
        const musicAdd = await Music.create(
            {
                cover: `${id}-${req.files.cover[0].originalname}`,
                sound: `${id}-${req.files.sound[0].originalname}`,
                title: req.body.title,
                category: req.body.category,
                artist: req.body.artist

            }
        );
        return res.status(201).json({message: 'You music have been add', result: musicAdd})
    },

    update: async(req,res)=>{
        const id = req.params.id;
        const music = await Music.findByPk(id);
        if(isNaN(id)){
            return res.status(405).json({error: "Param is not a number"});
        }
        if(!music){
            return res.status(404).json({error: "Music not found"});
        }
        if(!req.body.title || !req.body.artist || !req.body.category){
            return res.status(400).json({error: `One or more param are not found (${(!req.body.title) ? 'title,' : ''} ${(!req.body.artist) ? 'artist,' : ''} ${(!req.body.category) ? 'category' : ''})`});
        }

        const updateObject = { title: req.body.title, category: req.body.category, artist: req.body.artist };

        if(req.files.cover)
            updateObject['cover'] = `${id}-${req.files.cover[0].originalname}`;
        if(req.files.sound)
            updateObject['sound'] = `${id}-${req.files.sound[0].originalname}`;

        await Music.update(
            updateObject,
            {
                where: {
                    id
                }
            }
        );

        const musicUpdate = await Music.findByPk(id);
        return res.status(200).json({message: `Music with id = ${id} have been updated`, result: musicUpdate});
    },

    findById: async (req,res) => {
        const id = req.params.id;
        const data = await Music.findAll();
        const finderMusics = data.filter((music) => music.id == id);
        
        if(isNaN(id)){
            res.status(405).json({error: "Param is not a number"});
        }
        if(finderMusics.length == 0){
            res.status(404).json({error: "Music not found"});
        }
        res.status(200).json({result: finderMusics[0]});
    },

    //Créer la méthode pour renvoyer une musique au hasard
    random: async (req,res) => {
        const data = await Music.findAll();
        const music = data[Math.floor(Math.random()*data.length)];
        res.status(200).json({result: music});
    },

    downloadCover: (req,res)=>{
        const fileName = req.params.fileName;
        const directory = req.params.directory;
        if(directory != "cover" && directory != "sound"){
            return res.status(400).json({error: "Directory not exist ! It's cover or sound"});
        }
        if(fs.existsSync(`./uploads/${directory}/${fileName}`)){
            return res.download(`./uploads/${directory}/${fileName}`);
        } else {
            return res.status(404).json({error: "File not found"});
        }
    }
};

module.exports = controllerMusic;