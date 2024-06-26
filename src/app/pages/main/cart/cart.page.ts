import { Component, OnInit, inject } from '@angular/core';
import { ProductCart } from 'src/app/models/productCart.model';
import { CartService } from 'src/app/services/cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart: ProductCart[] = [];

  constructor(private CartService: CartService) {
    this.cart = this.CartService.getCart();
  }

  removeProduct(productId: string) {
    this.CartService.removeProduct(productId);
    this.cart = this.CartService.getCart();
  }

  getTotal() {
    return this.CartService.getTotal();
  }

  clearCart() {
    this.CartService.clearCart();
    this.cart = [];
  }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  // ============ Datos del usuario ==================
  user = {} as User;
  ngOnInit() {
    this.user = this.utilsSvc.getFormLocalStorage('user');
  }

  // =================== Formulario a enviar ==============
  formOrder = new FormGroup({
    id: new FormControl(''),
    idUser: new FormControl(this.utilsSvc.getFormLocalStorage('user').uid),
    status: new FormControl('1'),
    priceTotal: new FormControl(this.CartService.getTotal()),
    idProduct1: new FormControl(''),
    quantity1: new FormControl('0'),
    priceUni1: new FormControl('0'),
    idProduct2: new FormControl(''),
    quantity2: new FormControl('0'),
    priceUni2: new FormControl('0'),
    idProduct3: new FormControl(''),
    quantity3: new FormControl('0'),
    priceUni3: new FormControl('0'),
    idProduct4: new FormControl(''),
    quantity4: new FormControl('0'),
    priceUni4: new FormControl('0'),
    idProduct5: new FormControl(''),
    quantity5: new FormControl('0'),
    priceUni5: new FormControl('0')
  });

  // ============ Crear Pedido ==================
  async addOrder() {

    // =================== Validar que no facture más de 5 productos
    if (this.cart.length > 5) {
      this.utilsSvc.presentToast({
        message: 'Solo se puede realizar pedido con máximo 5 Productos',
        duration: 3000,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
      return;
    }

    // =================== Validar que el carrito no este vacío 
    if (this.cart.length < 1) {
      this.utilsSvc.presentToast({
        message: 'No hay productos agregados',
        duration: 3000,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
      return;
    }

    // ================= Iterar productos agregados al carrito ==================
    this.cart.forEach((product, key) => {

      // Datos del producto 1
      if(key == 0){
        this.formOrder.value.idProduct1 = product.id;
        this.formOrder.value.priceUni1 =  product.price.toString();
        this.formOrder.value.quantity1 =  product.quantity.toString();
      }
      // Datos del producto 2
      if(key == 1){
        this.formOrder.value.idProduct2 = product.id;
        this.formOrder.value.priceUni2 =  product.price.toString();
        this.formOrder.value.quantity2 =  product.quantity.toString();
      }
      // Datos del producto 3
      if(key == 2){
        this.formOrder.value.idProduct3 = product.id;
        this.formOrder.value.priceUni3 =  product.price.toString();
        this.formOrder.value.quantity3 =  product.quantity.toString();
      }
      // Datos del producto 4
      if(key == 3){
        this.formOrder.value.idProduct4 = product.id;
        this.formOrder.value.priceUni4 =  product.price.toString();
        this.formOrder.value.quantity4 =  product.quantity.toString();
      }
      // Datos del producto 5
      if(key == 4){
        this.formOrder.value.idProduct5 = product.id;
        this.formOrder.value.priceUni5 =  product.price.toString();
        this.formOrder.value.quantity5 =  product.quantity.toString();
      }
    });

    let path = `user/${this.user.uid}/order`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.formOrder.value.id;

    this.firebaseSvc.addDocument(path, this.formOrder.value).then(async res => {
      this.utilsSvc.routerLink('/main/order');
      this.formOrder.reset();
      this.utilsSvc.presentToast({
        message: 'Pedido creado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
  }




}
