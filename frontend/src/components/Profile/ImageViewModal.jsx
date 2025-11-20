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
      className="fixed inset-0 bg-black/95 flex flex-col z-[100]"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div>
          <h3 className="text-white text-lg font-medium">{imageName}</h3>
        </div>
        <div className="flex items-center gap-2">
          {canDelete && onDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 text-white/80 hover:text-red-500 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="flex-1 flex items-center justify-center relative overflow-hidden"
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
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
          draggable={false}
        />
      </div>

      {/* Controls Footer */}
      <div className="p-4 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-4">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="p-3 text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOut className="w-6 h-6" />
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors font-medium"
        >
          Reset
        </button>
        <button
          onClick={handleZoomIn}
          disabled={scale >= 4}
          className="p-3 text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomIn className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageViewModal;
