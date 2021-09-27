import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('vendas', {static: true}) vendas: ElementRef;
  @ViewChild('trocas', {static: true}) trocas: ElementRef;

  public chart: Chart;

  public cards = [
    { icon: 'fas fa-shopping-cart', background: 'A', title: 'Pedidos recebidos', valorIni: '486', subTitle: 'Pedidos concluídos', valorFin: '351' },
    { icon: 'fas fa-tags', background: 'B', title: 'Vendas totais', valorIni: '1641', subTitle: 'Este mês', valorFin: '213' },
    { icon: 'fas fa-retweet', background: 'C', title: 'Receita', valorIni: 'R$ 12.532,00', subTitle: 'Este mês', valorFin: 'R$ 5.032' },
    { icon: 'fas fa-coins', background: 'D', title: 'Lucro total', valorIni: 'R$ 6.562,00', subTitle: 'Este mês', valorFin: 'R$ 542' },
  ]
  constructor() { }

  ngOnInit(): void {
    new Chart(this.vendas.nativeElement, {
      type: 'line',      
      data: {        
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro"],
        datasets: [
          {
          label: 'Vendas no período',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [32, 29, 35, 41, 56, 28, 34, 36, 29],
          },
          {
            label: 'Lucro acumulado',
            borderColor: '#FFCC00',
            backgroundColor: '#FFCC00',
            data: [26, 39, 38, 44, 61, 19, 26, 34, 31],
            },
        ]
      }
    });

    new Chart(this.trocas.nativeElement, {
      type: 'doughnut',      
      data: {        
        labels: ["Excelente", "Muito Bom", "Regular", "Insatisfatório"],
        datasets: [
          {
            label: 'Vendas no período',
            data: [302, 100, 30, 12],  
            backgroundColor: [
              '#20c997',
              'rgb(54, 162, 235)',            
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
            ],            
            hoverOffset: 4
          }          
        ]        
      },
      options: {
        maintainAspectRatio: false,
      }
    });
  
  }
}
