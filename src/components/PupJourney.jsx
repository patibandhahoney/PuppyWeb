import React, { useEffect, useRef } from 'react';
import './PupJourney.css';

// SVG & Model dimensions from reference (modules 1063, 89681, 91360)
const W = 300;
const R = 240;
const D = { x: 150, y: 228 }; // Foot anchor center
const BODY_CENTER = [196, 206];
const HEAD_CENTER = [212, 100];
const SHOULDER_N = [186, 194];
const SHOULDER_F = [168, 192];
const HIP_N = [110, 194];
const HIP_F = [94, 192];
const TAIL_BASE = [84, 150];
const EAR_L = [174, 82];
const EAR_R = [250, 82];
const EYE_Y = 98;

const COCOA = '#2a170e';
const GOLD = '#f2be6b';
const GOLD_DEEP = '#e4a352';
const CREAM = '#fbe3b4';
const COLLAR_RED = '#a24a1a';
const BLUSH = '#f9b9a6';

// Helper for generating organic fluffy cloud curves
function generateBlob(cx, cy, rx, ry, points, amp, startAngle = -Math.PI / 2, rotDeg = 0) {
  const rad = (rotDeg * Math.PI) / 180;
  const cosR = Math.cos(rad);
  const sinR = Math.sin(rad);

  const pt = (angle, offset) => {
    const x0 = Math.cos(angle) * (rx + offset);
    const y0 = Math.sin(angle) * (ry + (ry / rx) * offset);
    return `${(cx + x0 * cosR - y0 * sinR).toFixed(1)} ${(cy + x0 * sinR + y0 * cosR).toFixed(1)}`;
  };

  let d = '';
  for (let i = 0; i < points; i++) {
    const a0 = startAngle + (i / points) * Math.PI * 2;
    const a1 = startAngle + ((i + 1) / points) * Math.PI * 2;
    const mid = (a0 + a1) / 2;
    d += `${i === 0 ? `M${pt(a0, 0)}` : ''}Q${pt(mid, 2.1 * amp)} ${pt(a1, 0)}`;
  }
  return `${d}Z`;
}

// Organic SVG Paths
const PATHS = {
  body: generateBlob(140, 170, 64, 36, 15, 3.4, 0.95 * Math.PI),
  chest: generateBlob(192, 166, 30, 32, 9, 3.2, 0.6 * Math.PI),
  tail: generateBlob(70, 126, 17, 16, 9, 3.2),
  tailStem: 'M86 152 C80 146 76 140 74 136',
  haunch: generateBlob(110, 204, 30, 24, 10, 3.2, Math.PI),
  haunchPaw: 'M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z',
  head: generateBlob(212, 100, 51, 46, 16, 3.6),
  topknot: generateBlob(212, 52, 17, 12, 8, 2.9, Math.PI),
  earL: generateBlob(170, 112, 19, 34, 10, 3.2, -Math.PI / 2, 12),
  earR: generateBlob(254, 112, 19, 34, 10, 3.2, -Math.PI / 2, -12),
  muzzle: 'M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z',
  nose: 'M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z',
  mouth: 'M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2',
  mouthOpen: 'M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z',
  tongue: 'M207.6 127.4 Q212 136.6 216.4 127.4 Z',
  collar: 'M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z',
  tag: 'M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z',
  ledgePaws: 'M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z',
  ledgeToes: 'M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5',
  shadow: { cx: 150, cy: 230, rx: 92, ry: 7 }
};

function generateLeg(w, h) {
  const hw = w / 2;
  return `M${-hw} -14 C${-hw} 4 -12 ${h - 18} -12 ${h - 9} C-12 ${h - 2} -7 ${h} 0 ${h} C9 ${h} 13 ${h - 3} 13 ${h - 9} C13 ${h - 18} ${hw} 4 ${hw} -14`;
}

const LEGS = {
  front: generateLeg(24, 228 - SHOULDER_N[1]),
  frontFar: generateLeg(22, 228 - SHOULDER_F[1]),
  back: generateLeg(30, 228 - HIP_N[1]),
  backFar: generateLeg(28, 228 - HIP_F[1])
};

function ellipsePath(cx, cy, rx, ry, deg) {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const p = (x, y) => `${(cx + x * cos - y * sin).toFixed(2)} ${(cy + x * sin + y * cos).toFixed(2)}`;
  return `M${p(rx, 0)}C${p(rx, 0.5523 * ry)} ${p(0.5523 * rx, ry)} ${p(0, ry)}C${p(-0.5523 * rx, ry)} ${p(-rx, 0.5523 * ry)} ${p(-rx, 0)}C${p(-rx, -0.5523 * ry)} ${p(-0.5523 * rx, -ry)} ${p(0, -ry)}C${p(0.5523 * rx, -ry)} ${p(rx, -0.5523 * ry)} ${p(rx, 0)}Z`;
}

const PAW_PRINT_PATH =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z' +
  ellipsePath(14.6, 29.2, 5.3, 6.9, -28) +
  ellipsePath(24.2, 16.6, 5.5, 7.3, -10) +
  ellipsePath(39.8, 16.6, 5.5, 7.3, 10) +
  ellipsePath(49.4, 29.2, 5.3, 6.9, 28);

// Poses definition
const BASE_POSE = {
  bodyRot: 0, bodyX: 0, bodyY: 0, stretch: 1,
  headX: 0, headY: 0, headRot: 0,
  earL: 0, earR: 0, tail: 0,
  fn: 0, ff: 0, bn: 0, bf: 0,
  sit: 0, eyes: 1, happy: 0, tongue: 0, mouth: 0, front: 0
};

const POSES = {
  stand: BASE_POSE,
  walk: { ...BASE_POSE, tail: -6, tongue: 1 },
  sit: { ...BASE_POSE, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...BASE_POSE, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...BASE_POSE, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1, tongue: 0 },
  lie: { ...BASE_POSE, bodyRot: -5, bodyY: 22, headX: 12, headY: 40, headRot: 3, fn: -84, ff: -80, sit: 1, tail: 58, tongue: 0 },
  sleep: { ...BASE_POSE, bodyRot: -5, bodyY: 22, headX: 14, headY: 44, headRot: -8, fn: -84, ff: -80, sit: 1, tail: 64, eyes: 0, earL: 4, earR: -4 },
  settle: { ...BASE_POSE, bodyRot: -5, bodyY: 22, headX: 10, headY: 16, fn: -84, ff: -80, sit: 1, tail: 40, tongue: 1 },
  hop: { ...BASE_POSE, bodyRot: -9, stretch: 1.06, headY: -6, fn: -42, ff: -32, bn: 40, bf: 30, earL: -26, earR: 26, tail: -24, tongue: 1 },
  sniff: { ...BASE_POSE, bodyRot: 7, headX: 16, headY: 32, headRot: 9, tail: -14, fn: 6, ff: 4 },
  bow: { ...BASE_POSE, bodyRot: 15, bodyY: 2, headX: 14, headY: 30, fn: -58, ff: -52, tail: -32, happy: 1, tongue: 1 },
  beg: { ...BASE_POSE, bodyRot: -36, bodyY: -6, headX: -18, headY: -18, sit: 1, fn: -70, ff: -64, tail: 30, happy: 1, tongue: 1 }
};

const BOXES = {
  sit: [50, 26, 284, 234],
  peek: [148, 34, 280, 163],
  snug: [148, 40, 280, 163],
  bow: [58, 56, 292, 236]
};
const DEFAULT_BOX = [48, 30, 288, 236];

const rnd = (e) => Math.round(100 * e) / 100;
const rot = (deg, [cx, cy]) => `rotate(${rnd(deg)} ${cx} ${cy})`;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (e) => e * e * (3 - 2 * e);
const smoothRatio = (e, t, a) => (t === e ? +(a >= t) : smoothstep(clamp01((a - e) / (t - e))));
const lerp = (a, b, t) => a + (b - a) * t;
const lerpBox = (e, t, a) => [lerp(e[0], t[0], a), lerp(e[1], t[1], a), lerp(e[2], t[2], a), lerp(e[3], t[3], a)];

