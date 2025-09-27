import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, UserData } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponentModule, CommonModule]
})
export class Tab1Page implements OnInit, OnDestroy {
  userData: UserData | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Suscribirse a los datos del usuario
    this.userSubscription = this.authService.getCurrentUserData().subscribe(
      userData => {
        this.userData = userData;
      }
    );
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private performLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }

  async sendEmailVerification() {
    if (!this.userData?.emailVerified) {
      try {
        await this.authService.sendEmailVerification().toPromise();
        await this.showAlert(
          'Email enviado',
          'Se ha enviado un email de verificación. Revisa tu bandeja de entrada.'
        );
      } catch (error) {
        await this.showAlert('Error', 'No se pudo enviar el email de verificación.');
      }
    }
  }

  async reloadUserData() {
    try {
      await this.authService.reloadUser().toPromise();
      await this.showAlert('Actualizado', 'Los datos del usuario han sido actualizados.');
    } catch (error) {
      await this.showAlert('Error', 'No se pudieron actualizar los datos.');
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