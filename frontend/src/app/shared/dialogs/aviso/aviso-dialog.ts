import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'aviso-dialog',
    templateUrl: 'aviso-dialog.html',
    styleUrls: ['aviso-dialog.scss']
})
export class AvisoDialog {

    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }
    
    onSubmit(){
        this.dialogRef.close(true);
    }
}

