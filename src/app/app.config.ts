import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Captura errors globals no gestionats (p.ex. excepcions no capturades) i els reporta a Angular
    provideBrowserGlobalErrorListeners(),

    // provideRouter registra les rutes de l'app.
    // withComponentInputBinding() és CLAU: permet que els paràmetres de la URL (:movieId, :actorId...) es rebin directament com a input() als components, sense haver de llegir-los manualment del Router. Sense això, input.required<string>() als detail-pages NO funcionaria.
    provideRouter(routes, withComponentInputBinding()),
  ]
};
