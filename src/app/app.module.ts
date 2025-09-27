import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import {
  initializeAuth,
  indexedDBLocalPersistence,
  getAuth as getFirebaseAuth,
} from 'firebase/auth';
import { getApp } from 'firebase/app';
import { environment } from '../environments/environment.local';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({
      innerHTMLTemplatesEnabled: true,
    }),
    AppRoutingModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => {
      const app = getApp();
      try {
        return initializeAuth(app, { persistence: indexedDBLocalPersistence });
      } catch {
        // Fallback a la instancia existente si ya fue inicializada o si IndexedDB falla
        return getFirebaseAuth(app);
      }
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
