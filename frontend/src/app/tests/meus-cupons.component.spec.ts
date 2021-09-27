import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusCuponsComponent } from '../pages/views/minha-conta/meus-cupons/meus-cupons.component';

describe('MeusCuponsComponent', () => {
  let component: MeusCuponsComponent;
  let fixture: ComponentFixture<MeusCuponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeusCuponsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusCuponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
