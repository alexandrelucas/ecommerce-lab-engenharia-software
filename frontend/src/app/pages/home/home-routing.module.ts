import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [  
  { 
    path: '',
    component: HomeComponent,
    children: [
      { path: '', loadChildren: () => import('../views/produto/produto.module').then( m => m.ProdutoModule) },
      { path: 'cadastro', loadChildren: () => import('../views/cadastro/cadastro.module').then( m => m.CadastroModule) },
      { path: 'login', loadChildren: () => import('../views/login/login.module').then( m => m.LoginModule) },
      { path: 'minha-conta', loadChildren: () => import('../views/minha-conta/minha-conta.module').then( m => m.MinhaContaModule) },
      { path: 'admin', loadChildren: () => import('../views/admin/admin.module').then( m => m.AdminModule) },
      { path: 'carrinho', loadChildren: () => import('../views/carrinho/carrinho.module').then( m => m.CarrinhoModule) }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
