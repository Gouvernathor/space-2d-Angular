import { computed, Directive, ElementRef } from '@angular/core';
import REGL from 'regl';
import RNG from '@gouvernathor/rng';
import * as pointStars from '../../util/point-stars';
import * as star from '../../util/star';
import * as nebula from '../../util/nebula';
import * as copy from '../../util/copy';

@Directive({
  selector: '[appScene]'
})
export class SceneDirective {
  private regl: REGL.Regl;
  private pointStarTexture: REGL.Texture2D;
  private ping: REGL.Framebuffer2D;
  private pong: REGL.Framebuffer2D;
  private starRenderer: REGL.DrawCommand;
  private nebulaRenderer: REGL.DrawCommand;
  private copyRenderer: REGL.DrawCommand;
  private lastWidth: number|null;
  private lastHeight: number|null;
  public readonly maxTextureSize: number;

  private canvas = computed(() => this.canvasRef.nativeElement);

  constructor(
    private canvasRef: ElementRef<HTMLCanvasElement>,
  ) {
    const regl = this.regl = REGL({canvas: this.canvas()});
    this.pointStarTexture = regl.texture();
    this.ping = regl.framebuffer({color: regl.texture(), depth: false, stencil: false, depthStencil: false});
    this.pong = regl.framebuffer({color: regl.texture(), depth: false, stencil: false, depthStencil: false});
    this.starRenderer = star.createRenderer(regl);
    this.nebulaRenderer = nebula.createRenderer(regl);
    this.copyRenderer = copy.createRenderer(regl);
    this.lastWidth = null;
    this.lastHeight = null;
    this.maxTextureSize = regl.limits.maxTextureSize;
  }

  render(props: any): void {
    const ping = this.ping;
    const pong = this.pong;
    const regl = this.regl;

    const width = this.canvas().width;
    const height = this.canvas().height;
    const viewport = { x: 0, y: 0, width, height };
    const scale = props.shortScale ? Math.min(width, height) : Math.max(width, height);
    if (width !== this.lastWidth || height !== this.lastHeight) {
      ping.resize(width, height);
      pong.resize(width, height);
      this.lastWidth = width;
      this.lastHeight = height;
    }

    regl({ framebuffer: ping })( () => {
      regl.clear({color: [0,0,0,1]});
    });
    regl({ framebuffer: pong })( () => {
      regl.clear({color: [0,0,0,1]});
    });

    let rand = new RNG(props.seed+(0).toString(36));
    if (props.renderPointStars) {
      let data = pointStars.generateTexture(width, height, 0.05, 0.125, rand);
      this.pointStarTexture({
        format: 'rgb',
        width,
        height,
        wrapS: 'clamp',
        wrapT: 'clamp',
        data,
      });
      this.copyRenderer({
        source: this.pointStarTexture,
        destination: ping,
        viewport,
      });
    }

    rand = new RNG(props.seed+(1).toString(36));
    let nebulaCount = 0;
    if (props.renderNebulae) nebulaCount = Math.round(rand.random() * 4 + 1);
    let nebulaOut = this.pingPong(ping, ping, pong, nebulaCount, (source, destination) => {
      this.nebulaRenderer({
        source,
        destination,
        offset: [rand.random() * 100, rand.random() * 100],
        scale: (rand.random() * 2 + 1) / scale,
        color: [rand.random(), rand.random(), rand.random()],
        density: rand.random() * 0.2,
        falloff: rand.random() * 2.0 + 3.0,
        width,
        height,
        viewport,
      });
    });

    rand = new RNG(props.seed+(2).toString(36));
    let starCount = 0;
    if (props.renderStars) starCount = Math.round(rand.random() * 8 + 1);
    let starOut = this.pingPong(nebulaOut, ping, pong, starCount, (source, destination) => {
      this.starRenderer({
        center: [rand.random(), rand.random()],
        coreRadius: rand.random() * 0.0,
        coreColor: [1,1,1],
        haloColor: [rand.random(), rand.random(), rand.random()],
        haloFalloff: rand.random() * 1024 + 32,
        resolution: [width, height],
        scale,
        source,
        destination,
        viewport,
      });
    });

    rand = new RNG(props.seed+(3).toString(36));
    let sunOut;
    if (props.renderSun) {
      sunOut = starOut === pong ? ping : pong;
      this.starRenderer({
        center: [rand.random(), rand.random()],
        coreRadius: rand.random() * 0.025 + 0.025,
        coreColor: [1,1,1],
        haloColor: [rand.random(), rand.random(), rand.random()],
        haloFalloff: rand.random() * 32 + 32,
        resolution: [width, height],
        scale,
        source: starOut,
        destination: sunOut,
        viewport,
      })
    }

    this.copyRenderer({
      source: sunOut ?? starOut,
      destination: undefined,
      viewport,
    });
  }

  private pingPong(
    initial: REGL.Framebuffer2D,
    alpha: REGL.Framebuffer2D,
    beta: REGL.Framebuffer2D,
    count: number,
    func: (source: REGL.Framebuffer2D, destination: REGL.Framebuffer2D) => void,
  ) {
    // Bail if the render count is zero.
    if (count === 0)  {
      return initial;
    }
    // Make sure the initial FBO is not the same as the first
    // output FBO.
    if (initial === alpha) {
      alpha = beta;
      beta = initial;
    }
    // Render to alpha using initial as the source.
    func(initial, alpha);

    // Keep track of the number of renders done, currently one.
    for (let i = 1; i < count; i++, ([alpha, beta] = [beta, alpha])) {
      // Run the ping-pong render on the two FBOs alternatively.
      func(alpha, beta);
    }
    // When the count is reached, done.
    return alpha;
  }
}
