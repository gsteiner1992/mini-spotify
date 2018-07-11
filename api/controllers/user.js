'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (!params.password) {
        return res.status(500).send({ message: 'Introduce la contraseña.' });
    }

    bcrypt.hash(params.password, null, null, (err, hash) => {
        user.password = hash;

        if (user.name == null || user.surname == null || user.email == null)
            return res.status(200).send({ message: 'Rellena todos los campos.' });

        user.save((err, userStored) => {
            if (err)
                return res.status(500).send({ message: 'Error al guardar el usuario.' });

            if (!userStored)
                return res.status(404).send({ message: 'No se ha registrado el usuario.' });

            return res.status(200).send({ user: userStored });
        });
    });
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición.' });

        if (!user)
            return res.status(404).send({ message: 'Usuario no existe.' });

        bcrypt.compare(password, user.password, (err, check) => {
            if (!check)
                return res.status(404).send({ message: 'El usuario no ha podido loguearse.' });

            if (!params.gethash)
                return res.status(200).send({ user });

            return res.status(200).send({
                token: jwt.createToken(user)
            });
        });
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permisos para actualizar este usuario.' });
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            return res.status(500).send({ message: 'Error al actualizar usuario.' });
        }

        if (!userUpdated) {
            return res.status(404).send({ message: 'No se ha podido actualizar el usuario.' });
        }

        return res.status(200).send({ user: userUpdated });
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido...';

    if (!req.files) {
        return res.status(200).send({ message: 'No se ha subido ninguna imagen.' });
    }

    var file_path = req.files.image.path;
    var file_split = file_path.split('\/');
    var file_name = file_split[2];

    var file_ext = file_name.split('\.')[1];

    if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'gif') {
        return res.status(200).send({ message: 'Extensión del archivo no válida.' });
    }

    User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
        if (err) {
            return res.status(500).send({ message: 'Error al actualizar usuario.' });
        }

        if (!userUpdated) {
            return res.status(404).send({ message: 'No se ha podido actualizar el usuario.' });
        }

        return res.status(200).send({ image: file_name, user: userUpdated });
    });
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (!exists) {
            return res.status(200).send({ message: 'Imagen no existe.' });
        }

        return res.sendFile(path.resolve(path_file));
    });
}

module.exports = {
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};