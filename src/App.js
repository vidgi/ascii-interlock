import "./App.css";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Loader, OrbitControls, useCursor } from "@react-three/drei";
import { AsciiEffect } from "three-stdlib";

function App() {
  return (
    <div className="App">
      <Canvas camera={{ fov: 75, position: [0, -30, 10] }} style={{ height: "100vh", width: "100vw" }}>
        <color attach="background" args={["black"]} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <Torusknot position={[0, 0, 10]} rotation={[0 * (Math.PI / 180), 0 * (Math.PI / 180), 0]} />
        <Torusknot position={[0, 10, 15]} rotation={[0 * (Math.PI / 180), 90 * (Math.PI / 180), 0]} />
        <Torusknot position={[0, 20, 25]} rotation={[0 * (Math.PI / 180), 180 * (Math.PI / 180), 0]} />

        <OrbitControls />
        <ambientLight />

        <AsciiRenderer invert />
      </Canvas>
      <Loader />
    </div>
  );
}

export default App;

function Torusknot(props) {
  const ref = useRef();
  const [clicked, click] = useState(false);
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta / 5));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1.25}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      transform
      position={props.position}
      rotation={props.rotation}
    >
      <torusKnotGeometry args={[10, 1.5, 100, 16, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function AsciiRenderer({ renderIndex = 1, characters = " .:-⋆☆✣✤✥✺+*=%@#", ...options }) {
  // Reactive state
  const { size, gl, scene, camera } = useThree();

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, options);
    effect.domElement.style.position = "absolute";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.color = "white";
    effect.domElement.style.backgroundColor = "black";
    effect.domElement.style.pointerEvents = "none";
    return effect;
  }, [gl, characters, options]);

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.parentNode.appendChild(effect.domElement);
    return () => gl.domElement.parentNode.removeChild(effect.domElement);
  }, [gl, effect]);

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera);
  }, renderIndex);

  // This component returns nothing, it has no view, it is a purely logical
}
