require('dotenv').config();//para leer las variables de entorno
const PDFDocument = require('pdfkit');
const express = require ('express');// para crear el servidor
const app = express();
const fs = require('fs');//para leer y escribir archivos
const morgan = require('morgan');
const {readFile, writeFile} = require('./src/file.js');
const {v4: uuidv4} = require('uuid');//para crear id unicos
const File_Name = './db/peliculas.txt';//ruta del archivo donde se guardan los datos
const Joi = require('joi');//para validar los datos que llegan al servidor
const PORT = process.env.PORT || 3000;//para leer el puerto desde las variables de entorno
const APP_NAME = process.env.APP_NAME || 'Peliculas API';//para leer el nombre de la app desde las variables de entorno
app.set('port', 3000);//configura el puerto del servidor
app.use(express.urlencoded({extended : false}));   //permite entender los datos que llegan desde un formulario html
app.use(morgan('dev'));//permite ver por consola lo que llega al servidor
app.use (express.json());//permite que el servidor entienda los datos que llegan en formato json
app.set('view engine', 'ejs');//permite usar ejs como motor de plantillas
app.set('views', './src/views');//permite configurar la carpeta donde estan las plantillas
const peliculas = require('./src/routes/peliculas');
const {models} = require('./src/libs/sequelize');
app.get('/read-file', (req, res) => {
    const data = readFile(File_Name);
    res.send(data);
});

// ACCESS
app.use((req, res, next) => {
    const accessLog = `${new Date().toISOString().slice(0, 19).replace("T", " ")} [${req.method}] ${req.originalUrl}\n`;

    // Escribir en el archivo access_log.txt
    fs.appendFile('db/access_log.txt', accessLog, (err) => {
        if (err) throw err;
        console.log('Registro de acceso agregado al archivo access_log.txt');
    });

    next(); // Continuar con el siguiente middleware o ruta
});



    
  

//DESCARGAR PDF
function getDataById(id) {
    const data = JSON.parse(fs.readFileSync('db/peliculas.txt'));
    return data.find(pelicula => pelicula.id === id);
}

app.get('/peliculas/generarPDF/:id', (req, res) => {
    const id = req.params.id;
    const data = getDataById(id);

    if (data) {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(`db/detalle_pelicula_${id}.pdf`));

        doc.text(`Detalle de la Película ID: ${id}`, {align: 'center'})
           .moveDown(1)
           .text(`Nombre: ${data.nombre}`)
           .text(`Director: ${data.director}`)
           .text(`Año: ${data.año}`)
           .text(`Género: ${data.genero}`)
           .text(`Duración: ${data.duracion}`)
           .text(`Calificación: ${data.calificacion}`)
           .end();

           res.redirect('/peliculas');
    } else {
        res.status(404).send('Registro no encontrado');
    }
});



    app.use('/peliculas', peliculas);
    

app.listen(PORT, () => {
    console.log(`${APP_NAME} corriendo en el puerto ${PORT}`);
});
