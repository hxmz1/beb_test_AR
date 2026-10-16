import { useEffect, useRef } from 'react';
import '@google/model-viewer';
import { getModelInfo, registerModelViewer } from '../utils/modelRegistry';
import '../styles/ar-viewer.css';

function PreloadedModel({ categoryId, onReady }) {
  const modelInfo = getModelInfo(categoryId);
  const viewerRef = useRef(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return undefined;

    const handleLoad = () => onReady(categoryId);
    let enteredAR = false;
    const handleARStatus = (event) => {
      if (['session-started', 'object-placed', 'presenting'].includes(event.detail.status)) {
        enteredAR = true;
      }

      if (event.detail.status === 'failed' || (event.detail.status === 'not-presenting' && enteredAR)) {
        viewer.classList.remove('ar-model-active');
        enteredAR = false;
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        viewer.classList.remove('ar-model-active');
      }
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleLoad);
    viewer.addEventListener('ar-status', handleARStatus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    registerModelViewer(categoryId, viewer);

    if (viewer.loaded) handleLoad();

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleLoad);
      viewer.removeEventListener('ar-status', handleARStatus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      registerModelViewer(categoryId, null);
    };
  }, [categoryId, onReady]);

  if (!modelInfo) return null;

  return (
    <model-viewer
      ref={viewerRef}
      className="ar-model-preloader"
      src={modelInfo.src}
      poster={modelInfo.image}
      alt=""
      ar
      ar-modes="webxr scene-viewer quick-look"
      ar-scale="auto"
      camera-controls
      loading="eager"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function ARModelPreloader({ categories, onModelReady }) {
  return (
    <>
      {categories.map(({ id }) => (
        <PreloadedModel key={id} categoryId={id} onReady={onModelReady} />
      ))}
    </>
  );
}

export default ARModelPreloader;
