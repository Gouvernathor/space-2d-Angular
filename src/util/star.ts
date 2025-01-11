import REGL from "regl";

export function createRenderer(regl: REGL.Regl) {
  return regl({
    vert: `
      precision highp float;
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUV;
      void main() {
        gl_Position = vec4(position, 0, 1);
        vUV = uv;
      }
    `,
    frag: `
      precision highp float;
      uniform sampler2D source;
      uniform vec3 coreColor, haloColor;
      uniform vec2 center, resolution;
      uniform float coreRadius, haloFalloff, scale;
      varying vec2 vUV;
      void main() {
        vec4 s = texture2D(source, vUV);
        float d = length(gl_FragCoord.xy - center * resolution) / scale;
        if (d <= coreRadius) {
          gl_FragColor = vec4(coreColor, 1);
          return;
        }
        float e = 1.0 - exp(-(d - coreRadius) * haloFalloff);
        vec3 rgb = mix(coreColor, haloColor, e);
        rgb = mix(rgb, vec3(0,0,0), e);
        gl_FragColor = vec4(rgb + s.rgb, 1);
      }
    `,
    attributes: {
      position: regl.buffer([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
      uv: regl.buffer([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
    },
    uniforms: {
      center: regl.prop<any, string>('center'),
      coreRadius: regl.prop<any, string>('coreRadius'),
      coreColor: regl.prop<any, string>('coreColor'),
      haloColor: regl.prop<any, string>('haloColor'),
      haloFalloff: regl.prop<any, string>('haloFalloff'),
      resolution: regl.prop<any, string>('resolution'),
      scale: regl.prop<any, string>('scale'),
      source: regl.prop<any, string>('source'),
    },
    framebuffer: regl.prop<any, string>('destination'),
    viewport: regl.prop<any, string>('viewport'),
    count: 6,
  });
}
