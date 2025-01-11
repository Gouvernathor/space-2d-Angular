import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-gui',
  imports: [],
  templateUrl: './gui.component.html',
  styleUrl: './gui.component.scss'
})
export class GuiComponent {
  seed = input<number|string|undefined>(undefined);
  maxTextureSize = input.required<unknown>();
  width = input.required<number>();
  height = input.required<number>();
  renderPointStars = input.required<boolean>();
  renderStars = input.required<boolean>();
  renderSun = input.required<boolean>();
  renderNebulae = input.required<boolean>();
  shortScale = input.required<boolean>();

  finishChangeSeed = output<number|string|undefined>();
  finishChangeWidth = output<number>();
  finishChangeHeight = output<number>();
  changeRenderPointStars = output<boolean>();
  changeRenderStars = output<boolean>();
  changeRenderSun = output<boolean>();
  changeRenderNebulae = output<boolean>();
  changeShortScale = output<boolean>();
}
