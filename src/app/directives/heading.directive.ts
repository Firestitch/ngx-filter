import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsFilterHeading]',
  standalone: true,
})
export class FilterHeadingDirective {

  constructor(
    public templateRef: TemplateRef<any>,
  ) { }

}
