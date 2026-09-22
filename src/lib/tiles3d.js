/* eslint-disable */
// Перенесено из макета (tiles3d.js) без изменений логики: кастомный элемент <tile-3d>
// рисует 3D-объекты (антенна, фланец, плата, чертёж, массив) и разнесённые виды на three.js.
// Модуль подключается только на клиенте (см. components/Tiles3D.tsx).
import * as THREE from 'three';

const C = { steel: 0x749dc4, deep: 0x1d2d3d, paper: 0xf2f2f3, sky: 0xb5d9fd, mid: 0x416180, dark: 0x2c455d };
const mat = (c, metalness = 0.65, roughness = 0.38) => new THREE.MeshStandardMaterial({ color: c, metalness, roughness });
const M = () => ({ steel: mat(C.steel), deep: mat(C.deep, 0.5, 0.5), paper: mat(C.paper, 0.05, 0.85), sky: mat(C.sky, 0.3, 0.5), mid: mat(C.mid, 0.6, 0.4), dark: mat(C.dark, 0.7, 0.3) });
const add = (g, geo, m, p = [0, 0, 0], r = [0, 0, 0]) => { const me = new THREE.Mesh(geo, m); me.position.set(...p); me.rotation.set(...r); g.add(me); return me; };

function antenna(m) {
  const g = new THREE.Group();
  const boom = add(g, new THREE.BoxGeometry(2.4, 0.07, 0.07), m.dark, [0, 0.35, 0]);
  const lens = [1.15, 1.0, 0.9, 0.82, 0.76, 0.7, 0.65];
  lens.forEach((L, i) => {
    const x = -1.0 + i * 0.34;
    add(g, new THREE.CylinderGeometry(0.022, 0.022, L, 10), i === 1 ? m.sky : m.steel, [x, 0.35, 0], [Math.PI / 2, 0, 0]);
    add(g, new THREE.BoxGeometry(0.08, 0.1, 0.1), m.mid, [x, 0.35, 0]);
  });
  add(g, new THREE.BoxGeometry(0.16, 0.14, 0.22), m.mid, [-0.66, 0.35, 0]);
  add(g, new THREE.CylinderGeometry(0.03, 0.03, 0.9, 10), m.dark, [-0.66, 0.0, 0.14], [0.25, 0, 0]);
  add(g, new THREE.CylinderGeometry(0.06, 0.07, 1.25, 20), m.dark, [0, -0.3, 0]);
  add(g, new THREE.BoxGeometry(0.2, 0.18, 0.14), m.steel, [0, 0.3, 0]);
  add(g, new THREE.CylinderGeometry(0.42, 0.48, 0.1, 32), m.mid, [0, -0.95, 0]);
  add(g, new THREE.TorusGeometry(0.36, 0.02, 8, 48), m.steel, [0, -0.89, 0], [Math.PI / 2, 0, 0]);
  return g;
}

function flange(m) {
  const g = new THREE.Group();
  add(g, new THREE.CylinderGeometry(1.05, 1.05, 0.2, 64), m.steel);
  add(g, new THREE.CylinderGeometry(0.62, 0.62, 0.62, 48), m.mid, [0, 0.3, 0]);
  add(g, new THREE.TorusGeometry(0.4, 0.05, 12, 48), m.dark, [0, 0.62, 0], [Math.PI / 2, 0, 0]);
  add(g, new THREE.CylinderGeometry(0.36, 0.36, 0.7, 40), m.deep, [0, 0.3, 0]);
  add(g, new THREE.TorusGeometry(1.0, 0.03, 8, 64), m.dark, [0, 0.1, 0], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const x = Math.cos(a) * 0.84, z = Math.sin(a) * 0.84; add(g, new THREE.CylinderGeometry(0.11, 0.11, 0.14, 6), m.dark, [x, 0.17, z]); add(g, new THREE.CylinderGeometry(0.05, 0.05, 0.05, 12), m.sky, [x, 0.265, z]); }
  add(g, new THREE.BoxGeometry(2.6, 0.08, 0.5), m.dark, [0, -0.14, 0]);
  return g;
}

function pcb(m) {
  const g = new THREE.Group();
  add(g, new THREE.BoxGeometry(2.0, 0.06, 1.35), m.deep);
  add(g, new THREE.BoxGeometry(1.94, 0.002, 1.29), m.dark, [0, 0.031, 0]);
  add(g, new THREE.BoxGeometry(0.55, 0.09, 0.55), m.dark, [-0.25, 0.075, 0.05]);
  add(g, new THREE.BoxGeometry(0.34, 0.01, 0.34), m.paper, [-0.25, 0.125, 0.05]);
  for (let i = 0; i < 8; i++) { const t = -0.245 + i * 0.07; add(g, new THREE.BoxGeometry(0.62, 0.02, 0.025), m.sky, [-0.25, 0.04, 0.05 + t]); add(g, new THREE.BoxGeometry(0.025, 0.02, 0.62), m.sky, [-0.25 + t, 0.04, 0.05]); }
  [[0.55, 0.35], [0.75, 0.35], [0.55, -0.1]].forEach(([x, z]) => { add(g, new THREE.CylinderGeometry(0.09, 0.09, 0.32, 24), m.steel, [x, 0.19, z]); add(g, new THREE.CylinderGeometry(0.09, 0.09, 0.01, 24), m.paper, [x, 0.355, z]); });
  add(g, new THREE.BoxGeometry(0.5, 0.22, 0.24), m.dark, [0.55, 0.14, -0.48]);
  for (let i = 0; i < 6; i++) add(g, new THREE.BoxGeometry(0.05, 0.05, 0.05), m.sky, [0.35 + i * 0.08, 0.14, -0.62]);
  for (let i = 0; i < 5; i++) add(g, new THREE.BoxGeometry(0.16, 0.05, 0.08), m.mid, [-0.75, 0.055, -0.5 + i * 0.16]);
  for (let i = 0; i < 6; i++) add(g, new THREE.BoxGeometry(0.9 - i * 0.1, 0.004, 0.02), m.sky, [0.05, 0.036, 0.45 + i * 0.05]);
  [[-0.9, 0.58], [0.9, 0.58], [-0.9, -0.58], [0.9, -0.58]].forEach(([x, z]) => add(g, new THREE.CylinderGeometry(0.06, 0.06, 0.07, 16), m.steel, [x, 0.03, z]));
  return g;
}

function drawing(m) {
  const g = new THREE.Group();
  add(g, new THREE.BoxGeometry(2.1, 0.02, 1.5), m.paper);
  const line = (w, d, x, z) => add(g, new THREE.BoxGeometry(w, 0.006, d), m.mid, [x, 0.013, z]);
  line(2.0, 0.012, 0, 0.7); line(2.0, 0.012, 0, -0.7); line(0.012, 1.4, -1.0, 0); line(0.012, 1.4, 1.0, 0);
  line(0.9, 0.012, 0.55, -0.42); line(0.012, 0.28, 0.1, -0.56); line(0.012, 0.28, 0.5, -0.56);
  for (let i = 0; i < 4; i++) line(0.6, 0.008, -0.6, -0.35 + i * 0.13);
  const part = new THREE.Group();
  add(part, new THREE.BoxGeometry(0.7, 0.16, 0.5), m.steel);
  add(part, new THREE.CylinderGeometry(0.14, 0.14, 0.3, 24), m.mid, [0, 0.22, 0]);
  add(part, new THREE.CylinderGeometry(0.07, 0.07, 0.32, 16), m.deep, [0, 0.22, 0]);
  [[-0.25, 0.16], [0.25, 0.16], [-0.25, -0.16], [0.25, -0.16]].forEach(([x, z]) => add(part, new THREE.CylinderGeometry(0.04, 0.04, 0.18, 12), m.deep, [x, 0.0, z]));
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 0.16, 0.5)), new THREE.LineBasicMaterial({ color: C.sky })); part.add(edges);
  part.position.set(-0.3, 0.3, 0.05); part.rotation.set(0, 0.5, 0); g.add(part);
  const dim = (x, z, w) => { line(w, 0.006, x, z); add(g, new THREE.ConeGeometry(0.025, 0.08, 8), m.mid, [x - w / 2, 0.015, z], [0, 0, Math.PI / 2]); add(g, new THREE.ConeGeometry(0.025, 0.08, 8), m.mid, [x + w / 2, 0.015, z], [0, 0, -Math.PI / 2]); };
  dim(-0.25, 0.5, 0.9);
  const pencil = new THREE.Group();
  add(pencil, new THREE.CylinderGeometry(0.035, 0.035, 1.3, 12), m.dark, [0, 0, 0], [Math.PI / 2, 0, 0]);
  add(pencil, new THREE.ConeGeometry(0.035, 0.14, 12), m.sky, [0, 0, -0.72], [-Math.PI / 2, 0, 0]);
  add(pencil, new THREE.CylinderGeometry(0.036, 0.036, 0.1, 12), m.steel, [0, 0, 0.6], [Math.PI / 2, 0, 0]);
  pencil.position.set(0.62, 0.05, 0.15); pencil.rotation.y = 0.55; g.add(pencil);
  return g;
}

