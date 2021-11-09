import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ListaClienteComponent } from './lista-cliente/lista-cliente.component';
import { MatTableModule } from '@angular/material/table';
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
import { EstoqueComponent } from './estoque/estoque.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VendasComponent } from './vendas/vendas.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { TrocasComponent } from './trocas/trocas.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { CadastroProdutoComponent } from './produtos/dialog/cadastro-produto.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EstoqueDialogComponent } from './produtos/estoque-dialog/estoque-dialog.component';

@NgModule({
  declarations: [AdminComponent, ListaClienteComponent, DashboardComponent, CuponsComponent, ConfiguracoesComponent, PedidosComponent, DetalhesPedidoComponent, CadastrarCupomComponent, EstoqueComponent, VendasComponent, TrocasComponent, ProdutosComponent, CadastroProdutoComponent, EstoqueDialogComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    MatStepperModule,
    MatDatepickerModule,    
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }]
})
export class AdminModule { }
