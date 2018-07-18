import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { AlbumService } from "../services/album.service";
import { UploadService } from "../services/upload.service";
import { Artist } from "../models/artist";
import { Album } from "../models/album";

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public titulo: String;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: String;
    public alertMessage;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar álbum';
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2017, '', '');
        this.is_edit = true;
    }

    ngOnInit(): void {
        console.log('album-add.component.ts cargado');

        // Conseguir el álbum
        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        return this._router.navigate(['/']);
                    }

                    this.album = response.album;
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);

                        console.log(error);
                    }
                })
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                response => {

                    if (!response.album) {
                        return this.alertMessage = 'Error en el servidor';
                    }

                    this.alertMessage = 'Álbum actualizado correctamente.';

                    if (!this.filesToUpload)
                        return this._router.navigate(['/artista', response.album.artist]);

                    this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                        .then(
                            (result) => {
                                this._router.navigate(['/artista', response.album.artist]);
                            },
                            (error) => {
                                console.log(error);
                            }

                        )
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);
                    }
                }
            );
        });


    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}