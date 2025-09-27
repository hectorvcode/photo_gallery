import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, CartItem, Category } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = 'https://fakestoreapi.com';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar carrito del localStorage al inicializar
    this.loadCartFromStorage();
  }

  // Obtener todos los productos
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // Obtener producto por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // Obtener productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`);
  }

  // Obtener todas las categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`).pipe(
      map(categories => categories.map(cat => ({
        name: cat,
        displayName: this.getCategoryDisplayName(cat)
      })))
    );
  }

  // Obtener productos limitados
  getLimitedProducts(limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?limit=${limit}`);
  }

  // Buscar productos por título
  searchProducts(query: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products =>
        products.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  // =============== FUNCIONALIDADES DEL CARRITO ===============

  // Agregar producto al carrito
  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ product, quantity });
    }

    this.updateCart(currentCart);
  }

  // Remover producto del carrito
  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value.filter(item => item.product.id !== productId);
    this.updateCart(currentCart);
  }

  // Actualizar cantidad de producto en carrito
  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(item => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart(currentCart);
      }
    }
  }

  // Limpiar carrito
  clearCart(): void {
    this.updateCart([]);
  }

  // Obtener total del carrito
  getCartTotal(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
    );
  }

  // Obtener cantidad total de items en carrito
  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  // Verificar si producto está en carrito
  isInCart(productId: number): Observable<boolean> {
    return this.cart$.pipe(
      map(items => items.some(item => item.product.id === productId))
    );
  }

  // =============== MÉTODOS PRIVADOS ===============

  private updateCart(cart: CartItem[]): void {
    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  private saveCartToStorage(cart: CartItem[]): void {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart) as CartItem[];
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'Electrónicos',
      'jewelery': 'Joyería',
      'men\'s clothing': 'Ropa Hombre',
      'women\'s clothing': 'Ropa Mujer'
    };
    return categoryMap[category] || category;
  }
}