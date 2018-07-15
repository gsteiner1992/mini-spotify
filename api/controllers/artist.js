'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');
var Artist = require ('../models/artist');
var Album = require ('../models/album');
var Song = require ('../models/song');

function getArtist (req, res) {
    var artistID = req.params.id;

    Artist.findById(artistID, (err, artist) => {
        if (err) {
            return res.status(500).send({message: 'Error en la petición.'}); 
        }

        if (!artist) {
            return res.status(404).send({message: 'Artista no existe.'});
        }

        return res.status(200).send({artist});
    });
}

function getArtists(req, res) {
    var page = req.params.page ? req.params.page : 1;

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            return res.status(500).send({message: 'Error en la petición.'});
        }

        if (!artists){
            return res.status(404).send({message: 'No hay artistas.'});
        }

        return res.status(200).send({
            total_items: total,
            artists: artists
        });

    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            return res.status(500).send({message: 'Error al guardar artista.'});
        }

        if (!artistStored) {
            return res.status(404).send({message: 'El artista no ha sido guardado.'}); 
        }

        return res.status(200).send({artist: artistStored});
    });
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            return res.status(500).send({message: 'Error al guardar el artista.'});
        }

        if (!artistUpdated) {
            return res.status(404).send({message: 'El artista no ha sido actualizado.'});
        }

        return res.status(200).send({artist: artistUpdated});
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            return res.status(500).send({message: 'Error al eliminar el artista.'});
        }

        if (!artistRemoved) {
            return res.status(404).send({message: 'El artista no ha sido eliminado.'});
        }

        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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

                return res.status(200).send({artist: artistRemoved});
            });
        });
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No subido...';

    if (!req.files) {
       return res.status(200).send({message: 'No se ha subido ninguna imagen.'});
    }

    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name  = file_split[2];

    var file_ext = file_name.split('\.')[1];

    if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'gif') {
       return res.status(200).send({message: 'Extensión del archivo no válida.'});
    }

    Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
       if (err) {
           return res.status(500).send({message: 'Error al actualizar usuario.'}); 
       }

       if (!artistUpdated) {
           return res.status(404).send({message: 'No se ha podido actualizar el usuario.'});
       }

       return res.status(200).send({artist: artistUpdated});         
    });

}

function getImageFile (req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/' + imageFile;

    fs.exists(path_file, (exists) => {
       if (!exists){
           return res.status(200).send({message: 'Imagen no existe.'}); 
       }

       return res.sendFile(path.resolve(path_file));
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};