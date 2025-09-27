import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { CartItem } from '../interfaces/product.interface';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private productsService: ProductsService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.subscribeToCart();
    this.subscribeToTotal();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private subscribeToCart() {
    const cartSub = this.productsService.cart$.subscribe(
      items => this.cartItems = items
    );
    this.subscriptions.push(cartSub);
  }

  private subscribeToTotal() {
    const totalSub = this.productsService.getCartTotal().subscribe(
      total => this.cartTotal = total
    );
    this.subscriptions.push(totalSub);
  }

  async updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity <= 0) {
      await this.confirmRemoveItem(item);
    } else {
      this.productsService.updateQuantity(item.product.id, newQuantity);
    }
  }

  async confirmRemoveItem(item: CartItem) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: `¿Estás seguro de que quieres eliminar "${item.product.title}" del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.productsService.removeFromCart(item.product.id);
            this.showToast('Producto eliminado del carrito');
          }
        }
      ]
    });

    await alert.present();
  }

  async clearCart() {
    const alert = await this.alertController.create({
      header: 'Vaciar Carrito',
      message: '¿Estás seguro de que quieres eliminar todos los productos del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          role: 'destructive',
          handler: () => {
            this.productsService.clearCart();
            this.showToast('Carrito vaciado');
          }
        }
      ]
    });

    await alert.present();
  }

  async checkout() {
    if (this.cartItems.length === 0) {
      await this.showAlert('Carrito Vacío', 'Agrega productos al carrito antes de proceder al pago.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Proceder al Pago',
      message: `
        <div style="text-align: left;">
          <p><strong>Resumen de tu pedido:</strong></p>
          ${this.cartItems.map(item =>
            `<p>${item.quantity}x ${item.product.title}: $${(item.product.price * item.quantity).toFixed(2)}</p>`
          ).join('')}
          <hr>
          <p><strong>Total: $${this.cartTotal.toFixed(2)}</strong></p>
        </div>
      `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar Pedido',
          handler: () => {
            this.processOrder();
          }
        }
      ]
    });

    await alert.present();
  }

  private async processOrder() {
    // Simular procesamiento de pedido
    await this.showAlert(
      'Pedido Confirmado',
      `¡Gracias por tu compra! Tu pedido por $${this.cartTotal.toFixed(2)} ha sido procesado exitosamente.`
    );

    // Limpiar carrito después del pedido
    this.productsService.clearCart();
  }

  getItemSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  trackByItemId(index: number, item: CartItem): number {
    return item.product.id;
  }
}