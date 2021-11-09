import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estoque-dialog',
  templateUrl: './estoque-dialog.component.html',
  styleUrls: ['./estoque-dialog.component.scss']
})
export class EstoqueDialogComponent implements OnInit {

  @Input() produto: any;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close();
  }

}
