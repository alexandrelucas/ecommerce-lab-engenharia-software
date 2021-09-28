import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Endereco } from 'src/app/shared/models/endereco.model';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent implements OnInit {

  @Input() endereco: Endereco;
  public formEndereco: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadEndereco();
  }

  loadEndereco(){
    this.formEndereco = this.formBuilder.group({
      id: [this.endereco.id],
      cep: [this.endereco.cep, [Validators.required]],
      numero: [this.endereco.numero, Validators.required],
      logradouro: [this.endereco.logradouro, Validators.required],
      complemento: [this.endereco.complemento],
      bairro: [this.endereco.bairro, Validators.required],
      cidade: [this.endereco.cidade, Validators.required],
      uf: [this.endereco.uf, Validators.required],
      paisId: [1, Validators.required],
      descricaoEndereco: ['Casa', Validators.required],
      tipoEnderecoId: [2, Validators.required],
      tipoLogradouroId: [2, Validators.required]
    });
  }  

  closeModal(){
    this.activeModal.close(this.formEndereco.value);
  }
}
