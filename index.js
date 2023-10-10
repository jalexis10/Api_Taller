const express = require ('express');// para crear el servidor
const app = express();
const fs = require('fs');//para leer y escribir archivos
const morgan = require('morgan');
const {readFile, writeFile} = require('./src/file.js');
const {v4: uuidv4} = require('uuid');//para crear id unicos
const File_Name = './db/peliculas.txt';//ruta del archivo donde se guardan los datos
const Joi = require('joi');//para validar los datos que llegan al servidor

app.set('port', 3000);//configura el puerto del servidor
app.use(express.urlencoded({extended : false}));   //permite entender los datos que llegan desde un formulario html
app.use(morgan('dev'));//permite ver por consola lo que llega al servidor
app.use (express.json());//permite que el servidor entienda los datos que llegan en formato json

app.post('/peliculas', (req, res) => {

    try{
        const data = readFile(File_Name);
        const newPelicula = req.body;
        newPelicula.id = uuidv4();
        const resultado = peliculaSchema.validate(newPelicula);
        
        if (resultado.error) {
            console.error("Error de validación:", resultado.error.details[0].message);
            res.json({error: 'Error al crear la pelicula'});
            return;
        }

        console.log(newPelicula);
        data.push(newPelicula);
        writeFile(File_Name, data);
        res.json({message: 'Pelicula creada correctamente', newPelicula});
    } catch (err) {
        console.error(err);
        res.json({error: 'Error al crear la pelicula'});
    }
});

app.get('/read.file', (req, res) => {
    const data = readFile(File_Name);
    res.json(data);
});
// todo el contenido del archivo
app.get('/peliculas', (req, res) => {
    const data = readFile(File_Name);
    res.json(data);
});
// buscar pelicula por id
app.get('/peliculas/:id', (req, res) => {
    const id = req.params.id;
    const pelicula = readFile(File_Name);
    const peliculaId = pelicula.find(pelicula => pelicula.id == id);
    if (!peliculaId) {
        res.status(404).json({error: 'Pelicula no encontrada'});
        return;
    } else {
        res.json(peliculaId);
    }
    });
    // actualizar pelicula

    app.put('/peliculas/:id', (req, res) => {
        try{
        console.log(req.params.id);

        const id = req.params.id;
        const peliculas = readFile(File_Name);
        const peliculaIndex = peliculas.findIndex(pelicula => pelicula.id == id);
        if (peliculaIndex < 0) {
            res.status(404).json({error: 'Pelicula no encontrada'});
            return;
        }
        
        let pelicula = peliculas[peliculaIndex];
        pelicula ={... pelicula, ...req.body};
        peliculas[peliculaIndex] = pelicula;
        const resultado = peliculaSchema.validate(pelicula);
        if (resultado.error) {
            console.error("Error de validación:", resultado.error.details[0].message);
            res.json({error: 'Error al crear la pelicula'});
            return;
        }
        writeFile(File_Name, peliculas);
        res.json({'ok': true, pelicula: pelicula});
    } catch (err) {
        console.error(err);
        res.json({error: 'Error al actualizar la pelicula'});
    }
});
    // eliminar pelicula

    app.delete('/peliculas/:id', (req, res) => {
        console.log(req.params.id);

        const id = req.params.id;
        const peliculas = readFile(File_Name);
        const peliculaIndex = peliculas.findIndex(pelicula => pelicula.id == id);
        if (peliculaIndex < 0) {
            res.status(404).json({error: 'Pelicula no encontrada'});
            return;
        }   
        peliculas.splice(peliculaIndex, 1);
        writeFile(File_Name, peliculas);
        res.json({'ok': true,peliculaIndex});
    });

    const peliculaSchema = Joi.object({
        nombre: Joi.string().required(),
        año: Joi.number().integer().min(1800).max(2030).required(),
        director: Joi.string().required(),
        genero: Joi.string(),
        duración: Joi.number(),
        actores: Joi.array().items(Joi.string()),
        calificación: Joi.number(),
        id: Joi.string()
    });
    
    
  

  
    

app.listen(app.get('port'), () => {
    console.log('Server is running on port 3000');
});