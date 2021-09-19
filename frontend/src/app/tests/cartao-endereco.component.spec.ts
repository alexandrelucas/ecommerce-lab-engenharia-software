import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaoEnderecoComponent } from '../pages/views/carrinho/cartao-endereco/cartao-endereco.component';

describe('CartaoEnderecoComponent', () => {
  let component: CartaoEnderecoComponent;
  let fixture: ComponentFixture<CartaoEnderecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartaoEnderecoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaoEnderecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
