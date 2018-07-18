import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { AlbumService } from "../services/album.service";

import { Album } from "../models/album";

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService]
})

export class AlbumDetailComponent implements OnInit {
    public album: Album;
    public identity;
    public token;
    public url: String;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
    ) {
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
        console.log('album-detail.component.ts cargado');

        //Sacar album de la BD
        this.getAlbum();
    }

    getAlbum() {
        console.log("Método get album.");

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
                    }
                }
            )
        });
    }

}