const BUILD = { antenna: tileMast, flange: tileHousing, pcb: tilePcb, drawing };
function array(m) {
  const g = new THREE.Group();
  const panel = new THREE.Group();
  add(panel, new THREE.BoxGeometry(2.6, 1.7, 0.08), m.deep);
  add(panel, new THREE.BoxGeometry(2.66, 1.76, 0.03), m.dark, [0, 0, -0.04]);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) {
    const x = -1.05 + i * 0.42, y = -0.6 + j * 0.4;
    add(panel, new THREE.BoxGeometry(0.3, 0.3, 0.04), m.steel, [x, y, 0.06]);
    add(panel, new THREE.CylinderGeometry(0.05, 0.05, 0.05, 12), m.sky, [x, y, 0.1], [Math.PI / 2, 0, 0]);
  }
  panel.position.y = 0.6; g.add(panel);
  add(g, new THREE.BoxGeometry(0.5, 0.5, 0.3), m.dark, [0, 0.6, -0.2]);
  add(g, new THREE.BoxGeometry(0.3, 1.9, 0.12), m.dark, [0, 0.6, -0.38]);
  add(g, new THREE.CylinderGeometry(0.1, 0.12, 2.9, 24), m.dark, [0, -0.35, -0.5]);
  add(g, new THREE.CylinderGeometry(0.5, 0.55, 0.1, 32), m.mid, [0, -1.85, -0.5]);
  add(g, new THREE.TorusGeometry(0.42, 0.03, 8, 48), m.steel, [0, -1.79, -0.5], [Math.PI / 2, 0, 0]);
  return g;
}
BUILD.array = array;

const edge = (g, geo, p = [0, 0, 0], r = [0, 0, 0], o = 0.45) => { const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: C.sky, transparent: true, opacity: o })); e.position.set(...p); e.rotation.set(...r); g.add(e); return e; };

function exHousing(m, root) {
  const P = [];
  const part = (dir, dist) => { const g = new THREE.Group(); root.add(g); P.push({ g, dir: new THREE.Vector3(...dir), dist }); return g; };
  const BOLT_R = 0.46, BOLTS = 6, boltXZ = (i) => { const a = i * Math.PI * 2 / BOLTS + Math.PI / 6; return [Math.cos(a) * BOLT_R, Math.sin(a) * BOLT_R]; };
  const circ = (x, y, r) => { const p = new THREE.Path(); const n = 24; for (let i = 0; i <= n; i++) { const a = -i / n * Math.PI * 2; const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; if (i === 0) p.moveTo(px, py); else p.lineTo(px, py); } p.closePath(); return p; };
  // horizontal slab with real through-holes: shape in XZ, extruded along Y
  const slab = (g, w, d, h, y, holes, mat, extra) => {
    const sh = new THREE.Shape(); sh.moveTo(-w / 2, -d / 2); sh.lineTo(w / 2, -d / 2); sh.lineTo(w / 2, d / 2); sh.lineTo(-w / 2, d / 2); sh.closePath();
    holes.forEach(([x, z, r]) => sh.holes.push(circ(x, z, r)));
    const geo = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false });
    const me = new THREE.Mesh(geo, mat); me.rotation.x = Math.PI / 2; me.position.y = y + h / 2; g.add(me);
    if (extra) edge(g, new THREE.BoxGeometry(w, h, d), [0, y, 0]);
    return me;
  };
  const ring = (g, R, h, y, holes, mat) => {
    const sh = new THREE.Shape(); { const n = 72; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; if (i === 0) sh.moveTo(R, 0); else sh.lineTo(Math.cos(a) * R, Math.sin(a) * R); } sh.closePath(); }
    holes.forEach(([x, z, r]) => sh.holes.push(circ(x, z, r)));
    const geo = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false, curveSegments: 48 });
    const me = new THREE.Mesh(geo, mat); me.rotation.x = Math.PI / 2; me.position.y = y + h / 2; g.add(me); return me;
  };
  const boltHoles = (r) => Array.from({ length: BOLTS }, (_, i) => { const [x, z] = boltXZ(i); return [x, z, r]; });
  // 01 base plate — 4 through holes
  const base = part([0, -1, 0], 1.75); P[P.length - 1].step = 4;
  slab(base, 2.3, 1.7, 0.16, -0.74, [[-0.95, -0.68, 0.08], [0.95, -0.68, 0.08], [-0.95, 0.68, 0.08], [0.95, 0.68, 0.08]], m.mid, true);
  // 02 body — block with bore, top flange ring with bore + 6 tapped holes
  const body = part([0, 0, 0], 0); P[P.length - 1].step = -1;
  slab(body, 1.72, 1.26, 0.86, -0.16, [[0, 0, 0.4]], m.steel, true);
  ring(body, 0.62, 0.14, 0.34, [[0, 0, 0.4], ...boltHoles(0.07)], m.steel);
  add(body, new THREE.CylinderGeometry(0.4, 0.4, 0.02, 40), m.deep, [0, -0.58, 0]);
  add(body, new THREE.BoxGeometry(0.22, 0.44, 1.3), m.mid, [-0.8, -0.2, 0]);
  add(body, new THREE.CylinderGeometry(0.15, 0.15, 0.42, 20), m.dark, [1.05, -0.12, 0], [0, 0, Math.PI / 2]);
  add(body, new THREE.TorusGeometry(0.16, 0.03, 8, 24), m.sky, [1.24, -0.12, 0], [0, Math.PI / 2, 0]);
  // 03 bearing unit — outer race fits the bore
  const bush = part([0, 1, 0], 1.15); P[P.length - 1].step = 3;
  ring(bush, 0.39, 0.4, 0.14, [[0, 0, 0.22]], m.dark);
  add(bush, new THREE.TorusGeometry(0.3, 0.055, 10, 36), m.steel, [0, 0.36, 0], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; add(bush, new THREE.SphereGeometry(0.055, 12, 10), m.sky, [Math.cos(a) * 0.3, 0.36, Math.sin(a) * 0.3]); }
  add(bush, new THREE.CylinderGeometry(0.19, 0.19, 0.9, 24), m.mid, [0, 0.32, 0]);
  // 04 cover — flange with shaft hole + 6 through holes on the same pattern
  const cap = part([0, 1, 0], 2.2); P[P.length - 1].step = 2;
  ring(cap, 0.62, 0.12, 0.47, [[0, 0, 0.2], ...boltHoles(0.085)], m.steel);
  ring(cap, 0.3, 0.1, 0.58, [[0, 0, 0.2]], m.mid);
  // 05 bolts — 6, aligned to the pattern
  const bolts = part([0, 1, 0], 3.05); P[P.length - 1].step = 1;
  for (let i = 0; i < BOLTS; i++) { const [x, z] = boltXZ(i); add(bolts, new THREE.CylinderGeometry(0.11, 0.11, 0.09, 6), m.dark, [x, 0.575, z]); add(bolts, new THREE.CylinderGeometry(0.065, 0.065, 0.36, 12), m.mid, [x, 0.35, z]); }
  return P;
}

