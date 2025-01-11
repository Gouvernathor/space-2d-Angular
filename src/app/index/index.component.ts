import { Component, computed, ElementRef, viewChild } from '@angular/core';
import { GuiComponent } from "./gui/gui.component";
import { reflow } from '../../util/index';
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
    this.scene().render(this.props);
    // and then render the gui element
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
    this.scene().render(this.props);
  }

  private reflow(w: Window): void {
    reflow(this.canvas(), {
      wInnerHeight: w.innerHeight, wInnerWidth: w.innerWidth,
      guiWidth: this.guiWidth, marginWidth: this.marginWidth, marginHeight: this.marginHeight,
    });
  }

  onResize(event: Event): void {
    this.reflow(event.target as Window);
  }

  onFinishChangeSeed(seed: string|number|undefined): void {
    this.props.seed = seed;
    this.scene().render(this.props);
  }

  onFinishChangeWidth(width: number): void {
    if (width !== this.canvas().width) {
      this.resize(Math.round(width), undefined);
    }
  }

  onFinishChangeHeight(height: number): void {
    if (height !== this.canvas().height) {
      this.resize(undefined, Math.round(height));
    }
  }

  onChangeRenderPointStars(renderPointStars: boolean): void {
    this.props.renderPointStars = renderPointStars;
    this.scene().render(this.props);
  }

  onChangeRenderStars(renderStars: boolean): void {
    this.props.renderStars = renderStars;
    this.scene().render(this.props);
  }

  onChangeRenderSun(renderSun: boolean): void {
    this.props.renderSun = renderSun;
    this.scene().render(this.props);
  }

  onChangeRenderNebulae(renderNebulae: boolean): void {
    this.props.renderNebulae = renderNebulae;
    this.scene().render(this.props);
  }

  onChangeShortScale(shortScale: boolean): void {
    this.props.shortScale = shortScale;
    this.scene().render(this.props);
  }
}
