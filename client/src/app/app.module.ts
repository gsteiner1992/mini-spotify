import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { routing, appRoutingProviders } from "./app.routing";

import { AppComponent } from './app.component';
import { HomeComponent } from "./components/home.component";

//USER
import { UserEditComponent } from "./components/user-edit.component";

//ARTIST
import { ArtistListComponent } from "./components/artist-list.component";
import { ArtistAddComponent } from "./components/artist-add.component";
import { ArtistEditComponent } from "./components/artist-edit.component";
import { ArtistDetailComponent } from "./components/artist-detail.component";

//ALBUM
import { AlbumAddComponent } from "./components/album-add.component";
import { AlbumEditComponent } from "./components/album-edit.component";
import { AlbumDetailComponent } from "./components/album-detail.component";

//SONG
import { SongAddComponent } from "./components/song-add.component";
import { SongEditComponent } from "./components/song-edit.component";

//PLAYER
import { PlayerComponent } from "./components/player.component";

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    HomeComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    appRoutingProviders
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
