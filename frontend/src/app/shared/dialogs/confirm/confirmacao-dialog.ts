import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'confirmacao-dialog',
    templateUrl: 'confirmacao-dialog.html',
    styleUrls: ['confirmacao-dialog.scss']
})
export class ConfirmacaoDialog {

    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
    onSubmit(){
        this.dialogRef.close(true);
    }
}