function lerpPose(p0, p1, alpha) {
  const res = { ...p0 };
  for (const k in BASE_POSE) {
    res[k] = p0[k] + (p1[k] - p0[k]) * alpha;
  }
  return res;
}

// Compute all bone transforms for an active animation state (module 1063)
// NOTE: SVG transform attributes require pure numbers (NO px, NO deg)
function computePuppyFrame(pose, t) {
  const sinP = Math.sin(t.phase);
  const sinP_pi = Math.sin(t.phase + Math.PI);
  const strideAmp = 20 + 10 * t.stride;
  const pBounce = (1 - Math.cos(2 * t.phase)) / 2;
  const isMoving = +(t.stride > 0.01);
  const idleBreathe = Math.sin(2.4 * t.time) * (1 - isMoving);

  const bodyY = pose.bodyY - pBounce * (2.5 + 4 * t.stride) * isMoving + 0.6 * idleBreathe;
  const bodyRot = pose.bodyRot + 1.6 * Math.sin(t.phase) * isMoving;
  const invBodyRot = -pose.bodyRot;

  const wagAmp = 5 + 17 * t.wag;
  const wagFreq = 1.2 + 2.6 * t.wag;
  const tailRot = pose.tail + Math.sin(t.time * wagFreq * Math.PI * 2) * wagAmp;
  const headYOffset = -((1 - Math.cos(2 * t.phase - 0.7)) / 2) * (2 + 3 * t.stride) * isMoving + 0.9 * idleBreathe;

  return {
    body: `translate(${rnd(pose.bodyX)} ${rnd(bodyY)}) ${rot(bodyRot, BODY_CENTER)} translate(${BODY_CENTER[0]} 0) scale(${rnd(pose.stretch)} 1) translate(${-BODY_CENTER[0]} 0)`,
    fn: `translate(${SHOULDER_N[0]} ${SHOULDER_N[1]}) rotate(${rnd(pose.fn + invBodyRot + sinP * strideAmp * isMoving)})`,
    ff: `translate(${SHOULDER_F[0]} ${SHOULDER_F[1]}) rotate(${rnd(pose.ff + invBodyRot + sinP_pi * strideAmp * isMoving)})`,
    bn: `translate(${HIP_N[0]} ${HIP_N[1]}) rotate(${rnd(pose.bn + sinP_pi * strideAmp * isMoving)})`,
    bf: `translate(${HIP_F[0]} ${HIP_F[1]}) rotate(${rnd(pose.bf + sinP * strideAmp * isMoving)})`,
    tail: rot(tailRot, TAIL_BASE),
    haunch: `translate(0 ${rnd(-0.06 * pose.bodyRot)})`,
    head: `translate(${rnd(pose.headX)} ${rnd(pose.headY + headYOffset)}) ${rot(pose.headRot + 1.4 * Math.sin(t.phase) * isMoving, HEAD_CENTER)}`,
    earL: rot(pose.earL + t.ear + 4 * Math.sin(2 * t.phase) * isMoving, EAR_L),
    earR: rot(pose.earR - t.ear - 4 * Math.sin(2 * t.phase) * isMoving, EAR_R),
    eyes: `translate(${rnd(3.4 * t.gazeX)} ${rnd(2.6 * t.gazeY)})`,
    blink: `translate(0 ${rnd(98 * t.blink * 0.92)}) scale(1 ${rnd(1 - 0.92 * t.blink)})`,
    openEyes: rnd(Math.max(0, pose.eyes - pose.happy)),
    happyEyes: rnd(Math.min(pose.happy, pose.eyes)),
    shutEyes: rnd(1 - pose.eyes),
    tongue: rnd(pose.tongue * (1 - pose.mouth)),
    mouth: rnd(pose.mouth),
    backLegs: rnd(1 - pose.sit),
    haunchOpacity: rnd(pose.sit * (1 - pose.front)),
    side: rnd(1 - pose.front),
    ledge: rnd(pose.front),
    shadow: `translate(${rnd(0.6 * pose.bodyX)} 0) scale(${rnd(1 - 0.05 * pBounce * isMoving)} 1)`,
    shadowOpacity: rnd(0.12 * (1 - pose.front))
  };
}

// Low-level Puppy Actor running on requestAnimationFrame (module 89681)
class PupActor {
  constructor(svg, initialPose = 'sit', facing = 1) {
    this.svg = svg;
    this.els = new Map();
    this.written = new Map();
    this.m = { phase: 0, stride: 0, time: 0, wag: 0.35, gazeX: 0, gazeY: 0, blink: 0, ear: 0 };
    this.strideTarget = 0;
    this.wagTarget = 0.35;
    this.gazeTarget = { x: 0, y: 0 };
    this.tilt = 0;
    this.tiltTarget = 0;
    this.earV = 0;
    this.nextBlink = 1.2;
    this.blinkAt = -1;
    this.woofUntil = 0;
    this.bounce = 0;
    this.bounceV = 0;
    this.offset = 0;
    this.offsetTarget = 0;
    this.pet = 0;
    this.petTarget = 0;
    this.turn = 0.07;
    this.lean = 0;

    svg.querySelectorAll('[data-p]').forEach((el) => this.els.set(el.dataset.p, el));
    this.pose = { ...(POSES[initialPose] || POSES.sit) };
    this.target = this.pose;
    this.facing = facing;
    this.facingTarget = facing;
  }

  setPose(p) {
    this.target = typeof p === 'string' ? POSES[p] || POSES.sit : p;
  }

  jump(p, facing) {
    this.pose = { ...(POSES[p] || POSES.sit) };
    this.target = this.pose;
    if (facing) {
      this.facing = this.facingTarget = facing;
    }
  }

  face(dir, turnSpeed = 0.07) {
    this.facingTarget = dir;
    this.turn = turnSpeed;
  }

  get facingDir() {
    return this.facingTarget;
  }

  stride(val) {
    this.strideTarget = Math.max(0, Math.min(1, val));
  }

  advance(dist) {
    this.m.phase += (dist / 46) * Math.PI;
  }

  walkedTo(totalDist) {
    this.m.phase = (totalDist / 46) * Math.PI;
  }

  wag(val) {
    this.wagTarget = Math.max(0, Math.min(1, val));
  }

  cock(deg) {
    this.tiltTarget = deg;
  }

  lookAt(point) {
    if (!point) {
      this.gazeTarget = { x: 0, y: 0 };
      return;
    }
    const rect = this.svg.getBoundingClientRect();
    const eyeX = this.facingTarget > 0 ? HEAD_CENTER[0] : W - HEAD_CENTER[0];
    const originX = rect.left + (eyeX / W) * rect.width;
    const originY = rect.top + (EYE_Y / R) * rect.height;
    const dx = point.x - originX;
    const dy = point.y - originY;
    const dist = Math.hypot(dx, dy) || 1;
    const factor = Math.min(1, dist / 160);
    this.gazeTarget = { x: (dx / dist) * factor * this.facingTarget, y: (dy / dist) * factor };
  }

  woof(time) {
    this.woofUntil = time + 0.34;
    this.bounceV = -150;
    this.earV += 260;
  }

  jolt(mult = 1) {
    this.earV += 220 * mult;
  }

  hop(mult = 1) {
    this.bounceV = -230 * mult;
    this.earV += 200 * mult;
  }

  yawn(time, dur = 0.9) {
    this.woofUntil = time + dur;
  }

  dash(dist) {
    this.offsetTarget = dist;
  }

  petting(isPet) {
    this.petTarget = isPet ? 1 : 0;
  }

  reset() {
    this.offsetTarget = 0;
    this.tiltTarget = 0;
    this.petTarget = 0;
  }

