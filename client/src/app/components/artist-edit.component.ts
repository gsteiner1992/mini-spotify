import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { UploadService } from "../services/upload.service";

import { Artist } from "../models/artist";

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public titulo: String;
    public artist: Artist;
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
        private _artistService: ArtistService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar artista';
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true
    }

    ngOnInit(): void {
        console.log('artist-edit.component.ts cargado');

        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist) {
                        return this._router.navigate(['/']);
                    }

                    this.artist = response.artist;
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);
                    }
                }
            )
        });
    }

    onSubmit() {
        console.log(this.artist);
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                response => {

                    if (!response.artist) {
                        return this.alertMessage = 'Error en el servidor';
                    }
                    this.alertMessage = 'Artista actualizado correctamente.';

                    if (!this.filesToUpload){
                        return this._router.navigate(['/artista', id]);
                    }

                    this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
                        .then(
                            (result) => {
                                this._router.navigate(['/artista', id]);
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

                        this.alertMessage = body.message;
                    }
                }
            )
        })
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;

        console.log(this.filesToUpload);
    }
}