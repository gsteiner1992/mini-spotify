import { Component, OnInit } from "@angular/core";
import { Song } from "../models/song";
import { GLOBAL } from "../services/global";

@Component({
    selector: 'player',
    templateUrl:'../views/player.html'
})

export class PlayerComponent implements OnInit {
    public url: string;
    public song : Song;

    constructor(){
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
    }

    ngOnInit(): void {
        console.log("Player cargado");

        var song = JSON.parse(localStorage.getItem("sound_song"));

        if (song){
            return this.song = song;
        }

        this.song = new Song(1, '', '', '', '');
    }

}