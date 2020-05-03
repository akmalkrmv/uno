import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './componentes/home/home.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { SidenavComponent } from './componentes/sidenav/sidenav.component';
import { ProfileComponent } from './componentes/profile/profile.component';
import { CommandsMenuComponent } from './componentes/commands-menu/commands-menu.component';

// Modules
import { MaterialImportsModule } from './shared/material-imports.module';
import { FirebaseImportsModule } from './shared/firebase-imports.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { BuraModule } from './modules/bura/bura.module';
import { ChatModule } from './modules/chat/chat.module';
import { VideoChatModule } from './modules/video-chat/video-chat.module';

// Services
import { ApiService } from '@services/repository/api.service';
import { LocalApiService } from '@services/local-repository/api.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    SidenavComponent,
    ProfileComponent,
    CommandsMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    // Imports
    MaterialImportsModule,
    FirebaseImportsModule,
    // App
    AppRoutingModule,
    BuraModule,
    ChatModule,
    VideoChatModule,
    AuthModule,
  ],
  providers: [
    // { provide: ApiService, useClass: LocalApiService },
    // ApiService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
