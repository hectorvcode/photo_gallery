import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterLink]
})
export class RegisterPage {
  email = '';
  password = '';
  confirmPassword = '';
  displayName = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      await this.showAlert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showAlert('Error', 'Por favor, ingresa un email válido.');
      return;
    }

    if (this.password.length < 6) {
      await this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
      spinner: 'circles'
    });
    await loading.present();

    this.isLoading = true;

    this.authService.register(this.email, this.password, this.displayName || undefined).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;

        await this.showAlert(
          'Cuenta creada',
          'Tu cuenta ha sido creada exitosamente. Se recomienda verificar tu email.',
          async () => {
            // Enviar email de verificación
            try {
              await this.authService.sendEmailVerification().toPromise();
            } catch (error) {
              console.log('Error enviando email de verificación:', error);
            }
            this.router.navigate(['/tabs/tab2']);
          }
        );
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        await this.showAlert('Error al crear cuenta', this.getErrorMessage(error.code));
      },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con este email.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'El registro con email no está habilitado.';
      default:
        return 'Error al crear la cuenta. Intenta nuevamente.';
    }
  }

  private async showAlert(header: string, message: string, handler?: () => void) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: handler || (() => {})
        }
      ]
    });
    await alert.present();
  }
}