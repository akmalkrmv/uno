import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './componentes/home/home.component';
import { RoomComponent } from './componentes/room/room.component';
import { UserListComponent } from './componentes/user-list/user-list.component';
import { RoomToolbarComponent } from './componentes/room/room-toolbar/room-toolbar.component';
import { VideosListComponent } from './componentes/videos-list/videos-list.component';
import { VideoControlsComponent } from './componentes/video-controls/video-controls.component';

// Modules
import { MaterialImportsModule } from './shared/material-imports.module';
import { FirestoreImportsModule } from './shared/firestore-imports.module';
import { AppRoutingModule } from './app-routing.module';
import { BuraModule } from './componentes/bura/bura.module';
import { ChatModule } from './componentes/chat/chat.module';

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
    FormsModule,
    // Imports
    MaterialImportsModule,
    FirestoreImportsModule,
    // App
    AppRoutingModule,
    BuraModule,
    ChatModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
