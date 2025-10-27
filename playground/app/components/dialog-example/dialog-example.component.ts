import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';
@Component({
    templateUrl: 'dialog-example.component.html',
    standalone: true,
    imports: [MatButton, FsFormModule]
})
export class DialogExampleComponent {
  dialog = inject(MatDialog);


  open(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });
  }

}
