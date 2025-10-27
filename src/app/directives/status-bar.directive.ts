import { Directive, TemplateRef, inject } from '@angular/core';


@Directive({
  selector: '[fsFilterStatusBar]',
  standalone: true,
})
export class FilterStatusBarDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);

}
