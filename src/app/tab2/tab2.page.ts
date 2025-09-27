import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../services/products.service';
import { Product, Category, CartItem } from '../interfaces/product.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';
  isLoading = false;
  cartItemCount = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private productsService: ProductsService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadData();
    this.subscribeToCart();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Cargando productos...',
      spinner: 'circles'
    });
    await loading.present();

    this.isLoading = true;

    try {
      // Cargar productos y categorías en paralelo
      const [products, categories] = await Promise.all([
        this.productsService.getAllProducts().toPromise(),
        this.productsService.getCategories().toPromise()
      ]);

      this.products = products || [];
      this.categories = [{ name: 'all', displayName: 'Todos' }, ...(categories || [])];
      this.filteredProducts = this.products;

    } catch (error) {
      console.error('Error loading data:', error);
      await this.showAlert('Error', 'No se pudieron cargar los productos. Verifica tu conexión a internet.');
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  private subscribeToCart() {
    const cartSub = this.productsService.getCartItemCount().subscribe(
      count => this.cartItemCount = count
    );
    this.subscriptions.push(cartSub);
  }

  onCategoryChange() {
    this.filterProducts();
  }

  onSearchChange() {
    this.filterProducts();
  }

  filterProducts() {
    let filtered = this.products;

    // Filtrar por categoría
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = filtered;
  }

  async addToCart(product: Product) {
    const alert = await this.alertController.create({
      header: 'Agregar al Carrito',
      message: `¿Cuántas unidades de "${product.title}" deseas agregar?`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          value: 1,
          min: 1,
          max: 10
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            const quantity = parseInt(data.quantity) || 1;
            if (quantity > 0) {
              this.productsService.addToCart(product, quantity);
              await this.showToast(`${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito`);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showProductDetails(product: Product) {
    const alert = await this.alertController.create({
      header: product.title,
      message: `
        <div style="text-align: center;">
          <img src="${product.image}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 10px;">
          <p><strong>Precio:</strong> $${product.price}</p>
          <p><strong>Categoría:</strong> ${this.getCategoryDisplayName(product.category)}</p>
          <p><strong>Rating:</strong> ${product.rating.rate} ⭐ (${product.rating.count} reseñas)</p>
          <p style="margin-top: 10px;">${product.description}</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Agregar al Carrito',
          handler: () => {
            this.addToCart(product);
          }
        }
      ]
    });

    await alert.present();
  }

  async refreshProducts(event: any) {
    try {
      const products = await this.productsService.getAllProducts().toPromise();
      this.products = products || [];
      this.filterProducts();
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      event.target.complete();
    }
  }

  getCategoryDisplayName(category: string): string {
    const categoryObj = this.categories.find(cat => cat.name === category);
    return categoryObj ? categoryObj.displayName : category;
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

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}