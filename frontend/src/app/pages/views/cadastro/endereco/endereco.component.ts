import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { listaPaises } from 'src/app/shared/models/paises.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent implements OnInit, OnChanges {

  @Output() dadosEndereco = new EventEmitter();
  @Input() resetEndereco = 0;
  @Input() loadData;
  public enderecoForm: FormGroup;
  public countryList: Array<String>;
  public tipoEndereco = [];
  public tipoLogradouro = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private servico: SandBoxService
  ) { }

  ngOnInit(): void {
    this.loadForm();
    this.getTipoEndereco();
    this.getTipoLogradouro();
  }

  getTipoEndereco(){
    this.servico.getTipoEndereco().subscribe( (result:any) => {
      this.tipoEndereco = result.tipoEndereco;
    });
  }
  getTipoLogradouro(){
    this.servico.getTipoLogradouro().subscribe( (result:any) => {
      this.tipoLogradouro = result.tipoLogradouro;
    });
  }

  ngOnChanges(){
    if(this.resetEndereco != -1){
      this.resetForm();
    }
    if(this.loadData && this.resetEndereco == -1){
      this.enderecoForm.patchValue({
        id: this.loadData.id,
        cep: this.loadData.cep,
        numero: this.loadData.numero,
        logradouro: this.loadData.logradouro,
        complemento: this.loadData.complemento,
        bairro: this.loadData.bairro,
        cidade: this.loadData.cidade,
        uf: this.loadData.uf,
        pais: this.loadData.pais,
        descricaoEndereco: this.loadData.descricaoEndereco,
        tipoEnderecoId: this.loadData.tipoEnderecoId,
        tipoLogradouroId: this.loadData.tipoLogradouroId,
      });
      this.onChange();
    }
  }

  loadForm(){
    this.countryList = listaPaises;

    this.enderecoForm = this.formBuilder.group({
      id: [''],
      cep: ['', [Validators.required]],
      numero: ['', Validators.required],
      logradouro: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      pais: ['Brasil', Validators.required],
      descricaoEndereco: ['', Validators.required],
      tipoEnderecoId: ['0', Validators.required],
      tipoLogradouroId: ['0', Validators.required],
    });
  }

  resetForm(){    
    if(this.enderecoForm){
      this.enderecoForm.reset();
      this.loadForm();
    }
  }
 
  aplicaCssErro(field, form){  
    let touched = this[form].get(field).touched;
    let isValid = touched ? this[form].get(field).valid ? 'is-valid' : 'is-invalid' : '';
    return field ? isValid : '';
  }

  verificarErro(field){
    const listErros = this.enderecoForm.get(field).errors;
    if(listErros){
      if(listErros['required']){
        return listErros['required'] ? 'CEP obrigatório' : '';
      }
      if(listErros['pattern']){
        return listErros['pattern'] ? 'CEP inválido' : '';
      }
    }
  }

  onCEPChange() {
    let cep = this.enderecoForm.get('cep');
    if(cep.valid) {
      this.clienteService.getViaCep(cep.value.toString().replace('-','')).subscribe((dados) => {
        this.enderecoForm.get('logradouro').setValue(dados['logradouro']);
        this.enderecoForm.get('cidade').setValue(dados['localidade']);
        this.enderecoForm.get('bairro').setValue(dados['bairro']);
        this.enderecoForm.get('complemento').setValue(dados['complemento']);
        this.enderecoForm.get('uf').setValue(dados['uf']);
      });
    }
  }

  onChange(){    
    this.dadosEndereco.emit(this.enderecoForm);
  }  
}
