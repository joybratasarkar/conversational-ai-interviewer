import { ChangeDetectorRef, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[scroll-to-bottom]'
})
export class ScrollToBottomDirective {
  constructor(private _el: ElementRef, private cdr: ChangeDetectorRef) { }

  public ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  public scrollToBottom(): void {
    const el: HTMLDivElement = this?._el?.nativeElement;
    setTimeout(() => {
      el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
      this.cdr.detectChanges(); 
    }, 0);
  }
}