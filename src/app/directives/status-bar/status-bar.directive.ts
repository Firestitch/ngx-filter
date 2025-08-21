import { Directive, TemplateRef } from '@angular/core';


@Directive({
    selector: '[fsFilterStatusBar]',
    standalone: true,
})
export class FilterStatusBarDirective {

  constructor(
    public templateRef: TemplateRef<any>,
  ) { }

}
