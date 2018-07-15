import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { Artist } from "../models/artist";

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public titulo: String;
    public artists: Artist[];
    public identity;
    public token;
    public url: String;
    public next_page;
    public prev_page;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Artistas';
        this.identity = _userService.getIdentity(),
            this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit(): void {
        console.log('Artist list component cargado');

        this.getArtists();
    }

    getArtists() {
        this._route.params.forEach((params: Params) => {
            let page = +params['page'];

            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if (this.prev_page == 0) {
                    this.prev_page = 1
                }

                this._artistService.getArtists(this.token, page).subscribe(
                    response => {
                        if (!response.artists){
                            this._router.navigate(['/']);
                        } else {
                            this.artists  = response.artists;
                        }
                        //this.artist = response.artist;
                    },
                    error => {
                        var errorMessage = <any>error;

                        if (errorMessage != null) {
                            var body = JSON.parse(error._body);
                        }
                    }
                );
            }
        });
    }
}