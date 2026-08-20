/**
 * avatar3d.js
 * Three.js Interactive 3D Student Guide & Neural Particle Scene
 * Author: Adithya (AI Student Portfolio)
 */

class StudentAvatarScene {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Mouse tracking for parallax
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    // Group holders
    this.avatarGroup = new THREE.Group();
    this.droneGroup = new THREE.Group();
    this.particlesGroup = new THREE.Group();
    this.scene.add(this.avatarGroup);
    this.scene.add(this.droneGroup);
    this.scene.add(this.particlesGroup);

    // Current Scroll Target Poses
    this.targetTransform = {
      x: 1.8,
      y: 0.2,
      z: 0,
      rotX: 0,
      rotY: -0.35,
      rotZ: 0,
      scale: 1.1
    };

    this.clock = new THREE.Clock();
    this.currentSection = 'hero';

    this.init();
  }

  init() {
    // 1. Setup Camera position
    this.camera.position.set(0, 0, 7.5);

    // 2. Setup Lighting
    this.setupLighting();

    // 3. Build Procedural 3D Student Avatar
    this.buildStudentAvatar();

    // 4. Build Floating Drone Companion
    this.buildDroneCompanion();

    // 5. Build Background Neural Particle Constellation
    this.buildNeuralParticles();

    // 6. Setup Event Listeners
    this.setupEventListeners();

    // 7. Update initial position based on screen width
    this.updateResponsivePosition();

    // 8. Start Animation Loop
    this.animate();
  }

  setupLighting() {
    // Ambient soft fill
    const ambientLight = new THREE.AmbientLight(0x131a2a, 2.5);
    this.scene.add(ambientLight);

    // Cyan Key Light (Front-Right)
    const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
    cyanLight.position.set(4, 3, 5);
    this.scene.add(cyanLight);

    // Purple Rim Light (Back-Left)
    const purpleLight = new THREE.PointLight(0x9d4edd, 3.5, 20);
    purpleLight.position.set(-4, -2, 3);
    this.scene.add(purpleLight);

    // Subtle Top White Light
    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 6, 4);
    this.scene.add(topLight);
  }

  buildStudentAvatar() {
    // Root student container
    this.studentRoot = new THREE.Group();

    // Materials
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25,
    });

    const whiteShellMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.3,
      roughness: 0.2,
    });

    const cyanGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
    });

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x030712,
      metalness: 0.95,
      roughness: 0.1,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.3,
    });

    // 1. Head
    this.headGroup = new THREE.Group();
    
    // Head Sphere / Helmet
    const headGeo = new THREE.SphereGeometry(0.75, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, whiteShellMaterial);
    this.headGroup.add(headMesh);

    // Visor Glass
    const visorGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.45, 32, 1, false, Math.PI * 0.15, Math.PI * 0.7);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    visorMesh.position.set(0, 0.05, 0.2);
    this.headGroup.add(visorMesh);

    // Digital Eyes (Cyan Glowing Capsule/Spheres)
    this.leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.05), cyanGlowMaterial);
    this.leftEye.position.set(-0.25, 0.08, 0.75);
    this.rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.05), cyanGlowMaterial);
    this.rightEye.position.set(0.25, 0.08, 0.75);
    this.headGroup.add(this.leftEye);
    this.headGroup.add(this.rightEye);

    // Student Headset Earcups
    const earcupGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 24);
    const earcupLeft = new THREE.Mesh(earcupGeo, armorMaterial);
    earcupLeft.rotation.z = Math.PI / 2;
    earcupLeft.position.set(-0.75, 0.05, 0);
    
    const earcupRight = earcupLeft.clone();
    earcupRight.position.set(0.75, 0.05, 0);

    const earGlowLeft = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.18, 16), cyanGlowMaterial);
    earGlowLeft.rotation.y = -Math.PI / 2;
    earGlowLeft.position.set(-0.83, 0.05, 0);

    const earGlowRight = earGlowLeft.clone();
    earGlowRight.rotation.y = Math.PI / 2;
    earGlowRight.position.set(0.83, 0.05, 0);

    this.headGroup.add(earcupLeft);
    this.headGroup.add(earcupRight);
    this.headGroup.add(earGlowLeft);
    this.headGroup.add(earGlowRight);

    // 2. Student Graduation Cap (Mortarboard)
    this.capGroup = new THREE.Group();
    
    // Cap Base (skull cap)
    const capBaseGeo = new THREE.CylinderGeometry(0.68, 0.72, 0.2, 32);
    const capBase = new THREE.Mesh(capBaseGeo, armorMaterial);
    capBase.position.y = 0.55;
    this.capGroup.add(capBase);

    // Cap Flat Board
    const capBoardGeo = new THREE.BoxGeometry(1.6, 0.06, 1.6);
    const capBoard = new THREE.Mesh(capBoardGeo, armorMaterial);
    capBoard.position.y = 0.68;
    capBoard.rotation.y = Math.PI / 4;
    this.capGroup.add(capBoard);

    // Cap Button (center)
    const capButton = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16), goldMaterial);
    capButton.position.y = 0.74;
    this.capGroup.add(capButton);

    // Tassel Cord & Hanging Tip
    this.tasselGroup = new THREE.Group();
    const tasselCord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.65, 8), goldMaterial);
    tasselCord.position.set(0.55, 0.45, 0.45);
    tasselCord.rotation.z = -0.45;
    
    const tasselTip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 12), goldMaterial);
    tasselTip.position.set(0.8, 0.15, 0.55);
    tasselTip.rotation.x = Math.PI;

    this.tasselGroup.add(tasselCord);
    this.tasselGroup.add(tasselTip);
    this.capGroup.add(this.tasselGroup);

    this.headGroup.add(this.capGroup);
    this.headGroup.position.y = 0.85;
    this.studentRoot.add(this.headGroup);

    // 3. Torso & Cyber Student Vest
    this.torsoGroup = new THREE.Group();
    
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.4, 1.1, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, whiteShellMaterial);
    torsoMesh.position.y = -0.2;
    this.torsoGroup.add(torsoMesh);

    // Torso Armor Vest
    const vestGeo = new THREE.CylinderGeometry(0.58, 0.44, 0.7, 32);
    const vestMesh = new THREE.Mesh(vestGeo, armorMaterial);
    vestMesh.position.y = -0.05;
    this.torsoGroup.add(vestMesh);

    // Holographic Neural Core in Chest
    const coreGeo = new THREE.SphereGeometry(0.18, 16, 16);
    this.chestCore = new THREE.Mesh(coreGeo, cyanGlowMaterial);
    this.chestCore.position.set(0, 0.05, 0.52);
    this.torsoGroup.add(this.chestCore);

    // Chest Ring Accent
    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 16, 32), armorMaterial);
    coreRing.position.set(0, 0.05, 0.5);
    this.torsoGroup.add(coreRing);

    this.studentRoot.add(this.torsoGroup);

    // 4. Articulated Floating Arms & Hands
    this.leftArmGroup = new THREE.Group();
    this.rightArmGroup = new THREE.Group();

    // Shoulder Pauldrons
    const shoulderGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeo, armorMaterial);
    leftShoulder.position.set(-0.85, 0.25, 0);
    this.leftArmGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, armorMaterial);
    rightShoulder.position.set(0.85, 0.25, 0);
    this.rightArmGroup.add(rightShoulder);

    // Floating Forearms
    const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.6, 16);
    const leftForearm = new THREE.Mesh(armGeo, whiteShellMaterial);
    leftForearm.position.set(-0.95, -0.15, 0.1);
    leftForearm.rotation.z = 0.2;
    this.leftArmGroup.add(leftForearm);

    const rightForearm = new THREE.Mesh(armGeo, whiteShellMaterial);
    rightForearm.position.set(0.95, -0.15, 0.1);
    rightForearm.rotation.z = -0.2;
    this.rightArmGroup.add(rightForearm);

    // Floating Robotic Hands (Pointing / Gesturing)
    const handGeo = new THREE.SphereGeometry(0.14, 16, 16);
    this.leftHand = new THREE.Mesh(handGeo, armorMaterial);
    this.leftHand.position.set(-1.05, -0.5, 0.25);
    this.leftArmGroup.add(this.leftHand);

    this.rightHand = new THREE.Mesh(handGeo, armorMaterial);
    this.rightHand.position.set(1.05, -0.5, 0.25);
    this.rightArmGroup.add(this.rightHand);

    this.studentRoot.add(this.leftArmGroup);
    this.studentRoot.add(this.rightArmGroup);

    // 5. Base Thruster Ring & Floating Aura
    const thrusterGeo = new THREE.TorusGeometry(0.35, 0.05, 16, 32);
    const thrusterMesh = new THREE.Mesh(thrusterGeo, cyanGlowMaterial);
    thrusterMesh.rotation.x = Math.PI / 2;
    thrusterMesh.position.y = -0.85;
    this.studentRoot.add(thrusterMesh);

    // Attach to Avatar group
    this.avatarGroup.add(this.studentRoot);
  }

  buildDroneCompanion() {
    // Mini Satellite Companion Drone "Orb-E"
    const droneCoreGeo = new THREE.SphereGeometry(0.25, 24, 24);
    const droneCoreMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2
    });
    this.droneCore = new THREE.Mesh(droneCoreGeo, droneCoreMat);

    // Drone Eye
    const droneEyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const droneEyeMat = new THREE.MeshBasicMaterial({ color: 0x9d4edd });
    const droneEye = new THREE.Mesh(droneEyeGeo, droneEyeMat);
    droneEye.position.set(0, 0, 0.2);
    this.droneCore.add(droneEye);

    // Spinning Drone Gyro Ring
    const ringGeo = new THREE.TorusGeometry(0.38, 0.02, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    this.droneRing = new THREE.Mesh(ringGeo, ringMat);
    this.droneCore.add(this.droneRing);

    this.droneGroup.add(this.droneCore);
    this.droneGroup.position.set(2.8, 1.2, 0.5);
  }

  buildNeuralParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00f2fe);
    const color2 = new THREE.Color(0x9d4edd);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 15 - 2;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.particlesMesh = new THREE.Points(geometry, material);
    this.particlesGroup.add(this.particlesMesh);
  }

  setupEventListeners() {
    // Mouse Parallax
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.updateResponsivePosition();
    });
  }

  updateResponsivePosition() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.targetTransform.scale = 0.75;
      this.targetTransform.x = 0;
      this.targetTransform.y = 1.6;
    } else {
      this.targetTransform.scale = 1.1;
    }
  }

  /**
   * Called when user scrolls into a specific section
   * @param {string} sectionId
   */
  setSectionPose(sectionId) {
    this.currentSection = sectionId;
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile compact transforms
      switch (sectionId) {
        case 'hero':
          this.targetTransform.x = 0;
          this.targetTransform.y = 1.4;
          this.targetTransform.rotY = 0;
          this.targetTransform.scale = 0.75;
          break;
        case 'about':
          this.targetTransform.x = 0;
          this.targetTransform.y = 1.5;
          this.targetTransform.rotY = -0.3;
          this.targetTransform.scale = 0.7;
          break;
        case 'skills':
          this.targetTransform.x = 0;
          this.targetTransform.y = 1.5;
          this.targetTransform.rotY = 0.3;
          this.targetTransform.scale = 0.7;
          break;
        case 'projects':
          this.targetTransform.x = 0;
          this.targetTransform.y = 1.4;
          this.targetTransform.rotY = -0.2;
          this.targetTransform.scale = 0.75;
          break;
        case 'experience':
          this.targetTransform.x = 0;
          this.targetTransform.y = 1.5;
          this.targetTransform.rotY = 0.25;
          this.targetTransform.scale = 0.7;
          break;
        case 'contact':
          this.targetTransform.x = 0;
          this.targetTransform.y = 1.4;
          this.targetTransform.rotY = 0;
          this.targetTransform.scale = 0.8;
          break;
      }
      return;
    }

    // Desktop transforms
    switch (sectionId) {
      case 'hero':
        this.targetTransform.x = 1.8;
        this.targetTransform.y = 0.1;
        this.targetTransform.z = 0;
        this.targetTransform.rotX = 0;
        this.targetTransform.rotY = -0.35;
        this.targetTransform.rotZ = 0;
        this.targetTransform.scale = 1.15;
        break;

      case 'about':
        this.targetTransform.x = 2.4;
        this.targetTransform.y = -0.1;
        this.targetTransform.z = 0.2;
        this.targetTransform.rotX = 0.05;
        this.targetTransform.rotY = -0.6;
        this.targetTransform.rotZ = 0.02;
        this.targetTransform.scale = 1.05;
        break;

      case 'skills':
        this.targetTransform.x = -2.2;
        this.targetTransform.y = 0.3;
        this.targetTransform.z = 0.1;
        this.targetTransform.rotX = -0.05;
        this.targetTransform.rotY = 0.55;
        this.targetTransform.rotZ = -0.02;
        this.targetTransform.scale = 1.1;
        break;

      case 'projects':
        this.targetTransform.x = 2.5;
        this.targetTransform.y = -0.2;
        this.targetTransform.z = 0.3;
        this.targetTransform.rotX = 0.05;
        this.targetTransform.rotY = -0.5;
        this.targetTransform.rotZ = 0.03;
        this.targetTransform.scale = 1.1;
        break;

      case 'experience':
        this.targetTransform.x = -2.3;
        this.targetTransform.y = 0.1;
        this.targetTransform.z = 0;
        this.targetTransform.rotX = 0;
        this.targetTransform.rotY = 0.6;
        this.targetTransform.rotZ = -0.03;
        this.targetTransform.scale = 1.15;
        break;

      case 'contact':
        this.targetTransform.x = 2.1;
        this.targetTransform.y = 0.1;
        this.targetTransform.z = 0.5;
        this.targetTransform.rotX = 0.08;
        this.targetTransform.rotY = -0.3;
        this.targetTransform.rotZ = 0;
        this.targetTransform.scale = 1.2;
        break;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = this.clock.getElapsedTime();

    // 1. Mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 2. Avatar smooth position & rotation lerping
    this.avatarGroup.position.x += (this.targetTransform.x - this.avatarGroup.position.x) * 0.05;
    this.avatarGroup.position.y += (this.targetTransform.y + Math.sin(time * 2) * 0.08 - this.avatarGroup.position.y) * 0.05;
    this.avatarGroup.position.z += (this.targetTransform.z - this.avatarGroup.position.z) * 0.05;

    this.avatarGroup.rotation.x += (this.targetTransform.rotX - this.mouse.y * 0.15 - this.avatarGroup.rotation.x) * 0.05;
    this.avatarGroup.rotation.y += (this.targetTransform.rotY + this.mouse.x * 0.25 - this.avatarGroup.rotation.y) * 0.05;
    this.avatarGroup.rotation.z += (this.targetTransform.rotZ - this.avatarGroup.rotation.z) * 0.05;

    const currentScale = this.avatarGroup.scale.x;
    const newScale = currentScale + (this.targetTransform.scale - currentScale) * 0.05;
    this.avatarGroup.scale.set(newScale, newScale, newScale);

    // 3. Head subtle look-at mouse & nodding
    if (this.headGroup) {
      this.headGroup.rotation.y = this.mouse.x * 0.35 + Math.sin(time * 1.5) * 0.05;
      this.headGroup.rotation.x = -this.mouse.y * 0.25 + Math.cos(time * 2) * 0.03;
    }

    // 4. Cap Tassel Swaying physics
    if (this.tasselGroup) {
      this.tasselGroup.rotation.z = Math.sin(time * 3) * 0.15 + this.mouse.x * 0.2;
      this.tasselGroup.rotation.x = Math.cos(time * 2.5) * 0.1;
    }

    // 5. Floating Arms Gesturing
    if (this.rightArmGroup && this.leftArmGroup) {
      if (this.currentSection === 'skills' || this.currentSection === 'experience') {
        // Pointing gesture with left hand
        this.leftArmGroup.rotation.z = Math.sin(time * 2) * 0.1 + 0.35;
        this.leftArmGroup.rotation.x = -0.4;
        this.rightArmGroup.rotation.z = Math.cos(time * 2) * 0.05;
      } else if (this.currentSection === 'projects' || this.currentSection === 'about') {
        // Pointing gesture with right hand
        this.rightArmGroup.rotation.z = -Math.sin(time * 2) * 0.1 - 0.35;
        this.rightArmGroup.rotation.x = -0.4;
        this.leftArmGroup.rotation.z = -Math.cos(time * 2) * 0.05;
      } else {
        // Idle friendly wave/hover
        this.rightArmGroup.rotation.z = Math.sin(time * 2.5) * 0.15 - 0.1;
        this.leftArmGroup.rotation.z = -Math.sin(time * 2.5) * 0.15 + 0.1;
        this.rightArmGroup.rotation.x = Math.cos(time * 1.8) * 0.1;
        this.leftArmGroup.rotation.x = Math.cos(time * 1.8) * 0.1;
      }
    }

    // 6. Chest Core pulsating glow
    if (this.chestCore) {
      const pulse = (Math.sin(time * 4) + 1) * 0.5;
      this.chestCore.scale.set(1 + pulse * 0.25, 1 + pulse * 0.25, 1 + pulse * 0.25);
    }

    // 7. Mini Drone Orbit & Spin
    if (this.droneGroup) {
      const droneOrbitRadius = 1.3;
      const droneSpeed = time * 1.6;
      this.droneGroup.position.x = this.avatarGroup.position.x + Math.cos(droneSpeed) * droneOrbitRadius + 0.4;
      this.droneGroup.position.y = this.avatarGroup.position.y + Math.sin(droneSpeed * 1.5) * 0.4 + 0.6;
      this.droneGroup.position.z = this.avatarGroup.position.z + Math.sin(droneSpeed) * droneOrbitRadius;
      
      if (this.droneRing) {
        this.droneRing.rotation.x += 0.03;
        this.droneRing.rotation.y += 0.04;
      }
    }

    // 8. Background Neural Particle drift
    if (this.particlesMesh) {
      this.particlesMesh.rotation.y = time * 0.03 + this.mouse.x * 0.05;
      this.particlesMesh.rotation.x = time * 0.015 - this.mouse.y * 0.05;
    }

    // 9. Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate and expose globally
let globalAvatarScene = null;
window.addEventListener('DOMContentLoaded', () => {
  globalAvatarScene = new StudentAvatarScene();
});
