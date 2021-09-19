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
}