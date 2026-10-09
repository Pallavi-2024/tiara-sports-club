import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  onSelectSport?: (sportId: string) => void;
  activeSportId?: string;
}

export const ThreeSportsArena: React.FC<Props> = ({ onSelectSport, activeSportId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b11, 0.045);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 11, 18);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Main Group
    const arenaGroup = new THREE.Group();
    scene.add(arenaGroup);

    // 1. Stadium Base Ground
    const groundGeo = new THREE.CylinderGeometry(11, 11.5, 0.6, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.3;
    arenaGroup.add(groundMesh);

    // 2. Athletic Turf Field
    const pitchGeo = new THREE.CylinderGeometry(8.5, 8.5, 0.1, 48);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Deep emerald turf
      roughness: 0.6,
      metalness: 0.1
    });
    const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
    pitchMesh.position.y = 0.05;
    arenaGroup.add(pitchMesh);

    // 3. Field Boundary Rings
    const ringGeo = new THREE.RingGeometry(8.2, 8.35, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc5a059, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.11;
    arenaGroup.add(ringMesh);

    // Center Tennis & Pickleball Court Rectangle
    const courtGeo = new THREE.PlaneGeometry(3.6, 6.2);
    const courtMat = new THREE.MeshBasicMaterial({
      color: 0x064e3b,
      side: THREE.DoubleSide
    });
    const courtMesh = new THREE.Mesh(courtGeo, courtMat);
    courtMesh.rotation.x = -Math.PI / 2;
    courtMesh.position.y = 0.12;
    arenaGroup.add(courtMesh);

    // Court White Lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    const linePoints = [
      new THREE.Vector3(-1.7, 0.13, -3),
      new THREE.Vector3(1.7, 0.13, -3),
      new THREE.Vector3(1.7, 0.13, 3),
      new THREE.Vector3(-1.7, 0.13, 3),
      new THREE.Vector3(-1.7, 0.13, -3),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMesh = new THREE.Line(lineGeo, lineMat);
    arenaGroup.add(lineMesh);

    // Center Service Line
    const centerLinePoints = [
      new THREE.Vector3(0, 0.13, -3),
      new THREE.Vector3(0, 0.13, 3)
    ];
    const centerLineGeo = new THREE.BufferGeometry().setFromPoints(centerLinePoints);
    const centerLineMesh = new THREE.Line(centerLineGeo, lineMat);
    arenaGroup.add(centerLineMesh);

    // 4. Stadium Architectural Canopy Rings (Crown / Tiara shape)
    const crownCurve = new THREE.EllipseCurve(0, 0, 9.8, 9.8, 0, 2 * Math.PI, false, 0);
    const crownPoints = crownCurve.getPoints(80);
    const crownGeo = new THREE.BufferGeometry().setFromPoints(
      crownPoints.map(p => new THREE.Vector3(p.x, 1.8 + Math.sin(p.x * 0.8) * 0.4, p.y))
    );
    const crownMat = new THREE.LineBasicMaterial({ color: 0xc5a059, transparent: true, opacity: 0.85 }); // Championship Gold
    const crownRibbon = new THREE.Line(crownGeo, crownMat);
    arenaGroup.add(crownRibbon);

    // 5. Floodlight Pylons (4 modern athletic towers)
    const towerAngle = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    towerAngle.forEach((ang) => {
      const radius = 10.2;
      const x = Math.cos(ang) * radius;
      const z = Math.sin(ang) * radius;

      // Pylon Stem
      const pylonGeo = new THREE.CylinderGeometry(0.08, 0.15, 4.5, 8);
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.set(x, 2.25, z);
      arenaGroup.add(pylon);

      // Light Bank Head
      const headGeo = new THREE.BoxGeometry(0.8, 0.3, 0.3);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(x, 4.5, z);
      head.lookAt(0, 0, 0);
      arenaGroup.add(head);

      // Spot Light
      const spot = new THREE.SpotLight(0xffffff, 2.5);
      spot.position.set(x, 4.5, z);
      spot.target.position.set(0, 0, 0);
      spot.angle = Math.PI / 5;
      spot.penumbra = 0.4;
      scene.add(spot);
      scene.add(spot.target);
    });

    // 6. Interactive Sport Landmark Nodes
    const sportNodes: { id: string; name: string; position: THREE.Vector3; color: number }[] = [
      { id: 'tennis', name: 'Tennis', position: new THREE.Vector3(4.2, 0.8, -2.5), color: 0x15803d },
      { id: 'badminton', name: 'Badminton', position: new THREE.Vector3(-4.2, 0.8, -2.5), color: 0x0284c7 },
      { id: 'pickleball', name: 'Pickleball', position: new THREE.Vector3(-3.8, 0.8, 3.2), color: 0xd97706 },
      { id: 'gym', name: 'GYM', position: new THREE.Vector3(3.8, 0.8, 3.2), color: 0x475569 }
    ];

    const nodeMeshes: { mesh: THREE.Mesh; data: typeof sportNodes[0] }[] = [];

    sportNodes.forEach(node => {
      const pinGeo = new THREE.SphereGeometry(0.35, 24, 24);
      const pinMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.6
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(node.position);
      pinMesh.userData = { id: node.id, name: node.name };

      // Gentle vertical pedestal
      const pedGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
      const pedMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
      const pedMesh = new THREE.Mesh(pedGeo, pedMat);
      pedMesh.position.set(node.position.x, 0.4, node.position.z);

      arenaGroup.add(pedMesh);
      arenaGroup.add(pinMesh);
      nodeMeshes.push({ mesh: pinMesh, data: node });
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xfbbf24, 1.2);
    goldKeyLight.position.set(12, 18, 10);
    scene.add(goldKeyLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, 0.8);
    rimLight.position.set(-12, 10, -10);
    scene.add(rimLight);

    // Mouse / Parallax controls
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.4;
      targetRotationX = -y * 0.2;

      // Raycaster for nodes
      const raycaster = new THREE.Raycaster();
      const mouseVec = new THREE.Vector2(x, y);
      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        setHoveredNode(hit.userData.name);
        container.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        container.style.cursor = 'default';
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      const mouseVec = new THREE.Vector2(x, y);
      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (onSelectSport) {
          onSelectSport(hit.userData.id);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onClick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Subtle base idle spin
        arenaGroup.rotation.y += 0.002;
        // Parallax blend
        arenaGroup.rotation.y += (targetRotationY - arenaGroup.rotation.y * 0.1) * 0.03;
        arenaGroup.rotation.x += (targetRotationX - arenaGroup.rotation.x) * 0.03;

        // Bobbing node pins
        nodeMeshes.forEach((nm, idx) => {
          const isSelected = activeSportId === nm.data.id;
          const floatOffset = Math.sin(elapsed * 2 + idx * 1.5) * 0.08;
          nm.mesh.position.y = nm.data.position.y + floatOffset + (isSelected ? 0.3 : 0);
          const mat = nm.mesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = isSelected ? 0.9 : 0.35 + Math.sin(elapsed * 3 + idx) * 0.15;
        });

        // Subtle ribbon pulse
        crownRibbon.rotation.y = -elapsed * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      groundGeo.dispose();
      pitchGeo.dispose();
      crownGeo.dispose();
    };
  }, [onSelectSport, activeSportId]);

  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[560px] overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Floating HUD status */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#080B11]/90 border border-[#1C2638] text-[11px] tracking-wider text-slate-300 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>VADODARA CAMPUS BLUEPRINT · 3D INTERACTIVE ARENA</span>
        </div>
      </div>

      {hoveredNode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-all">
          <div className="px-4 py-2 rounded-sm bg-[#080B11]/95 border border-emerald-400/60 text-xs font-semibold tracking-wide text-emerald-400 shadow-xl backdrop-blur-md flex items-center gap-2">
            <span>EXPLORE</span>
            <span className="text-white font-bold">{hoveredNode.toUpperCase()}</span>
            <span className="text-slate-400">· Click node to view details</span>
          </div>
        </div>
      )}

      {/* Control prompt */}
      <div className="absolute bottom-3 right-4 z-10 pointer-events-none hidden sm:block">
        <span className="text-[10px] tracking-widest uppercase text-slate-500 font-mono">
          Hover & Rotate · Real-Time Three.js Engine
        </span>
      </div>
    </div>
  );
};
