import { Component, ElementRef, viewChild } from '@angular/core';
import { GuiComponent } from "./gui/gui.component";
import { reflow } from '../../util/index';
import { generateRandomSeed } from '../../util/random';

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

  scene: any;

  props = {
    renderPointStars: true,
    renderStars: true,
    renderSun: true,
    renderNebulae: true,
    shortScale: true,
    seed: generateRandomSeed() as string|number|undefined,
  };

  ngOnInit(): void {
    this.reflow(window);
    // scene.render(this.props);
    // and then render the gui element
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
    // scene.render(this.props);
  }

  private reflow(w: Window): void {
    reflow(this.canvas().nativeElement, {
      wInnerHeight: w.innerHeight, wInnerWidth: w.innerWidth,
      guiWidth: this.guiWidth, marginWidth: this.marginWidth, marginHeight: this.marginHeight,
    });
  }

  onResize(event: Event): void {
    this.reflow(event.target as Window);
  }

  onFinishChangeSeed(seed: string|number|undefined): void {
    this.props.seed = seed;
    // scene.render(this.props);
  }

  onFinishChangeWidth(width: number): void {
    if (width !== this.canvas().nativeElement.width) {
      this.resize(Math.round(width), undefined);
    }
  }

  onFinishChangeHeight(height: number): void {
    if (height !== this.canvas().nativeElement.height) {
      this.resize(undefined, Math.round(height));
    }
  }

  onChangeRenderPointStars(renderPointStars: boolean): void {
    this.props.renderPointStars = renderPointStars;
    // scene.render(this.props);
  }

  onChangeRenderStars(renderStars: boolean): void {
    this.props.renderStars = renderStars;
    // scene.render(this.props);
  }

  onChangeRenderSun(renderSun: boolean): void {
    this.props.renderSun = renderSun;
    // scene.render(this.props);
  }

  onChangeRenderNebulae(renderNebulae: boolean): void {
    this.props.renderNebulae = renderNebulae;
    // scene.render(this.props);
  }

  onChangeShortScale(shortScale: boolean): void {
    this.props.shortScale = shortScale;
    // scene.render(this.props);
  }
}
