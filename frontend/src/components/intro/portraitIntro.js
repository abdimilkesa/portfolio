/** Home intro from the water-portrait page: rising water, particles, then the photo and name. */

const CFG = { form: 3.2, rev: 6.8, revD: 2, text: 5.6, ui: 8.2, end: 9.6, desk: 4200, mob: 1600, amb: 180 };
const FALL = ['#e8f6ff', '#bfe6ff', '#79C8FF', '#9fd6ff', '#ffffff'];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

const FS = `uniform vec2 uR;uniform float uT,uS,uF,uB;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
float caus(vec2 uv,float t){vec2 p=mod(uv*6.28318,6.28318)-250.;vec2 i=p;float c=1.;float inten=.005;
 for(int n=0;n<4;n++){float tt=t*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/inten),p.y/(cos(i.y+tt)/inten)));}
 c/=4.;c=1.17-pow(c,1.4);return pow(abs(c),8.);}
void main(){
 vec2 uv=gl_FragCoord.xy/uR;float asp=uR.x/uR.y;vec2 p=vec2(uv.x*asp,uv.y);
 float wave=.018*sin(uv.x*7.+uT*2.2)+.011*sin(uv.x*19.-uT*3.1)+.02*(fbm(vec2(uv.x*6.+uT*.6,uT*.3))-.5);
 float d=uS+wave-uv.y;
 vec3 col=mix(vec3(.01,.025,.06),vec3(.03,.08,.17),uv.y)+vec3(.04,.07,.13)*fbm(p*2.+uT*.05)*uv.y;
 float fl=fbm(p*3.+vec2(uT*.08,uT*.05)+fbm(p*2.-uT*.06)*1.5);
 vec3 bg=mix(vec3(.015,.04,.1),vec3(.04,.16,.3),fl);
 bg+=caus(p*.5+vec2(uT*.02,0.),uT*.25)*.14*vec3(.4,.8,1.);
 bg+=pow(.5+.5*sin((p.x*.8+p.y*.6)*14.+fl*8.-uT*.5),6.)*.05*vec3(.4,.8,1.);
 col=mix(col,bg,uB);
 if(d>0.){
  float depth=clamp(d*1.6,0.,1.);vec2 q=p*5.+vec2(uT*.15,-uT*.25);float e=.02;
  float h0=fbm(q),hx=fbm(q+vec2(e,0.)),hy=fbm(q+vec2(0.,e));
  vec3 n=normalize(vec3((h0-hx)*9.,(h0-hy)*9.,1.));vec3 L=normalize(vec3(.35,.5,.8));
  float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),48.);
  col=mix(vec3(.18,.62,.86),vec3(.01,.1,.26),smoothstep(0.,.9,depth));
  col+=caus(p*.7+n.xy*.08,uT*.5)*.45*vec3(.55,.9,1.)*(1.-depth*.6);
  col+=spec*vec3(.9,.97,1.)*.8+(h0-.5)*.18;
  float fo=smoothstep(.045,0.,d)*(.5+.7*fbm(p*14.+uT));
  col=mix(col,vec3(.95,.98,1.),clamp(fo,0.,1.));
 }
 col+=uF*vec3(.45,.65,1.)*.55;gl_FragColor=vec4(col,1.);}`;

function drawDefault(sx) {
  let g = sx.createRadialGradient(200, 150, 20, 200, 200, 300);
  g.addColorStop(0, '#3d6285');
  g.addColorStop(1, '#0b1420');
  sx.fillStyle = g;
  sx.fillRect(0, 0, 400, 400);
  sx.fillStyle = '#79C8FF';
  sx.font = '900 72px Orbitron, Sora, sans-serif';
  sx.textAlign = 'center';
  sx.textBaseline = 'middle';
  sx.fillText('AM', 200, 200);
}

function loadPhoto(url, sx) {
  return new Promise((resolve) => {
    if (!url) {
      drawDefault(sx);
      resolve();
      return;
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const side = Math.min(image.width, image.height);
      sx.clearRect(0, 0, 400, 400);
      sx.drawImage(image, (image.width - side) / 2, (image.height - side) * 0.18, side, side, 0, 0, 400, 400);
      resolve();
    };
    image.onerror = () => {
      drawDefault(sx);
      resolve();
    };
    image.src = url;
  });
}

