import { Component, input, output } from '@angular/core';
import { generateRandomSeed } from '../../../util/random';

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

  visible = true;

  onSeedChange(event: Event): void {
    this.finishChangeSeed.emit((event.target as HTMLInputElement).value);
  }

  onClickRandomizeSeed(): void {
    this.finishChangeSeed.emit(generateRandomSeed());
  }

  onWidthChange(event: Event): void {
    this.finishChangeWidth.emit(parseInt((event.target as HTMLInputElement).value));
  }

  onHeightChange(event: Event): void {
    this.finishChangeHeight.emit(parseInt((event.target as HTMLInputElement).value));
  }

  onRenderPointStarsChange(event: Event): void {
    this.changeRenderPointStars.emit((event.target as HTMLInputElement).checked);
  }

  onRenderStarsChange(event: Event): void {
    this.changeRenderStars.emit((event.target as HTMLInputElement).checked);
  }

  onRenderSunChange(event: Event): void {
    this.changeRenderSun.emit((event.target as HTMLInputElement).checked);
  }

  onRenderNebulaeChange(event: Event): void {
    this.changeRenderNebulae.emit((event.target as HTMLInputElement).checked);
  }

  onShortScaleChange(event: Event): void {
    this.changeShortScale.emit((event.target as HTMLInputElement).checked);
  }
}
