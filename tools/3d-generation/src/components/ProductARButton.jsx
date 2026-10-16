import { useState } from 'react';
import { getModelViewer, hasModel } from '../utils/modelRegistry';

const ProductARButton = ({ categoryId, productName, isModelReady }) => {
  const [message, setMessage] = useState('');

  const launchAR = () => {
    setMessage('');
    const viewer = getModelViewer(categoryId);

    if (!viewer?.loaded || !isModelReady) {
      setMessage(viewer ? 'The 3D preview could not be loaded. Please try again later.' : 'The 3D preview is still loading. Please try again in a moment.');
      return;
    }

    if (!viewer.canActivateAR) {
      setMessage('Camera AR requires an AR-capable mobile device and browser.');
      return;
    }

    viewer.classList.add('ar-model-active');

    try {
      viewer.activateAR().catch((error) => {
        viewer.classList.remove('ar-model-active');
        console.error('Unable to start camera AR:', error);
        setMessage('Could not start camera AR. Check camera permission and try again.');
      });
    } catch (error) {
      viewer.classList.remove('ar-model-active');
      console.error('Unable to start camera AR:', error);
      setMessage('Could not start camera AR. Check camera permission and try again.');
    }
  };

  if (!hasModel(categoryId)) {
    return null;
  }

  return (
    <div className="product-ar-action">
      <button
        className="product-ar-button"
        onClick={launchAR}
        disabled={!isModelReady}
        aria-label={`View ${productName} using your camera`}
      >
        {isModelReady ? 'View with camera' : 'Preparing camera…'}
      </button>
      {message && <p className="product-ar-message" role="status">{message}</p>}
    </div>
  );
};

export default ProductARButton;