  tick(dt, time) {
    dt = Math.min(dt, 0.05);
    const m = this.m;
    m.time = time;

    const smoothAlpha = 1 - Math.exp(-dt / 0.16);
    this.pose = lerpPose(this.pose, this.target, smoothAlpha);

    this.facing += (this.facingTarget - this.facing) * (1 - Math.exp(-dt / this.turn));
    m.stride += (this.strideTarget - m.stride) * (1 - Math.exp(-dt / 0.12));
    if (m.stride < 0.012 && this.strideTarget === 0) m.stride = 0;

    m.wag += (this.wagTarget - m.wag) * (1 - Math.exp(-dt / 0.4));
    m.gazeX += (this.gazeTarget.x - m.gazeX) * (1 - Math.exp(-dt / 0.07));
    m.gazeY += (this.gazeTarget.y - m.gazeY) * (1 - Math.exp(-dt / 0.07));

    this.tilt += (this.tiltTarget + 3 * m.gazeX - this.tilt) * (1 - Math.exp(-dt / 0.18));

    this.earV += (-150 * m.ear - 10 * this.earV) * dt;
    m.ear = Math.max(-28, Math.min(28, m.ear + this.earV * dt));

    this.bounceV += (-260 * this.bounce - 16 * this.bounceV) * dt;
    this.bounce += this.bounceV * dt;

    const prevOffset = this.offset;
    this.offset += (this.offsetTarget - this.offset) * (1 - Math.exp(-dt / 0.2));
    if (Math.abs(this.offsetTarget - this.offset) < 0.05) this.offset = this.offsetTarget;
    const diff = Math.abs(this.offset - prevOffset);
    if (diff) this.advance(diff);
    const speed = dt > 0 ? Math.min(1, diff / dt / 180) : 0;

    this.pet += (this.petTarget - this.pet) * (1 - Math.exp(-dt / 0.15));

    if (time > this.nextBlink && this.pose.eyes > 0.6) {
      this.blinkAt = time;
      this.nextBlink = time + 2.2 + 3.8 * Math.random();
      if (Math.random() < 0.18) this.nextBlink = time + 0.32;
    }
    const blinkProgress = (time - this.blinkAt) / 0.15;
    m.blink = blinkProgress >= 0 && blinkProgress <= 1 ? Math.sin(blinkProgress * Math.PI) : 0;

    const activePose = {
      ...this.pose,
      headRot: this.pose.headRot + this.tilt,
      bodyRot: this.pose.bodyRot + this.lean,
      bodyY: this.pose.bodyY + this.bounce,
      headY: this.pose.headY + 1.15 * this.bounce,
      mouth: time < this.woofUntil ? 1 : this.pose.mouth,
      happy: Math.max(this.pose.happy, this.pet)
    };

    const frame = computePuppyFrame(activePose, speed > m.stride ? { ...m, stride: speed } : m);
    const safeFacing = Math.abs(this.facing) < 0.02 ? 0.02 * Math.sign(this.facing || 1) : this.facing;
    const rootTransform = `translate(${this.offset.toFixed(1)} 0) translate(${W / 2} 0) scale(${safeFacing.toFixed(3)} 1) translate(${-W / 2} 0)`;

    const mappings = [
      ['root', 'transform', rootTransform],
      ['shadow', 'transform', frame.shadow],
      ['shadow', 'opacity', frame.shadowOpacity],
      ['body', 'transform', frame.body],
      ['body', 'opacity', frame.side],
      ['bf', 'transform', frame.bf],
      ['bf', 'opacity', frame.backLegs],
      ['bn', 'transform', frame.bn],
      ['bn', 'opacity', frame.backLegs],
      ['ff', 'transform', frame.ff],
      ['fn', 'transform', frame.fn],
      ['tail', 'transform', frame.tail],
      ['haunch', 'transform', frame.haunch],
      ['haunch', 'opacity', frame.haunchOpacity],
      ['head', 'transform', frame.head],
      ['earL', 'transform', frame.earL],
      ['earR', 'transform', frame.earR],
      ['eyes', 'transform', frame.eyes],
      ['open', 'opacity', frame.openEyes],
      ['blink', 'transform', frame.blink],
      ['happy', 'opacity', frame.happyEyes],
      ['shut', 'opacity', frame.shutEyes],
      ['tongue', 'opacity', frame.tongue],
      ['mouth', 'opacity', frame.mouth],
      ['ledge', 'opacity', frame.ledge]
    ];

    for (const [part, attr, val] of mappings) {
      const el = this.els.get(part);
      if (!el) continue;
      const key = `${part}:${attr}`;
      const sVal = String(val);
      if (this.written.get(key) !== sVal) {
        el.setAttribute(attr, sVal);
        this.written.set(key, sVal);
      }
    }
  }
}

// Burst floating hearts
function spawnHearts(container, x, y) {
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('span');
    s.className = 'pup-heart';
    s.textContent = '❤';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    container.appendChild(s);

    const xOffset = (Math.random() - 0.5) * 90;
    const yOffset = -70 - 60 * Math.random();

    s.animate(
      [
        { transform: 'translate(-50%, 0) scale(0.4)', opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: `translate(calc(-50% + ${xOffset.toFixed(0)}px), ${yOffset.toFixed(0)}px) scale(1.1)`, opacity: 0 }
      ],
      {
        duration: 1150 + 110 * i,
        delay: 80 * i,
        easing: 'cubic-bezier(.2, .7, .3, 1)',
        fill: 'backwards'
      }
    ).finished.then(() => s.remove(), () => s.remove());
  }
}

// Interactive tricks schedule (module 8478)
const TRICKS = {
  woof: ({ d, say }, t) => [
    [t, (now) => { d.woof(now); say('woof!'); }],
    [t + 0.42, (now) => { d.woof(now); say('woof woof!'); }]
  ],
  spin: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose('stand'); d.hop(0.5); }],
    [t + 0.14, () => d.face(-facing)],
    [t + 0.38, () => d.face(facing)],
    [t + 0.62, () => d.face(-facing)],
    [t + 0.86, () => { d.face(facing); say('wheee!'); }],
    [t + 1.3, () => d.setPose(rest)]
  ],
  beg: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('beg'); d.wag(1); say('treat, please?', 1.7); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }]
  ],
  bow: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('bow'); d.wag(1); say('play with me!'); }],
    [t + 0.55, () => d.hop(0.45)],
    [t + 1.7, () => { d.setPose(rest); d.wag(0.7); }]
  ],
  hop: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('hop'); d.hop(1.1); say('boing!'); }],
    [t + 0.36, () => d.setPose(rest)],
    [t + 0.62, () => { d.setPose('hop'); d.hop(0.8); }],
    [t + 0.98, () => d.setPose(rest)]
  ],
  love: ({ d, rest, say, hearts }, t) => [
    [t, () => { d.setPose({ ...rest, happy: 1, tongue: 1 }); d.wag(1); hearts(); say('I like you!', 1.5); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }]
  ],
  tilt: ({ d, say }, t) => [
    [t, () => { d.cock(-14); say('hm?'); }],
    [t + 0.8, () => d.cock(12)],
    [t + 1.6, () => d.cock(0)]
  ],
  sneeze: ({ d, say }, t) => [
    [t, () => d.cock(-8)],
    [t + 0.32, (now) => { d.cock(10); d.jolt(1.4); d.hop(0.35); d.yawn(now, 0.22); say('achoo!'); }],
    [t + 0.8, () => d.cock(0)]
  ],
  zoomies: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose('walk'); d.wag(1); say('zoomies!', 2); }],
    [t + 0.05, () => { d.face(1); d.dash(70); }],
    [t + 0.5, () => { d.face(-1); d.dash(-70); }],
    [t + 0.98, () => { d.face(1); d.dash(50); }],
    [t + 1.4, () => { d.face(-1); d.dash(-30); }],
    [t + 1.78, () => { d.face(1); d.dash(0); }],
    [t + 2.25, () => { d.face(facing); d.setPose(rest); d.wag(0.7); }]
  ],
  peekaboo: ({ d, say }, t) => [
    [t, () => d.setPose({ ...POSES.peek, headY: 120 })],
    [t + 0.55, () => { d.setPose('peek'); d.jolt(1.2); say('peekaboo!'); }]
  ]
};

