import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ListaClienteComponent } from './lista-cliente/lista-cliente.component';
import {MatTableModule} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CuponsComponent } from './cupons/cupons.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetalhesPedidoComponent } from './pedidos/detalhes-pedido/detalhes-pedido.component';
import { CadastrarCupomComponent } from './cupons/cadastrar-cupom/cadastrar-cupom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [AdminComponent, ListaClienteComponent, DashboardComponent, CuponsComponent, ConfiguracoesComponent, PedidosComponent, DetalhesPedidoComponent, CadastrarCupomComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
