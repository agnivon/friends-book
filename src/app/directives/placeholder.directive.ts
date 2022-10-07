import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appLoading]'
})
export class PlaceholderDirective {

  @Input() appLoading: boolean | string = false;

  constructor(private el: ElementRef) { 
  }

  ngOnChanges() {
    if(this.appLoading) {
      this.el.nativeElement.classList.add('placeholder');
    } else {
      this.el.nativeElement.classList.remove('placeholder');
    }
  }

}
