import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsFilterStatusBar]',
})
export class FilterStatusBarDirective {

  constructor(
    public templateRef: TemplateRef<any>,
  ) { }

}
