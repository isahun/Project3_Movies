import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-login',
  // FormsModule és necessari per usar [(ngModel)] a la plantilla HTML,
  // que fa "two-way binding": quan l'usuari escriu al input, la propietat s'actualitza,
  // i si canviem la propietat per codi, el input es reconstrueix.
  imports: [RouterLink, FormsModule],
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {
  authService = inject(AuthService);

  // Propietats vinculades als inputs del formulari via [(ngModel)]="email" i [(ngModel)]="password"
  email = '';
  password = '';
  error = ''; // Missatge d'error visible a la plantilla si el login falla

  // async perquè authService.login() retorna una Promise i necessitem esperar-la
  async onSubmit() {
    this.error = ''; // Netejem l'error anterior abans de cada intent

    try {
      // Si login() té èxit, navega a '/' internament (veure AuthService)
      await this.authService.login(this.email, this.password);
    } catch (err: any) {
      // err: any perquè TypeScript no pot inferir el tipus d'excepcions capturades.
      // AuthService llença l'error de Supabase directament (que té .message).
      // ?? actua com a fallback: si err.message és undefined, mostrem el missatge genèric.
      this.error = err.message ?? 'Email o contrassenya incorrectes';
    }
  }
}
