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

  readonly changeSeed = output<string>();
  readonly changeWidth = output<number>();
  readonly changeHeight = output<number>();
  readonly changeRenderPointStars = output<boolean>();
  readonly changeRenderStars = output<boolean>();
  readonly changeRenderSun = output<boolean>();
  readonly changeRenderNebulae = output<boolean>();
  readonly changeShortScale = output<boolean>();

  visible = true;

  onChangeSeed(event: Event): void {
    this.changeSeed.emit((event.target as HTMLInputElement).value);
  }

  onzeSeedClickRandomi(): void {
    this.changeSeed.emit(generateRandomSeed());
  }

  onChangeWidth(event: Event): void {
    this.changeWidth.emit(parseInt((event.target as HTMLInputElement).value));
  }

  onChangeHeight(event: Event): void {
    this.changeHeight.emit(parseInt((event.target as HTMLInputElement).value));
  }

  onChangeRenderPointStars(event: Event): void {
    this.changeRenderPointStars.emit((event.target as HTMLInputElement).checked);
  }

  onChangeRenderStars(event: Event): void {
    this.changeRenderStars.emit((event.target as HTMLInputElement).checked);
  }

  onChangeRenderSun(event: Event): void {
    this.changeRenderSun.emit((event.target as HTMLInputElement).checked);
  }

  onChangeRenderNebulae(event: Event): void {
    this.changeRenderNebulae.emit((event.target as HTMLInputElement).checked);
  }

  onChangeShortScale(event: Event): void {
    this.changeShortScale.emit((event.target as HTMLInputElement).checked);
  }
}
