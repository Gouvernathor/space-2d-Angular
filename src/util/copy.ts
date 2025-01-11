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
      varying vec2 vUV;
      void main() {
        gl_FragColor = texture2D(source, vUV);
      }
    `,
    attributes: {
      position: regl.buffer([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
      uv: regl.buffer([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
    },
    uniforms: {
      source: regl.prop<any, string>('source'),
    },
    framebuffer: regl.prop<any, string>('destination'),
    viewport: regl.prop<any, string>('viewport'),
    count: 6,
  });
}
