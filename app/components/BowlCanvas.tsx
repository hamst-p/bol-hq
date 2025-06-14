'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Object3D, Group } from 'three';

export default function BowlCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setClearColor(0x000000, 0); 
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 10);
    scene.add(directionalLight);

    const loader = new OBJLoader();
    loader.load(
      '/models/model.obj',
      (object: Group) => {
        object.traverse((child: Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: '#53bba5',
              shininess: 10,
              specular: 0xaaaaaa
            });
          }
        });
        object.scale.set(2.4, 2.4, 2.4);
        object.position.set(0, 0, 0);
        scene.add(object);
      },
      (xhr: ProgressEvent) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error: ErrorEvent) => {
        console.error('An error happened:', error);
      }
    );

    camera.position.set(300, 180, 200);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 1000,
      }}
    />
  );
} 