import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Firestore
import { environment } from './../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

// Modules
import { MaterialImportsModule } from './shared/material-imports.module';
import { AppRoutingModule } from './app-routing.module';
import { BuraModule } from './componentes/bura/bura.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './componentes/home/home.component';
import { RoomComponent } from './componentes/room/room.component';
import { UserListComponent } from './componentes/user-list/user-list.component';
import { RoomToolbarComponent } from './componentes/room/room-toolbar/room-toolbar.component';
import { VideosListComponent } from './componentes/videos-list/videos-list.component';
import { VideoControlsComponent } from './componentes/video-controls/video-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RoomComponent,
    UserListComponent,
    RoomToolbarComponent,
    VideosListComponent,
    VideoControlsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    // Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    // Material
    MaterialImportsModule,
    // App
    AppRoutingModule,
    BuraModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
