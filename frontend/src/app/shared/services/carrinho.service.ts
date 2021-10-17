import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SandBoxService {

  private baseUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { } 

  calculaFrete(cep){
    return this.http.get(`https://sandbox.melhorenvio.com.br/api/v2/calculator?from=01001000&to=${cep}&width=12&weight=0,3&height=0,2&length=17&insurance_value=500&services=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17`);
  }

  validaCupom(idCupom){
    return this.http.get(this.baseUrl + `/cupom/validar?codigo=${idCupom}`)
  }

  /* PRODUTOS */
  getListaProdutos(){
    return this.http.get(this.baseUrl + `/produto`);
  }
  getProduto(idProduto){
    return this.http.get(this.baseUrl + `/produto/${idProduto}`);
  }
  getListaCategorias(){
    return this.http.get(this.baseUrl + `/produto/categoria/`);
  }

  /* ESTOQUE */
  getEstoqueProduto(idProduto){
    return this.http.get(this.baseUrl + `/estoque/${idProduto}`);
  }
  getEstoque(){
    return this.http.get(this.baseUrl + `/estoque`);
  }  
  

  /* CUPOM */
  getCupom(){
    return this.http.get(this.baseUrl + `/cupom/todos`);
  }
  getCupomCliente(idCliente){
    return this.http.get(this.baseUrl + `/cupom/cliente/${idCliente}`);
  }
  setCupom(cupom){    
    delete cupom.ativo;
    delete cupom.id;
    return this.http.post(this.baseUrl + `/cupom/`, cupom);
  }
  deleteCupom(idCupom){
    return this.http.delete(this.baseUrl + `/cupom/${idCupom}`);
  }
  updateCupom(idCupom, cupom){    
    delete cupom.ativo;
    return this.http.put(this.baseUrl + `/cupom/${idCupom}`, cupom);
  }
 

  /* TIPOS */
  getTipoTelefone(){
    return this.http.get(this.baseUrl + `/tipo/telefone`);
  }
  getTipoEndereco(){
    return this.http.get(this.baseUrl + `/tipo/endereco`);
  }
  getTipoResidencia(){
    return this.http.get(this.baseUrl + `/tipo/residencia`);
  }
  getTipoLogradouro(){
    return this.http.get(this.baseUrl + `/tipo/logradouro`);
  }

  /** PEDIDOS */
  setPedido(dadosPedido){
    return this.http.post(this.baseUrl + `/pedido/`, dadosPedido);
  }
  getPedido(idPedido){
    return this.http.get(this.baseUrl + `/pedido/${idPedido}`);
  }
  getListaPedidos(){
    return this.http.get(this.baseUrl + `/pedido/todos`);
  }
  getPedidosMinhasCompras(idCliente){
    return this.http.get(this.baseUrl + `/pedido/cliente/${idCliente}`);
  }
  setStatusPedido(idPedido, status){
    return this.http.put(this.baseUrl + `/pedido/${idPedido}`, status);
  }

  /** PAIS */
  getListaPaises(){
    return this.http.get(this.baseUrl + `/pais`);
  }
  
  /** AUTORIZAR VENDA */
  autorizarVenda(pedidoId){
    return this.http.post(this.baseUrl + `/venda/autorizar`, {
      pedidoId: pedidoId
    });
  }
    
  /** VENDAS */
  getListaVendas(){
    return this.http.get(this.baseUrl + `/venda/todos`);
  }  
}