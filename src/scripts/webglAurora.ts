// Restrained Luxury WebGL GLSL Topographic Silk-Light Shader (v3 — Calm Studio Edition)

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
    float aspect = u_resolution.x / min(u_resolution.x, u_resolution.y);
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Subtle slow parallax zoom on scroll
    p *= (1.0 - u_scroll * 0.09);

    vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
    float mDist = length(p - m);
    float mousePull = exp(-mDist * 1.9) * 0.14;

    // Meditative ~55-65s cycle
    float t = u_time * 0.042;
    float breath = 0.88 + 0.12 * sin(u_time * 0.22);

    vec2 q = vec2(
      fbm(p * 1.3 + vec2(t, -t * 0.5)),
      fbm(p * 1.3 + vec2(-t * 0.6, t * 0.4) + 5.2)
    );
    vec2 r = vec2(
      fbm(p * 1.65 + 1.8 * q + vec2(1.7, 9.2) + t * 0.25),
      fbm(p * 1.65 + 1.8 * q + vec2(8.3, 2.8) - t * 0.2)
    );

    float f = fbm(p * 1.55 + r * 1.15 - (p - m) * mousePull);
    float fShift = fbm((p + vec2(0.014, -0.01)) * 1.55 + r * 1.15 - (p - m) * mousePull);

    // Soft, restrained topographic texture lines
    float contour = abs(fract(f * 8.5) - 0.5);
    float ridge = smoothstep(0.085, 0.0, contour) * 0.095;

    vec3 colObsidian = vec3(0.019, 0.019, 0.027);
    vec3 colGraphite = vec3(0.045, 0.056, 0.078);
    vec3 colEmerald  = vec3(0.0, 0.898, 0.60);
    vec3 colCyan     = vec3(0.14, 0.65, 0.92);
    vec3 colSilver   = vec3(0.82, 0.92, 0.98);

    vec3 color = mix(colObsidian, colGraphite, smoothstep(0.24, 0.76, f));

    // Restrained luminous depth (~38% softer than tech-demo intensity)
    float silk = smoothstep(0.54, 0.80, f) * (1.0 - smoothstep(0.80, 0.96, f));
    float caustic = clamp((f - fShift) * 5.0, 0.0, 1.0) * smoothstep(0.46, 0.84, f);

    color += colEmerald * silk * 0.23 * breath;
    color += colCyan * smoothstep(0.48, 0.80, r.x) * smoothstep(0.45, 0.78, f) * 0.11;
    color += colSilver * caustic * 0.13;
    color += mix(colEmerald, colSilver, 0.55) * ridge * smoothstep(0.32, 0.80, f);

    // Ultra-delicate cursor luminance
    color += colEmerald * exp(-mDist * 2.5) * 0.085;

    // Strong headline-first vignette & smooth bottom fade
    float vig = 1.0 - smoothstep(0.28, 1.08, length(uv - vec2(0.55, 0.46)));
    color = mix(colObsidian, color, clamp(vig * 1.05, 0.0, 1.0));
    color = mix(colObsidian, color, smoothstep(0.0, 0.26, uv.y));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function mountWebglAurora(canvasId: string, staticOnly = false): () => void {
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

  let targetMouseX = 0.62;
  let targetMouseY = 0.52;
  let curMouseX = 0.62;
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

  const drawFrame = (elapsedSec: number) => {
    const scrollRatio = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, elapsedSec);
    gl.uniform2f(uMouse, curMouseX, curMouseY);
    gl.uniform1f(uScroll, scrollRatio);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  resize();

  // Static high-craft topographic frame for prefers-reduced-motion
  if (staticOnly) {
    drawFrame(12.0);
    const onResizeStatic = () => {
      resize();
      drawFrame(12.0);
    };
    window.addEventListener('resize', onResizeStatic, { passive: true });
    return () => {
      window.removeEventListener('resize', onResizeStatic);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      targetMouseX = (e.clientX - rect.left) / rect.width;
      targetMouseY = 1.0 - (e.clientY - rect.top) / rect.height;
    }
  };

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

    curMouseX += (targetMouseX - curMouseX) * 0.035;
    curMouseY += (targetMouseY - curMouseY) * 0.035;
    drawFrame((now - startTime) * 0.001 + 12.0);
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
