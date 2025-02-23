
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AnimatedPixels = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const pixelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pixelsRef.current || !containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.offsetWidth / containerRef.current.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    pixelsRef.current.appendChild(renderer.domElement);

    const pixels: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x9932cc, // Фиолетовый цвет
      transparent: true,
      opacity: 0.8,
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
      
      // Начальная позиция - в центре
      pixel.position.x = (Math.random() - 0.5) * 2;
      pixel.position.y = (Math.random() - 0.5) * 2;
      pixel.position.z = Math.random() * -5;
      
      // Скорость движения
      (pixel as any).velocity = {
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.1,
        z: Math.random() * 0.1,
      };
      
      pixels.push(pixel);
      scene.add(pixel);
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      pixels.forEach(pixel => {
        // Движение пикселей
        pixel.position.x += (pixel as any).velocity.x;
        pixel.position.y += (pixel as any).velocity.y;
        pixel.position.z += (pixel as any).velocity.z;

        // Вращение пикселей
        pixel.rotation.x += 0.01;
        pixel.rotation.y += 0.01;

        // Сброс позиции, если пиксель улетел слишком далеко
        if (pixel.position.z > 10) {
          pixel.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            -5
          );
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (pixelsRef.current) {
        pixelsRef.current.removeChild(renderer.domElement);
      }
    };
  }, [containerRef]);

  return (
    <div
      ref={pixelsRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};
