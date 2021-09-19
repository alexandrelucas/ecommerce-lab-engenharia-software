import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesPedidoComponent } from '../pages/views/admin/pedidos/detalhes-pedido/detalhes-pedido.component';

describe('DetalhesPedidoComponent', () => {
  let component: DetalhesPedidoComponent;
  let fixture: ComponentFixture<DetalhesPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesPedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
