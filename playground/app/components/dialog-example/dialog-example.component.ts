import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  templateUrl: 'dialog-example.component.html'
})
export class DialogExampleComponent {

  constructor(public dialog: MatDialog) {}

  open(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });
  }

}
