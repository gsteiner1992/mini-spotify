import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { Artist } from "../models/artist";

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistEditComponent implements OnInit {
    public titulo: String;
    public artist: Artist;
    public identity;
    public token;
    public url: String;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo = 'Crear nuevo artista';
        this.identity = _userService.getIdentity(),
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true
    }

    ngOnInit(): void {
        console.log('artist-edit.component.ts cargado');

        //
    }

    onSubmit(){
        console.log(this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {

                if (!response.artist){
                    return this.alertMessage = 'Error en el servidor';
                }
                this.alertMessage = 'Artista creado correctamente.';
                this.artist = response.artist;
            },
            error => {
                var errorMessage = <any>error;

                if (errorMessage != null){
                    var body = JSON.parse(error._body);
                }
            }
        )
    }
}