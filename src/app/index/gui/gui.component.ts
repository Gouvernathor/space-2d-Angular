import { Component, input, output } from '@angular/core';
import { generateRandomSeed } from '../../../util/random';

export type Props = {
  seed: string;
  renderPointStars: boolean;
  renderStars: boolean;
  renderSun: boolean;
  renderNebulae: boolean;
  shortScale: boolean;
}

@Component({
  selector: 'app-gui',
  imports: [],
  templateUrl: './gui.component.html',
  styleUrl: './gui.component.scss'
})
export class GuiComponent {
  readonly props = input.required<Readonly<Props>>();
  readonly maxTextureSize = input.required<number>();
  readonly width = input.required<number>();
  readonly height = input.required<number>();

  // Emits *updates* to the props
  readonly changeProps = output<Partial<Props>>();
  readonly changeWidth = output<number>();
  readonly changeHeight = output<number>();

  visible = true;

  onChangeSeed(event: Event): void {
    this.changeProps.emit({seed: (event.target as HTMLInputElement).value});
  }

  onSeedClickRandomize(): void {
    this.changeProps.emit({seed: generateRandomSeed()});
  }

  onChangeWidth(event: Event): void {
    this.changeWidth.emit(parseInt((event.target as HTMLInputElement).value));
  }

  onChangeHeight(event: Event): void {
    this.changeHeight.emit(parseInt((event.target as HTMLInputElement).value));
  }

  onChangeRenderPointStars(event: Event): void {
    this.changeProps.emit({renderPointStars: (event.target as HTMLInputElement).checked});
  }

  onChangeRenderStars(event: Event): void {
    this.changeProps.emit({renderStars: (event.target as HTMLInputElement).checked});
  }

  onChangeRenderSun(event: Event): void {
    this.changeProps.emit({renderSun: (event.target as HTMLInputElement).checked});
  }

  onChangeRenderNebulae(event: Event): void {
    this.changeProps.emit({renderNebulae: (event.target as HTMLInputElement).checked});
  }

  onChangeShortScale(event: Event): void {
    this.changeProps.emit({shortScale: (event.target as HTMLInputElement).checked});
  }
}
