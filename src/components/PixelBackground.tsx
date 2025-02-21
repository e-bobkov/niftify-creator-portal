
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const PixelBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Создаем пиксели
    const pixels: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const material = new THREE.MeshPhongMaterial({
      color: 0xb4e66e, // Зеленый цвет в соответствии с темой
      transparent: true,
      opacity: 0.6,
    });

    // Добавляем освещение
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Создаем 50 пикселей
    for (let i = 0; i < 50; i++) {
      const pixel = new THREE.Mesh(geometry, material);
      pixel.position.x = Math.random() * 40 - 20;
      pixel.position.y = Math.random() * 40 - 20;
      pixel.position.z = Math.random() * 40 - 20;
      pixels.push(pixel);
      scene.add(pixel);
    }

    camera.position.z = 15;

    // Анимация
    const animate = () => {
      requestAnimationFrame(animate);

      pixels.forEach(pixel => {
        pixel.rotation.x += 0.01;
        pixel.rotation.y += 0.01;
        pixel.position.y += Math.sin(Date.now() * 0.001 + pixel.position.x) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Обработка изменения размера окна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};
