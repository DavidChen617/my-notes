import { Component, signal, HostListener, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'sidebar-resize',
  imports: [],
  styleUrl:"./sidebar-resize.component.css",
  template: `
    <div class="flex h-screen overflow-hidden bg-dark-bg">
      <aside
        #asideEl
        class="bg-dark-surface overflow-auto border-r border-dark-border"
        style="width: 250px">
        <ng-content select="[slot-sidebar]"></ng-content>
      </aside>

      <div
        class="relative w-[3px] bg-dark-border cursor-ew-resize select-none hover:bg-dark-text-muted transition-colors group"
        (mousedown)="onMouseDown($event)">
        <div class="absolute top-1/2 -translate-y-1/2 -right-[2px] h-[18px] w-[2px] border-r border-dark-text-muted"></div>
        <div class="absolute top-1/2 -translate-y-1/2 -left-[2px] h-[18px] w-[2px] border-l border-dark-text-muted"></div>
      </div>

      <main class="flex-1 overflow-auto bg-dark-bg p-8">
        <ng-content select="[slot-main]"></ng-content>
      </main>
    </div>
  `,
  styles: ``
})
export class SidebarResizeComponent {
  private asideEl = viewChild<ElementRef<HTMLElement>>('asideEl');

  protected defaultWidth = 250;
  protected minWidth = 30;
  protected maxWidth = 600;

  private resizeData = {
    tracking: false,
    startWidth: 0,
    startCursorScreenX: 0,
    maxWidth: 0
  };

  protected onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    const asideElement = this.asideEl()?.nativeElement;
    if (!asideElement) {
      console.error('Aside element not found');
      return;
    }

    const containerElement = asideElement.parentElement;
    if (!containerElement) {
      console.error('Container element not found');
      return;
    }

    this.resizeData.startWidth = asideElement.offsetWidth;
    this.resizeData.startCursorScreenX = event.screenX;
    this.resizeData.maxWidth = containerElement.clientWidth - 3; // 3px for handle
    this.resizeData.tracking = true;

    console.log('tracking started', this.resizeData.startWidth);
  }

  @HostListener('window:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    if (!this.resizeData.tracking) return;

    const asideElement = this.asideEl()?.nativeElement;
    if (!asideElement) return;

    const cursorDelta = event.screenX - this.resizeData.startCursorScreenX;
    const newWidth = this.resizeData.startWidth + cursorDelta;

    // Clamp between min and max
    const clampedWidth = Math.max(
      this.minWidth,
      Math.min(newWidth, Math.min(this.maxWidth, this.resizeData.maxWidth))
    );

    asideElement.style.width = `${clampedWidth}px`;
  }

  @HostListener('window:mouseup', ['$event'])
  protected onMouseUp(event: MouseEvent): void {
    if (this.resizeData.tracking) {
      this.resizeData.tracking = false;
      console.log('tracking stopped');
    }
  }
}
