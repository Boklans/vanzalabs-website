// Pure WebGL GLSL Silk-Light & Topographic Fluid Shader (zero external dependencies)

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_scroll;

  // Smooth 2D value noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    vec2 m = (u_mouse - 0.5) * vec2(u_resolution.x / min(u_resolution.x, u_resolution.y), 1.0);
    float mDist = length(p - m);
    float mousePull = exp(-mDist * 2.4) * 0.35;

    float t = u_time * 0.14;
    vec2 warp = vec2(
      fbm(p * 1.6 + vec2(t, -t * 0.6) + u_scroll * 0.4),
      fbm(p * 1.6 + vec2(-t * 0.8, t * 0.5) + 4.2)
    );

    float field = fbm(p * 1.9 + warp * 1.45 - (p - m) * mousePull);

    // Subtle topographic contour lines
    float contour = abs(fract(field * 9.0) - 0.5);
    float ridge = smoothstep(0.06, 0.0, contour) * 0.14;

    // Color palette: Deep Obsidian -> Metallic Slate -> Precision Emerald & Cyan light ribbons
    vec3 colObsidian = vec3(0.019, 0.019, 0.027);
    vec3 colSlate    = vec3(0.055, 0.072, 0.105);
    vec3 colEmerald  = vec3(0.0, 0.898, 0.60);
    vec3 colCyan     = vec3(0.18, 0.62, 0.96);

    vec3 color = mix(colObsidian, colSlate, smoothstep(0.22, 0.72, field));

    // Luminous silk filaments
    float ribbon1 = smoothstep(0.56, 0.78, field) * (1.0 - smoothstep(0.78, 0.94, field));
    float ribbon2 = smoothstep(0.42, 0.64, warp.x) * smoothstep(0.45, 0.75, field);

    color += colEmerald * ribbon1 * 0.34;
    color += colCyan * ribbon2 * 0.16;
    color += mix(colEmerald, vec3(0.85, 0.96, 1.0), 0.55) * ridge * smoothstep(0.32, 0.75, field);

    // Soft cursor illumination halo
    color += colEmerald * exp(-mDist * 3.1) * 0.16;

    // Vignette so edges melt seamlessly into #050507
    float vig = 1.0 - smoothstep(0.35, 1.15, length(uv - vec2(0.5, 0.44)));
    color = mix(colObsidian, color, clamp(vig * 1.15, 0.0, 1.0));

    // Bottom fade to pure obsidian
    color = mix(colObsidian, color, smoothstep(0.0, 0.24, uv.y));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function mountWebglAurora(canvasId: string): () => void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return () => {};

  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return () => {};

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };

  const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return () => {};

  const program = gl.createProgram();
  if (!program) return () => {};
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};

  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');
  const uScroll = gl.getUniformLocation(program, 'u_scroll');

  let targetMouseX = 0.55;
  let targetMouseY = 0.52;
  let curMouseX = 0.55;
  let curMouseY = 0.52;
  let isVisible = true;
  let rafId = 0;
  const startTime = performance.now();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      targetMouseX = (e.clientX - rect.left) / rect.width;
      targetMouseY = 1.0 - (e.clientY - rect.top) / rect.height;
    }
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const io = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0.01 }
  );
  io.observe(canvas);

  const render = (now: number) => {
    rafId = requestAnimationFrame(render);
    if (!isVisible) return;

    curMouseX += (targetMouseX - curMouseX) * 0.06;
    curMouseY += (targetMouseY - curMouseY) * 0.06;

    const scrollRatio = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - startTime) * 0.001);
    gl.uniform2f(uMouse, curMouseX, curMouseY);
    gl.uniform1f(uScroll, scrollRatio);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    io.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    gl.deleteBuffer(buf);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
}
