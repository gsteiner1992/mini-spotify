import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";

import { Artist } from "../models/artist";

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detalle.html',
    providers: [UserService, ArtistService]
})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public identity;
    public token;
    public url: String;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
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
}