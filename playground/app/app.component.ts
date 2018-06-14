import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: [`
     .examples {
       height: 1000px;
     }
  `],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
