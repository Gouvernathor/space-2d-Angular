import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-gui',
  imports: [],
  templateUrl: './gui.component.html',
  styleUrl: './gui.component.scss'
})
export class GuiComponent {
  readonly seed = input.required<string>();
  readonly maxTextureSize = input.required<unknown>();
  readonly width = input.required<number>();
  readonly height = input.required<number>();
  readonly renderPointStars = input.required<boolean>();
  readonly renderStars = input.required<boolean>();
  readonly renderSun = input.required<boolean>();
  readonly renderNebulae = input.required<boolean>();
  readonly shortScale = input.required<boolean>();

  readonly finishChangeSeed = output<string>();
  readonly finishChangeWidth = output<number>();
  readonly finishChangeHeight = output<number>();
  readonly changeRenderPointStars = output<boolean>();
  readonly changeRenderStars = output<boolean>();
  readonly changeRenderSun = output<boolean>();
  readonly changeRenderNebulae = output<boolean>();
  readonly changeShortScale = output<boolean>();

  onSeedChange(event: Event): void {
    this.finishChangeSeed.emit((event.target as HTMLInputElement).value);
  }
}
