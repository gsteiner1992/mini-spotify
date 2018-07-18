import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { AlbumService } from "../services/album.service";

import { Artist } from "../models/artist";
import { Album } from "../models/album";

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detalle.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public albums: Array<Album>;
    public identity;
    public token;
    public url: String;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
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

                    //Obtener álbumes del artista
                    this._albumService.getAlbums(this.token, id).subscribe(
                        response => {
                            if (!response.albums) {
                                return this.alertMessage = "Artista no tiene albums.";
                            }

                            this.albums = response.albums;

                            console.log(this.albums);
                        },
                        error => {
                            var errorMessage = <any>error;

                            if (errorMessage != null) {
                                var body = JSON.parse(error._body);
                            }
                        }
                    )
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

    public confirmado;
    onDeleteConfirm(id) {
        this.confirmado = id;
    }

    onCancelAlbum() {
        this.confirmado = null;
    }

    onDeleteAlbum(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if (!response.album) {
                    alert('Error en el servidor.');
                }

                this.getArtist();
            },
            error => {
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    var body = JSON.parse(error._body);
                }
            }
        )
    }
}