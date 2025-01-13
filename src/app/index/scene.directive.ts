import { computed, Directive, ElementRef } from '@angular/core';
import { Props, Scene } from '../../util/scene';

@Directive({
  selector: '[appScene]'
})
export class SceneDirective {
  private scene: Scene;
  public readonly maxTextureSize = computed(() => this.scene.maxTextureSize);
  private canvas = computed(() => this.canvasRef.nativeElement);

  constructor(
    private canvasRef: ElementRef<HTMLCanvasElement>,
  ) {
    this.scene = new Scene(this.canvas);
  }

  render(props: Props): void {
    return this.scene.render(props);
  }
}
