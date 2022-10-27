import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appLoading]'
})
export class PlaceholderDirective {

  @Input() appLoading: any = false;

  constructor(private el: ElementRef) {
  }

  ngOnChanges() {
    // console.log(this.el, this.appLoading);
    if (this.appLoading === '' ||
      this.appLoading === null ||
      this.appLoading === undefined ||
      this.appLoading === true) {
      this.el.nativeElement.classList.add('placeholder');
    } else {
      this.el.nativeElement.classList.remove('placeholder');
    }
  }

}
