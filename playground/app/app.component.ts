import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [`
     .examples {
       height: 1000px;
     }
  `],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {
  
  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  } 
}
