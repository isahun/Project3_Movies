import { Component, inject, signal, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  authService = inject(AuthService);
  menuOpen = signal(false); // Controla si el menú mòbil és visible

  constructor() {
    // inject() dins del constructor és l'alternativa a declarar-lo com a propietat de classe.
    // Aquí el fem servir directament sense guardar-lo, per accedir a Router.events.
    inject(Router)
      .events.pipe(
        // Router.events emet molts tipus d'esdeveniments (NavigationStart, NavigationEnd, Scroll...).
        // filter() deixa passar NOMÉS els NavigationEnd (quan la navegació ha acabat completament).
        filter((event) => event instanceof NavigationEnd),

        // takeUntilDestroyed() és fonamental per evitar memory leaks:
        // quan el component es destrueixi, cancel·la automàticament la subscripció.
        // Sense això, el listener continuaria actiu en memòria fins i tot après de la destrucció.
        // NOTA: ha d'estar dins del constructor (o en un injection context) per funcionar.
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false)); // Tanquem el menú cada vegada que canvia la ruta
  }

  toggleMenu() {
    // signal.update() rep el valor actual i retorna el nou; ideal per a toggles
    this.menuOpen.update((open) => !open);
  }

  // @HostListener escolta un event del DOM des del component.
  // 'document:click' captura TOTS els clics a qualsevol lloc de la pàgina.
  // Això permet tancar el menú quan l'usuari fa clic fora d'ell.
  // La plantilla HTML ha d'usar stopPropagation() al botó de menú per evitar que el tanci immediatament.
  @HostListener('document:click')
  onDocumentClick() {
    this.menuOpen.set(false);
  }
}