function letters(el, text) {
  el.replaceChildren();
  const nodes = [];
  text.split(' ').forEach((word, wordIndex) => {
    if (wordIndex) el.appendChild(document.createTextNode(' '));
    const group = document.createElement('span');
    group.className = 'cine-w';
    group.setAttribute('aria-hidden', 'true');
    [...word].forEach((char) => {
      const letter = document.createElement('span');
      letter.className = 'cine-l';
      const inner = document.createElement('span');
      inner.className = 'cine-i';
      inner.textContent = char;
      inner.style.setProperty('--i', String(nodes.length));
      letter.appendChild(inner);
      group.appendChild(letter);
      nodes.push(letter);
    });
    el.appendChild(group);
  });
  return nodes;
}

function enter(list, delay) {
  list.forEach((letter, index) => {
    const dir = (Math.random() * 4) | 0;
    const far = 50 + Math.random() * 60;
    const fromX = dir === 0 ? -far : dir === 1 ? far : 0;
    const fromY = dir === 2 ? 70 : dir === 3 ? -70 : 0;
    const amp = 20 + Math.random() * 20;
    const frames = [];
    const steps = 16;
    for (let step = 0; step <= steps; step += 1) {
      const p = step / steps;
      const eased = 1 - (1 - p) ** 3;
      const wave = Math.sin(p * Math.PI * 3 + index) * amp * (1 - p);
      const x = fromX * (1 - eased) + (dir > 1 ? wave : 0);
      const y = fromY * (1 - eased) + (dir < 2 ? wave : 0);
      frames.push({
        transform: `translate(${x}px, ${y}px) rotate(${(1 - p) * (Math.random() > 0.5 ? 1 : -1) * 40}deg)`,
        opacity: Math.min(1, p * 3),
        filter: `blur(${(1 - p) * 6}px)`,
      });
    }
    letter.animate(frames, { duration: 1500 + Math.random() * 500, delay: delay * 1000 + index * 45, fill: 'both', easing: 'linear' });
  });
}

