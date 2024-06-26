import { Injectable, inject } from '@angular/core';
import { ProductCart } from 'src/app/models/productCart.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  productsCart: ProductCart[] = [];
  utilsSvc = inject(UtilsService);

  addProductCart(products: ProductCart) {
    const existingProduct = this.productsCart.find(p => p.id === products.id);
    if (existingProduct) {
      existingProduct.quantity += 1; // Sumar +1 a la cantidad de productos agregados
    } else {
      this.productsCart.push(products);
    }

    this.utilsSvc.presentToast({
      message: 'Producto agregado exitosamente',
      duration: 500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    })
  }

  getCart() {
    return this.productsCart;
  }

  removeProduct(productId: string) {
    this.productsCart = this.productsCart.filter(p => p.id != productId);
  }

  clearCart() {
    this.productsCart = [];
  }

  getTotal() {
    return this.productsCart.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  getTotalOrder(priceUni: string, quantity: string) {
    let pt = parseInt(priceUni);
    let qu = parseInt(quantity);
    return (pt * qu);
  }


  constructor() { }
}
