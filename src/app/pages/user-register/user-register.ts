import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './user-register.html',
  styleUrl: './user-register.css',
})
export class UserRegister {
  private authService = inject(AuthService);

  email = '';
  password = '';
  error = '';

  async onSubmit() {
    this.error = '';

    try {
      await this.authService.register(this.email, this.password);
    } catch (err: any) {
      this.error = err.message ?? 'Errnr en crear el compte';
    }
  }
}
