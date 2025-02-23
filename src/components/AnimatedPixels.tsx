
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
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); // Уменьшили размер пикселей
    const material = new THREE.MeshPhongMaterial({
      color: 0x9932cc,
      transparent: true,
      opacity: 0.6,
    });

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Создаем больше пикселей и располагаем их по краям
    for (let i = 0; i < 100; i++) {
      const pixel = new THREE.Mesh(geometry, material);
      
      // Генерируем позицию на краях карточки
      const edge = Math.floor(Math.random() * 4); // 0: верх, 1: право, 2: низ, 3: лево
      const position = {
        x: 0,
        y: 0,
        z: Math.random() * -2
      };

      switch (edge) {
        case 0: // верх
          position.x = (Math.random() - 0.5) * 4;
          position.y = 2;
          break;
        case 1: // право
          position.x = 2;
          position.y = (Math.random() - 0.5) * 4;
          break;
        case 2: // низ
          position.x = (Math.random() - 0.5) * 4;
          position.y = -2;
          break;
        case 3: // лево
          position.x = -2;
          position.y = (Math.random() - 0.5) * 4;
          break;
      }

      pixel.position.set(position.x, position.y, position.z);
      
      // Скорость движения наружу от края
      const direction = new THREE.Vector3(position.x, position.y, 0).normalize();
      (pixel as any).velocity = {
        x: direction.x * 0.03,
        y: direction.y * 0.03,
        z: Math.random() * 0.02,
      };
      
      pixels.push(pixel);
      scene.add(pixel);
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      pixels.forEach(pixel => {
        pixel.position.x += (pixel as any).velocity.x;
        pixel.position.y += (pixel as any).velocity.y;
        pixel.position.z += (pixel as any).velocity.z;

        pixel.rotation.x += 0.02;
        pixel.rotation.y += 0.02;

        // Сбрасываем позицию, когда пиксель улетает слишком далеко
        if (Math.abs(pixel.position.x) > 5 || 
            Math.abs(pixel.position.y) > 5 || 
            pixel.position.z > 5) {
          // Возвращаем на случайный край
          const edge = Math.floor(Math.random() * 4);
          switch (edge) {
            case 0:
              pixel.position.set((Math.random() - 0.5) * 4, 2, Math.random() * -2);
              break;
            case 1:
              pixel.position.set(2, (Math.random() - 0.5) * 4, Math.random() * -2);
              break;
            case 2:
              pixel.position.set((Math.random() - 0.5) * 4, -2, Math.random() * -2);
              break;
            case 3:
              pixel.position.set(-2, (Math.random() - 0.5) * 4, Math.random() * -2);
              break;
          }
          
          const direction = new THREE.Vector3(pixel.position.x, pixel.position.y, 0).normalize();
          (pixel as any).velocity = {
            x: direction.x * 0.03,
            y: direction.y * 0.03,
            z: Math.random() * 0.02,
          };
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
