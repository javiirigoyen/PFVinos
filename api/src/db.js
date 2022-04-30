require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, ENVIRONMENT, DB_NAME, DATABASE_URL
} = process.env;


const URL = ENVIRONMENT === "development" ? `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}` : DATABASE_URL;
//lpm

const options = ENVIRONMENT === "development" ? {
  logging: false,
  native: false,
} : {
  logging: false,
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
};

const sequelize = new Sequelize(URL, options);
const basename = path.basename(__filename);
const modelDefiners = [];


// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize, DataTypes));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
let models = Object.fromEntries(capsEntries);
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

sequelize.models = models;

// En sequelize.models están todos los modelos importados como propiedades 
// Para relacionarlos hacemos un destructuring
const { Product, Categoria, User, Pedido } = sequelize.models;

 Product.belongsTo(Categoria, {
  sourceKey: 'id',
  foreignKey: 'categoriaId'
});
 Categoria.hasMany(Product, {
  sourceKey: 'id',
  foreignKey: 'categoriaId'
});

User.hasMany(Pedido, {
  sourceKey: 'id',
  foreignKey: 'usuarioId'
});

// Relacionando Pedido y Usuario
Pedido.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'usuarioId'
});

module.exports = {
  ...sequelize.models,
   // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
