//========================
// Puerto
//========================
process.env.PORT = process.env.PORT || 3000;

//========================
// Entorno
//========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========================
// Base de datos
//========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/usuarios';
} else {
    urlDB = 'mongodb+srv://isai86:e9L2qXeh5aaoc3C6@cluster0-n6wvx.mongodb.net/oficiosApp';
}
process.env.URLDB = urlDB;