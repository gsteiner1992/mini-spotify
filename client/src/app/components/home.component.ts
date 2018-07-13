import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
    selector: 'home',
    templateUrl: '../views/home.html'
})

export class HomeComponent implements OnInit {
    public titulo: String;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Artistas';
    }

    ngOnInit(): void {
        console.log('Componente home cargado');

        //Conseguir listado 
    }
}