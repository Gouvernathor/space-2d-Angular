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

  downloadCanvas(): void {
    let blobURL: string;

    function downloadFromURL() {
      const a = document.createElement('a');
      a.href = blobURL;
      a.download = 'stars.png';
      a.click();
    }

    this.canvas().toBlob((blob) => {
        if (blob === null) {
          console.error("Failed to extract data from canvas");
          return;
        }

        if (blobURL !== undefined) {
          URL.revokeObjectURL(blobURL);
        }
        blobURL = URL.createObjectURL(blob);
        downloadFromURL();
      },
      'image/webp',
      1.0,
    );
  }

  canCopyCanvas = navigator?.clipboard?.write !== undefined;

  async copyCanvas() {
    for (const mime of ['image/webp', 'image/png']) {
      if (ClipboardItem.supports && !ClipboardItem.supports(mime)) {
        console.log(`Clipboard does not support ${mime}`);
        continue;
      }

      const blob = await new Promise<Blob|null>(resolve => this.canvas().toBlob(resolve, mime, 1.0));
      if (blob === null) {
        console.error("Failed to extract data from canvas");
        return;
      }

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
      } catch (e) {
        console.warn(`Failed to copy canvas as ${mime}: ${e}`);
        continue;
      }
      console.log(`Copied canvas as ${mime} to clipboard`);
      break;
    }
  }
}
