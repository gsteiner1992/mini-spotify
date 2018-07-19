import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { SongService } from "../services/song.service";
import { UploadService } from "../services/upload.service";

import { Song } from "../models/song";


@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
    public titulo: String;
    public song: Song;
    public identity;
    public token;
    public url: String;
    public alertMessage;
    public filesToUpload: Array<File>;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar canción';
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.is_edit = true;
    }

    ngOnInit(): void {
        this.getSong();
    }

    getSong() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._songService.getSong(this.token, id).subscribe(
                response => {
                    if (!response.song) {
                        return this._router.navigate(['/']);
                    }

                    this.song = response.song;
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);
                    }
                }
            )
        })
    }

    onSubmit() {

        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            console.log(this.song);

            this._songService.editSong(this.token, id, this.song).subscribe(
                response => {

                    if (!response.song) {
                        return this.alertMessage = 'Error en el servidor';
                    }

                    if (!this.filesToUpload) {
                        return this._router.navigate(['/album', response.song.album]);
                    }

                    //Subir fichero de audio
                    this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
                        .then(
                            (result) => {
                                this._router.navigate(['/album', response.song.album]);
                            },
                            (error) => {
                                console.log(error);
                            }

                        )

                    this.alertMessage = 'Canción actualizada correctamente.';
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);

                        this.alertMessage = body.message;
                    }
                }
            )
        });

    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}