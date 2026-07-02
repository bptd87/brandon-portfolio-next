"use client";

import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AboutModelViewerProps = {
  src: string;
  downloadName: string;
};

type LoadedModel = import("three").Object3D;

export default function AboutModelViewer({
  src,
  downloadName,
}: AboutModelViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<LoadedModel | null>(null);
  const pointerDownRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const targetRotationRef = useRef(3.5);
  const [isDesktop, setIsDesktop] = useState(false);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setIsDesktop(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    async function setupScene() {
      const THREE = await import("three");
      const { GLTFLoader } =
        await import("three/examples/jsm/loaders/GLTFLoader.js");

      if (disposed || !mountRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0.08, 4.65);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = "h-full w-full touch-none";
      renderer.domElement.style.touchAction = "none";
      renderer.domElement.style.userSelect = "none";
      renderer.domElement.setAttribute(
        "aria-label",
        "Interactive 3D model of Brandon PT Davis"
      );
      renderer.domElement.setAttribute("role", "img");

      mountRef.current.appendChild(renderer.domElement);

      const ambient = new THREE.HemisphereLight(0xffffff, 0xcfc8be, 2.2);
      scene.add(ambient);

      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(2.5, 3.5, 4.5);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xffffff, 0.9);
      fill.position.set(-3, 1.4, 2);
      scene.add(fill);

      const resize = () => {
        const width = mountRef.current?.clientWidth || 180;
        const height = mountRef.current?.clientHeight || 240;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mountRef.current);
      resize();

      const loader = new GLTFLoader();
      loader.load(
        src,
        gltf => {
          if (disposed) return;

          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const largestAxis = Math.max(size.x, size.y, size.z) || 1;
          const scale = 1.92 / largestAxis;

          model.scale.setScalar(scale);
          model.position.set(
            -center.x * scale,
            -center.y * scale + 0.03,
            -center.z * scale
          );
          model.rotation.y = targetRotationRef.current;

          scene.add(model);
          modelRef.current = model;
          setStatus("ready");
        },
        undefined,
        () => {
          if (!disposed) setStatus("error");
        }
      );

      const beginDrag = (clientX: number) => {
        pointerDownRef.current = true;
        lastPointerXRef.current = clientX;
      };

      const drag = (clientX: number) => {
        if (!pointerDownRef.current) return;
        const delta = clientX - lastPointerXRef.current;
        lastPointerXRef.current = clientX;
        targetRotationRef.current += delta * 0.012;
      };

      const endDrag = () => {
        pointerDownRef.current = false;
      };

      const onPointerDown = (event: PointerEvent) => {
        event.preventDefault();
        beginDrag(event.clientX);
        try {
          renderer.domElement.setPointerCapture(event.pointerId);
        } catch {
          // Some browsers do not allow capture for synthetic pointer events.
        }
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!pointerDownRef.current) return;
        event.preventDefault();
        drag(event.clientX);
      };

      const onPointerUp = (event: PointerEvent) => {
        event.preventDefault();
        endDrag();
        if (renderer.domElement.hasPointerCapture(event.pointerId)) {
          renderer.domElement.releasePointerCapture(event.pointerId);
        }
      };

      const onMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        beginDrag(event.clientX);
      };

      const onMouseMove = (event: MouseEvent) => {
        if (!pointerDownRef.current) return;
        event.preventDefault();
        drag(event.clientX);
      };

      const onMouseUp = () => {
        endDrag();
      };

      const onTouchStart = (event: TouchEvent) => {
        event.preventDefault();
        const touch = event.touches[0];
        if (touch) beginDrag(touch.clientX);
      };

      const onTouchMove = (event: TouchEvent) => {
        if (!pointerDownRef.current) return;
        event.preventDefault();
        const touch = event.touches[0];
        if (touch) drag(touch.clientX);
      };

      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("pointercancel", onPointerUp);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      renderer.domElement.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      renderer.domElement.addEventListener("touchstart", onTouchStart, {
        passive: false,
      });
      renderer.domElement.addEventListener("touchmove", onTouchMove, {
        passive: false,
      });
      renderer.domElement.addEventListener("touchend", onMouseUp);
      renderer.domElement.addEventListener("touchcancel", onMouseUp);

      const animate = () => {
        if (disposed) return;

        const model = modelRef.current;
        if (model) {
          if (!pointerDownRef.current && !prefersReducedMotion) {
            targetRotationRef.current += 0.0022;
          }
          model.rotation.y +=
            (targetRotationRef.current - model.rotation.y) * 0.08;
        }

        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(animate);
      };

      animate();

      return () => {
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("pointerup", onPointerUp);
        renderer.domElement.removeEventListener("pointercancel", onPointerUp);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        renderer.domElement.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        renderer.domElement.removeEventListener("touchstart", onTouchStart);
        renderer.domElement.removeEventListener("touchmove", onTouchMove);
        renderer.domElement.removeEventListener("touchend", onMouseUp);
        renderer.domElement.removeEventListener("touchcancel", onMouseUp);
        renderer.dispose();
        scene.traverse(object => {
          const mesh = object as import("three").Mesh;
          mesh.geometry?.dispose();
          const material = mesh.material;
          if (Array.isArray(material)) {
            material.forEach(item => item.dispose());
          } else {
            material?.dispose();
          }
        });
      };
    }

    let cleanupScene: undefined | (() => void);
    setupScene().then(cleanup => {
      cleanupScene = cleanup;
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      cleanupScene?.();
      if (mount.firstChild) {
        mount.replaceChildren();
      }
      modelRef.current = null;
    };
  }, [isDesktop, src]);

  if (!isDesktop) return null;

  return (
    <figure className="space-y-3 pt-8" aria-label="3D model">
      <div
        ref={mountRef}
        className="relative aspect-[2/3] w-full cursor-grab overflow-hidden bg-[#f1f0ec] active:cursor-grabbing"
      >
        {status !== "ready" ? (
          <div className="absolute inset-0 grid place-items-center px-3 text-center font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-black/36">
            {status === "error" ? "Model unavailable" : "Loading model"}
          </div>
        ) : null}
      </div>

      <figcaption className="flex items-center justify-center gap-2 font-sans text-[0.72rem] font-semibold leading-5 tracking-[0.02em] text-black/32">
        <a
          href={src}
          download={downloadName}
          className="inline-flex items-center gap-1.5 underline-offset-4 transition-colors hover:text-black/58 hover:underline"
        >
          <Download className="h-3 w-3" aria-hidden="true" />
          GLB
        </a>
      </figcaption>
    </figure>
  );
}
