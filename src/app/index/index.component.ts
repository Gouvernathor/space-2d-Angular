import { Component, computed, ElementRef, viewChild } from '@angular/core';
import { Props } from '@gouvernathor/space-2d';
import { GuiComponent } from "./gui/gui.component";
import { generateRandomSeed } from '../../util/random';
import { SceneDirective } from './scene.directive';

const blobMimes = ['image/webp', 'image/png'];

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
    scale: null!, // set in ngOnInit
    seed: generateRandomSeed() as string,
  };

  blobMap: Map<string, Blob> = new Map();

  ngOnInit(): void {
    const width = this.canvas().width = window.innerWidth-(this.guiWidth+3*this.marginWidth);
    const height = this.canvas().height = window.innerHeight-(2*this.marginHeight);
    this.props.scale = Math.max(width, height);
  }

  ngAfterViewInit(): void {
    this.reflow(window);
    this.renderScene();
  }

  private renderScene() {
    this.scene().render(this.props);

    const blobMap = this.blobMap = new Map(); // previous blob generations fill a dereferenced map object
    Promise.all(blobMimes.map(mime => {
      return new Promise<void>(resolve => {
        this.canvas().toBlob(blob => {
          if (blob === null) {
            console.warn(`Failed to extract data as ${mime} from canvas`);
          } else {
            // console.log(`${mime} canvas size: ${blob.size}`);
            blobMap.set(mime, blob);
          }
          resolve();
        }, mime, 1.);
      });
    }));
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

  private blobURL?: string;

  async downloadCanvas() {
    const mime = blobMimes.find(mime => this.blobMap.has(mime));
    if (mime === undefined) {
      console.warn('No blobs available to download');
      return;
    }
    const blob = this.blobMap.get(mime)!;
    const extension = mime.split('/').at(-1);

    if (this.blobURL !== undefined) {
      URL.revokeObjectURL(this.blobURL);
    }
    this.blobURL = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = this.blobURL;
    a.download = `stars.${extension}`; // though Firefox will fix the extension anyway
    a.click();
  }

  canCopyCanvas = navigator?.clipboard?.write !== undefined;

  async copyCanvas() {
    for (const mime of blobMimes) {
      if (ClipboardItem.supports && !ClipboardItem.supports(mime)) {
        console.log(`Clipboard does not support ${mime}`);
        continue;
      }

      if (!this.blobMap.has(mime)) {
        // console.warn(`No ${mime} blob available to copy`);
        continue;
      }

      try {
        const blob = this.blobMap.get(mime)!;
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
      return;
    }

    console.error('No blobs available to copy');
  }
}
