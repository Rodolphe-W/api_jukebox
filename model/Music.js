const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnect');


const Music = sequelize.define(
    'Music',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      artist: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sound: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cover: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      freezeTableName: true
    },
  );
  
  // `sequelize.define` also returns the model
  //console.log(Music === sequelize.models.Music); // true

 

  module.exports = Music;