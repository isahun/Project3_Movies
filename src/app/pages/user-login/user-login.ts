import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {
  private authService = inject(AuthService);

  email = '';
  password = '';
  error = '';

  async onSubmit() {
    this.error = '';

    try {
      await this.authService.login(this.email, this.password)
    } catch (err: any) {
      this.error = err.message ?? 'Email o contrassenya incorrectes';
    }
  }
}
