
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

    // Создаем больше пикселей для эффекта полета
    const pixels: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const material = new THREE.MeshPhongMaterial({
      color: 0xb4e66e,
      transparent: true,
      opacity: 0.6,
    });

    // Добавляем освещение
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Создаем 200 пикселей в форме туннеля
    const tunnelRadius = 10;
    const tunnelLength = 100;
    for (let i = 0; i < 200; i++) {
      const pixel = new THREE.Mesh(geometry, material);
      
      // Располагаем пиксели по спирали для создания эффекта туннеля
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * tunnelRadius;
      pixel.position.x = Math.cos(angle) * radius;
      pixel.position.y = Math.sin(angle) * radius;
      pixel.position.z = Math.random() * tunnelLength - tunnelLength/2;
      
      // Случайное начальное вращение
      pixel.rotation.x = Math.random() * Math.PI;
      pixel.rotation.y = Math.random() * Math.PI;
      pixel.rotation.z = Math.random() * Math.PI;
      
      pixels.push(pixel);
      scene.add(pixel);
    }

    camera.position.z = 15;

    // Анимация
    const animate = () => {
      requestAnimationFrame(animate);

      // Движение и вращение пикселей
      pixels.forEach(pixel => {
        // Движение вперед (эффект полета)
        pixel.position.z += 0.1;
        
        // Если пиксель улетел слишком далеко, возвращаем его в начало туннеля
        if (pixel.position.z > tunnelLength/2) {
          pixel.position.z = -tunnelLength/2;
          // Новая случайная позиция в пределах радиуса туннеля
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * tunnelRadius;
          pixel.position.x = Math.cos(angle) * radius;
          pixel.position.y = Math.sin(angle) * radius;
        }

        // Плавное вращение
        pixel.rotation.x += 0.01;
        pixel.rotation.y += 0.01;
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
