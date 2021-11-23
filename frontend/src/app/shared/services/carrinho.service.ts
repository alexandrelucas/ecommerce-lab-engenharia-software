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

  validaCupom(idCupom, idCliente){
    return this.http.get(this.baseUrl + `/cupom/validar?codigo=${idCupom}&clienteId=${idCliente}`)
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
  deleteProduto(idProduto){    
    return this.http.delete(this.baseUrl + `/produto/${idProduto}`);
  }
  setProduto(produto){    
    delete produto.id;
    return this.http.post(this.baseUrl + `/produto/`, produto);
  }
  updateProduto(idProduto, produto){
    return this.http.put(this.baseUrl + `/produto/${idProduto}`, produto);
  }  

  /* ESTOQUE */
  retirarEstoqueProduto(idProduto){
    return this.http.delete(this.baseUrl + `/estoque/${idProduto}`);
  }
  addEstoqueProduto(produto) {
    return this.http.post(this.baseUrl + '/estoque/', produto);
  }  
  getEstoqueProduto(idProduto){
    return this.http.get(this.baseUrl + `/estoque/${idProduto}`);
  }
  getEstoque(){
    return this.http.get(this.baseUrl + `/estoque`);
  }  
  darBaixaEstoque(produtoId, quantidade){    
    return this.http.put(this.baseUrl + `/estoque/${produtoId}`, quantidade);
  }
  inativarProduto(produto){
    return this.http.post(this.baseUrl + `/estoque/inativar`, produto)
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
  setStatusTrocaProduto(idPedido, idProduto, status){
    return this.http.put(this.baseUrl + `/pedido/${idPedido}/produto/${idProduto}`, status)
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

  // Rejeitar Venda
  rejeitarVenda(pedidoId){
    return this.http.post(this.baseUrl + `/venda/rejeitar`, {
      pedidoId: pedidoId
    });
  }
    
  /** VENDAS */
  getListaVendas(){
    return this.http.get(this.baseUrl + `/venda/todos`);
  }  

  /** TROCAS */
  getListaTrocas(){
    return this.http.get(this.baseUrl + `/troca/todos`);
  } 
  gerarCupomCliente(cupom){
    console.log(cupom)    

    return this.http.post(this.baseUrl + `/troca/gerarCupom`, cupom);
  }


  /** DASHBOARD - GRAFICO */
  getDashboard() {
    return this.http.get(this.baseUrl + `/dashboard`);
  }

  filtrarGrafico(filtro: any) {
    return this.http.put(this.baseUrl + '/dashboard/filtro', filtro);
  }
}