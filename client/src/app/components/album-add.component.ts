import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { AlbumService } from "../services/album.service";
import { Artist } from "../models/artist";
import { Album } from "../models/album";

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public titulo: String;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: String;
    public alertMessage;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Crear nuevo álbum';
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2017, '', '');
    }

    ngOnInit(): void {
        console.log('album-add.component.ts cargado');
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let artist_id = params['artist'];
            this.album.artist = artist_id;

            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {

                    if (!response.album) {
                        return this.alertMessage = 'Error en el servidor';
                    }
                    this.alertMessage = 'Álbum creado correctamente.';
                    this.album = response.album;

                    //this._router.navigate(['/editar-artista', response.artist._id]);
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);
                    }
                }
            );
            console.log(this.album);
        });


    }
}