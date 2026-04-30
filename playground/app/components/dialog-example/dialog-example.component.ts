import { Component, inject } from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { FsFormModule } from '@firestitch/form';

import { DialogComponent } from '../dialog/dialog.component';
@Component({
  templateUrl: './dialog-example.component.html',
  standalone: true,
  imports: [MatButton, FsFormModule],
})
export class DialogExampleComponent {
 
  public dialog = inject(MatDialog);


  public open(): void {
    this.dialog.open(DialogComponent, {
      width: '250px',
    });
  }

}
