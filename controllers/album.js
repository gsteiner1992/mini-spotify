'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');
//var Artist = require ('../models/artist');
var Album = require ('../models/album');
var Song = require ('../models/song');

function getAlbum (req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=> {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!album) {
            return res.status(404).send({message: 'El álbum no existe.'}); 
        }

        return res.status(200).send({album});       
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;

    if (!artistId){
        var find = Album.find({}).sort('title');
    } else {
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!albums) {
            return res.status(404).send({message: 'No hay albums.'}); 
        }

        return res.status(200).send({albums});  
    });
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!albumStored) {
            return res.status(404).send({message: 'El álbum no ha sido guardado.'}); 
        }

        return res.status(200).send({album: albumStored});
    });   
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!albumUpdated) {
            return res.status(404).send({message: 'El álbum no ha sido actualizado.'}); 
        }

        return res.status(200).send({album: albumUpdated});     
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            return res.status(500).send({message: 'Error al eliminar el álbum.'});
        }

        if (!albumRemoved) {
            return res.status(404).send({message: 'El álbum no ha sido eliminado.'});
        }  

        Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
            if (err) {
                return res.status(500).send({message: 'Error al eliminar canción.'});
            }
    
            if (!songRemoved) {
                return res.status(404).send({message: 'La canción no ha sido eliminado.'});
            }  

            return res.status(200).send({album: albumRemoved});
        });
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (!req.files) {
       return res.status(200).send({message: 'No se ha subido ninguna imagen.'});
    }

    var file_path = req.files.image.path;
    var file_split = file_path.split('\/');
    var file_name  = file_split[2];

    var file_ext = file_name.split('\.')[1];

    if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'gif') {
       return res.status(200).send({message: 'Extensión del archivo no válida.'});
    }

    Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
       if (err) {
           return res.status(500).send({message: 'Error al actualizar album.'}); 
       }

       if (!albumUpdated) {
           return res.status(404).send({message: 'No se ha podido actualizar el album.'});
       }

       return res.status(200).send({album: albumUpdated});         
    });

}

function getImageFile (req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, (exists) => {
       if (!exists){
           return res.status(200).send({message: 'Imagen no existe.'}); 
       }

       return res.sendFile(path.resolve(path_file));
    });
}

module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}