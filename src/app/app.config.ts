import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({ projectId: "join-e5bef", appId: "1:387219287108:web:b0b9a44f23a5141e8a2011", storageBucket: "join-e5bef.firebasestorage.app", apiKey: "AIzaSyCHwzQJ3d8q8bspT7nv86740Jz4OFdu9xg", authDomain: "join-e5bef.firebaseapp.com", messagingSenderId: "387219287108" })), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())
  ]
};

// for smooth transition replace row 13 with:

    // provideRouter(routes, withViewTransitions()), 