function exMast(m, root) {
  const P = [];
  const part = (dir, dist, step, dir2, dist2, step2) => { const g = new THREE.Group(); root.add(g); P.push({ g, dir: new THREE.Vector3(...dir), dist, step, dir2: dir2 ? new THREE.Vector3(...dir2) : null, dist2, step2 }); return g; };
  // mast stays: pole + base flange with 4 through holes
  const mast = part([0, -1, 0], 0, -1);
  add(mast, new THREE.CylinderGeometry(0.1, 0.11, 2.3, 28), m.dark, [0, -1.25, 0]);
  {
    const sh = new THREE.Shape(); const n = 72; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; if (i === 0) sh.moveTo(0.5, 0); else sh.lineTo(Math.cos(a) * 0.5, Math.sin(a) * 0.5); } sh.closePath();
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2; const p = new THREE.Path(); const k = 24; for (let j = 0; j <= k; j++) { const b = -j / k * Math.PI * 2; const px = Math.cos(a) * 0.38 + Math.cos(b) * 0.045, py = Math.sin(a) * 0.38 + Math.sin(b) * 0.045; if (j === 0) p.moveTo(px, py); else p.lineTo(px, py); } p.closePath(); sh.holes.push(p); }
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: false, curveSegments: 48 });
    const me = new THREE.Mesh(geo, m.mid); me.rotation.x = Math.PI / 2; me.position.y = -2.36; mast.add(me);
  }
  // 04 bracket: sleeve over the mast top, saddle plate under the boom, two clamp straps
  // 04 bracket + boom rise together; 05 the clamp opens: top strap up, sleeve down — boom is freed
  const brkBot = part([0, 1, 0], 0.9, 3, [0, -1, 0], 0.32, 4);
  add(brkBot, new THREE.CylinderGeometry(0.15, 0.15, 0.42, 28), m.steel, [0, -0.28, 0]);
  add(brkBot, new THREE.BoxGeometry(0.5, 0.06, 0.3), m.steel, [0, -0.04, 0]);
  const brkTop = part([0, 1, 0], 0.9, 3, [0, 1, 0], 0.4, 4);
  add(brkTop, new THREE.BoxGeometry(0.06, 0.16, 0.16), m.mid, [-0.17, 0.05, 0]);
  add(brkTop, new THREE.BoxGeometry(0.06, 0.16, 0.16), m.mid, [0.17, 0.05, 0]);
  add(brkTop, new THREE.BoxGeometry(0.4, 0.03, 0.16), m.mid, [0, 0.145, 0]);
  for (const x of [-0.17, 0.17]) add(brkTop, new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12), m.dark, [x, 0.185, 0]);
  const boom = part([0, 1, 0], 0.9, 3);
  add(boom, new THREE.BoxGeometry(3.0, 0.08, 0.08), m.dark, [0.3, 0.05, 0]);
  // 03 directors
  const dirs = part([0, 1, 0], 2.05, 2);
  [0.95, 0.86, 0.8, 0.75, 0.7].forEach((L, i) => { const x = 0.55 + i * 0.3; add(dirs, new THREE.CylinderGeometry(0.02, 0.02, L, 10), m.steel, [x, 0.05, 0], [Math.PI / 2, 0, 0]); add(dirs, new THREE.BoxGeometry(0.08, 0.1, 0.1), m.mid, [x, 0.05, 0]); });
  // 02 reflector + driven element
  const refl = part([0, 1, -0.6], 2.3, 1);
  add(refl, new THREE.CylinderGeometry(0.024, 0.024, 1.35, 12), m.sky, [-1.05, 0.05, 0], [Math.PI / 2, 0, 0]);
  add(refl, new THREE.BoxGeometry(0.1, 0.12, 0.12), m.mid, [-1.05, 0.05, 0]);
  add(refl, new THREE.CylinderGeometry(0.022, 0.022, 1.15, 12), m.steel, [-0.65, 0.05, 0.16], [Math.PI / 2, 0, 0]);
  add(refl, new THREE.CylinderGeometry(0.022, 0.022, 1.15, 12), m.steel, [-0.65, 0.05, -0.16], [Math.PI / 2, 0, 0]);
  add(refl, new THREE.BoxGeometry(0.09, 0.11, 0.42), m.dark, [-0.65, 0.05, 0]);
  return P;
}

function exDims(m, root) {
  exHousing(m, root);
  const A = [
    { p: [0, 0.44, 0], t: 0.06 },
    { p: [0.86, -0.16, 0.63], t: 0.26 },
    { p: [-1.15, -0.74, 0.85], t: 0.46 },
    { p: [0.5, 0.66, 0], t: 0.66 },
    { p: [-0.86, -0.45, 0.63], t: 0.86 }
  ].map((a) => ({ v: new THREE.Vector3(...a.p), t: a.t }));
  const dotMat = new THREE.MeshBasicMaterial({ color: C.sky });
  const dots = A.map((a) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), dotMat); d.position.copy(a.v); root.add(d); return d; });
  const tmp = new THREE.Vector3();
  return {
    update(p, t, pivot, el) {
      pivot.rotation.set(0.3, -0.5 + p * 0.75, 0);
      pivot.updateMatrixWorld(true);
      el.camera.updateMatrixWorld(true);
      if (!el._dims || !el._dims.length || !el._dims[0].isConnected) el._dims = Array.from((el.parentElement || el).querySelectorAll('[data-dim]'));
      const w = el.clientWidth, h = el.clientHeight, G = 56, H = 62;
      const rows = A.map((a, i) => {
        const on = p > a.t; dots[i].visible = on;
        tmp.copy(a.v); root.localToWorld(tmp); tmp.project(el.camera);
        return { i, on, x: (tmp.x + 1) / 2 * w, y: (1 - tmp.y) / 2 * h, dy: 0, d: el._dims[i] };
      });
      // выноска не должна выходить за холст: на узком экране короче стрелка, при нехватке места
      // подпись уходит на другую сторону; затем подписи одной стороны раздвигаются по вертикали
      const gap = w < 700 ? 28 : G;
      rows.forEach((r) => {
        if (!r.d || !r.on) return;
        const txt = r.d.children[2];
        r.tw = (txt && txt.offsetWidth) || 120;
        // Сторона задана разметкой (data-side) и не меняется никогда. Раньше она
        // выбиралась по месту в каждом кадре, и при повороте модели подпись
        // перескакивала слева направо. Если места не хватает — подпись остаётся на
        // своей стороне и поджимается к краю холста (ниже, при расчёте gx).
        r.left = r.d.getAttribute('data-side') === 'l';
      });
      [true, false].forEach((side) => {
        const g = rows.filter((r) => r.d && r.on && r.left === side);
        const placed = [];
        g.forEach((r) => {
          const hh = ((r.d.children[2] && r.d.children[2].offsetHeight) || H) + 10;
          for (let it = 0; it < 6; it++) {
            const hit = placed.find((q) => Math.abs((r.y + r.dy) - (q.y + q.dy)) < hh);
            if (!hit) break;
            const c = hit.y + hit.dy;
            r.dy = (r.y + r.dy <= c ? c - hh : c + hh) - r.y;
          }
          placed.push(r);
        });
      });
      rows.forEach((r) => {
        const d = r.d; if (!d) return;
        if (!r.on) { d.removeAttribute('data-on'); return; }
        const left = r.left, lead = d.children[1], txt = d.children[2];
        let gx = left ? -gap : gap;
        if (left && r.x + gx - r.tw < 4) gx = 4 + r.tw - r.x;
        if (!left && r.x + gx + r.tw > w - 4) gx = w - 4 - r.tw - r.x;
        d.style.transform = 'translate(' + r.x.toFixed(1) + 'px,' + r.y.toFixed(1) + 'px)';
        if (lead) { lead.style.width = Math.hypot(gx, r.dy).toFixed(1) + 'px'; lead.style.transform = 'rotate(' + Math.atan2(r.dy, gx).toFixed(4) + 'rad)'; }
        if (txt) txt.style.transform = 'translate(' + gx.toFixed(1) + 'px,' + r.dy.toFixed(1) + 'px) translate(' + (left ? '-100%' : '0') + ',-50%)';
        d.setAttribute('data-on', '');
      });
    }
  };
}

