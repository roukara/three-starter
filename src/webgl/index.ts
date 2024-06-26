import { PerspectiveCamera, Scene, WebGLRenderer, WebGLRendererParameters } from 'three';

type Size = {
  width: number;
  height: number;
  dpr: number;
}

type Time = {
  elapsed: number;
  delta: number;
  last: number;
  targetDelta: number;
  ratio: number;
  frame: number;
}

export default class WebGL {
  renderer: WebGLRenderer;
  size: Size;
  camera: PerspectiveCamera;
  scene: Scene;
  time: Time;
  
  constructor(rendererOptions: WebGLRendererParameters = {}) {
    this.renderer = new WebGLRenderer(rendererOptions);
    const canvas = this.renderer.domElement;

    this.size = {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      dpr: Math.min(2, window.devicePixelRatio)
    };

    this.camera = new PerspectiveCamera(
      45,
      this.size.width / this.size.height,
      .1,
      100
    );
    this.camera.position.z = 5;

    this.scene = new Scene();

    this.time = {
      elapsed: 0,
      delta: 0,
      last: 0,
      targetDelta: 1 / 60,
      ratio: 1,
      frame: 0
    };
  }

  tick(timestamp: number) {
    if (!this.time.last) this.time.last = timestamp;
    this.time.delta = (timestamp - this.time.last) * .001;
    this.time.elapsed += this.time.delta;
    this.time.last = timestamp;
    this.time.ratio = this.time.delta / this.time.targetDelta;
    this.time.frame++;
  }

  render() {
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number = window.innerWidth, height: number = window.innerHeight) {
    this.size.width = width;
    this.size.height = height;
    this.size.dpr = Math.min(2, window.devicePixelRatio);

    this.renderer.setPixelRatio(this.size.dpr);
    this.renderer.setSize(this.size.width, this.size.height);

    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();
  }
}