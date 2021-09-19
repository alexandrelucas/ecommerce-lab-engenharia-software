import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecoCartaoComponent } from '../pages/views/carrinho/endereco-cartao/endereco-cartao.component';

describe('EnderecoCartaoComponent', () => {
  let component: EnderecoCartaoComponent;
  let fixture: ComponentFixture<EnderecoCartaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnderecoCartaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnderecoCartaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
