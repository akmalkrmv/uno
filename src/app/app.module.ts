import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import { environment } from "./../environments/environment";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { CardComponent } from "./componentes/card/card.component";
import { PlayComponent } from "./componentes/play/play.component";
import { HomeComponent } from "./componentes/home/home.component";
import { RoomComponent } from "./componentes/room/room.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    PlayComponent,
    HomeComponent,
    RoomComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    // Material
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    // App
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
