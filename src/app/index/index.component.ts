import { Component, computed, ElementRef, viewChild } from '@angular/core';
import { GuiComponent, Props } from "./gui/gui.component";
import { generateRandomSeed } from '../../util/random';
import { SceneDirective } from './scene.directive';

@Component({
  selector: 'app-index',
  imports: [GuiComponent, SceneDirective],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class IndexComponent {
  window = window;
  guiWidth = 300;
  marginWidth = 16;
  marginHeight = 16;

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  canvas = computed(() => this.canvasRef().nativeElement);
  scene = viewChild.required(SceneDirective);

  props: Props = {
    renderPointStars: true,
    renderStars: true,
    renderSun: false,
    renderNebulae: true,
    shortScale: false,
    seed: generateRandomSeed() as string,
  };

  ngAfterViewInit(): void {
    this.reflow(window);
    this.renderScene();
  }

  private renderScene() {
    this.scene().render(this.props);
  }

  private resize(width?: number, height?: number): void {
    const canvas = this.canvas();
    if (width !== undefined) {
      canvas.width = width;
    }
    if (height !== undefined) {
      canvas.height = height;
    }
    this.reflow(window);
    this.renderScene();
  }

  private reflow(w: Window): void {
    const canvas = this.canvas();
    const width = canvas.width;
    const height = canvas.height;
    const wAvailable = w.innerWidth - (this.guiWidth + 3*this.marginWidth);
    const hAvailable = w.innerHeight - 2*this.marginHeight;

    if (width/height > wAvailable/hAvailable) {
      canvas.style.left = `${this.guiWidth+2*this.marginWidth}px`;
      canvas.style.width = `${wAvailable}px`;
      const hComputed = wAvailable * height / width;
      canvas.style.height = `${hComputed}px`;
    } else {
      canvas.style.height = `${hAvailable}px`;
      const wComputed = hAvailable * width / height;
      const wCenter = this.guiWidth + 2*this.marginWidth + wAvailable/2;
      canvas.style.left = `${wCenter - wComputed/2}px`;
      canvas.style.width = `${wComputed}px`;
    }
    canvas.style.top = `${this.marginHeight}px`;
  }

  onResize(event: Event): void {
    this.reflow(event.target as Window);
  }

  onChangeProps(props: Partial<Props>): void {
    Object.assign(this.props, props);
    this.renderScene();
  }

  onChangeWidth(width: number): void {
    if (width !== this.canvas().width) {
      this.resize(Math.round(width), undefined);
    }
  }

  onChangeHeight(height: number): void {
    if (height !== this.canvas().height) {
      this.resize(undefined, Math.round(height));
    }
  }
}
