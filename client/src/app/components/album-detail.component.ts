import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { AlbumService } from "../services/album.service";
import { SongService } from "../services/song.service";

import { Album } from "../models/album";
import { Song } from "../models/song";

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit {
    public album: Album;
    public songs: Array<Song>;
    public identity;
    public token;
    public url: String;
    public alertMessage;
    public confirmar;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ) {
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
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

                    //Sacar canciones
                    this._songService.getSongs(this.token, id).subscribe(
                        response => {
                            if (!response.songs) {
                                return this.alertMessage = "Este álbum no tiene canciones.";
                            }

                            this.songs = response.songs;
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

    onDeleteConfirm(id) {
        this.confirmar = id;
    }

    onCancelSong() {
        this.confirmar = null;
    }

    onDeleteSong(id: string) {
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                if (!response.song) {
                    return alert("Error en el servidor.")
                }

                this.getAlbum();
            },
            error => {
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    var body = JSON.parse(error._body);
                }
            }
        )
    }

    startPlayer(song) {
        let song_player = JSON.stringify(song);
        let file_path = this.url + 'get-song-file/' + song.file;
        let image_path = this.url + 'get-image-album/' + song.album.image;

        localStorage.setItem('sound_song', song_player);

        document.getElementById('player').setAttribute('src', file_path);
        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();

        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute("src", image_path);
    }

}