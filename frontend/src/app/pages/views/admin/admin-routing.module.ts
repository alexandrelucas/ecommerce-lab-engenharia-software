import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { CuponsComponent } from './cupons/cupons.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EstoqueComponent } from './estoque/estoque.component';
import { ListaClienteComponent } from './lista-cliente/lista-cliente.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { VendasComponent } from './vendas/vendas.component';

const routes: Routes = [
  { 
    path: '', component: AdminComponent, 
    children: [
      {path: '', component: DashboardComponent},
      {path: 'clientes', component: ListaClienteComponent},
      {path: 'pedidos', component: PedidosComponent},
      {path: 'vendas', component:VendasComponent},
      {path: 'cupons', component: CuponsComponent},
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
