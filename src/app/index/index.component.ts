import { Component, ElementRef, viewChild } from '@angular/core';
import { GuiComponent } from "./gui/gui.component";
import { reflow } from '../../util/index';

@Component({
  selector: 'app-index',
  imports: [GuiComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class IndexComponent {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  window = window;
  guiWidth = 300;
  marginWidth = 16;
  marginHeight = 16;

  ngOnInit(): void {
    this.reflow(window);
  }

  onResize(event: Event): void {
    this.reflow(event.target as Window);
  }

  private reflow(w: Window): void {
    reflow(this.canvas().nativeElement, {
      wInnerHeight: w.innerHeight, wInnerWidth: w.innerWidth,
      guiWidth: this.guiWidth, marginWidth: this.marginWidth, marginHeight: this.marginHeight,
    });
  }

  private resize(width?: number, height?: number): void {
    const canvas = this.canvas().nativeElement;
    if (width !== undefined) {
      canvas.width = width;
    }
    if (height !== undefined) {
      canvas.height = height;
    }
    this.reflow(window);
    // scene.render(props);
  }
}
