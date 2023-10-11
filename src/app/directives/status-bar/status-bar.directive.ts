import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsFilterStatusBar]',
})
export class FilterStatusBarDirective {

  public constructor(
    public templateRef: TemplateRef<any>,
  ) { }

}
