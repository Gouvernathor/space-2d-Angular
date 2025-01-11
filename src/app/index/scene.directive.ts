import { Directive, ElementRef, input } from '@angular/core';

@Directive({
  selector: '[appScene]'
})
export class SceneDirective {
  maxTextureSize!: number;

  constructor(
    private el: ElementRef<HTMLCanvasElement>,
  ) { }

  render(props: any): void {
    // TODO
  }
}
