const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('../file');
const {models} = require('../libs/sequelize');

const File_Name = './db/peliculas.txt';


//web LISTAR

router.get('/', async(req, res) => {
    try {
        // Obtener todos los registros de la base de datos
        
       
let peliculas = await models.Peli.findAll();

        // Obtener el query param para filtrar
        const filterKey = req.query.filterKey;
        
       
let filterValue = req.query.filterValue; // Convertir a cadena

        

       
if (filterKey && filterValue) {
            // Filtrar registros por el valor del query param
            const filteredPeliculas = peliculas.filter(pelicula => pelicula[filterKey] === filterValue);
            res.
           
render('peliculas/index', { peliculas: filteredPeliculas });
            console.log(filterKey, filterValue, filteredPeliculas);
        } 
        
else {
            // Si no hay query param, renderizar todos los registros
            res.render('peliculas/index', { peliculas: peliculas });
        }
    } 
        
catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
//web crear
router.get('/create', (req, res) => {
    res.render('peliculas/create');
});

router.post('/', async (req, res) => {
    try{
        //const data = readFile(File_Name);
        //const newPelicula = req.body;
        //newPelicula.id = uuidv4();
        //console.log(newPelicula);
        //data.push(newPelicula);
        //writeFile(File_Name, data);
        const newPeli = await models.Peli.create(req.body);
        res.redirect('/peliculas');
    } catch (err) {
        console.error(err);
        res.json({error: 'Error al crear la pelicula'});
    }
});
//web eliminar
router.post('/delete/:id', async (req, res) => {
    //console.log(req.params.id);

    const id = req.params.id;
    //const peliculas = readFile(File_Name);
    //const peliculaIndex = peliculas.findIndex(pelicula => pelicula.id == id);
    try {
        const deletedCount = await models.Peli.destroy({ where: { id } });
        if (deletedCount === 0) {
            res.status(404).json({ error: 'Pelicula no encontrada' });
            return;
        }
        res.redirect('/peliculas');
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Web ACTUALIZAR (Vista)
router.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pelicula = await models.Peli.findByPk(id);
        if (pelicula) {
            res.render('peliculas/update',{ pelicula });
        } else {
            res.status(404).send('Registro no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

// Procesar la actualización
router.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    try {
        const pelicula = await models.Peli.findByPk(id);

        if (pelicula) {
            await pelicula.update(newData);
            res.redirect('/peliculas');
        } else {
            res.status(404).send('Registro no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;