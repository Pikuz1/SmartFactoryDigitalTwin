import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMachineData } from '../hooks/useMachineData';

const FactoryViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { status } = useMachineData();
  const cubeRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Set up sizes
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f4f6); // light gray

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Add cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.01;
      cube.rotation.x += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update color based on status
  useEffect(() => {
    if (cubeRef.current) {
      const color = status === 'FAULT' ? 0xff0000 : 0x00ff00;
      (cubeRef.current.material as THREE.MeshStandardMaterial).color.setHex(color);
    }
  }, [status]);

  return <div ref={mountRef} className="w-full h-96 bg-white rounded-md shadow-inner" />;
};

export default FactoryViewer;
