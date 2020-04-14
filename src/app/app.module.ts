import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

import { environment } from './../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CardComponent } from './componentes/card/card.component';
import { PlayComponent } from './componentes/play/play.component';
import { HomeComponent } from './componentes/home/home.component';
import { RoomComponent } from './componentes/room/room.component';
import { UserListComponent } from './componentes/user-list/user-list.component';
import { RoomToolbarComponent } from './componentes/room-toolbar/room-toolbar.component';
import { VideosListComponent } from './componentes/videos-list/videos-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    PlayComponent,
    HomeComponent,
    RoomComponent,
    UserListComponent,
    RoomToolbarComponent,
    VideosListComponent,
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
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDividerModule,
    // App
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
