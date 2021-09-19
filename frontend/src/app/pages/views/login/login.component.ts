import { Route } from '@angular/compiler/src/core';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/shared/services/cliente.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  storage: Storage;

  constructor(private cliente: ClienteService, private formBuilder: FormBuilder, private route: Router) {
    this.storage = window.localStorage;
  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'senha': ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
    });
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.cliente.login(this.loginForm.get('email').value, this.loginForm.get('senha').value).subscribe((result: any) => {

        if(result.result) {
          this.storage.setItem('clienteId', JSON.stringify([...result.result.toString()]))
        this.route.navigate(['home/produto']);
        } else {
          console.log(result.message);
        }
        
      });
    }
  }

}
