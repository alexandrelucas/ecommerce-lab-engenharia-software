import { AfterViewChecked, ChangeDetectionStrategy, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { CarrinhoService } from '../carrinho.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-carrinho-dash',
  templateUrl: './carrinho-dash.component.html',
  styleUrls: ['./carrinho-dash.component.scss']
})
export class CarrinhoDashComponent implements OnInit {

  @ViewChild('stepper') private myStepper: MatHorizontalStepper;
  
  constructor(
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.carrinhoService.setControlStepper(this.myStepper)
  }

  setStep(event){    
    this.myStepper.selectedIndex = 2;
  }
}
