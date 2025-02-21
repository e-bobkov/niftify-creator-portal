
import { useState, useEffect, useRef, memo } from 'react';
import { Link } from "react-router-dom";
import { Image, Palette, Star } from "lucide-react";
import * as THREE from 'three';

export const Logo = memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isHovered) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 60 / 40, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(60, 40);
    
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xb4e66e,
      transparent: true,
      opacity: 0.8,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 2;

    const animate = () => {
      if (!isHovered) return;
      
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isHovered]);

  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <Palette 
          size={24} 
          className="text-primary transform -rotate-12 absolute" 
        />
        <Image 
          size={24} 
          className="text-primary transform rotate-12 ml-3" 
        />
        <Star 
          size={16} 
          className="text-primary animate-pulse absolute mt-[-12px] ml-[8px]" 
        />
      </div>
      <div ref={containerRef} className="w-[60px] h-[40px] absolute opacity-60" />
      <span className="text-2xl font-bold relative ml-12">
        <span className="text-primary">ft</span>
        <span className="text-foreground">soa</span>
        <span className="text-primary">.art</span>
      </span>
    </Link>
  );
});

Logo.displayName = 'Logo';
