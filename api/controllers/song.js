'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require ('../models/artist');
var Album = require ('../models/album');
var Song = require ('../models/song');

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!song) {
            return res.status(404).send({message: 'La canción no existe.'}); 
        }

        return res.status(200).send({song});       
    });   
}

function getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId){
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!songs) {
            return res.status(404).send({message: 'No hay canciones.'}); 
        }

        return res.status(200).send({songs});  
    });
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!songStored) {
            return res.status(404).send({message: 'Canción no ha sido guardado.'}); 
        }

        return res.status(200).send({song: songStored});
    });   
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!songUpdated) {
            return res.status(404).send({message: 'Canción no ha sido actualizado.'}); 
        }

        return res.status(200).send({song: songUpdated}); 
    });
}

function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!songRemoved) {
            return res.status(404).send({message: 'Canción no ha sido eliminada.'}); 
        }

        return res.status(200).send({song: songRemoved});       
    });
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No subido...';

    if (!req.files.file) {
       return res.status(200).send({message: 'No se ha subido ningún archivo.'});
    }

    var file_path = req.files.file.path;
    var file_split = file_path.split('\\');
    var file_name  = file_split[2];

    var file_ext = file_name.split('\.')[1];

    if (file_ext != 'mp3' && file_ext != 'ogg') {
       return res.status(200).send({message: 'Extensión del archivo no válida.'});
    }

    Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
       if (err) {
           return res.status(500).send({message: 'Error al actualizar canción.'}); 
       }

       if (!songUpdated) {
           return res.status(404).send({message: 'No se ha subido el audio...'});
       }

       return res.status(200).send({song: songUpdated});         
    });

}

function getSongFile (req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, (exists) => {
       if (!exists){
           return res.status(200).send({message: 'No existe el fichero de audio...'}); 
       }

       return res.sendFile(path.resolve(path_file));
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};