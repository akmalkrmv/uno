import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule.enablePersistence()
  ],
  exports: [
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
  ],
})
export class FirebaseImportsModule {}