const TRICK_NAMES = ['woof', 'spin', 'beg', 'bow', 'hop', 'love', 'tilt', 'sneeze'];

// Evaluate cubic Bezier
function evalCubicBezier(p0, c1, c2, p1, t) {
  const inv = 1 - t;
  const inv2 = inv * inv;
  const inv3 = inv2 * inv;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: inv3 * p0.x + 3 * inv2 * t * c1.x + 3 * inv * t2 * c2.x + t3 * p1.x,
    y: inv3 * p0.y + 3 * inv2 * t * c1.y + 3 * inv * t2 * c2.y + t3 * p1.y
  };
}

// Clamp stop anchor point to viewport safe rectangle (y helper in module 91360)
function clampToViewport(x, y, s, box, safe) {
  const leftMargin = (D.x - box[0]) * s;
  const rightMargin = (box[2] - D.x) * s;
  const topMargin = (D.y - box[1]) * s;
  const bottomMargin = (box[3] - D.y) * s;

  let clampedX = x;
  if (safe.right - safe.left > leftMargin + rightMargin) {
    clampedX = Math.min(safe.right - rightMargin, Math.max(safe.left + leftMargin, x));
  } else {
    clampedX = (safe.left + safe.right) / 2 - (rightMargin - leftMargin) / 2;
  }

  let clampedY = y;
  if (safe.bottom - safe.top > topMargin + bottomMargin) {
    clampedY = Math.min(safe.bottom - bottomMargin, Math.max(safe.top + topMargin, y));
  } else {
    clampedY = safe.bottom - bottomMargin;
  }

  return { x: clampedX, y: clampedY };
}

// Resolve absolute viewport point for a given stop at current scroll (f helper in module 91360)
function getStopPoint(stop, currScroll) {
  const track = stop.track;
  let yVal;
  if (track.kind === 'page') {
    yVal = track.top - currScroll;
  } else if (track.kind === 'screen') {
    yVal = track.top;
  } else {
    // track.kind === 'pin'
    if (currScroll < track.from) {
      yVal = track.top - (currScroll - track.from);
    } else if (currScroll > track.to) {
      yVal = track.top - (currScroll - track.to);
    } else {
      yVal = track.top;
    }
  }
  return {
    x: stop.x + D.x * stop.s,
    y: yVal + D.y * stop.s
  };
}

// Find active segment in holds array (x helper in module 91360)
function findSegment(holds, currScroll) {
  if (!holds.length || currScroll <= holds[0][1]) {
    return { k: 0, t: 0 };
  }
  for (let i = 0; i < holds.length - 1; i++) {
    const holdEnd = holds[i][1];
    const nextHoldStart = holds[i + 1][0];
    if (currScroll < nextHoldStart) {
      return { k: i, t: clamp01((currScroll - holdEnd) / Math.max(1, nextHoldStart - holdEnd)) };
    }
    if (currScroll <= holds[i + 1][1]) {
      return { k: i + 1, t: 0 };
    }
  }
  return { k: holds.length - 1, t: 0 };
}

// Generate natural Bezier control points between two points (N helper in module 91360)
function makeBezier(p0, p1, safe) {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const safeW = safe.right - safe.left;
  const l = Math.max(0.45 * Math.abs(dx), 0);
  const dir = dx >= 0 ? 1 : -1;

  let c1 = { x: p0.x + dir * l, y: p0.y };
  let c2 = { x: p1.x - dir * l, y: p1.y };

  const minDist = 0.14 * safeW;
  if (Math.abs(dx) < minDist) {
    const midX = (p0.x + p1.x) / 2;
    const centerSafe = (safe.left + safe.right) / 2;
    const curveSign = midX < centerSafe ? 1 : -1;
    const offset = curveSign * (minDist - Math.abs(dx)) * 0.9;
    c1 = { x: c1.x + offset, y: lerp(p0.y, p1.y, 0.2) };
    c2 = { x: c2.x + offset, y: lerp(p0.y, p1.y, 0.8) };
  }

  const clampPt = (pt) => ({
    x: Math.min(safe.right, Math.max(safe.left, pt.x)),
    y: Math.min(safe.bottom, Math.max(safe.top, pt.y))
  });

  return {
    p0,
    c1: clampPt(c1),
    c2: clampPt(c2),
    p1
  };
}

