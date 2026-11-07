import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { surface, screenTexture } from './textures';

type Parent = T.Object3D;
const materials = {
  plaster: new T.MeshStandardMaterial({ map: surface('plaster', '#69625b'), roughness: .96 }),
  outside: new T.MeshStandardMaterial({ map: surface('plaster', '#514e48'), roughness: .95 }),
  wood: new T.MeshStandardMaterial({ map: surface('wood', '#654630'), roughness: .54 }),
  door: new T.MeshStandardMaterial({ map: surface('wood', '#4d3324'), roughness: .47 }),
  walnut: new T.MeshStandardMaterial({ map: surface('wood', '#473326'), roughness: .58 }),
  black: new T.MeshStandardMaterial({ color: '#17191a', roughness: .52, metalness: .35 }),
  leather: new T.MeshStandardMaterial({ map: surface('fabric', '#343735'), roughness: .85 }),
  metal: new T.MeshStandardMaterial({ color: '#8f8d86', metalness: .88, roughness: .27 }),
  ceramic: new T.MeshStandardMaterial({ color: '#b5aa92', roughness: .78 }),
  paper: new T.MeshStandardMaterial({ color: '#c9bd9f', roughness: 1 }),
  green: new T.MeshStandardMaterial({ color: '#3c5136', roughness: .9, side: T.DoubleSide }),
  soil: new T.MeshStandardMaterial({ color: '#251c13', roughness: 1 }),
};
type Mat = T.Material;
const boxCache = new Map<string, T.BufferGeometry>();

function box(parent: Parent, size: number[], at: number[], mat: Mat, bevel = .008) {
  const radius = Math.min(bevel, Math.min(...size) / 3);
  const key = `${size.join(',')},${radius}`;
  let geometry = boxCache.get(key);
  if (!geometry) { geometry = radius ? new RoundedBoxGeometry(size[0], size[1], size[2], 2, radius) : new T.BoxGeometry(...size as [number, number, number]); boxCache.set(key, geometry); }
  const mesh = new T.Mesh(geometry, mat); mesh.position.set(...at as [number, number, number]); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function cylinder(parent: Parent, radii: [number, number], height: number, at: number[], mat: Mat, segments = 24) {
  const mesh = new T.Mesh(new T.CylinderGeometry(...radii, height, segments), mat); mesh.position.set(...at as [number, number, number]); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function rod(parent: Parent, from: number[], to: number[], radius: number, mat = materials.black) {
  const start = new T.Vector3(...from as [number, number, number]), end = new T.Vector3(...to as [number, number, number]);
  const mesh = cylinder(parent, [radius, radius], start.distanceTo(end), start.clone().add(end).multiplyScalar(.5).toArray(), mat, 12);
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), end.sub(start).normalize()); return mesh;
}
function group(parent: Parent, at: number[]) { const object = new T.Group(); object.position.set(...at as [number, number, number]); parent.add(object); return object; }

function plant(parent: Parent, at: number[], scale = 1) {
  const g = group(parent, at); g.scale.setScalar(scale);
  cylinder(g, [.14, .105], .23, [0, .115, 0], materials.ceramic);
  cylinder(g, [.13, .13], .012, [0, .233, 0], materials.soil);
  for (let i = 0; i < 13; i++) {
    const a = i * 2.4, h = .28 + (i % 5) * .07, r = .1 + (i % 3) * .035;
    rod(g, [0, .23, 0], [Math.cos(a) * r, h + .12, Math.sin(a) * r], .0035, materials.green);
    const leaf = new T.Mesh(new T.SphereGeometry(1, 10, 6), materials.green);
    leaf.position.set(Math.cos(a) * r * 1.4, h + .14, Math.sin(a) * r * 1.4); leaf.scale.set(.065, .15, .018); leaf.rotation.set(.6, -a, .6); leaf.castShadow = true; g.add(leaf);
  }
}

