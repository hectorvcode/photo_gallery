import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterLink]
})
export class LoginPage {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async login() {
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showAlert('Error', 'Por favor, ingresa un email válido.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'circles'
    });
    await loading.present();

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;
        this.router.navigate(['/tabs/tab2']);
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        await this.showAlert('Error de autenticación', this.getErrorMessage(error.code));
      },
    });
  }

  async resetPassword() {
    if (!this.email) {
      await this.showAlert('Error', 'Por favor, ingresa tu email para restablecer la contraseña.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showAlert('Error', 'Por favor, ingresa un email válido.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Enviando email...',
      spinner: 'circles'
    });
    await loading.present();

    this.authService.resetPassword(this.email).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.showAlert(
          'Email enviado',
          'Se ha enviado un email para restablecer tu contraseña. Revisa tu bandeja de entrada.'
        );
      },
      error: async (error) => {
        await loading.dismiss();
        await this.showAlert('Error', this.getErrorMessage(error.code));
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No se encontró una cuenta con este email.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada.';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas. Verifica tu email y contraseña.';
      default:
        return 'Error al iniciar sesión. Intenta nuevamente.';
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}