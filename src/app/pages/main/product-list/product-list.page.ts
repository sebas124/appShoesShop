import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { orderBy, where } from 'firebase/firestore';
import { ProductCart } from 'src/app/models/productCart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  cartSvc = inject(CartService);

  products: Product[] = [];
  productsCart: ProductCart[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  // ================= Obtener datos del usuario ====================
  user(): User {
    return this.utilsSvc.getFormLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  // ============ Agregar producto al carrito ==============
  addToCart(product: Product) {
    this.cartSvc.addProductCart(product);
  }

  // ============ Obtener Productos ==============
  getProducts() {
    //let path = `user/${this.user().uid}/products`
    let path = `user/caGOmbCPEcbdBSBbjhKG8FgfHDO2/products`

    this.loading = true;

    let query = [
      orderBy('soldUnits', 'desc'),
      //where('soldUnits', '>', 3)
    ];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.products = res;
        this.loading = false;
        sub.unsubscribe();
      }
    })
  }
}
