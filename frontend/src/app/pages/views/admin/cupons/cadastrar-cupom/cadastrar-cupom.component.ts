import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Cupom from 'src/app/shared/models/cupom.model';

@Component({
  selector: 'app-cadastrar-cupom',
  templateUrl: './cadastrar-cupom.component.html',
  styleUrls: ['./cadastrar-cupom.component.scss']
})
export class CadastrarCupomComponent implements OnInit {
  public cupomForm: FormGroup;
  @Input() cupom: Cupom;

  constructor(private formBuilder: FormBuilder, private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if(!this.cupom) this.cupom = new Cupom();

    this.cupomForm = this.formBuilder.group({
      id: [this.cupom.id ?? undefined],
      tipoCupom: [this.cupom.tipoCupom ?? '', Validators.required],
      codigo: [this.cupom.codigo ?? '', Validators.required],
      valorDesconto: [this.cupom?.valorDesconto ?? '', [Validators.required]],
      validade: [this.cupom?.validade ?? '', Validators.required],
      ativo: [this.cupom.ativo ?? true, Validators.required]
    });
    console.log(this.cupomForm.get('ativo'))
  }

  closeModal(){
    if(this.cupomForm.valid) {
      console.log(this.cupomForm.value);
      this.activeModal.close(this.cupomForm.value);
    }
  }

}