function art(parent: Parent, at: number[], width = .9, height = .64) {
  const frame = group(parent, at);
  box(frame, [width, height, .035], [0, 0, 0], materials.walnut);
  box(frame, [width - .045, height - .045, .01], [0, 0, .023], materials.paper);
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 320;
  const c = canvas.getContext('2d')!; c.fillStyle = '#b7ad98'; c.fillRect(0, 0, 512, 320);
  ['#99927e', '#7f7c6e', '#515c52'].forEach((color, i) => { c.fillStyle = color; c.beginPath(); c.moveTo(0, 170 + i * 45); c.lineTo(110, 80 + i * 49); c.lineTo(290, 160 + i * 35); c.lineTo(440, 90 + i * 36); c.lineTo(512, 135 + i * 40); c.lineTo(512, 320); c.lineTo(0, 320); c.fill(); });
  const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace;
  box(frame, [width * .8, height * .7, .003], [0, 0, .031], new T.MeshStandardMaterial({ map: texture, roughness: 1 }), 0);
  return frame;
}

export function createRoom(canvas: HTMLCanvasElement) {
  const mobile = matchMedia('(max-width: 700px)').matches;
  const renderer = new T.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.6));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  const scene = new T.Scene(); scene.background = new T.Color('#262723'); scene.fog = new T.Fog('#242522', 11, 28);
  const camera = new T.PerspectiveCamera(43, 1, .015, 45);
  const pmrem = new T.PMREMGenerator(renderer); const envScene = new RoomEnvironment();
  const env = pmrem.fromScene(envScene, .04); scene.environment = env.texture; scene.environmentIntensity = .28; envScene.dispose(); pmrem.dispose();
  scene.add(new T.HemisphereLight('#dadfee', '#514131', 1.05));
  const sun = new T.DirectionalLight('#ffe5bf', 2.5); sun.position.set(-3, 6, -3.8); sun.target.position.set(1, 0, -1);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -7; sun.shadow.camera.right = 7; sun.shadow.camera.top = 7; sun.shadow.camera.bottom = -7; sun.shadow.normalBias = .025; sun.shadow.bias = -.00015;
  scene.add(sun, sun.target);
  const outsideFill = new T.PointLight('#e3c4a0', 12, 9, 2); outsideFill.position.set(-2.5, 2.6, 3); scene.add(outsideFill);

  // Architecture: the entry is at z=0, the workspace is on the right (+x).
  box(scene, [18, .15, 16], [0, -.09, 0], materials.black, 0);
  const floorMaterials = [0, 1, 2, 3].map(i => new T.MeshStandardMaterial({ map: materials.wood.map, color: new T.Color().setHSL(.08, .12, .68 + i * .05), roughness: .72 }));
  for (let x = -3.5; x < 3.6; x += .3) for (let z = -6; z < 0; z += 1.2) {
    box(scene, [.294, .025, 1.19], [x, .002, z + .6], floorMaterials[Math.abs(Math.round(x * 10 + z * 10)) % 4], .001);
  }
  for (let x = -7; x <= 7; x += 1) for (let z = .5; z < 8; z += 1) box(scene, [.994, .02, .994], [x, -.006, z], materials.outside, .001);
  box(scene, [6.1, 3.4, .22], [-4, 1.7, 0], materials.outside, 0);
  box(scene, [6.1, 3.4, .22], [4, 1.7, 0], materials.outside, 0);
  box(scene, [2, .85, .22], [0, 2.975, 0], materials.outside, 0);
  box(scene, [.16, 3.2, 6.2], [-3.6, 1.6, -3], materials.plaster, 0);
  box(scene, [.16, 3.2, 6.2], [3.6, 1.6, -3], materials.plaster, 0);
  box(scene, [7.2, 3.2, .16], [0, 1.6, -6], materials.plaster, 0);
  box(scene, [7.2, .1, 6], [0, 3.22, -3], materials.plaster, 0);
  for (const x of [-3.5, 3.5]) box(scene, [.045, .1, 5.9], [x, .06, -3], materials.walnut);
  box(scene, [7, .1, .045], [0, .06, -5.88], materials.walnut);
  // Jambs, reveal, threshold and actual hinge geometry.
  for (const x of [-1.015, 1.015]) {
    box(scene, [.12, 2.58, .25], [x, 1.29, 0], materials.walnut);
    box(scene, [.025, 2.48, .04], [x + (x < 0 ? .06 : -.06), 1.24, -.11], materials.black);
  }
  box(scene, [2.14, .12, .25], [0, 2.58, 0], materials.walnut);
  box(scene, [2, .025, .27], [0, .014, 0], materials.metal);
  const door = group(scene, [-.95, 0, -.015]);
  const leaf = box(door, [1.9, 2.48, .065], [.95, 1.255, 0], materials.door, .012);
  for (const x of [.08, 1.82]) box(door, [.012, 2.3, .003], [x, 1.25, .035], materials.walnut, 0);
  for (const y of [.22, 1.25, 2.25]) cylinder(door, [.016, .016], .12, [0, y, .02], materials.metal, 16);
  for (const side of [-1, 1]) {
    box(door, [.065, .18, .013], [1.7, 1.08, side * .04], materials.metal);
    rod(door, [1.7, 1.1, side * .04], [1.7, 1.1, side * .095], .014, materials.metal);
    rod(door, [1.7, 1.1, side * .095], [1.53, 1.1, side * .095], .015, materials.metal);
    cylinder(door, [.008, .008], .008, [1.7, 1.03, side * .05], materials.black).rotation.x = Math.PI / 2;
  }
  // Engraved room marker.
  const plaqueCanvas = document.createElement('canvas'); plaqueCanvas.width = 512; plaqueCanvas.height = 256;
  const pc = plaqueCanvas.getContext('2d')!; pc.fillStyle = '#302f2b'; pc.fillRect(0, 0, 512, 256); pc.fillStyle = '#c1b59e'; pc.font = '34px monospace'; pc.fillText('01', 42, 86); pc.font = '25px sans-serif'; pc.fillText('RUANG KARYA', 42, 146); pc.fillStyle = '#7c786b'; pc.font = '17px monospace'; pc.fillText('MAKE YOURSELF AT HOME', 42, 202);
  const plaque = new T.CanvasTexture(plaqueCanvas); plaque.colorSpace = T.SRGBColorSpace;
  box(scene, [.58, .29, .02], [1.56, 1.55, .13], new T.MeshStandardMaterial({ map: plaque, roughness: .8 }));
  // Exterior wall sconce and pool of warm light.
  box(scene, [.1, .4, .12], [-1.62, 1.95, .18], materials.black);
  const emitter = new T.MeshBasicMaterial({ color: '#ffdd9d' });
  for (const y of [1.74, 2.16]) {
    box(scene, [.075, .008, .09], [-1.62, y, .2], emitter);
    const light = new T.PointLight('#ffca83', 3, 2.2, 2); light.position.set(-1.62, y, .27); scene.add(light);
  }
  plant(scene, [-2.05, .01, .55], 1.65);

  // Rear window with a luminous outdoor view, mullions, sill and blinds.
  const skyCanvas = document.createElement('canvas'); skyCanvas.width = 512; skyCanvas.height = 512;
  const sc = skyCanvas.getContext('2d')!; const gradient = sc.createLinearGradient(0, 0, 0, 512); gradient.addColorStop(0, '#99adb4'); gradient.addColorStop(.6, '#d7d5bd'); gradient.addColorStop(1, '#637062'); sc.fillStyle = gradient; sc.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 75; i++) { sc.fillStyle = `rgba(40,65,44,${.12 + (i % 5) * .07})`; sc.beginPath(); sc.arc((i * 73) % 512, 310 + Math.sin(i) * 110, 18 + (i % 7) * 8, 0, Math.PI * 2); sc.fill(); }
  const skyTexture = new T.CanvasTexture(skyCanvas); skyTexture.colorSpace = T.SRGBColorSpace;
  box(scene, [2.5, 1.72, .1], [-.7, 1.85, -5.85], materials.walnut);
  box(scene, [2.32, 1.54, .02], [-.7, 1.85, -5.78], new T.MeshBasicMaterial({ map: skyTexture, color: '#cfdbd7' }));
  for (const x of [-1.88, -.7, .48]) box(scene, [.045, 1.58, .06], [x, 1.85, -5.74], materials.black);
  box(scene, [2.65, .065, .28], [-.7, .97, -5.74], materials.walnut);
  for (let i = 0; i < 19; i++) { const blind = box(scene, [2.35, .018, .065], [-.7, 2.63 - i * .078, -5.69], materials.walnut); blind.rotation.x = -.35; }
  for (const x of [-1.55, .15]) rod(scene, [x, 1.1, -5.65], [x, 2.66, -5.65], .003, materials.paper);

  // Textured woven rug and edge bindings.
  const rug = new T.MeshStandardMaterial({ map: surface('fabric', '#55584f'), roughness: 1 });
  box(scene, [2.6, .012, 3.65], [.25, .026, -2.55], rug);
  for (const x of [-.99, 1.49]) box(scene, [.028, .002, 3.5], [x, .033, -2.55], materials.paper, 0);

  // Desk is rotated toward the right wall. Local +z is the seated visitor side.
  const workspace = group(scene, [2.7, 0, -3.5]); workspace.rotation.y = -Math.PI / 2;
  box(workspace, [2.5, .065, .86], [0, .77, 0], materials.wood, .016);
  box(workspace, [2.43, .035, .8], [0, .726, 0], materials.walnut);
  for (const x of [-1.12, 1.12]) for (const z of [-.32, .32]) box(workspace, [.045, .72, .045], [x, .36, z], materials.black);
  box(workspace, [.48, .56, .69], [.9, .44, -.01], materials.walnut);
  for (let i = 0; i < 3; i++) { box(workspace, [.46, .17, .018], [.9, .63 - i * .18, .344], materials.wood); box(workspace, [.16, .01, .025], [.9, .68 - i * .18, .363], materials.black); }
  // Laptop base, ports, individual keys, trackpad, two coaxial hinges, lid and display.
  const laptop = group(workspace, [0, .813, .02]);
  box(laptop, [.67, .025, .46], [0, .013, 0], materials.metal, .009);
  box(laptop, [.64, .004, .435], [0, .028, 0], materials.black, .008);
  box(laptop, [.23, .003, .12], [0, .031, .13], materials.metal, .007);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 13; col++) box(laptop, [.038, .005, .027], [-.267 + col * .0445, .033, -.145 + row * .034], materials.leather, .003);
  box(laptop, [.2, .006, .025], [0, .034, .013], materials.leather, .003);
  for (const x of [-.32, .32]) for (const z of [-.12, -.04]) box(laptop, [.005, .007, .032], [x, .013, z], materials.black, .001);
  for (const x of [-.23, .23]) { const hinge = cylinder(laptop, [.014, .014], .09, [x, .035, -.209], materials.black); hinge.rotation.z = Math.PI / 2; }
  const lid = group(laptop, [0, .039, -.209]);
  box(lid, [.67, .014, .444], [0, 0, .218], materials.metal, .009);
  box(lid, [.639, .003, .41], [0, -.009, .218], materials.black, .008);
  const displayMaterial = new T.MeshBasicMaterial({ map: screenTexture(), color: '#e8e8e8', toneMapped: false });
  const display = new T.Mesh(new T.PlaneGeometry(.601, .375), displayMaterial); display.rotation.x = Math.PI / 2; display.position.set(0, -.011, .224); lid.add(display);
  const webcam = cylinder(lid, [.0025, .0025], .001, [0, -.012, .423], materials.black, 12);
  webcam.rotation.x = 0;
  box(lid, [.085, .002, .075], [0, .008, .23], materials.walnut, .012);

  // Office chair: cushioned seat/back, seams, arms, gas lift and five casters.
  const chair = group(workspace, [0, 0, .92]);
  cylinder(chair, [.035, .035], .34, [0, .29, 0], materials.metal);
  cylinder(chair, [.065, .065], .06, [0, .11, 0], materials.black);
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5; const x = Math.sin(a) * .31, z = Math.cos(a) * .31;
    rod(chair, [0, .13, 0], [x, .075, z], .023);
    const caster = cylinder(chair, [.04, .04], .05, [x, .046, z], materials.black, 16); caster.rotation.z = Math.PI / 2;
  }
  box(chair, [.55, .095, .51], [0, .49, 0], materials.leather, .035);
  box(chair, [.57, .025, .52], [0, .438, 0], materials.black);
  const back = box(chair, [.53, .61, .085], [0, .87, .215], materials.leather, .03); back.rotation.x = .1;
  for (const x of [-.23, .23]) box(chair, [.003, .52, .002], [x, .88, .165], materials.paper, 0);
  rod(chair, [0, .44, .14], [0, .78, .255], .024, materials.metal);
  for (const x of [-.31, .31]) {
    rod(chair, [x, .47, 0], [x, .72, 0], .018);
    box(chair, [.07, .035, .34], [x, .735, .005], materials.black, .016);
  }

  // Desk lamp, including an actual targeted light and a visible warm diffuser.
  const lamp = group(workspace, [-.86, .81, -.12]);
  cylinder(lamp, [.115, .125], .025, [0, .013, 0], materials.black);
  rod(lamp, [0, .03, 0], [0, .47, -.04], .012);
  rod(lamp, [0, .47, -.04], [.12, .55, .03], .012);
  cylinder(lamp, [.055, .12], .1, [.12, .52, .03], materials.black);
  cylinder(lamp, [.108, .108], .004, [.12, .468, .03], emitter);
  const deskLight = new T.SpotLight('#ffd49a', 7, 4, .95, .7, 2); const lightTarget = group(lamp, [.22, -.1, .15]);
  deskLight.position.set(.12, .45, .03); deskLight.target = lightTarget; deskLight.castShadow = true; deskLight.shadow.mapSize.set(512, 512); deskLight.shadow.normalBias = .015; lamp.add(deskLight);
  const lampFill = new T.PointLight('#ffd19b', .7, 1.5, 2); lampFill.position.set(.12, .44, .03); lamp.add(lampFill);

  // Cup, coffee, notebook, paper edges, elastic band and pencil.
  const cup = group(workspace, [.66, .815, .04]);
  cylinder(cup, [.056, .046], .11, [0, .055, 0], materials.ceramic);
  cylinder(cup, [.047, .047], .003, [0, .109, 0], new T.MeshStandardMaterial({ color: '#21170e', roughness: .25 }));
  const handle = new T.Mesh(new T.TorusGeometry(.034, .009, 8, 20), materials.ceramic); handle.position.set(.06, .058, 0); cup.add(handle);
  box(workspace, [.32, .035, .22], [.83, .825, .24], materials.black);
  box(workspace, [.3, .023, .206], [.83, .828, .242], materials.paper);
  box(workspace, [.32, .004, .22], [.83, .846, .24], materials.walnut);
  box(workspace, [.009, .004, .216], [.92, .849, .24], materials.black);
  rod(workspace, [.58, .813, .29], [.78, .813, .34], .004, materials.paper);

  // Wall shelves and purposeful small objects.
  for (const y of [1.63, 2.12]) {
    box(workspace, [2.55, .035, .23], [0, y, -.62], materials.wood);
    for (const x of [-.9, .9]) { rod(workspace, [x, y - .23, -.7], [x, y - .02, -.53], .01); }
  }
  for (let i = 0; i < 7; i++) {
    const book = box(workspace, [.045 + (i % 3) * .009, .24 + (i % 4) * .03, .16], [-.9 + i * .075, 1.77 + (i % 4) * .015, -.63], i % 2 ? materials.walnut : materials.paper);
    book.rotation.z = i > 4 ? -.12 : 0;
  }
  plant(workspace, [.8, 2.14, -.61], .65);
  plant(workspace, [1.05, .81, -.15], .55);
  const wallArt = art(workspace, [.3, 1.25, -.705], .65, .44);
  wallArt.rotation.y = 0;
  plant(scene, [-2.6, .025, -5.2], 2.2);
  art(scene, [-2.6, 1.85, -5.85], .7, .9);
  // A restrained pendant and its ceiling mount.
  rod(scene, [.2, 3.1, -2.8], [.2, 2.55, -2.8], .007);
  cylinder(scene, [.08, .24], .18, [.2, 2.48, -2.8], materials.black);
  cylinder(scene, [.225, .225], .006, [.2, 2.387, -2.8], emitter);

  const raycaster = new T.Raycaster(), pointer = new T.Vector2();
  let active = true, visible = true, dirty = true, lastFrame = 0, animationId = 0;
  let progress = 0;
  const look = new T.Vector3();
  const frames = [
    { p: 0, pos: [0, 1.6, 4.15], aim: [0, 1.35, 0] },
    { p: .16, pos: [0, 1.58, .65], aim: [.5, 1.35, -3] },
    { p: .36, pos: [.15, 1.58, -1.6], aim: [2.7, 1.15, -3.5] },
    { p: .53, pos: [1.12, 1.52, -3.5], aim: [2.7, 1.1, -3.5] },
    { p: .66, pos: [1.86, 1.23, -3.5], aim: [2.7, .99, -3.5] },
    { p: .79, pos: [1.86, 1.23, -3.5], aim: [2.7, 1.04, -3.5] },
    { p: .88, pos: [2.12, 1.11, -3.5], aim: [2.74, 1.06, -3.5] },
    { p: 1, pos: [2.57, 1.12, -3.5], aim: [2.97, 1.06, -3.5] },
  ];
  const smooth = (x: number) => x * x * (3 - 2 * x);
  function update(value: number) {
    progress = T.MathUtils.clamp(value, 0, 1);
    let i = frames.findIndex((f, n) => n < frames.length - 1 && progress >= f.p && progress <= frames[n + 1].p); if (i < 0) i = frames.length - 2;
    const a = frames[i], b = frames[i + 1]; const t = smooth((progress - a.p) / (b.p - a.p));
    camera.position.fromArray(a.pos).lerp(new T.Vector3().fromArray(b.pos), t); look.fromArray(a.aim).lerp(new T.Vector3().fromArray(b.aim), t);
    // A gentle positional bob during walking only; tied to progress, never idle.
    if (progress > .03 && progress < .5) camera.position.y += Math.sin(progress * 75) * .009 * Math.sin(progress / .5 * Math.PI);
    lid.rotation.x = -1.88 * smooth(T.MathUtils.clamp((progress - .66) / .13, 0, 1));
    displayMaterial.color.setScalar(.03 + .97 * smooth(T.MathUtils.clamp((progress - .7) / .08, 0, 1)));
    chair.position.z = .92 + .15 * Math.sin(T.MathUtils.clamp((progress - .42) / .24, 0, 1) * Math.PI);
    // Final movement follows the screen normal so the transition stays aligned.
    if (progress >= .88) {
      scene.updateMatrixWorld(true);
      const center = display.getWorldPosition(new T.Vector3());
      const normal = new T.Vector3(0, 0, 1).applyQuaternion(display.getWorldQuaternion(new T.Quaternion()));
      const end = center.clone().addScaledVector(normal, .19);
      const start = new T.Vector3(2.12, 1.11, -3.5);
      const finalT = smooth((progress - .88) / .12);
      camera.position.copy(start).lerp(end, finalT); look.lerp(center, finalT);
    }
    camera.lookAt(look); dirty = true;
  }
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight;
    camera.fov = innerWidth < 700 ? 57 : 43;
    camera.updateProjectionMatrix(); update(progress);
  }
  function render(time: number) {
    animationId = requestAnimationFrame(render);
    if (!active || !visible || (!dirty && time - lastFrame < 1000)) return;
    renderer.render(scene, camera); lastFrame = time; dirty = false;
  }
  function isDoor(clientX: number, clientY: number) {
    pointer.set(clientX / innerWidth * 2 - 1, -(clientY / innerHeight) * 2 + 1); raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(leaf).length > 0;
  }
  const onVisibility = () => { visible = !document.hidden; dirty = true; };
  document.addEventListener('visibilitychange', onVisibility); window.addEventListener('resize', resize);
  resize(); update(0); render(0);
  return {
    door, update, isDoor,
    invalidate() { dirty = true; },
    setActive(value: boolean) { active = value; dirty = true; },
    dispose() { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVisibility); scene.traverse(o => { if (o instanceof T.Mesh) o.geometry.dispose(); }); Object.values(materials).forEach(m => m.dispose()); env.dispose(); renderer.dispose(); },
  };
}
