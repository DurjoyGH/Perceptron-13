import React, { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Upload, Loader } from 'lucide-react';

const ProfilePictureModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  onUpload, 
  isUploading = false,
  title = "Profile Picture"
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
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

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-white/80 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-white/10 rounded-full disabled:opacity-50"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Image Container */}
        <div 
          className="relative bg-black rounded-lg overflow-hidden"
          style={{ 
            height: '50vh',
            minHeight: '300px',
            maxHeight: '600px',
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
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain select-none"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }}
              draggable={false}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Zoom and Rotate Controls */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1.5 sm:p-2">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5 || isUploading}
              className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-white text-xs sm:text-sm font-medium min-w-[50px] sm:min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3 || isUploading}
              className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="w-px h-5 sm:h-6 bg-white/20 mx-0.5 sm:mx-1" />
            <button
              onClick={handleRotate}
              disabled={isUploading}
              className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded transition-colors disabled:opacity-50"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={isUploading}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors backdrop-blur-sm disabled:opacity-50 text-sm sm:text-base"
            >
              Reset
            </button>
            {onUpload && (
              <button
                onClick={() => onUpload({ scale, rotation, position })}
                disabled={isUploading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="hidden min-[400px]:inline">Uploading...</span>
                    <span className="min-[400px]:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-2 sm:mt-3 text-center">
          <p className="text-white/70 text-xs sm:text-sm">
            {scale > 1 ? 'Drag to reposition • ' : ''}Use controls to adjust your image
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
