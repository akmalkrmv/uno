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

// Modules
import { MaterialImportsModule } from './shared/material-imports.module';
import { FirebaseImportsModule } from './shared/firebase-imports.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { BuraModule } from './modules/bura/bura.module';
import { ChatModule } from './modules/chat/chat.module';
import { VideoChatModule } from './modules/video-chat/video-chat.module';
import { SharedComponentsModule } from './componentes/shared-components.module';

@NgModule({
  declarations: [AppComponent, HomeComponent, LayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ServiceWorkerModule.register('combined-workers.js', {
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
    SharedComponentsModule,
  ],
  providers: [
    // { provide: ApiService, useClass: LocalApiService },
    // ApiService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
