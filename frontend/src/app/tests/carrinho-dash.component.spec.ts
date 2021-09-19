import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrinhoDashComponent } from '../pages/views/carrinho/dash/carrinho-dash.component';

describe('CarrinhoDashComponent', () => {
  let component: CarrinhoDashComponent;
  let fixture: ComponentFixture<CarrinhoDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrinhoDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrinhoDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