export default function PupJourney() {
  const layerRef = useRef(null);
  const actorRef = useRef(null);
  const bodyRef = useRef(null);
  const bubbleRef = useRef(null);
  const bubbleWrapperRef = useRef(null);
  const printsRef = useRef(null);
  const probeRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const layer = layerRef.current;
    const actor = actorRef.current;
    const body = bodyRef.current;
    const bubble = bubbleRef.current;
    const bubbleWrapper = bubbleWrapperRef.current;
    const printsContainer = printsRef.current;
    const probe = probeRef.current;
    if (!layer || !actor || !body || !bubble || !printsContainer || !probe) return;

    const svg = body.querySelector('svg');
    if (!svg) return;

    const rootDoc = document.documentElement;
    const pawSVGs = [...printsContainer.children];
    let pawIndex = 0;

    let routeData = null;
    let actorInstance = null;
    let animFrameId = null;
    let isLive = false;

    let lastTime = performance.now() / 1e3;
    let lastScrollY = window.scrollY;
    let lastScrollActiveTime = performance.now() / 1e3;
    let scrollDirection = 1;

    let actionQueue = [];
    let speechUntil = 0;
    let currentLookTarget = null;
    let mousePos = null;

    let currentStopK = -1;
    let stopArrivalTime = 0;
    let lastStopActiveTime = 0;
    let lastTrackLeft = null;
    let treadmillIdleTimer = 0;

    let prevPos = null;
    let stoppedTimer = 0;
    let lastStepStopIdx = -1;
    let lastStepIdx = 0;
    let smoothOffset = { x: 0, y: 0, s: 0 };
    let lastRoutePos = null;

    let comboClicks = 0;
    let comboLastTime = 0;
    let lastTrickName = null;

    const say = (text, time, dur = 1.4) => {
      bubble.textContent = text;
      bubble.dataset.show = 'true';
      speechUntil = time + dur;
    };

    // Calculate safe viewport bounds
    const getSafeRect = (isLane) => {
      const clientW = rootDoc.clientWidth;
      const headerEl = document.getElementById('site-header');
      const topSafe = (headerEl ? headerEl.offsetHeight : 76) + 10;
      const whatsappBar = document.querySelector('[data-whatsapp-bar]');
      const whatsappTop = whatsappBar && whatsappBar.getClientRects().length ? whatsappBar.getBoundingClientRect().top : window.innerHeight;

      if (isLane) {
        return {
          left: 10,
          top: topSafe,
          right: clientW - 10,
          bottom: whatsappTop + 40
        };
      }
      return {
        left: 10,
        top: topSafe,
        right: clientW - 10,
        bottom: Math.min(window.innerHeight, whatsappTop) - 10
      };
    };

    // Scan all [data-pup-stop="true"] elements
    const scanRoute = () => {
      const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 519px)').matches;
      const clientW = rootDoc.clientWidth;
      const probeHeight = probe.getBoundingClientRect().height || window.innerHeight;
      const safeRect = getSafeRect(isMobile);
      const mainEl = document.getElementById('main');

      const stops = [];
      const meta = [];
      const rawHolds = [];

      const processStop = (el) => {
        const rect = el.getBoundingClientRect();
        const pose = el.dataset.pose || 'sit';
        const act = el.dataset.act || '';
        const rawScale = rect.width / 300;
        const scale = act === 'basket' || isMobile ? rawScale : 1.12 * rawScale;
        const anchor = pose === 'peek' ? { x: D.x, y: 159 } : D;

        // Track kind detection (sticky / pinned vs normal page)
        let trackKind = 'page';
        let trackTop = rect.top + window.scrollY;
        let trackFrom = 0;
        let trackTo = 0;

        let stickyParent = null;
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (getComputedStyle(p).position === 'sticky') {
            stickyParent = p;
            break;
          }
        }

        if (stickyParent) {
          const stickyTop = parseFloat(getComputedStyle(stickyParent).top) || 0;
          const stickyRect = stickyParent.getBoundingClientRect();
          const pSection = stickyParent.closest('section') || stickyParent.parentElement;
          const pSectionRect = pSection.getBoundingClientRect();
          const from = stickyRect.top + window.scrollY - stickyTop;
          const to = pSectionRect.bottom + window.scrollY - stickyRect.height - stickyTop;

          if (to > from) {
            trackKind = 'pin';
            trackTop = stickyTop + (rect.top - stickyRect.top);
            trackFrom = from;
            trackTo = to;
          }
        }

        const trackObj = trackKind === 'pin'
          ? { kind: 'pin', top: trackTop + anchor.y * (rawScale - scale), from: trackFrom, to: trackTo }
          : { kind: 'page', top: trackTop + anchor.y * (rawScale - scale) };

        const stopObj = {
          x: rect.left + anchor.x * (rawScale - scale),
          track: trackObj,
          s: scale,
          behind: el.dataset.behind === 'true',
          sink: 0,
          box: BOXES[pose] || DEFAULT_BOX
        };

        const scene = el.closest('[data-pup-scene]');
        stops.push(stopObj);
        meta.push({
          scene,
          pose,
          facing: el.dataset.facing === 'left' ? -1 : 1,
          act,
          looks: scene ? [...scene.querySelectorAll('[data-pup-look]')] : [],
          track: act === 'treadmill' ? scene?.querySelector('[data-treadmill]') || null : null
        });

        // Compute hold range
        let fromScroll, toScroll;
        if (trackObj.kind === 'pin') {
          fromScroll = trackObj.from;
          toScroll = trackObj.to;
        } else {
          const sTop = trackObj.top;
          const nTop = sTop + stopObj.box[1] * stopObj.s;
          const lBottom = sTop + stopObj.box[3] * stopObj.s;
          const rMid = (nTop + lBottom) / 2;
          const safeH = safeRect.bottom - safeRect.top;
          const M_range = isMobile ? [0.6, 0.86] : [0.42, 0.78];
          let o = rMid - (safeRect.top + M_range[1] * safeH);
          let d = rMid - (safeRect.top + M_range[0] * safeH);
          o = Math.max(o, lBottom - safeRect.bottom);
          d = Math.min(d, nTop - safeRect.top);
          if (o > d) o = d = rMid - (safeRect.top + safeH / 2);
          fromScroll = o;
          toScroll = d;
        }

        if (!isMobile && scene && trackObj.kind === 'page' && act !== 'basket' && act !== 'peekaboo') {
          const safeH = safeRect.bottom - safeRect.top;
          const sceneTop = scene.getBoundingClientRect().top + window.scrollY - safeRect.top + 0.08 * safeH;
          const stopBottom = trackObj.top + stopObj.box[3] * stopObj.s - safeRect.bottom;
          if (toScroll > sceneTop) {
            const s = Math.max(sceneTop, stopBottom + 0.12 * safeH);
            fromScroll = Math.max(stopBottom, s - Math.max(toScroll - fromScroll, 0.2 * safeH));
            toScroll = s;
          }
        }

        rawHolds.push([fromScroll, toScroll]);
      };

      const stopEls = [...document.querySelectorAll('[data-pup-stop="true"]')].filter((e) => e.getClientRects().length > 0);

      if (isMobile) {
        const laneStops = stopEls.filter((e) => e.dataset.lane === 'true');
        const first = laneStops[0];
        const last = laneStops.length > 1 ? laneStops[laneStops.length - 1] : undefined;
        if (first) processStop(first);

        const firstScene = meta[0]?.scene;
        const otherScenes = [...document.querySelectorAll('#main [data-pup-scene]')].filter(
          (e) => e !== firstScene && e.getClientRects().length > 0
        );

        const laneScale = Math.min(0.62, Math.max(0.5, clientW / 650));
        const peekBox = BOXES.peek;

        otherScenes.forEach((scene, idx) => {
          const isLeft = idx % 2 === 0;
          const stopX = isLeft ? safeRect.left + 2 - peekBox[0] * laneScale : safeRect.right - 2 - peekBox[2] * laneScale;
          stops.push({
            x: stopX,
            track: { kind: 'screen', top: 0 },
            s: laneScale,
            behind: false,
            sink: D.y - 159,
            box: peekBox
          });
          meta.push({
            scene,
            pose: 'peek',
            facing: isLeft ? 1 : -1,
            act: 'lane',
            looks: [],
            track: null
          });
          const sRect = scene.getBoundingClientRect();
          const from = sRect.top + window.scrollY - 0.42 * probeHeight;
          const to = sRect.bottom + window.scrollY - 0.58 * probeHeight;
          rawHolds.push(from <= to ? [from, to] : [(from + to) / 2, (from + to) / 2]);
        });

        if (last) processStop(last);
      } else {
        stopEls.forEach(processStop);
      }

      if (stops.length < 2) return null;

      // Normalize hold intervals
      const maxScroll = rootDoc.scrollHeight - window.innerHeight;
      const nHolds = rawHolds.map(([f, t]) => (f <= t ? [f, t] : [(f + t) / 2, (f + t) / 2]));
      nHolds[0][0] = -Infinity;
      nHolds[nHolds.length - 1][1] = Infinity;
      nHolds[nHolds.length - 1][0] = Math.min(nHolds[nHolds.length - 1][0], maxScroll - 1);

      for (let i = 0; i < nHolds.length - 1; i++) {
        const cur = nHolds[i];
        const next = nHolds[i + 1];
        if (next[0] < cur[1]) {
          const mid = (cur[1] + next[0]) / 2;
          cur[1] = Math.max(cur[0], mid);
          next[0] = Math.min(next[1], mid);
          if (next[0] < cur[1]) next[0] = cur[1];
        }
      }

      return {
        lane: isMobile,
        stops,
        meta,
        holds: nHolds,
        blend: 0.12 * probeHeight,
        mainTop: mainEl ? mainEl.getBoundingClientRect().top + window.scrollY : 0
      };
    };

    // Trajectory evaluator (eb in module 91360)
    const evaluateRoute = (data, currScroll) => {
      const { stops, holds, blend, lane } = data;
      const safe = getSafeRect(lane);

      const { k, t } = findSegment(holds, currScroll);

      if (t <= 0 || k >= stops.length - 1) {
        const s = stops[k];
        const rawPt = getStopPoint(s, currScroll);
        const clamped = clampToViewport(rawPt.x, rawPt.y, s.s, s.box, safe);
        return {
          x: clamped.x,
          y: clamped.y,
          s: s.s,
          front: !s.behind,
          airborne: false,
          k,
          t: 0,
          walked: 0
        };
      }

      const s0 = stops[k];
      const s1 = stops[k + 1];
      const hold0End = holds[k][1];
      const hold1Start = holds[k + 1][0];
      const segSpan = Math.max(1, hold1Start - hold0End);
      const rawV = clamp01((currScroll - hold0End) / segSpan);

      const pt0 = getStopPoint(s0, hold0End);
      const pt1 = getStopPoint(s1, hold1Start);

      const bezCurve = makeBezier(
        { x: pt0.x, y: pt0.y - s0.sink * s0.s },
        { x: pt1.x, y: pt1.y - s1.sink * s1.s },
        safe
      );

      // Hermite quintic smootherstep (6v^5 - 15v^4 + 10v^3)
      const w = rawV * rawV * rawV * (rawV * (6 * rawV - 15) + 10);
      const bezPos = evalCubicBezier(bezCurve.p0, bezCurve.c1, bezCurve.c2, bezCurve.p1, w);
      const curScale = lerp(s0.s, s1.s, smoothstep(clamp01(rawV / 0.65)));

      const blendR = Math.min(0.3, Math.max(0.06, blend / segSpan));
      const S = 1 - smoothRatio(0, blendR, rawV);
      const T = smoothRatio(1 - blendR, 1, rawV);

      let finalY = bezPos.y + S * (getStopPoint(s0, currScroll).y - pt0.y) + T * (getStopPoint(s1, currScroll).y - pt1.y);
      let finalX = bezPos.x;

      finalY += s0.sink * s0.s * (1 - smoothRatio(0, 0.22, rawV)) + s1.sink * s1.s * smoothRatio(0.78, 1, rawV);

      let isAirborne = false;
      if (s0.behind && rawV < 0.36) {
        finalY -= Math.sin((rawV / 0.36) * Math.PI) * Math.min(64 * s0.s, 72);
        isAirborne = rawV < 0.32;
      }
      if (s1.behind && rawV > 0.68) {
        finalY -= Math.sin(((rawV - 0.68) / 0.32) * Math.PI) * Math.min(56 * s1.s, 60);
        isAirborne = true;
      }
      if (s0.sink && rawV < 0.2) isAirborne = true;

      const isFront = !(s0.behind && rawV < 0.12 || s1.behind && rawV > 0.92);

      const box0 = s0.box;
      const box1 = s1.box;
      const curBox = rawV < 0.5
        ? lerpBox(box0, DEFAULT_BOX, smoothRatio(0, s0.sink ? 0.22 : s0.behind ? 0.36 : 0.06, rawV))
        : lerpBox(DEFAULT_BOX, box1, smoothRatio(s1.sink ? 0.78 : s1.behind ? 0.68 : 0.94, 1, rawV));

      const clamped = clampToViewport(finalX, finalY, curScale, curBox, safe);

      // Calculate path arc length walked
      let walked = 0;
      let prevSample = bezCurve.p0;
      const nSamples = Math.max(1, Math.ceil(32 * clamp01(w)));
      for (let i = 1; i <= nSamples; i++) {
        const curSample = evalCubicBezier(bezCurve.p0, bezCurve.c1, bezCurve.c2, bezCurve.p1, (i / nSamples) * clamp01(w));
        walked += Math.hypot(curSample.x - prevSample.x, curSample.y - prevSample.y);
        prevSample = curSample;
      }

      return {
        x: clamped.x,
        y: clamped.y,
        s: curScale,
        front: isFront,
        airborne: isAirborne,
        k,
        t: rawV,
        walked
      };
    };

    // Start puppy journey
    const startJourney = () => {
      const data = scanRoute();
      if (!data) return;

      routeData = data;
      isLive = true;
      rootDoc.dataset.pup = data.lane ? 'lane' : 'live';
      layer.hidden = false;

      const firstMeta = data.meta[0];
      actorInstance = new PupActor(svg, firstMeta.pose, firstMeta.facing);
      lastScrollY = window.scrollY;
      lastTime = performance.now() / 1e3;
      prevPos = null;

      const now = lastTime;
      const initRoute = evaluateRoute(data, lastScrollY);
      if (initRoute.k === 0 && initRoute.t === 0 && firstMeta.act === 'peekaboo') {
        currentStopK = 0;
        stopArrivalTime = now;
        const peekPose = { ...POSES.peek, headY: 120 };
        const friends = firstMeta.scene ? [...firstMeta.scene.querySelectorAll('[data-pup-friend]')] : [];
        const f0 = friends[0];
        const fLast = friends[friends.length - 1];

        actionQueue = [
          [now + 0.1, () => actorInstance.setPose(peekPose)],
          [now + 0.7, (t) => { actorInstance.setPose('peek'); actorInstance.jolt(1.2); say('peekaboo!', t, 1.6); }],
          [now + 1.5, (t) => f0 && (currentLookTarget = { el: f0, until: t + 0.8 })],
          [now + 2.3, (t) => fLast && (currentLookTarget = { el: fLast, until: t + 0.8 })],
          [now + 3.1, () => { currentLookTarget = null; actorInstance.wag(1); }]
        ];
      } else {
        currentStopK = -1;
      }
    };

    const stopJourney = () => {
      if (!isLive) return;
      isLive = false;
      delete rootDoc.dataset.pup;
      layer.hidden = true;
      delete layer.dataset.anchor;

      if (routeData) {
        routeData.meta.forEach((m) => {
          if (m.scene) {
            delete m.scene.dataset.here;
            delete m.scene.dataset.visited;
          }
        });
      }
      routeData = null;
      actorInstance = null;
      currentStopK = -1;
      actionQueue = [];
    };

    // Main Animation Loop running on requestAnimationFrame (e_ in module 91360)
    const onTick = () => {
      if (!isLive || !routeData || !actorInstance) {
        animFrameId = requestAnimationFrame(onTick);
        return;
      }

      const now = performance.now() / 1e3;
      const dt = Math.min(0.05, now - lastTime);
      lastTime = now;

      const currScroll = window.scrollY;
      const scrollDiff = currScroll - lastScrollY;
      lastScrollY = currScroll;

      if (Math.abs(scrollDiff) > 0.5) {
        lastScrollActiveTime = now;
        scrollDirection = scrollDiff > 0 ? 1 : -1;
      }

      // Execute queued action items
      while (actionQueue.length && actionQueue[0][0] <= now) {
        const [, fn] = actionQueue.shift();
        fn(now);
      }

      // Smooth camera filter & route evaluation
      const routePos = evaluateRoute(routeData, currScroll);
      const isHolding = routePos.t === 0;
      const k = routePos.k;

      // Exponential decay on offset
      const decay = Math.exp(-dt / 0.28);
      smoothOffset.x *= decay;
      smoothOffset.y *= decay;
      smoothOffset.s *= decay;
      if (Math.abs(smoothOffset.x) < 0.05 && Math.abs(smoothOffset.y) < 0.05) {
        smoothOffset.x = smoothOffset.y = 0;
      }

      const curScale = routePos.s + smoothOffset.s;
      const finalX = routePos.x + smoothOffset.x;
      const finalY = routePos.y + smoothOffset.y;

      // Update visited / here attributes on scenes
      routeData.meta.forEach((m, idx) => {
        if (m.scene) {
          m.scene.dataset.here = String(isHolding && idx === k);
          m.scene.dataset.visited = String(idx <= k || (idx === k + 1 && routePos.t > 0.92));
        }
      });

      if (isHolding) {
        // Puppy is resting at a stop
        if (currentStopK !== k) {
          currentStopK = k;
          stopArrivalTime = now;
          lastStopActiveTime = now;
          actionQueue = [];
          currentLookTarget = null;
          lastTrackLeft = null;

          const meta = routeData.meta[k];
          actorInstance.reset();
          actorInstance.setPose(meta.pose);
          actorInstance.face(meta.facing, 0.14);
          actorInstance.stride(0);
          actorInstance.wag(meta.act === 'basket' ? 0.3 : 0.7);
          actorInstance.jolt(0.4);
        }

        const meta = routeData.meta[k];

        // Meet the pups treadmill walk integration
        if (meta.track && !actionQueue.length) {
          const trackLeft = meta.track.getBoundingClientRect().left;
          const diff = lastTrackLeft === null ? 0 : trackLeft - lastTrackLeft;
          lastTrackLeft = trackLeft;

          actorInstance.walkedTo(-trackLeft / curScale);

          if (Math.abs(diff) > 0.15) {
            treadmillIdleTimer = 0;
            actorInstance.setPose('walk');
            actorInstance.stride(1);
            actorInstance.face(diff < 0 ? 1 : -1, 0.16);
          } else {
            treadmillIdleTimer += dt;
            if (treadmillIdleTimer > 0.25) {
              actorInstance.setPose('stand');
              actorInstance.stride(0);
            }
          }
        }

        // Questions / FAQ tilt action
        if (meta.act === 'tilt' && !actionQueue.length && now - stopArrivalTime > 1.2) {
          const wave = Math.sin(0.9 * now);
          actorInstance.cock(wave > 0.35 ? 13 : wave < -0.35 ? -10 : 0);
        }

        // Random idle puppy behavior while resting
        if (!actionQueue.length && !meta.track && meta.act !== 'basket' && now - lastStopActiveTime > 9) {
          lastStopActiveTime = now;
          if (Math.random() < 0.55) {
            actionQueue = TRICKS.tilt({ d: actorInstance, say: (txt) => say(txt, now) }, now);
          } else {
            actionQueue = [
              [now, () => actorInstance.wag(1)],
              [now + 2.4, () => actorInstance.wag(0.7)]
            ];
          }
        }
      } else {
        // Puppy is walking / running between stops!
        if (currentStopK !== -1) {
          currentStopK = -1;
          actionQueue = [];
          actorInstance.reset();
        }

        const moveDist = prevPos ? Math.hypot(finalX - prevPos.x, finalY - prevPos.y) : 0;
        stoppedTimer = moveDist > 0.25 ? 0 : stoppedTimer + dt;

        let isAirborne = routePos.airborne;
        if (isAirborne) {
          actorInstance.setPose('hop');
          actorInstance.stride(0);
        } else if (stoppedTimer > 0.3) {
          actorInstance.setPose('stand');
          actorInstance.stride(0);
          if (stoppedTimer > 2.6 && stoppedTimer - dt <= 2.6) {
            say('coming?', now, 1.4);
          }
        } else {
          actorInstance.setPose('walk');
          actorInstance.stride(1);
        }

        // Direct 1:1 stride kinematics driven by curve arc length walked
        actorInstance.walkedTo(routePos.walked / Math.max(0.05, curScale));

        // Turn towards travel direction
        if (prevPos) {
          const dx = finalX - prevPos.x;
          const dy = finalY - prevPos.y;
          if (Math.abs(dx) > 0.6 && Math.abs(dx) > 0.35 * Math.abs(dy)) {
            actorInstance.face(dx > 0 ? 1 : -1, 0.16);
          }
        }

        // Stamp paw prints trail in wake
        if (!routeData.lane) {
          const stepIdx = Math.floor(routePos.walked / (34 * curScale));
          if (lastStepStopIdx === k && stepIdx !== lastStepIdx && !routePos.airborne && prevPos) {
            const isLeft = (stepIdx & 1) === 1;
            const footX = isLeft ? 186 : 110;
            const pupFootX = finalX - D.x * curScale + (actorInstance.facingDir > 0 ? footX : W - footX) * curScale;
            const pupFootY = finalY - D.y * curScale + 226 * curScale + currScroll - routeData.mainTop + (isLeft ? -4 : 4) * curScale;

            const angle = Math.atan2(finalY - prevPos.y + scrollDiff, finalX - prevPos.x) + Math.PI / 2;
            const pawSize = 14 * Math.max(0.75, 1.5 * curScale);

            const pawSvg = pawSVGs[pawIndex++ % pawSVGs.length];
            if (pawSvg) {
              pawSvg.style.transform = `translate(${(pupFootX - pawSize / 2).toFixed(1)}px, ${(pupFootY - pawSize / 2).toFixed(1)}px) rotate(${angle.toFixed(3)}rad)`;
              pawSvg.style.width = `${pawSize.toFixed(1)}px`;
              pawSvg.style.height = `${pawSize.toFixed(1)}px`;
              pawSvg.animate(
                [
                  { opacity: 0 },
                  { opacity: 0.45, offset: 0.08 },
                  { opacity: 0.45, offset: 0.5 },
                  { opacity: 0 }
                ],
                { duration: 2600, easing: 'ease-out' }
              );
            }
            lastStepIdx = stepIdx;
          }
          lastStepStopIdx = k;
        }
      }

      prevPos = { x: finalX, y: finalY };

      // Eye & Head Gaze Tracking: look at target or cursor
      if (currentLookTarget && currentLookTarget.until > now) {
        const targetRect = currentLookTarget.el.getBoundingClientRect();
        actorInstance.lookAt({
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + targetRect.height / 2
        });
      } else if (mousePos && now - mousePos.t < 2.5) {
        actorInstance.lookAt(mousePos);
      } else {
        actorInstance.lookAt(null);
      }

      // Apply root transforms
      actor.style.transform = `translate3d(${(finalX - D.x * curScale).toFixed(2)}px, ${(finalY - D.y * curScale).toFixed(2)}px, 0)`;
      body.style.transform = `scale(${curScale.toFixed(4)})`;
      layer.dataset.front = String(routePos.front);
      actor.dataset.holding = String(isHolding);

      // Speech bubble position
      if (bubble.dataset.show === 'true') {
        if (now > speechUntil) {
          bubble.dataset.show = 'false';
        }
        const bubbleX = (actorInstance.facingDir > 0 ? 214 : W - 214) * curScale;
        bubbleWrapper.style.transform = `translate(${bubbleX.toFixed(1)}px, ${(30 * curScale).toFixed(1)}px)`;
      }

      actorInstance.tick(dt, now);
      animFrameId = requestAnimationFrame(onTick);
    };

    // Event handlers
    const onPointerMove = (e) => {
      if (e.pointerType === 'mouse') {
        mousePos = { x: e.clientX, y: e.clientY, t: performance.now() / 1e3 };
      }
    };

    const onPupCue = (e) => {
      const detail = e.detail;
      const activeScene = currentStopK >= 0 ? routeData?.meta[currentStopK]?.scene : null;
      if (!activeScene || (detail.look && !activeScene.contains(detail.look))) return;
      const now = performance.now() / 1e3;
      if (detail.look) currentLookTarget = { el: detail.look, until: now + (detail.secs || 1.6) };
      if (detail.say) say(detail.say, now);
    };

    const onFocusIn = (e) => {
      const el = e.target;
      if (el instanceof HTMLElement && el.matches('a, button, input, textarea, select, summary')) {
        currentLookTarget = { el, until: performance.now() / 1e3 + 1.4 };
      }
    };

    // Click handler for interactive tricks
    const onClickActor = () => {
      if (!actorInstance || !routeData) return;
      const now = performance.now() / 1e3;
      comboClicks = now - comboLastTime < 0.7 ? comboClicks + 1 : 1;
      comboLastTime = now;
      lastStopActiveTime = now;

      const actCtx = {
        d: actorInstance,
        rest: POSES[currentStopK >= 0 ? routeData.meta[currentStopK].pose : 'stand'],
        facing: actorInstance.facingDir,
        say: (txt, dur) => say(txt, now, dur),
        hearts: () => spawnHearts(printsContainer, prevPos?.x || 150, (prevPos?.y || 200) + window.scrollY - routeData.mainTop)
      };

      if (currentStopK < 0) {
        // Clicked while moving
        const tricks = ['hop', 'woof', 'love', 'sneeze'];
        const chosen = tricks[Math.floor(Math.random() * tricks.length)];
        if (chosen === 'hop') {
          actionQueue = [[now, () => { actorInstance.hop(1.35); say('wheee!', now); }], [now + 0.5, () => actorInstance.hop(0.7)]];
        } else if (chosen === 'woof') {
          actionQueue = [[now, (t) => { actorInstance.woof(t); say('woof!', t); }], [now + 0.4, (t) => actorInstance.woof(t)]];
        } else if (chosen === 'love') {
          actionQueue = [[now, () => { actorInstance.wag(1); actorInstance.hop(0.5); actCtx.hearts(); say('I like you!', now); }]];
        } else {
          actionQueue = [[now, (t) => { actorInstance.jolt(1.4); actorInstance.hop(0.4); actorInstance.yawn(t, 0.22); say('achoo!', t); }]];
        }
        return;
      }

      const meta = routeData.meta[currentStopK];
      let pool = TRICK_NAMES.filter((t) => t !== lastTrickName);
      if (meta.pose === 'peek') pool = ['peekaboo', 'woof', 'tilt', 'sneeze'];
      else if (comboClicks >= 4) pool = ['zoomies', 'spin'];

      const chosen = pool[Math.floor(Math.random() * pool.length)];
      lastTrickName = chosen;

      actorInstance.reset();
      if (TRICKS[chosen]) {
        actionQueue = TRICKS[chosen](actCtx, now);
      }
    };

    const onPointerEnterActor = (e) => {
      if (e.pointerType === 'mouse' && actorInstance && currentStopK >= 0) {
        actorInstance.petting(true);
        actorInstance.wag(1);
      }
    };

    const onPointerLeaveActor = () => {
      if (actorInstance) {
        actorInstance.petting(false);
        if (currentStopK >= 0) {
          actorInstance.wag(routeData?.meta[currentStopK]?.act === 'basket' ? 0.3 : 0.7);
        }
      }
    };

    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isLive || !routeData) return;
        const fresh = scanRoute();
        if (!fresh) {
          stopJourney();
          return;
        }
        routeData = fresh;
        rootDoc.dataset.pup = fresh.lane ? 'lane' : 'live';
      }, 120);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pup:cue', onPupCue);
    window.addEventListener('focusin', onFocusIn);

    actor.addEventListener('click', onClickActor);
    actor.addEventListener('pointerenter', onPointerEnterActor);
    actor.addEventListener('pointerleave', onPointerLeaveActor);

    startJourney();
    animFrameId = requestAnimationFrame(onTick);

    return () => {
      stopJourney();
      cancelAnimationFrame(animFrameId);
      clearTimeout(resizeTimer);
      ro.disconnect();

      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pup:cue', onPupCue);
      window.removeEventListener('focusin', onFocusIn);

      actor.removeEventListener('click', onClickActor);
      actor.removeEventListener('pointerenter', onPointerEnterActor);
      actor.removeEventListener('pointerleave', onPointerLeaveActor);
    };
  }, []);

  return (
    <>
      {/* Hidden Probe for Viewport Height Measuring */}
      <div ref={probeRef} aria-hidden="true" className="pup-probe"></div>

      {/* Paw Prints Trail Container */}
      <div ref={printsRef} aria-hidden="true" className="pup-prints">
        {Array.from({ length: 28 }).map((_, i) => (
          <svg key={i} viewBox="0 0 64 64">
            <path d={PAW_PRINT_PATH} />
          </svg>
        ))}
      </div>

      {/* Moving Mascot Layer */}
      <div ref={layerRef} aria-hidden="true" className="pup-layer" hidden data-front="true">
        <div ref={actorRef} className="pup-actor">
          <div ref={bodyRef} className="pup-actor__body">
            <svg viewBox="0 0 300 240" focusable="false" style={{ overflow: 'visible' }}>
              <g data-p="root">
                {/* Shadow */}
                <ellipse
                  data-p="shadow"
                  cx="150"
                  cy="230"
                  rx="92"
                  ry="7"
                  fill={COCOA}
                  opacity="0.12"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />

                {/* Body & Legs */}
                <g data-p="body">
                  {/* Back Far Leg */}
                  <g data-p="bf">
                    <path d={`${LEGS.backFar}Z`} fill={GOLD_DEEP} />
                    <path d={LEGS.backFar} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                    <path d="M-3.5 29 v5 M4.5 29 v5" stroke={COCOA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                  </g>

                  {/* Front Far Leg */}
                  <g data-p="ff">
                    <path d={`${LEGS.frontFar}Z`} fill={GOLD_DEEP} />
                    <path d={LEGS.frontFar} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                    <path d="M-3.5 29 v5 M4.5 29 v5" stroke={COCOA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                  </g>

                  {/* Tail */}
                  <g data-p="tail">
                    <path d={PATHS.tailStem} stroke={COCOA} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                    <path d={PATHS.tailStem} stroke={GOLD} strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d={PATHS.tail} fill={GOLD} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
                  </g>

                  {/* Back Near Leg */}
                  <g data-p="bn">
                    <path d={`${LEGS.back}Z`} fill={GOLD} />
                    <path d={LEGS.back} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                    <path d="M-3.5 27 v5 M4.5 27 v5" stroke={COCOA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                  </g>

                  {/* Main Fluffy Body & Chest */}
                  <path d={PATHS.body} fill={GOLD} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
                  <path d={PATHS.chest} fill={GOLD} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />

                  {/* Front Near Leg */}
                  <g data-p="fn">
                    <path d={`${LEGS.front}Z`} fill={GOLD} />
                    <path d={LEGS.front} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                    <path d="M-3.5 27 v5 M4.5 27 v5" stroke={COCOA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                  </g>
                </g>

                {/* Haunch (Sitting Pose) */}
                <g data-p="haunch">
                  <path d={PATHS.haunch} fill={GOLD} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
                  <path d={PATHS.haunchPaw} fill={GOLD} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
                  <path d="M132 222v5M139 222v5" stroke={COCOA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                </g>

                {/* Head */}
                <g data-p="head">
                  {/* Collar & Heart Tag */}
                  <path d={PATHS.collar} fill={COLLAR_RED} stroke={COCOA} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                  <path d={PATHS.tag} fill={CREAM} stroke={COCOA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />

                  {/* Ears */}
                  <path data-p="earL" d={PATHS.earL} fill={GOLD_DEEP} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
                  <path data-p="earR" d={PATHS.earR} fill={GOLD_DEEP} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />

                  {/* Head Fur & Topknot */}
                  <path d={PATHS.head} fill={GOLD} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
                  <path d={PATHS.topknot} fill={GOLD} stroke={COCOA} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

                  {/* Cream Muzzle & Blush */}
                  <path d={PATHS.muzzle} fill={CREAM} />
                  <circle cx="181" cy="116" r="7" fill={BLUSH} opacity="0.85" />
                  <circle cx="243" cy="116" r="7" fill={BLUSH} opacity="0.85" />

                  {/* Eyes & Blinking */}
                  <g data-p="eyes">
                    <g data-p="open">
                      <g data-p="blink">
                        <ellipse cx="194" cy={EYE_Y} rx="7.4" ry="8.6" fill={COCOA} />
                        <ellipse cx="230" cy={EYE_Y} rx="7.4" ry="8.6" fill={COCOA} />
                        <circle cx="196.6" cy={EYE_Y - 3.4} r="2.7" fill="#fff" />
                        <circle cx="232.6" cy={EYE_Y - 3.4} r="2.7" fill="#fff" />
                        <circle cx="192" cy={EYE_Y + 3.2} r="1.2" fill="#fff" />
                        <circle cx="228" cy={EYE_Y + 3.2} r="1.2" fill="#fff" />
                      </g>
                    </g>
                  </g>

                  {/* Happy Eyes (Arc) */}
                  <path
                    data-p="happy"
                    d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101"
                    stroke={COCOA}
                    strokeWidth="3.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Sleeping / Shut Eyes */}
                  <path
                    data-p="shut"
                    d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97"
                    stroke={COCOA}
                    strokeWidth="3.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Nose & Mouth */}
                  <path d={PATHS.nose} fill={COCOA} />
                  <path d={PATHS.mouth} stroke={COCOA} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none" />

                  {/* Tongue */}
                  <path data-p="tongue" d={PATHS.tongue} fill="#e98c8c" stroke={COCOA} strokeWidth="2.2" strokeLinejoin="round" />

                  {/* Open Mouth (Barking) */}
                  <g data-p="mouth">
                    <path d={PATHS.mouthOpen} fill="#6b2a1c" stroke={COCOA} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
                    <path d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z" fill="#e98c8c" />
                  </g>
                </g>

                {/* Ledge Paws (for peek pose) */}
                <g data-p="ledge">
                  <path d={PATHS.ledgePaws} fill={GOLD} stroke={COCOA} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
                  <path d={PATHS.ledgeToes} stroke={COCOA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                </g>
              </g>
            </svg>
          </div>

          {/* Speech Bubble */}
          <span ref={bubbleWrapperRef} className="pup-bubble-at">
            <span ref={bubbleRef} className="pup-bubble" data-show="false">
              peekaboo!
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
