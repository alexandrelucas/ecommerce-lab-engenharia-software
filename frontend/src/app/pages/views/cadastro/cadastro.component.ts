import { Component, OnInit } from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { ClienteService } from 'src/app/shared/services/cliente.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class CadastroComponent implements OnInit {

  public cadastroForm: FormGroup;
  public dadosForm: FormGroup;   
  public endereco: FormGroup;
  public loadData:FormGroup;
  public enderecoValid: boolean;
  public resetEndereco = 0;
  public listaEnderecos = [];
  public cliente: Cliente;
  public clienteComponent = true;
  public storage;

  public dadosCliente;
  public dadosEndereco = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: ClienteService,    
    ) {
    this.cliente = new Cliente();
    this.cliente.endereco = [];
    this.storage = window.localStorage;
  }

  ngOnInit(): void {
    this.cadastroForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmaSenha: ['', Validators.required]
    })

    this.dadosForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      tipoTelefone: ['0', Validators.required],
      telefone: ['', Validators.required],
      sexo: ['0', Validators.required],
      dataNasc: ['', Validators.required],
    });
  }
 
  aplicaCssErro(field, form){  
    let touched = this[form].get(field).touched;
    let isValid = touched ? this[form].get(field).valid ? 'is-valid' : 'is-invalid' : '';
    return field ? isValid : '';
  }

  verificarErro(field){
    const listErros = this.cadastroForm.get(field).errors;
    if(listErros){
      if(listErros['required']){
        return listErros['required'] ? 'Senha obrigatória' : '';
      }
      if(listErros['pattern']){
        return listErros['pattern'] ? 'Senha inválida' : '';
      }
    }
  }
  
  onPasswordChange() {
    if (this.cadastroForm.get('senha').value === this.cadastroForm.get('confirmaSenha').value) {
      this.cadastroForm.get('confirmaSenha').setErrors(null);
    } else {
      this.cadastroForm.get('confirmaSenha').setErrors({ mismatch: true });      
    }
  }

  getDadosEndereco(event){
    if(event.valid){
      this.endereco = event;
    }
    this.enderecoValid = event.valid ? false : true;
  }

  addEndereco(){
    this.resetEndereco += 1;

    if(this.endereco?.valid){
      if(this.endereco.get('id').value){        
        //Alterar
        let idx = this.listaEnderecos.findIndex(lista => lista.id == this.endereco.get('id').value)
        this.listaEnderecos[idx] = this.endereco.value;
      }else{
        //Novo
        const newId = this.listaEnderecos.length + 1;
        this.endereco.patchValue({id: newId});
        this.listaEnderecos.push(this.endereco.value);
      }
    }
  }

  editEndereco(enderecoIdx){
    this.resetEndereco = -1;
    this.loadData = this.listaEnderecos[enderecoIdx];    
  }

  removeEndereco(enderecoIdx){
    this.listaEnderecos.splice(enderecoIdx, 1);
  }

  preparaDados(){
    this.dadosCliente = {
      nome : this.dadosForm.get('nome').value,
      cpf : this.dadosForm.get('cpf').value,
      tipoTelefone : this.dadosForm.get('tipoTelefone').value,
      telefone : this.dadosForm.get('telefone').value,
      sexo : this.dadosForm.get('sexo').value,
      dataNasc : this.dadosForm.get('dataNasc').value,
      email : this.cadastroForm.get('email').value,
      senha : this.cadastroForm.get('senha').value,
    }    
  }

  preparaEndereco(){    
    if(!this.listaEnderecos.length){
      this.dadosEndereco.push({
        descricaoEndereco: this.endereco.get('descricaoEndereco').value, 
        pais: this.endereco.get('pais').value,
        logradouro: this.endereco.get('logradouro').value,
        cep: this.endereco.get('cep').value,
        numero: this.endereco.get('numero').value,
        complemento: this.endereco.get('complemento').value,
        bairro: this.endereco.get('bairro').value,
        cidade: this.endereco.get('cidade').value,
        uf: this.endereco.get('uf').value,
        tipoEnderecoId: this.endereco.get('tipoEnderecoId').value,
        tipoLogradouroId: this.endereco.get('tipoLogradouroId').value,
        tipoResidenciaId: 1
      });
    }else{
      this.listaEnderecos.forEach(e => {
        this.dadosEndereco.push({
          descricaoEndereco: e.descricaoEndereco, 
          pais: e.pais,
          logradouro: e.logradouro,
          cep: e.cep,
          numero: e.numero,
          complemento: e.complemento,
          bairro: e.bairro,
          cidade: e.cidade,
          uf: e.uf,
          tipoEndereco: e.tipoEndereco,
          tipoLogradouro: 1,
          tipoResidencia: 1
        });
      });      
    }
  }

  onSubmit(){
    this.preparaDados();
    this.preparaEndereco();

    console.log(this.dadosCliente)
    console.log(this.dadosEndereco)

    this.service.setCliente(this.dadosCliente).subscribe( (result:any) => {
      this.storage.setItem('clienteId', JSON.stringify(result.message));
      this.dadosEndereco.forEach( e => {
        this.service.setEndereco(result.message, e).subscribe( result => {
        });
      })
      this.router.navigate(['home/produto']);
    });
  }
}
