import React, { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, Download, Trash2 } from 'lucide-react';

const ImageViewModal = ({ 
  isOpen, 
  onClose, 
  imageUrl,
  imageName = "Image",
  onDelete,
  canDelete = false,
  isDeleting = false
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageName}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (scale > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && scale > 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10 backdrop-blur-sm"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="relative max-w-4xl w-full animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
          <div
            className="relative"
            style={{ 
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={imageName}
              className="w-full h-auto max-h-[85vh] object-contain select-none"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }}
              draggable={false}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white text-xl md:text-2xl font-bold text-center mb-4">
              {imageName}
            </h3>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors font-medium backdrop-blur-sm"
              >
                Reset
              </button>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 4}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-sm"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              {canDelete && onDelete && (
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors disabled:opacity-50 backdrop-blur-sm"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewModal;
