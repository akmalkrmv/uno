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
import { SharedComponentsModule } from './componentes/shared-components.module';
import { AppRoutingModule } from './app-routing.module';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';

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
    SharedComponentsModule,
    // App
    AppRoutingModule,
    environment.production ? [] : AkitaNgDevtools,
    AkitaNgRouterStoreModule,
  ],
  providers: [
    // { provide: ApiService, useClass: LocalApiService },
    // ApiService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