function exPcb(m, root) {
  const P = []; P.inv = true;
  const part = (dist, dir) => { const g = new THREE.Group(); root.add(g); P.push({ g, dir: new THREE.Vector3(...(dir || [0, 1, 0])).normalize(), dist, inv: true }); return g; };
  const board = part(0);
  const bg = new THREE.BoxGeometry(2.6, 0.08, 1.7);
  add(board, bg, m.deep); edge(board, bg, [0, 0, 0], [0, 0, 0], 0.35);
  add(board, new THREE.BoxGeometry(2.54, 0.004, 1.64), m.dark, [0, 0.042, 0]);
  const trace = (pts, w = 0.022) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, z1] = pts[i], [x2, z2] = pts[i + 1];
      const dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz);
      add(board, new THREE.BoxGeometry(len + w, 0.004, w), m.sky, [(x1 + x2) / 2, 0.046, (z1 + z2) / 2], [0, Math.atan2(-dz, dx), 0]);
    }
    add(board, new THREE.CylinderGeometry(w * 1.5, w * 1.5, 0.006, 12), m.sky, [pts[0][0], 0.046, pts[0][1]]);
    add(board, new THREE.CylinderGeometry(w * 1.5, w * 1.5, 0.006, 12), m.sky, [pts[pts.length - 1][0], 0.046, pts[pts.length - 1][1]]);
  };
  // every net keeps its own lane and turns into its pad with a single 45° leg
  const route = (from, to, axis, w) => {
    const ai = axis === 'x' ? 0 : 1, li = 1 - ai;
    const off = to[li] - from[li], a = Math.abs(off), d = Math.sign(to[ai] - from[ai]);
    if (a < 1e-6) return trace([from, to], w);
    const turn = []; turn[ai] = to[ai] - d * a; turn[li] = from[li];
    trace([from, turn, to], w);
  };
  // BGA east pins -> SMD pads, each lane to its own row (rows z = 0.22 / 0.36 / 0.50)
  [[0.37, 0.28, 0.50], [0.29, 0.42, 0.36], [0.21, 0.56, 0.22], [0.13, 0.70, 0.22], [0.05, 0.84, 0.22]]
    .forEach(function (n) { route([0.03, n[0]], [n[1], n[2]], 'x', 0.022); });
  // BGA south pins -> connector pads (front edge z = -0.72)
  [[-0.59, -0.37], [-0.43, -0.19], [-0.27, -0.01], [-0.11, 0.17]]
    .forEach(function (n) { route([n[0], -0.33], [n[1], -0.72], 'z', 0.022); });
  // BGA west pins -> left passive column (pads at x = -0.89)
  [[-0.19, -0.25], [-0.03, -0.05], [0.13, 0.15], [0.29, 0.35]]
    .forEach(function (n) { route([-0.73, n[0]], [-0.89, n[1]], 'x', 0.022); });
  // power: connector -> cap, cap -> module
  trace([[0.30, -0.68], [0.45, -0.68], [0.55, -0.58], [0.55, -0.52]], 0.05);
  trace([[1.12, -0.40], [1.15, -0.37], [1.15, 0.34], [1.06, 0.43]], 0.05);
  [[-1.2, 0.75], [1.2, 0.75], [-1.2, -0.75], [1.2, -0.75]].forEach(([x, z]) => add(board, new THREE.CylinderGeometry(0.07, 0.07, 0.1, 16), m.steel, [x, 0.04, z]));
  const chip = part(1.6);
  add(chip, new THREE.BoxGeometry(0.66, 0.1, 0.66), m.dark, [-0.35, 0.09, 0.05]);
  add(chip, new THREE.BoxGeometry(0.42, 0.012, 0.42), m.paper, [-0.35, 0.146, 0.05]);
  for (let i = 0; i < 9; i++) { const d = -0.32 + i * 0.08; add(chip, new THREE.BoxGeometry(0.76, 0.02, 0.03), m.steel, [-0.35, 0.052, 0.05 + d]); add(chip, new THREE.BoxGeometry(0.03, 0.02, 0.76), m.steel, [-0.35 + d, 0.052, 0.05]); }
  const passives = part(1.6);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) add(passives, new THREE.BoxGeometry(0.1, 0.05, 0.06), i % 2 ? m.mid : m.sky, [0.28 + i * 0.14, 0.065, 0.5 - r * 0.14]);
  for (let i = 0; i < 5; i++) add(passives, new THREE.BoxGeometry(0.22, 0.06, 0.1), m.mid, [-1.0, 0.07, -0.45 + i * 0.2]);
  add(passives, new THREE.BoxGeometry(0.34, 0.08, 0.34), m.dark, [1.0, 0.08, -0.12]);
  const caps = part(1.6);
  [[0.55, -0.4], [0.75, -0.4], [0.55, -0.62]].forEach(([x, z]) => { add(caps, new THREE.CylinderGeometry(0.09, 0.09, 0.34, 24), m.steel, [x, 0.21, z]); add(caps, new THREE.CylinderGeometry(0.09, 0.09, 0.012, 24), m.paper, [x, 0.386, z]); });
  add(caps, new THREE.BoxGeometry(0.7, 0.26, 0.24), m.dark, [-0.1, 0.17, -0.72]);
  for (let i = 0; i < 7; i++) add(caps, new THREE.BoxGeometry(0.05, 0.05, 0.05), m.sky, [-0.37 + i * 0.09, 0.17, -0.855]);
  add(caps, new THREE.BoxGeometry(0.26, 0.22, 0.26), m.mid, [1.06, 0.15, 0.55]);
  const shield = part(2.35);
  add(shield, new THREE.BoxGeometry(0.92, 0.02, 0.92), m.steel, [-0.35, 0.31, 0.05]);
  add(shield, new THREE.BoxGeometry(0.92, 0.24, 0.02), m.steel, [-0.35, 0.19, 0.05 - 0.45]);
  add(shield, new THREE.BoxGeometry(0.92, 0.24, 0.02), m.steel, [-0.35, 0.19, 0.05 + 0.45]);
  add(shield, new THREE.BoxGeometry(0.02, 0.24, 0.92), m.steel, [-0.35 - 0.45, 0.19, 0.05]);
  add(shield, new THREE.BoxGeometry(0.02, 0.24, 0.92), m.steel, [-0.35 + 0.45, 0.19, 0.05]);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) add(shield, new THREE.BoxGeometry(0.1, 0.006, 0.1), m.deep, [-0.35 - 0.3 + i * 0.2, 0.322, 0.05 - 0.3 + j * 0.2]);
  return P;
}

