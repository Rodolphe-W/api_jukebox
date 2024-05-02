const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const app = express();
const port = 3000;
const version = "v1";
const router = require('./routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = require('./swagger.json');
const specs = swaggerJsdoc(options);
const sequelize = require('./db/dbConnect');



(async function dbConnect(){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const Music = require('./model/Music');

(async () => {

  await Music.sync();
  // Code here
  
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(`/api/${version}`, router);
app.use( `/api/${version}/api-docs`, swaggerUi.serve, swaggerUi.setup(specs, { explorer : true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});