export async function startPortraitIntro({ root, waterCanvas, fxCanvas, photoCanvas, nameEl, roleEl, wrapEl, portraitEl, name, role, imageUrl, reduced }) {
  const fx = fxCanvas.getContext('2d');
  const photoCtx = photoCanvas.getContext('2d');
  const source = document.createElement('canvas');
  source.width = source.height = 400;
  const sx = source.getContext('2d', { willReadFrequently: true });
  await loadPhoto(imageUrl, sx);

  let alive = true;
  let W = 1;
  let H = 1;
  let R = { l: 0, t: 0, w: 300 };
  let P = [];
  let gn = 60;
  let gs = 4;
  let t = 0;
  let last = 0;
  let done = false;
  let splash = [];
  let ripples = [];
  let raf = 0;
  let bolts = [];
  let flash = 0;
  let shake = 14;
  let nextBolt = 0.7;
  let boom = false;
  let shock = -1;
  let mx = -9999;
  let my = -9999;
  let hoverP = false;
  let kickNow = false;
  let exK = 0;
  let springs = [];
  let acting = false;
  let RV0 = CFG.rev;
  let RVD = CFG.revD;
  let exploded = false;
  let visible = true;
  const nameLetters = letters(nameEl, name);
  const roleLetters = letters(roleEl, role);

  const gl = waterCanvas.getContext('webgl', { alpha: false, antialias: false });
  let uniforms = null;
  if (gl) {
    const precision = gl.getShaderPrecisionFormat?.(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    const makeShader = (type, sourceCode) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram();
    gl.attachShader(program, makeShader(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(program, makeShader(gl.FRAGMENT_SHADER, `precision ${precision && precision.precision > 0 ? 'highp' : 'mediump'} float;${FS}`));
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const attrib = gl.getAttribLocation(program, 'a');
      gl.enableVertexAttribArray(attrib);
      gl.vertexAttribPointer(attrib, 2, gl.FLOAT, false, 0, 0);
      uniforms = {
        R: gl.getUniformLocation(program, 'uR'),
        T: gl.getUniformLocation(program, 'uT'),
        S: gl.getUniformLocation(program, 'uS'),
        F: gl.getUniformLocation(program, 'uF'),
        B: gl.getUniformLocation(program, 'uB'),
      };
    }
  }

  function origin() {
    const box = root.getBoundingClientRect();
    return { x: box.left, y: box.top };
  }

  function place() {
    const box = wrapEl.getBoundingClientRect();
    const o = origin();
    R = { l: box.left - o.x, t: box.top - o.y, w: box.width };
  }

  function textPoints() {
    const mobile = W < 700;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, W);
    canvas.height = Math.max(1, H);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const out = [];
    const o = origin();
    context.fillStyle = '#fff';
    context.textBaseline = 'middle';
    for (const [el, step] of [
      [nameEl, mobile ? 5 : 4],
      [roleEl, mobile ? 4 : 3],
    ]) {
      const style = getComputedStyle(el);
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      context.clearRect(0, 0, canvas.width, canvas.height);
      el.querySelectorAll('.cine-w').forEach((word) => {
        const box = word.getBoundingClientRect();
        context.fillText(word.textContent, box.left - o.x, box.top - o.y + box.height * 0.52);
      });
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          if (data[(y * canvas.width + x) * 4 + 3] > 128) out.push([x, y, step]);
        }
      }
    }
    if (!out.length) out.push([W * 0.3, H * 0.5, 4]);
    return out;
  }

  function surface() {
    if (t < 2.4) {
      const f = t / 2.4;
      return -0.06 + 1.22 * (1 - (1 - f) ** 2);
    }
    if (t < 3.4) return 1.16;
    const f = clamp((t - 3.4) / 2.4);
    return 1.16 - 1.3 * f * f * (3 - 2 * f);
  }
  const level = () => H * (1 - surface());

  function zig(x0, y0, x1, y1) {
    const points = [[x0, y0]];
    for (let i = 1; i < 14; i += 1) {
      const f = i / 14;
      points.push([x0 + (x1 - x0) * f + (Math.random() - 0.5) * 70 * (1 - f * 0.4), y0 + (y1 - y0) * f + (Math.random() - 0.5) * 20]);
    }
    points.push([x1, y1]);
    return points;
  }

  function strike(mode, big) {
    const cx = R.l + R.w / 2;
    const cy = R.t + R.w / 2;
    const atPhoto = mode === 'p';
    const path = zig(
      atPhoto ? cx + (Math.random() - 0.5) * R.w * 1.6 : Math.random() * W,
      -10,
      atPhoto ? cx + (Math.random() - 0.5) * R.w * 0.5 : Math.random() * W,
      atPhoto ? cy + (Math.random() - 0.2) * R.w * 0.45 : H * (0.35 + Math.random() * 0.5),
    );
    bolts.push({ pts: path, a: 1, big });
    const joint = path[5 + ((Math.random() * 5) | 0)];
    bolts.push({ pts: zig(joint[0], joint[1], joint[0] + (Math.random() - 0.5) * 300, joint[1] + 150 + Math.random() * 200), a: 0.7 });
    flash = Math.max(flash, big ? 1 : 0.4 + Math.random() * 0.3);
    shake = Math.max(shake, big ? 10 : 5);
  }

  function reset() {
    for (const particle of P) {
      particle.x = Math.random() * W;
      particle.y = Math.random() * H;
      particle.born = false;
      particle.b = (1 - particle.y / H) * 2.2;
      particle.vx = 0;
      particle.vy = 0;
      particle.ph = Math.random() * 6.28;
      particle.st = CFG.form + Math.random() * 1.4;
      particle.kick = 0;
      particle.ex = 0.7 + Math.random() * 1.1;
      particle.w = 1.5 + Math.random() * 2.5;
    }
    splash = [];
    ripples = [];
    bolts = [];
    flash = 0;
    shake = 14;
    nextBolt = 0.7;
    boom = false;
    shock = -1;
    exK = 0;
    RV0 = CFG.rev;
    RVD = CFG.revD;
    exploded = false;
  }

  function build() {
    const count = W < 700 ? CFG.mob : CFG.desk;
    gn = Math.ceil(Math.sqrt(count / 0.785));
    const data = sx.getImageData(0, 0, 400, 400).data;
    P = [];
    for (let j = 0; j < gn; j += 1) {
      for (let i = 0; i < gn; i += 1) {
        const u = (i + 0.5) / gn;
        const v = (j + 0.5) / gn;
        if ((u - 0.5) ** 2 + (v - 0.5) ** 2 > 0.25) continue;
        const offset = (((v * 399) | 0) * 400 + ((u * 399) | 0)) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
        const tone = 0.12 + 0.88 * lum ** 0.8;
        const hi = lum > 0.72 ? (lum - 0.72) * 500 : 0;
        P.push({
          k: 0,
          u,
          v,
          fall: FALL[(Math.random() * 5) | 0],
          water: `rgb(${Math.min(255, 121 * tone + hi) | 0},${Math.min(255, 200 * tone + hi) | 0},${Math.min(255, 255 * tone + hi * 0.6) | 0})`,
          photo: `rgb(${r},${g},${b})`,
        });
      }
    }
    const ambient = W < 700 ? CFG.amb / 2 : CFG.amb;
    for (let i = 0; i < ambient; i += 1) {
      P.push({ k: 1, ang: Math.random() * 6.28, rad: 0.56 + Math.random() * 0.26, om: (Math.random() - 0.5) * 0.5, s: 1.4 + Math.random() * 2.2, fall: FALL[(Math.random() * 5) | 0] });
    }
    for (const point of textPoints()) {
      P.push({ k: 2, tx: point[0], ty: point[1], gs: point[2] * 0.95, fall: FALL[(Math.random() * 5) | 0], water: '#8fd3ff', photo: '#79C8FF' });
    }
    gs = (R.w / gn) * 1.2;
    reset();
  }

  function measure() {
    W = Math.max(1, root.clientWidth);
    H = Math.max(1, root.clientHeight);
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    fxCanvas.width = Math.floor(W * ratio);
    fxCanvas.height = Math.floor(H * ratio);
    fx.setTransform(ratio, 0, 0, ratio, 0, 0);
    waterCanvas.width = Math.round(W * 0.6);
    waterCanvas.height = Math.round(H * 0.6);
    place();
    const photoRatio = Math.min(devicePixelRatio || 1, 2);
    photoCanvas.width = photoCanvas.height = Math.max(1, Math.round(R.w * photoRatio));
    photoCtx.setTransform(photoRatio, 0, 0, photoRatio, 0, 0);
  }

  function sim(dt) {
    const cx = R.l + R.w / 2;
    const cy = R.t + R.w / 2;
    const hovering = hoverP && t > CFG.rev + CFG.revD;
    exK += ((hovering ? 1 : 0) - exK) * Math.min(1, dt * (hovering ? 5 : 2.2));
    if (hovering) exploded = true;
    if (exploded && !hoverP && exK < 0.05) {
      exploded = false;
      RV0 = t;
      RVD = 1.4;
    }
    const kicked = kickNow;
    kickNow = false;
    for (const particle of P) {
      if (t < particle.st) {
        if (!particle.born) {
          if (t < particle.b) continue;
          particle.born = true;
          particle.vx = 0;
          particle.vy = -(15 + Math.random() * 50);
        }
        particle.vx = Math.sin(t * 1.6 + particle.ph + particle.y * 0.012) * 70;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        if (particle.y < -10) particle.y = H + 10;
      } else if (particle.k === 1) {
        const angle = particle.ang + t * particle.om;
        const ox = cx + Math.cos(angle) * particle.rad * R.w;
        const oy = cy + Math.sin(angle) * particle.rad * R.w * 0.95;
        const k = Math.min(1, dt * 2.2);
        particle.x += (ox - particle.x) * k;
        particle.y += (oy - particle.y) * k;
      } else {
        if (!particle.kick) {
          particle.kick = 1;
          const angle = Math.atan2(particle.y - H * 0.5, particle.x - W * 0.5);
          const speed = 300 + Math.random() * 600;
          particle.vx = Math.cos(angle) * speed;
          particle.vy = Math.sin(angle) * speed;
        }
        const progress = clamp((t - particle.st) / 1.8);
        let tx = particle.k === 2 ? particle.tx : R.l + particle.u * R.w;
        let ty = particle.k === 2 ? particle.ty : R.t + particle.v * R.w;
        if (particle.k === 0 && exK > 0.001) {
          if (kicked) {
            const angle = Math.atan2(particle.y - my, particle.x - mx);
            const speed = 400 + Math.random() * 800;
            particle.vx += Math.cos(angle) * speed;
            particle.vy += Math.sin(angle) * speed;
          }
          tx += (tx - cx) * exK * particle.ex + Math.sin(t * 3 + particle.ph) * 10 * exK;
          ty += (ty - cy) * exK * particle.ex + Math.cos(t * 2.6 + particle.ph) * 10 * exK;
        }
        const dx = tx - particle.x;
        const dy = ty - particle.y;
        const swirl = (1 - progress) * 1.6;
        particle.vx += (dx * 16 - particle.vx * 8.2 - dy * swirl) * dt;
        particle.vy += (dy * 16 - particle.vy * 8.2 + dx * swirl) * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
      }
    }
    if (t < 2.6) {
      for (let i = 0; i < 8 && splash.length < 420; i += 1) {
        splash.push({ x: Math.random() * W, y: level(), vx: (Math.random() - 0.5) * 200, vy: -100 - Math.random() * 400, l: 0.4 + Math.random() * 0.5 });
      }
    }
    for (const drop of splash) {
      drop.vy += 900 * dt;
      drop.x += drop.vx * dt;
      drop.y += drop.vy * dt;
      drop.l -= dt;
    }
    splash = splash.filter((drop) => drop.l > 0);
    if (!boom && t >= CFG.form) {
      boom = true;
      shake = 12;
      shock = 0;
    }
    if (shock >= 0) shock += dt;
    if (t > 1.1 && t < CFG.form && t > nextBolt) {
      strike(Math.random() > 0.45 ? 'p' : 's', Math.random() > 0.72);
      nextBolt = t + 0.35 + Math.random() * 0.45;
    }
    for (const bolt of bolts) bolt.a -= dt * 4.5;
    bolts = bolts.filter((bolt) => bolt.a > 0);
    flash *= 0.003 ** dt;
    shake *= 0.02 ** dt;
  }

  function drawPhoto() {
    const w = R.w;
    const reveal = clamp((t - RV0) / RVD);
    photoCtx.clearRect(0, 0, w, w);
    if (reveal <= 0) return;
    const eased = reveal * reveal * (3 - 2 * reveal);
    const path = new Path2D();
    path.moveTo(0, w + 4);
    for (let x = 0; x <= w; x += 6) path.lineTo(x, w * (1.1 - 1.2 * eased) + Math.sin(x * 0.045 + t * 5) * 14 * (1 - eased * 0.7));
    path.lineTo(w, w + 4);
    path.closePath();
    photoCtx.save();
    photoCtx.clip(path);
    photoCtx.drawImage(source, 0, 0, w, w);
    photoCtx.fillStyle = `rgba(121,200,255,${0.28 * (1 - eased)})`;
    photoCtx.fillRect(0, 0, w, w);
    photoCtx.restore();
    if (eased < 1) {
      photoCtx.strokeStyle = `rgba(220,245,255,${0.9 * (1 - eased)})`;
      photoCtx.lineWidth = 3;
      photoCtx.stroke(path);
    }
    ripples = ripples.filter((ripple) => t - ripple.t < 0.9);
    for (const ripple of ripples) {
      const age = (t - ripple.t) / 0.9;
      photoCtx.strokeStyle = `rgba(160,220,255,${0.6 * (1 - age)})`;
      photoCtx.lineWidth = 2;
      photoCtx.beginPath();
      photoCtx.arc(ripple.x, ripple.y, age * w * 0.3, 0, 7);
      photoCtx.stroke();
    }
  }

  function drawWater() {
    if (!uniforms) return;
    gl.viewport(0, 0, waterCanvas.width, waterCanvas.height);
    gl.uniform2f(uniforms.R, waterCanvas.width, waterCanvas.height);
    gl.uniform1f(uniforms.T, t);
    gl.uniform1f(uniforms.S, surface());
    gl.uniform1f(uniforms.F, flash);
    gl.uniform1f(uniforms.B, clamp((t - 4.6) / 2));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function draw() {
    const reveal = clamp((t - RV0) / RVD);
    fx.globalCompositeOperation = 'destination-out';
    fx.fillStyle = 'rgba(0,0,0,.35)';
    fx.fillRect(0, 0, W, H);
    fx.globalCompositeOperation = 'source-over';
    drawWater();
    if (!uniforms && surface() > -0.1) {
      const y = Math.max(0, level());
      const gradient = fx.createLinearGradient(0, y, 0, H);
      gradient.addColorStop(0, '#2f86c8');
      gradient.addColorStop(1, '#06223f');
      fx.fillStyle = gradient;
      fx.fillRect(0, y, W, H - y);
    }
    for (const particle of P) {
      if (particle.k === 0 && reveal >= 1 && exK < 0.01) continue;
      if (particle.k === 2 && t > CFG.text + 1.8) continue;
      if (t < particle.st) {
        if (!particle.born) continue;
        fx.globalAlpha = 0.42;
        fx.fillStyle = particle.fall;
        fx.fillRect(particle.x - particle.w / 2, particle.y - particle.w / 2, particle.w, particle.w);
        continue;
      }
      if (particle.k === 1) {
        fx.globalAlpha = 0.55;
        fx.fillStyle = '#bfe6ff';
        fx.fillRect(particle.x, particle.y, particle.s, particle.s);
        continue;
      }
      const progress = clamp((t - particle.st) / 1.8);
      const size = 1.8 + ((particle.k === 2 ? particle.gs : gs) - 1.8) * progress;
      fx.globalAlpha = 0.95;
      fx.fillStyle = progress < 0.35 ? particle.fall : progress < 0.85 ? particle.water : particle.photo;
      fx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
    }
    fx.globalAlpha = 0.8;
    fx.fillStyle = '#e6f6ff';
    for (const drop of splash) fx.fillRect(drop.x, drop.y, 3, 3);
    if (shock >= 0 && shock < 1.2) {
      fx.globalAlpha = 1 - shock / 1.2;
      fx.strokeStyle = 'rgba(200,235,255,.9)';
      fx.lineWidth = 6;
      fx.beginPath();
      fx.arc(W * 0.5, H * 0.5, shock * W * 0.9, 0, 7);
      fx.stroke();
    }
    fx.lineJoin = 'round';
    for (const bolt of bolts) {
      fx.globalAlpha = clamp(bolt.a) * (0.6 + Math.random() * 0.4);
      fx.beginPath();
      bolt.pts.forEach((point, index) => (index ? fx.lineTo(point[0], point[1]) : fx.moveTo(point[0], point[1])));
      fx.strokeStyle = 'rgba(121,200,255,.35)';
      fx.lineWidth = bolt.big ? 16 : 9;
      fx.stroke();
      fx.strokeStyle = '#fff';
      fx.lineWidth = bolt.big ? 3.5 : 2;
      fx.stroke();
    }
    fx.globalAlpha = 1;
    if (flash > 0.02) {
      fx.fillStyle = `rgba(190,225,255,${flash * 0.4})`;
      fx.fillRect(0, 0, W, H);
    }
    const shift = shake > 0.2 ? `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)` : '';
    fxCanvas.style.transform = shift;
    waterCanvas.style.transform = shift;
    photoCanvas.style.opacity = exploded ? '0' : '1';
    drawPhoto();
    if (!done && t > CFG.ui) {
      done = true;
      root.classList.add('is-done');
    }
    if (t > CFG.rev + 1) root.classList.add('is-ring');
  }

  function scatter(dt) {
    if (!done || reduced || (mx < -1000 && !acting)) return;
    const all = [...nameLetters, ...roleLetters];
    if (springs.length !== all.length) springs = all.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, on: 0 }));
    const reach = Math.max(90, Math.min(150, W * 0.1));
    const o = origin();
    acting = false;
    all.forEach((letter, index) => {
      const spring = springs[index];
      const box = letter.getBoundingClientRect();
      const dx = box.left - o.x + box.width / 2 - mx;
      const dy = box.top - o.y + box.height / 2 - my;
      const distance = Math.hypot(dx, dy) || 1;
      let tx = 0;
      let ty = 0;
      if (distance < reach) {
        const force = (1 - distance / reach) * reach * 1.1;
        tx = (dx / distance) * force;
        ty = (dy / distance) * force;
      }
      spring.vx += (tx - spring.x) * 120 * dt - spring.vx * 14 * dt;
      spring.vy += (ty - spring.y) * 120 * dt - spring.vy * 14 * dt;
      spring.x += spring.vx * dt;
      spring.y += spring.vy * dt;
      const inner = letter.firstChild;
      if (Math.abs(spring.x) + Math.abs(spring.y) + Math.abs(spring.vx) + Math.abs(spring.vy) < 0.05) {
        if (spring.on) {
          spring.on = 0;
          inner.style.translate = '';
          inner.style.rotate = '';
        }
      } else {
        spring.on = 1;
        acting = true;
        inner.style.translate = `${spring.x}px ${spring.y}px`;
        inner.style.rotate = `${spring.x * 0.6}deg`;
      }
    });
  }

  function runText() {
    [...nameLetters, ...roleLetters].forEach((letter) => letter.getAnimations().forEach((animation) => animation.cancel()));
    if (reduced) return;
    enter(nameLetters, CFG.text);
    enter(roleLetters, CFG.text + 0.9);
  }

  function finishText() {
    [...nameLetters, ...roleLetters].forEach((letter) => letter.getAnimations().forEach((animation) => animation.finish()));
  }

  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden || !visible) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000 || 0.016, 0.033);
    last = now;
    t += dt;
    sim(dt);
    draw();
    scatter(dt);
  }

  function play() {
    if (!alive) return;
    cancelAnimationFrame(raf);
    done = false;
    root.classList.remove('is-done', 'is-ring');
    t = 0;
    last = performance.now();
    place();
    reset();
    runText();
    raf = requestAnimationFrame(frame);
  }

  function showFinal() {
    cancelAnimationFrame(raf);
    t = CFG.end + 1;
    finishText();
    root.classList.add('is-done', 'is-ring');
    done = true;
    boom = true;
    for (let i = 0; i < 8; i += 1) sim(0.3);
    bolts = [];
    flash = 0;
    shake = 0;
    draw();
  }

  measure();
  build();
  if (reduced) showFinal();
  else play();
  document.fonts?.ready?.then(() => {
    if (!alive) return;
    const points = textPoints();
    let index = 0;
    for (const particle of P) {
      if (particle.k !== 2) continue;
      const point = points[index % points.length];
      particle.tx = point[0];
      particle.ty = point[1];
      particle.gs = point[2] * 0.95;
      index += 1;
    }
  });

  function localPoint(event) {
    const o = origin();
    return { x: event.clientX - o.x, y: event.clientY - o.y };
  }
  const onMove = (event) => {
    const point = localPoint(event);
    mx = point.x;
    my = point.y;
  };
  const onLeave = () => {
    mx = my = -9999;
  };
  const onResize = () => {
    measure();
    if (reduced || t > CFG.end) draw();
  };
  const onPhotoMove = (event) => {
    if (t < CFG.rev + CFG.revD) return;
    const box = photoCanvas.getBoundingClientRect();
    const lastRipple = ripples[ripples.length - 1];
    if (!lastRipple || t - lastRipple.t > 0.18) ripples.push({ x: event.clientX - box.left, y: event.clientY - box.top, t });
  };
  const onEnterPortrait = () => {
    hoverP = true;
    if (t > CFG.rev + CFG.revD) kickNow = true;
  };
  const onLeavePortrait = () => {
    hoverP = false;
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(root);
  window.addEventListener('pointermove', onMove);
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', place, { passive: true });
  photoCanvas.addEventListener('pointermove', onPhotoMove);
  portraitEl.addEventListener('pointerenter', onEnterPortrait);
  portraitEl.addEventListener('pointerleave', onLeavePortrait);

  return {
    replay() {
      if (reduced) showFinal();
      else play();
    },
    skip() {
      t = CFG.end + 0.01;
      finishText();
    },
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', place);
      photoCanvas.removeEventListener('pointermove', onPhotoMove);
      portraitEl.removeEventListener('pointerenter', onEnterPortrait);
      portraitEl.removeEventListener('pointerleave', onLeavePortrait);
    },
  };
}
