import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMachineData } from '../hooks/useMachineData';

const FactoryViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const machines = useMachineData();
  const cubeMap = useRef<Record<string, THREE.Mesh>>({});
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    if (!rendererRef.current) {
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    }

    if (!cameraRef.current) {
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;
    }

    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      // Helpers (optional)
      scene.add(new THREE.GridHelper(20, 20));
      scene.add(new THREE.AxesHelper(5));

      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(10, 10, 10);
      scene.add(ambient);
      scene.add(light);

      sceneRef.current = scene;
    }

    const renderer = rendererRef.current!;
    const scene = sceneRef.current!;
    const camera = cameraRef.current!;
    const clock = new THREE.Clock();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
    
      const delta = clock.getDelta();
    
      Object.values(cubeMap.current).forEach((cube) => {
        cube.rotation.y += delta;
      });
    
      renderer.render(scene, camera);
    };
    

    animate();

    const handleResize = () => {
      if (!mount || !rendererRef.current || !cameraRef.current) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      rendererRef.current.setSize(newWidth, newHeight);
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  // ✅ Add cubes *after* scene is initialized and machines are available
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || machines.length === 0) return;

    // Clear previous cubes (if any)
    Object.values(cubeMap.current).forEach((cube) => {
      scene.remove(cube);
    });
    cubeMap.current = {};

    machines.forEach((machine, i) => {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = i * 3 - (machines.length - 1); // center around 0
      scene.add(cube);
      cubeMap.current[machine.id] = cube;
    });
  }, [machines]);

  // ✅ Update colors based on status
  useEffect(() => {
    machines.forEach((machine) => {
      const cube = cubeMap.current[machine.id];
      if (cube) {
        const color = machine.status === 'FAULT' ? 0xff0000 : 0x00ff00;
        (cube.material as THREE.MeshStandardMaterial).color.setHex(color);
      }
    });
  }, [machines]);

  return (
    <div
      ref={mountRef}
      className="w-full h-96 sm:h-[500px] md:h-[600px] bg-white overflow-hidden"
    />
  );
};

export default FactoryViewer;
