import { Directive, TemplateRef, inject } from '@angular/core';


@Directive({
  selector: '[fsFilterHeading]',
  standalone: true,
})
export class FilterHeadingDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);

}
