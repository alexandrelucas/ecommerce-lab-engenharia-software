import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListaClienteComponent } from './lista-cliente/lista-cliente.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { VendasComponent } from './vendas/vendas.component';
import { TrocasComponent } from './trocas/trocas.component';
import { CuponsComponent } from './cupons/cupons.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { EstoqueComponent } from './estoque/estoque.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';

const routes: Routes = [
  { 
    path: '', component: AdminComponent, 
    children: [
      {path: '', component: DashboardComponent},
      {path: 'clientes', component: ListaClienteComponent},
      {path: 'pedidos', component: PedidosComponent},
      {path: 'vendas', component:VendasComponent},
      {path: 'trocas', component:TrocasComponent},
      {path: 'cupons', component: CuponsComponent},
      {path: 'produtos', component:ProdutosComponent},
      {path: 'estoque', component:EstoqueComponent},
      {path: 'configuracoes', component: ConfiguracoesComponent}
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
