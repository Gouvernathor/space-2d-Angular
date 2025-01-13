import { Directive, ElementRef } from '@angular/core';
import { Props, Scene } from '@gouvernathor/space-2d';

@Directive({
  selector: '[appScene]'
})
export class SceneDirective {
  private scene: Scene;

  constructor(
    private canvasRef: ElementRef<HTMLCanvasElement>,
  ) {
    this.scene = new Scene(() => this.canvasRef.nativeElement);
  }

  public get maxTextureSize() {
    return this.scene.maxTextureSize;
  }

  render(props: Props): void {
    return this.scene.render(props);
  }
}
