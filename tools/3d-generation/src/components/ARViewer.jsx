import { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { getModelInfo } from '../utils/modelRegistry';
import '../styles/ar-viewer.css';

const ARViewer = ({ categoryId, productName, onClose }) => {
  const modelInfo = getModelInfo(categoryId);
  const viewerRef = useRef(null);
  const [arAvailable, setArAvailable] = useState(null);
  const [arFailed, setArFailed] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return undefined;

    const updateARAvailability = () => setArAvailable(viewer.canActivateAR);
    const handleARStatus = (event) => {
      setArFailed(event.detail.status === 'failed');
      updateARAvailability();
    };
    const handleModelError = () => setModelFailed(true);

    viewer.addEventListener('load', updateARAvailability);
    viewer.addEventListener('ar-status', handleARStatus);
    viewer.addEventListener('error', handleModelError);
    updateARAvailability();

    return () => {
      viewer.removeEventListener('load', updateARAvailability);
      viewer.removeEventListener('ar-status', handleARStatus);
      viewer.removeEventListener('error', handleModelError);
    };
  }, [categoryId]);

  if (!modelInfo) {
    return null;
  }

  return (
    <div className="ar-viewer-backdrop" onClick={onClose}>
      <div className="ar-viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="ar-viewer-header">
          <div>
            <h2>{productName}</h2>
            <p>View in your space using your device camera</p>
          </div>
          <button className="ar-viewer-close" onClick={onClose} aria-label="Close 3D viewer">
            ×
          </button>
        </div>
        <model-viewer
          ref={viewerRef}
          src={modelInfo.src}
          poster={modelInfo.image}
          alt={`3D preview for ${productName}`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          shadow-intensity="1"
          exposure="1"
          loading="eager"
          style={{ width: '100%', height: '100%' }}
        >
          <button
            slot="ar-button"
            className="ar-viewer-ar-button"
          >
            Open camera and place in your space
          </button>
        </model-viewer>
        {modelFailed && (
          <p className="ar-viewer-message ar-viewer-error" role="alert">
            The 3D preview could not be loaded. Please try again later.
          </p>
        )}
        {!modelFailed && arFailed && (
          <p className="ar-viewer-message ar-viewer-error" role="status">
            AR could not start. Check camera permission and try a supported AR browser.
          </p>
        )}
        {!modelFailed && !arFailed && arAvailable === false && (
          <p className="ar-viewer-message" role="status">
            Camera-based AR is not supported on this device or browser. You can still rotate the 3D preview.
          </p>
        )}
        {!modelFailed && !arFailed && arAvailable === true && (
          <p className="ar-viewer-message" role="status">
            Tap “Open camera and place in your space” to start AR.
          </p>
        )}
      </div>
    </div>
  );
};

export default ARViewer;
