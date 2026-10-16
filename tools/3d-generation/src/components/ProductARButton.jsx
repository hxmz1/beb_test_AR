import { useState } from 'react';
import { hasModel } from '../utils/modelRegistry';
import ARViewer from './ARViewer';

const ProductARButton = ({ categoryId, productName }) => {
  const [viewerOpen, setViewerOpen] = useState(false);

  const toggleViewer = () => {
    setViewerOpen(!viewerOpen);
  };

  if (!hasModel(categoryId)) {
    return null;
  }

  return (
    <>
      <button
        className="product-ar-button"
        onClick={toggleViewer}
        aria-label={`View ${productName} using your camera`}
      >
        View with camera
      </button>
      {viewerOpen && (
        <ARViewer
          categoryId={categoryId}
          productName={productName}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
};

export default ProductARButton;