function exDocs(m, root) {
  const s = 0.35, FX = -0.85, FZ = -0.472, TZ = 0.364, SX = 0.42, PY = 1.15, CX = 0.42, CZ = 0.364;
  const sheet = new THREE.Group(); root.add(sheet);
  add(sheet, new THREE.BoxGeometry(3.4, 0.02, 2.4), m.paper);
  const lineMat = (c, o) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o });
  const seg = (grp, pts, mat, y = 0.013) => { const g = new THREE.BufferGeometry().setFromPoints(pts.map(([x, z]) => new THREE.Vector3(x, y, z))); const l = new THREE.LineSegments(g, mat); if (mat.isLineDashedMaterial) l.computeLineDistances(); grp.add(l); return l; };
  const rect = (grp, cx, cz, w, h, mat) => seg(grp, [[cx - w / 2, cz - h / 2], [cx + w / 2, cz - h / 2], [cx + w / 2, cz - h / 2], [cx + w / 2, cz + h / 2], [cx + w / 2, cz + h / 2], [cx - w / 2, cz + h / 2], [cx - w / 2, cz + h / 2], [cx - w / 2, cz - h / 2]], mat);
  const circle = (grp, cx, cz, r, mat, n = 40) => { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, b = (i + 1) / n * Math.PI * 2; pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r], [cx + Math.cos(b) * r, cz + Math.sin(b) * r]); } return seg(grp, pts, mat); };
  // 45° hatching clipped to a rect (sheet coords); dir = ±1
  const hatch = (grp, x0, x1, z0, z1, mat, dir = 1, step = 0.04) => {
    const pts = [];
    for (let c = (dir > 0 ? x0 - z1 : x0 + z0) - step; c < (dir > 0 ? x1 - z0 : x1 + z1) + step; c += step) {
      let za, zb;
      if (dir > 0) { za = Math.max(z0, x0 - c); zb = Math.min(z1, x1 - c); if (zb > za) pts.push([za + c, za], [zb + c, zb]); }
      else { za = Math.max(z0, c - x1); zb = Math.min(z1, c - x0); if (zb > za) pts.push([c - za, za], [c - zb, zb]); }
    }
    if (pts.length) seg(grp, pts, mat);
  };
  const layer = () => { const g = new THREE.Group(); sheet.add(g); const list = []; return { g, mk(c, o = 1, dash) { const mt = dash ? new THREE.LineDashedMaterial({ color: c, dashSize: dash[0], gapSize: dash[1], transparent: true, opacity: 0 }) : lineMat(c, 0); list.push({ mt, o }); return mt; }, set(k) { list.forEach((x) => { x.mt.opacity = x.o * k; }); g.visible = k > 0.002; } }; };
  // sheet frame + corner registration marks (always on)
  { const fm = lineMat(C.mid, 0.9); rect(sheet, 0.05, 0, 3.1, 2.2, fm);
    const thin = lineMat(C.mid, 0.4); [[-1.5, -1.1], [1.6, -1.1], [-1.5, 1.1], [1.6, 1.1]].forEach(([x, z]) => seg(sheet, [[x - 0.06, z], [x + 0.06, z], [x, z - 0.06], [x, z + 0.06]], thin));
    // zone marks along the frame
    const zm = []; for (let i = 1; i < 6; i++) zm.push([-1.5 + i * 0.52, -1.1], [-1.5 + i * 0.52, -1.06]); for (let i = 1; i < 4; i++) zm.push([-1.5, -1.1 + i * 0.55], [-1.46, -1.1 + i * 0.55]); seg(sheet, zm, thin); }
  const fz = (y) => FZ - (y + 0.025) * s;
  const SL = [[-0.74, 0.16], [-0.16, 0.86], [0.34, 0.14], [0.47, 0.12], [0.58, 0.1], [0.7, 0.14]];
  const stack = (grp, cx, mat, widths) => SL.forEach(([y, h], i) => rect(grp, cx, fz(y), widths[i] * s, h * s, mat));
  // 02 · top view
  const top = layer(); { const mt = top.mk(C.mid), thin = top.mk(C.mid, 0.45), dash = top.mk(C.mid, 0.6, [0.03, 0.02]);
    rect(top.g, FX, TZ, 2.3 * s, 1.7 * s, mt); rect(top.g, FX, TZ, 1.72 * s, 1.26 * s, mt);
    [[-0.95, -0.68], [0.95, -0.68], [-0.95, 0.68], [0.95, 0.68]].forEach(([x, z]) => { circle(top.g, FX + x * s, TZ + z * s, 0.08 * s, mt, 16); seg(top.g, [[FX + x * s - 0.06, TZ + z * s], [FX + x * s + 0.06, TZ + z * s], [FX + x * s, TZ + z * s - 0.06], [FX + x * s, TZ + z * s + 0.06]], thin); });
    [0.62, 0.3, 0.2].forEach((r) => circle(top.g, FX, TZ, r * s, mt));
    circle(top.g, FX, TZ, 0.46 * s, dash, 48); circle(top.g, FX, TZ, 0.4 * s, dash, 40);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + Math.PI / 6; circle(top.g, FX + Math.cos(a) * 0.46 * s, TZ + Math.sin(a) * 0.46 * s, 0.085 * s, mt, 16); }
    seg(top.g, [[FX - 1.25 * s, TZ], [FX + 1.25 * s, TZ], [FX, TZ - 0.95 * s], [FX, TZ + 0.95 * s]], thin); }
  // 03 · main + left views, hidden lines, construction lines
  const views = layer(); { const mt = views.mk(C.mid), thin = views.mk(C.mid, 0.45), link = views.mk(C.sky, 0.35), dash = views.mk(C.mid, 0.6, [0.03, 0.02]);
    stack(views.g, FX, mt, [2.3, 1.72, 1.24, 1.24, 0.6, 0.38]);
    stack(views.g, SX, mt, [1.7, 1.26, 1.24, 1.24, 0.6, 0.38]);
    seg(views.g, [[FX, fz(0.85)], [FX, fz(-0.9)], [SX, fz(0.85)], [SX, fz(-0.9)]], thin);
    [FX, SX].forEach((cx) => { seg(views.g, [[cx - 0.4 * s, fz(0.27)], [cx - 0.4 * s, fz(-0.59)], [cx + 0.4 * s, fz(0.27)], [cx + 0.4 * s, fz(-0.59)], [cx - 0.2 * s, fz(0.53)], [cx - 0.2 * s, fz(0.41)], [cx + 0.2 * s, fz(0.53)], [cx + 0.2 * s, fz(0.41)]], dash); });
    [[-0.46, 0], [0.46, 0]].forEach(([x]) => rect(views.g, FX + x * s, fz(0.575), 0.19 * s, 0.09 * s, mt));
    seg(views.g, [[FX - 1.15 * s, fz(-0.82) + 0.02], [FX - 1.15 * s, TZ - 0.85 * s - 0.02], [FX + 1.15 * s, fz(-0.82) + 0.02], [FX + 1.15 * s, TZ - 0.85 * s - 0.02], [FX + 1.15 * s + 0.02, fz(0.77)], [SX - 0.19 * s - 0.02, fz(0.77)], [FX + 1.15 * s + 0.02, fz(-0.82)], [SX - 0.85 * s - 0.02, fz(-0.82)]], link); }
  // 04 · section A–A with hatching + cutting plane on top view
  const sect = layer(); { const mt = sect.mk(C.mid), h1 = sect.mk(C.mid, 0.55), cut = sect.mk(C.deep, 0.95), thin = sect.mk(C.mid, 0.45);
    const sz = (y) => CZ - (y + 0.025) * s;
    const R = [
      [[-1.15, 1.15, -0.82, -0.66, 1]],
      [[-0.86, -0.4, -0.59, 0.27, 1], [0.4, 0.86, -0.59, 0.27, 1]],
      [[-0.62, -0.4, 0.27, 0.41, 1], [0.4, 0.62, 0.27, 0.41, 1]],
      [[-0.62, -0.2, 0.41, 0.53, -1], [0.2, 0.62, 0.41, 0.53, -1]],
      [[-0.3, -0.2, 0.53, 0.63, -1], [0.2, 0.3, 0.53, 0.63, -1]],
      [[-0.39, -0.22, -0.06, 0.34, -1], [0.22, 0.39, -0.06, 0.34, -1]],
      [[-0.19, 0.19, -0.13, 0.77, 1]]
    ];
    R.flat().forEach(([x0, x1, y0, y1, d]) => { const X0 = CX + x0 * s, X1 = CX + x1 * s, Z0 = sz(y1), Z1 = sz(y0); rect(sect.g, (X0 + X1) / 2, (Z0 + Z1) / 2, X1 - X0, Z1 - Z0, mt); hatch(sect.g, X0 + 0.004, X1 - 0.004, Z0 + 0.004, Z1 - 0.004, h1, d, d > 0 ? 0.04 : 0.03); });
    seg(sect.g, [[CX, sz(0.85)], [CX, sz(-0.9)]], thin);
    // cutting plane A–A on the top view
    const L = 1.15 * s + 0.16;
    seg(sect.g, [[FX - L, TZ], [FX - L + 0.12, TZ], [FX + L - 0.12, TZ], [FX + L, TZ], [FX - L + 0.06, TZ], [FX - L + 0.06, TZ - 0.12], [FX + L - 0.06, TZ], [FX + L - 0.06, TZ - 0.12]], cut);
    [[FX - L + 0.06, -1], [FX + L - 0.06, 1]].forEach(([x]) => seg(sect.g, [[x, TZ - 0.12], [x - 0.025, TZ - 0.05], [x, TZ - 0.12], [x + 0.025, TZ - 0.05]], cut)); }
  // 05 · dimensions, tolerances, roughness
  const dims = layer(); { const mt = dims.mk(C.deep, 0.95), txt = dims.mk(C.deep, 0.55);
    const arrow = (grp, px, pz, dx, dz) => { const n = Math.hypot(dx, dz); dx /= n; dz /= n; const L = 0.07, W = 0.022; seg(grp, [[px, pz], [px - dx * L - dz * W, pz - dz * L + dx * W], [px, pz], [px - dx * L + dz * W, pz - dz * L - dx * W]], mt); };
    const label = (x, z, w = 0.14) => seg(dims.g, [[x - w / 2, z], [x + w / 2, z]], txt, 0.014);
    const hw = 1.15 * s, zt = fz(0.77), zb = fz(-0.82), zd = zt - 0.18, zd2 = zt - 0.27;
    seg(dims.g, [[FX - hw, fz(-0.66)], [FX - hw, zd2 - 0.04], [FX + hw, fz(-0.66)], [FX + hw, zd2 - 0.04], [FX - hw, zd2], [FX + hw, zd2]], mt);
    arrow(dims.g, FX - hw, zd2, -1, 0); arrow(dims.g, FX + hw, zd2, 1, 0); label(FX, zd2 - 0.035);
    const bw = 0.86 * s;
    seg(dims.g, [[FX - bw, fz(0.27)], [FX - bw, zd - 0.04], [FX + bw, fz(0.27)], [FX + bw, zd - 0.04], [FX - bw, zd], [FX + bw, zd]], mt);
    arrow(dims.g, FX - bw, zd, -1, 0); arrow(dims.g, FX + bw, zd, 1, 0); label(FX, zd - 0.035, 0.1);
    const xd = SX + 0.85 * s + 0.17;
    seg(dims.g, [[SX + 0.19 * s, zt], [xd + 0.04, zt], [SX + 0.85 * s, zb], [xd + 0.04, zb], [xd, zt], [xd, zb]], mt);
    arrow(dims.g, xd, zt, 0, -1); arrow(dims.g, xd, zb, 0, 1); seg(dims.g, [[xd + 0.035, (zt + zb) / 2 - 0.07], [xd + 0.035, (zt + zb) / 2 + 0.07]], txt, 0.014);
    const r = 0.62 * s, c = Math.SQRT1_2, ex = 0.5;
    seg(dims.g, [[FX - r * c, TZ + r * c], [FX + (r + ex) * c, TZ - (r + ex) * c], [FX + (r + ex) * c, TZ - (r + ex) * c], [FX + (r + ex) * c + 0.3, TZ - (r + ex) * c]], mt);
    arrow(dims.g, FX - r * c, TZ + r * c, -1, 1); arrow(dims.g, FX + r * c, TZ - r * c, 1, -1);
    label(FX + (r + ex) * c + 0.15, TZ - (r + ex) * c - 0.035, 0.18);
    // tolerance frame next to the bore diameter
    rect(dims.g, FX + (r + ex) * c + 0.15, TZ - (r + ex) * c + 0.06, 0.26, 0.07, mt); seg(dims.g, [[FX + (r + ex) * c + 0.08, TZ - (r + ex) * c + 0.06], [FX + (r + ex) * c + 0.08, TZ - (r + ex) * c + 0.095]], mt); label(FX + (r + ex) * c + 0.19, TZ - (r + ex) * c + 0.06, 0.12);
    // section width dim
    const sz = (y) => CZ - (y + 0.025) * s, xs = CX + 1.15 * s + 0.16;
    seg(dims.g, [[CX + 0.19 * s, sz(0.77)], [xs + 0.04, sz(0.77)], [CX + 1.15 * s, sz(-0.82)], [xs + 0.04, sz(-0.82)], [xs, sz(0.77)], [xs, sz(-0.82)]], mt);
    arrow(dims.g, xs, sz(0.77), 0, -1); arrow(dims.g, xs, sz(-0.82), 0, 1);
    // roughness marks: on the main view top face and the unspecified one at the sheet corner
    const rough = (x, z, k = 1) => seg(dims.g, [[x, z], [x + 0.03 * k, z + 0.08 * k], [x + 0.03 * k, z + 0.08 * k], [x + 0.08 * k, z - 0.06 * k], [x + 0.08 * k, z - 0.06 * k], [x + 0.15 * k, z - 0.06 * k]], mt);
    rough(SX - 0.52, zt - 0.05, 0.8); rough(1.28, -1.0); label(1.42, -1.035, 0.08); }
  // 06 · title block + parts list
  const tb = layer(); { const mt = tb.mk(C.mid, 0.9), txt = tb.mk(C.mid, 0.5);
    const x0 = 0.2, x1 = 1.6, z0 = 0.74, z1 = 1.1;
    rect(tb.g, (x0 + x1) / 2, (z0 + z1) / 2, x1 - x0, z1 - z0, mt);
    seg(tb.g, [[x0, 0.83], [0.9, 0.83], [x0, 0.92], [0.9, 0.92], [x0, 1.01], [0.9, 1.01], [0.9, 0.86], [x1, 0.86], [1.25, 0.86], [1.25, z1], [0.55, z0], [0.55, z1], [0.9, z0], [0.9, z1], [0.4, z0], [0.4, z1], [1.25, 0.98], [x1, 0.98], [1.37, 0.86], [1.37, 0.98], [1.49, 0.86], [1.49, 0.98]], mt);
    const t = (x, z, w) => seg(tb.g, [[x, z], [x + w, z]], txt, 0.014);
    t(0.24, 0.785, 0.12); t(0.43, 0.785, 0.1); t(0.24, 0.875, 0.12); t(0.43, 0.875, 0.1); t(0.24, 0.965, 0.1); t(0.43, 0.965, 0.1); t(0.24, 1.055, 0.12); t(0.6, 0.785, 0.22); t(0.6, 0.875, 0.22);
    t(1.0, 0.8, 0.5); t(1.0, 0.95, 0.22); t(1.0, 1.03, 0.22); t(1.29, 0.92, 0.05); t(1.41, 0.92, 0.05); t(1.53, 0.92, 0.04); t(1.3, 1.04, 0.24);
    // parts list above the title block
    const px0 = 1.1, px1 = 1.6, pz0 = -0.55, pz1 = 0.7, rows = 12, rh = (pz1 - pz0 - 0.1) / rows;
    rect(tb.g, (px0 + px1) / 2, (pz0 + pz1) / 2, px1 - px0, pz1 - pz0, mt);
    const gl = [[px0, pz0 + 0.1], [px1, pz0 + 0.1], [1.18, pz0], [1.18, pz1], [1.26, pz0], [1.26, pz1], [1.46, pz0], [1.46, pz1], [1.53, pz0], [1.53, pz1]];
    for (let i = 1; i < rows; i++) gl.push([px0, pz0 + 0.1 + i * rh], [px1, pz0 + 0.1 + i * rh]);
    seg(tb.g, gl, mt);
    for (let i = 0; i < 9; i++) { const z = pz0 + 0.1 + (i + 0.5) * rh; t(1.125, z, 0.03); t(1.2, z, 0.04); t(1.28, z, i % 3 === 0 ? 0.16 : 0.12); t(1.475, z, 0.02); }
    t(1.28, pz0 + 0.05, 0.16); }
  // the part, hovering over its top view
  const part = new THREE.Group(); exHousing(m, part); part.scale.setScalar(s); part.position.set(FX, PY, TZ); root.add(part);
  const rayMat = new THREE.LineDashedMaterial({ color: C.sky, dashSize: 0.06, gapSize: 0.045, transparent: true, opacity: 0 });
  const yb = PY - 0.82 * s, rp = [];
  [[-1.15, -0.85], [1.15, -0.85], [1.15, 0.85], [-1.15, 0.85]].forEach(([x, z]) => rp.push(new THREE.Vector3(FX + x * s, yb, TZ + z * s), new THREE.Vector3(FX + x * s, 0.013, TZ + z * s)));
  const rays = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(rp), rayMat); rays.computeLineDistances(); root.add(rays);
  // section plane indicator on the part (appears with the section view)
  const planeMat = new THREE.MeshBasicMaterial({ color: C.sky, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.7 * s, 1.75 * s), planeMat); plane.position.set(FX, PY - 0.02, TZ); root.add(plane);
  const planeEdge = new THREE.LineSegments(new THREE.EdgesGeometry(plane.geometry), new THREE.LineBasicMaterial({ color: C.sky, transparent: true, opacity: 0 })); plane.add(planeEdge);
  const ramp = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const tmpV = new THREE.Vector3();
  const fitPts = [[-1.7, 0, -1.2], [1.7, 0, -1.2], [1.7, 0, 1.2], [-1.7, 0, 1.2]].map((a) => new THREE.Vector3(...a));
  [[-1.15, -0.85], [1.15, -0.85], [1.15, 0.85], [-1.15, 0.85]].forEach(([x, z]) => fitPts.push(new THREE.Vector3(FX + x * s, PY + 0.06 + 0.8 * s, TZ + z * s)));
  return {
    update(p, t, pivot, el) {
      pivot.rotation.set(0, -0.42 + p * 0.5, 0);
      pivot.scale.setScalar(1); pivot.position.y = 0; pivot.updateMatrixWorld(true); el.camera.updateMatrixWorld(true);
      let mx = 0, my = 0;
      fitPts.forEach((v) => { tmpV.copy(v); pivot.localToWorld(tmpV); tmpV.project(el.camera); mx = Math.max(mx, Math.abs(tmpV.x)); my = Math.max(my, Math.abs(tmpV.y)); });
      const sc = Math.min(1.4, 0.86 / Math.max(mx, my, 0.01));
      pivot.scale.setScalar(sc);
      const mid = () => { pivot.updateMatrixWorld(true); let lo = 1, hi = -1; fitPts.forEach((v) => { tmpV.copy(v); pivot.localToWorld(tmpV); tmpV.project(el.camera); lo = Math.min(lo, tmpV.y); hi = Math.max(hi, tmpV.y); }); return (lo + hi) / 2; };
      const c0 = mid(); pivot.position.y = 0.5; const c1 = mid();
      const dy = (c1 - c0) !== 0 ? -c0 * 0.5 / (c1 - c0) : 0;
      pivot.position.y = Math.max(-2, Math.min(2, dy));
      const N = 6, K = (i) => ease(ramp(p, i / N - 0.02, i / N + 0.1));
      const k1 = K(1), k2 = K(2), k3 = K(3), k4 = K(4), k5 = K(5);
      part.position.y = PY + Math.sin(t / 1400) * 0.06 * (1 - k1);
      part.rotation.y = Math.sin(t / 3200) * 0.4 * (1 - k1);
      rayMat.opacity = 0.7 * k1 * (1 - 0.45 * k4); rays.visible = k1 > 0.002;
      const kp = k3 * (1 - 0.6 * k5); planeMat.opacity = 0.14 * kp; planeEdge.material.opacity = 0.7 * kp; plane.visible = kp > 0.002; plane.position.y = part.position.y - 0.02;
      top.set(k1); views.set(k2); sect.set(k3); dims.set(k4); tb.set(k5);
    }
  };
}

