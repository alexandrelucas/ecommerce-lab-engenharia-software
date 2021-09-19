import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasComprasComponent } from '../pages/views/minha-conta/minhas-compras/minhas-compras.component';

describe('MinhasComprasComponent', () => {
  let component: MinhasComprasComponent;
  let fixture: ComponentFixture<MinhasComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinhasComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhasComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
