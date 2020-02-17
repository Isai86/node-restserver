const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Contratistas = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se selecciono ningún archivo'
                }
            });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son:' + tiposValidos.join(',')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //Extenciones Permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            message: 'Las extenciones permitidas son:' + extensionesValidas.join(','),
            ext: extension
        })
    }

    let nombreArchivo = `${id}- ${new Date().getMilliseconds()}.${extension}`;



    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).send(err).json({
                ok: false,
                err
            });

        //imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    })
});

function imagenUsuario(id, res, nombreArchivo) {

    Contratistas.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        //let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        //if (fs.existsSync(pathImagen)) {
        //    fs.unlinkSync(pathImagen);
        //}

        borraArchivo(usuarioDB.img, 'usuarios')


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        })

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        //let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        //if (fs.existsSync(pathImagen)) {
        //    fs.unlinkSync(pathImagen);
        //}

        borraArchivo(productoDB.img, 'productos')


        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        })

    });


}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;