const assembled = (fn, m) => { const g = new THREE.Group(); fn(m, g); return g; };
function tileHousing(m) { const g = assembled(exHousing, m); g.scale.setScalar(0.78); g.position.y = 0.12; return g; }
function tileMast(m) { const g = assembled(exMast, m); g.scale.setScalar(0.5); g.position.set(-0.15, 0.55, 0); return g; }
function tilePcb(m) { const g = assembled(exPcb, m); g.scale.setScalar(0.8); g.rotation.x = 0.55; g.position.y = 0.05; return g; }

const EX = { housing: exHousing, mast: exMast, dims: exDims, pcbasm: exPcb, docs: exDocs };
// Без закреплённой прокрутки (планшеты, телефоны) разнесённые виды проигрываются сами по кругу
const AUTO = { housing: 1, mast: 1, dims: 1, pcbasm: 1, docs: 1 };
const FRAME = { antenna: { dist: 5.4, y: 0.1 }, flange: { dist: 5.0, y: 0.15 }, pcb: { dist: 4.8, y: 0.1 }, drawing: { dist: 4.8, y: 0.1 }, array: { dist: 7.6, y: -0.2 }, housing: { dist: 8.2, y: -0.1 }, mast: { dist: 9.4, y: -0.9 }, dims: { dist: 7.4, y: -0.1, camY: 1.5, look: [0, 0, 0] }, pcbasm: { dist: 8.2, y: 0.38 }, docs: { dist: 5.6, y: 0.35, camY: 2.5, look: [0, 0.15, 0] } };
const MOTION = {
  antenna: { dir: 1, speed: 0.0016, start: 0.6, baseX: 0.04, rock: 0.07, per: 2600, roll: 0.04, rper: 3900, bob: 0.05, bper: 3100 },
  flange: { dir: -1, speed: 0.0027, start: -0.5, baseX: 0.24, rock: 0.03, per: 3400, roll: 0.06, rper: 2500, bob: 0.03, bper: 2400 },
  pcb: { dir: 1, speed: 0.0006, start: 0.95, baseX: 0.36, rock: 0.13, per: 2900, roll: 0.17, rper: 4300, bob: 0.07, bper: 3600 },
  drawing: { dir: -1, speed: 0.0004, start: 2.4, baseX: 0.52, rock: 0.05, per: 4200, roll: 0.08, rper: 3100, bob: 0.05, bper: 2800 },
  def: { dir: 1, speed: 0.0015, start: 0, baseX: 0, rock: 0.04, per: 3000, roll: 0.03, rper: 3600, bob: 0.04, bper: 3000 }
};
// Плавная прокрутка с замедлением (нативная smooth на телефонах слишком резкая)
function easeScrollTo(top, duration = 1100) {
  const start = window.scrollY, delta = top - start, t0 = performance.now();
  if (Math.abs(delta) < 2) return;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now) => {
    const k = Math.min(1, (now - t0) / duration);
    window.scrollTo({ top: start + delta * ease(k), behavior: 'instant' });
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const instances = new Set();
let lastBoot = 0;
// одновременно живых WebGL-контекстов; на главной их шесть — иначе при прокрутке модели
// в ещё видимых плитках засыпали и резко пропадали
const MAX = 6;
const centerDist = (el) => { const r = el.getBoundingClientRect(); return Math.abs(r.top + r.height / 2 - innerHeight / 2); };
let loop = null;

class Tile3D extends HTMLElement {
  connectedCallback() {
    if (this._init) return; this._init = true;
    this.style.display = 'block';
    this.kind = this.getAttribute('kind') || 'flange';
    this.mode = this.getAttribute('mode') || 'tile';
    const f = FRAME[this.kind] || FRAME.flange;
    this.baseDist = f.dist; this.frameY = f.y;
    this.mo = MOTION[this.kind] || MOTION.def;
    this.rotY = this.mo.start; this.speed = this.mo.speed * this.mo.dir; this.targetSpeed = this.speed; this.tiltX = 0; this.tiltZ = 0; this.tTiltX = 0; this.tTiltZ = 0; this.scale = 1; this.tScale = 1;
    this.visible = true;
    if (this.mode === 'explode') {
      this.host = this.closest('[data-explode]');
      this.steps = this.host ? Array.from(this.host.querySelectorAll('[data-ex-step]')) : [];
      this.p = 0; this.tp = 0; this._act = -1;
      this._ck = (ev) => {
        const s = ev.target && ev.target.closest && ev.target.closest('[data-ex-step]');
        if (!s) return;
        const host = s.closest('[data-explode]');
        if (!host || !host.contains(this)) return;
        this.host = host;
        const list = Array.from(host.querySelectorAll('[data-ex-step]'));
        const stage = host.querySelector('[data-ex-stage]');
        const i = list.indexOf(s); if (i < 0) return;
        this.steps = list; this._act = -1;
        const t = (i + 0.5) / list.length;
        if (!stage || getComputedStyle(stage).position !== 'sticky') {
          // без закреплённой прокрутки (планшет/телефон): переводим сцену к выбранному шагу
          // и держим её 6 с, потом авто-проигрывание продолжается с этого места
          this._auto = false; this.tp = t; this._at = t; this._hold = performance.now() + 6000;
          // если сцена не видна (список ниже экрана) — подводим под шапку заголовок сцены («Разнесённый вид · …»)
          const cr = this.getBoundingClientRect(), navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
          const head = host.querySelector('[data-ex-head]') || this;
          if (cr.top < navH || cr.bottom > innerHeight) easeScrollTo(head.getBoundingClientRect().top + scrollY - navH - 24);
          return;
        }
        const jump = (smooth) => { const r = host.getBoundingClientRect(); const span = r.height - innerHeight; if (span <= 40) return; window.scrollTo({ top: r.top + scrollY + span * t, behavior: smooth ? 'smooth' : 'auto' }); };
        jump(true);
        setTimeout(() => { const r = host.getBoundingClientRect(); const span = r.height - innerHeight; if (span <= 40) return; if (Math.abs(-r.top / span - t) > 0.04) jump(false); }, 850);
      };
      document.addEventListener('click', this._ck);
      this._sc = () => this.measure();
      window.addEventListener('scroll', this._sc, { passive: true }); window.addEventListener('resize', this._sc);
      this.measure();
    } else if (this.mode === 'hero') {
      this.speed = this.targetSpeed = 0.0025; this.rotY = 0.35;
      window.addEventListener('pointermove', this._pm = (e) => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; this.tTiltX = ny * 0.25; this.tTiltZ = -nx * 0.2; this.tPanX = nx * 0.18; });
      window.addEventListener('scroll', this._sc = () => { this.scrollY = window.scrollY || 0; }, { passive: true });
      this.tPanX = 0; this.panX = 0; this.scrollY = window.scrollY || 0;
      this.tScale = 1; this.scale = 0.001;
    } else {
      const host = this.closest('[data-tile]') || this.parentElement;
      host.addEventListener('pointerenter', () => { this.targetSpeed = this.mo.speed * 1.8 * this.mo.dir; this.tScale = 1.06; this.tLight = 1; });
      host.addEventListener('pointerleave', () => { this.targetSpeed = this.mo.speed * this.mo.dir; this.tScale = 1; this.tTiltX = 0; this.tTiltZ = 0; this.tLight = 0; });
      host.addEventListener('pointermove', (e) => { const r = host.getBoundingClientRect(); const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5; this.tTiltX = ny * 0.5; this.tTiltZ = -nx * 0.35; });
    }
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this);
    this.visible = false;
    instances.add(this);
    if (!loop) { loop = () => { instances.forEach(i => { try { i.tick(); } catch (e) { if (!i._warned) { i._warned = 1; console.warn('tile-3d tick', e); } } }); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  }
  boot() {
    if (this.renderer || this._dead) return;
    const live = [...instances].filter(i => i.renderer && i !== this).sort((a, b) => centerDist(b) - centerDist(a));
    const mine = centerDist(this);
    // усыпляем только те, что уже ушли с экрана; видимые не трогаем (иначе модель исчезает на глазах)
    while (live.length >= MAX) { const far = live[0]; if (far.near || centerDist(far) <= mine) return; far.sleep(); live.shift(); }
    // холст появляется плавно: прозрачность растёт после первого отрисованного кадра
    const canvas = document.createElement('canvas'); canvas.style.cssText = 'width:100%;height:100%;display:block;opacity:0;transition:opacity .9s cubic-bezier(.2,.7,.2,1)'; this.appendChild(canvas);
    this._shown = false;
    try { this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); } catch (e) { this.removeChild(canvas); this._dead = true; return; }
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.sleep(); });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    this.renderer.localClippingEnabled = true;
    this.canvas = canvas;
    const f = FRAME[this.kind] || FRAME.flange;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60); this.camera.position.set(0, 1.4, f.dist); this.camera.lookAt(0, this.mode === 'explode' ? 0 : f.y, 0);
    this.scene.add(new THREE.HemisphereLight(0xe8f1fb, 0x1d2d3d, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xb5d9fd, 1.4); rim.position.set(-4, 2, -3); this.scene.add(rim);
    if (this.mode === 'tile') { this.spot = new THREE.PointLight(0xdcecff, 0, 9, 2); this.spot.position.set(1.2, 2.2, 2.6); this.scene.add(this.spot); this.lightK = 0; this.tLight = 0; }
    this.pivot = new THREE.Group();
    if (this.mode === 'explode') { this.parts = (EX[this.kind] || exHousing)(M(), this.pivot); }
    else { this.model = (BUILD[this.kind] || flange)(M()); this.pivot.add(this.model); }
    if (this.mode === 'tile') this.scale = 0.86;
    this.pivot.position.y = this.mode === 'explode' ? -f.y : f.y; this.pivot.scale.setScalar(this.scale == null ? 1 : this.scale); this.scene.add(this.pivot); this.baseY = this.pivot.position.y;
    this.resize();
  }
  sleep() {
    if (!this.renderer) return;
    this.scene && this.scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); });
    try { this.renderer.forceContextLoss(); } catch (e) {}
    this.renderer.dispose();
    if (this.canvas && this.canvas.parentNode === this) this.removeChild(this.canvas);
    this.renderer = null; this.scene = null; this.pivot = null; this.parts = null; this.canvas = null;
  }
  measure() {
    if (!this.host || !this.host.isConnected) { this.host = this.closest('[data-explode]'); this.steps = this.host ? Array.from(this.host.querySelectorAll('[data-ex-step]')) : []; this._act = -1; }
    if (!this.host) return;
    const stage = this.host.querySelector('[data-ex-stage]');
    const pinned = !!stage && getComputedStyle(stage).position === 'sticky';
    if (!pinned && this._hold && performance.now() < this._hold) return;
    if (!pinned) { if (AUTO[this.kind]) { this._auto = true; } else { this._auto = false; this.tp = 0; } return; }
    const r = this.host.getBoundingClientRect(); const span = r.height - window.innerHeight;
    if (span > 40) { this._auto = false; this.tp = Math.min(1, Math.max(0, -r.top / span)); }
    else if (AUTO[this.kind]) { this._auto = true; }
    else { this._auto = false; this.tp = 0; } }
  disconnectedCallback() { instances.delete(this); if (this._ck) document.removeEventListener('click', this._ck); if (this._pm) window.removeEventListener('pointermove', this._pm); if (this._sc) { window.removeEventListener('scroll', this._sc); window.removeEventListener('resize', this._sc); } this.ro && this.ro.disconnect(); this.sleep(); this._init = false; }
  resize() {
    if (!this.renderer) return;
    const w = this.clientWidth || 300, h = this.clientHeight || 300;
    this.renderer.setSize(w, h, false);
    const a = w / h;
    this.camera.aspect = a;
    this.camera.fov = 30;
    this.camera.updateProjectionMatrix();
    if (this.mode === 'explode') return;
    if (this._r == null) {
      let r = 0; const V = this.camera.position.constructor;
      this.pivot.updateMatrixWorld(true);
      this.pivot.traverse((o) => {
        if (!o.isMesh || !o.geometry) return;
        o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox;
        for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) {
          const v = new V(x, y, z); o.localToWorld(v); this.pivot.worldToLocal(v); r = Math.max(r, v.length());
        }
      });
      this._r = r || 1.5;
    }
    const hv = this.camera.fov / 2 * Math.PI / 180;
    const hh = Math.atan(Math.tan(hv) * a);
    // в узком блоке (телефон) модель кадрируем плотнее, иначе она выглядит мелкой
    // в узком или широком-низком блоке (телефон/планшет) модель кадрируем плотнее, иначе она выглядит мелкой
    const tight = w < 420 || a > 1.6;
    const dist = this._r / Math.sin(Math.min(hv, hh)) * (this.mode === 'hero' ? (tight ? 0.8 : 1.12) : (tight ? 1.0 : 1.22));
    this.camera.position.z = this.mode === 'hero' ? Math.max(this.baseDist, dist) : dist;
    this.camera.lookAt(0, (FRAME[this.kind] || FRAME.flange).y, 0);
  }
  tick() {
    const now = performance.now();
    if (now > (this._vt || 0)) {
      this._vt = now + 160;
      const r = this.getBoundingClientRect();
      this.visible = r.width > 0 && r.bottom > -80 && r.top < innerHeight + 80;
      // «рядом» — на экран ещё не попал, но скоро попадёт: сцену готовим заранее, пока плитка
      // за кадром, чтобы создание WebGL-контекста не дёргало страницу в момент появления
      this.near = r.width > 0 && r.bottom > -innerHeight * 0.75 && r.top < innerHeight * 1.75;
      if (this.mode === 'explode') this.measure();
      if (!this.near && this.renderer) this.sleep();
    }
    if (!this.renderer) {
      // не больше одной инициализации за 120 мс — иначе несколько сцен, создаваемых в один кадр, дают рывок
      if (this.near && !this._dead && now > (this._retry || 0) && now - lastBoot > 120) { this._retry = now + 300; lastBoot = now; this.boot(); }
      return;
    }
    if (!this.visible) return;
    if (this.mode === 'explode') {
      if (this._auto) {
        // авто-режим: разобрать (0→1), пауза, собрать обратно (1→0), пауза — без резкого сброса
        this._at = ((this._at || 0) + 0.0032) % 2.5;
        const c = this._at;
        this.tp = c < 1 ? c : c < 1.25 ? 1 : c < 2.25 ? 1 - (c - 1.25) : 0;
      }
      this.p += (this.tp - this.p) * 0.07;
      const p = this.p, n = this.parts.length;
      if (this.parts.update) {
        const fr = FRAME[this.kind] || FRAME.flange;
        // на узком холсте отодвигаем камеру, чтобы вокруг модели осталось место для выносок размеров
        const far = this.kind === 'dims' && this.clientWidth < 700 ? 1.3 : 1;
        this.camera.position.set(0, fr.camY == null ? 1.6 : fr.camY, this.baseDist * far); this.camera.lookAt(...(fr.look || [0, 0, 0]));
        this.parts.update(p, now, this.pivot, this);
      } else {
      const ns = (this.steps && this.steps.length) || this.parts.length;
      this.parts.forEach((pt, i) => { const st = pt.step == null ? i : pt.step; const t = pt.inv ? Math.min(1, Math.max(0, (p - (i * 0.2 - 0.08)) / 0.18)) : (st < 0 ? 0 : Math.min(1, Math.max(0, (p - st / ns) / (0.9 / ns)))); const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; pt.g.position.copy(pt.dir).multiplyScalar((pt.inv ? 1 - e : e) * pt.dist); if (pt.dir2 && pt.step2 != null) { const t2 = Math.min(1, Math.max(0, (p - pt.step2 / ns) / (0.9 / ns))); const e2 = t2 < 0.5 ? 2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 2) / 2; pt.g.position.addScaledVector(pt.dir2, e2 * pt.dist2); } });
      if (this.parts.inv) {
        const sc = 0.92;
        this.pivot.rotation.set(0.5 + p * 0.08, -0.75 + p * 1.05, 0);
        this.pivot.scale.setScalar(sc);
        this.pivot.position.y = -0.85;
        this.camera.position.set(0, 1.7, this.baseDist); this.camera.lookAt(0, 0, 0);
      } else {
      let up = 0, dn = 0; this.parts.forEach((pt) => { const y = pt.g.position.y; if (y > up) up = y; if (y < dn) dn = y; });
      const ext = Math.min(1, (up - dn) / 4.9);
      this.pivot.rotation.set(0.1 + p * 0.12, -0.55 + p * 1.5, 0);
      this.pivot.scale.setScalar(1 - ext * 0.26);
      this.pivot.position.y = -(FRAME[this.kind] || FRAME.flange).y - (up + dn) * 0.5 * (1 - ext * 0.32) * 0.9;
      this.camera.position.set(0, 1.4 + ext * 0.4, this.baseDist * (0.92 + ext * 0.34)); this.camera.lookAt(0, 0, 0);
      }
      }
      if (this.steps.length) { const act = Math.min(this.steps.length - 1, Math.floor(p * this.steps.length * 0.999)); if (act !== this._act) { this._act = act; this.steps.forEach((s, i) => i <= act ? s.setAttribute('data-on', '') : s.removeAttribute('data-on')); } }
      this.renderer.render(this.scene, this.camera); this.reveal(); return;
    }
    this.speed += (this.targetSpeed - this.speed) * 0.06; if (this.mode === 'hero') { const target = 0.35 + Math.sin(performance.now() / 5000) * 0.45 + (this.scrollY || 0) * 0.0015; this.rotY += (target - this.rotY) * 0.03; } else this.rotY += this.speed;
    this.tiltX += (this.tTiltX - this.tiltX) * 0.08; this.tiltZ += (this.tTiltZ - this.tiltZ) * 0.08; this.scale += (this.tScale - this.scale) * 0.08;
    if (this.mode === 'hero') { this.panX += ((this.tPanX || 0) - this.panX) * 0.05; this.pivot.position.x = this.panX; this.pivot.rotation.set(this.tiltX, this.rotY, this.tiltZ); this.pivot.position.y = (FRAME[this.getAttribute('kind')] || FRAME.flange).y + Math.sin(performance.now() / 1400) * 0.08; }
    else { const mo = this.mo, ms = now; this.pivot.rotation.set(this.tiltX + mo.baseX + Math.sin(ms / mo.per) * mo.rock, this.rotY, this.tiltZ + Math.cos(ms / mo.rper) * mo.roll); this.pivot.position.y = this.baseY + Math.sin(ms / mo.bper) * mo.bob; }
    this.pivot.scale.setScalar(this.scale);
    if (this.spot) { this.lightK += ((this.tLight || 0) - this.lightK) * 0.06; this.spot.intensity = this.lightK * 14; }
    this.renderer.render(this.scene, this.camera); this.reveal();
  }
  reveal() { if (this._shown || !this.canvas) return; this._shown = true; const c = this.canvas; requestAnimationFrame(() => { c.style.opacity = '1'; }); }
}
if (!customElements.get('tile-3d')) customElements.define('tile-3d', Tile3D);
