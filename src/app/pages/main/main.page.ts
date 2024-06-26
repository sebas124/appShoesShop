import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline', describe: '1' }, // Se muestra a solo Admin
    { title: 'Inicio', url: '/main/product-list', icon: 'home-outline', describe: '2' }, // Se muestra a solo Clientes
    { title: 'Pedidos', url: '/main/order', icon: 'bag-handle-outline', describe: '0' }, 
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline', describe: '0' },
  ]

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    })
  }

  // ================= Obtener datos del usuario ====================
  user(): User {
    return this.utilsSvc.getFormLocalStorage('user');
  }

  // ========== Cerrar Sesión =============
  signOut() {
    this.firebaseSvc.signOut();
  }
}
