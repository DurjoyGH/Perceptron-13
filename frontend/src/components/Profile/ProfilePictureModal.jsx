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
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        disabled={isUploading}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10 backdrop-blur-sm disabled:opacity-50"
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
              alt="Preview"
              className="w-full h-auto max-h-[85vh] object-contain select-none"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }}
              draggable={false}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white text-xl md:text-2xl font-bold text-center mb-4">
              {title}
            </h3>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Zoom and Rotate Controls */}
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5 || isUploading}
                  className="p-2 text-white hover:bg-white/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-white text-sm font-medium min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 3 || isUploading}
                  className="p-2 text-white hover:bg-white/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-white/30 mx-1" />
                <button
                  onClick={handleRotate}
                  disabled={isUploading}
                  className="p-2 text-white hover:bg-white/30 rounded transition-colors disabled:opacity-50"
                  title="Rotate"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  disabled={isUploading}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm disabled:opacity-50"
                >
                  Reset
                </button>
                {onUpload && (
                  <button
                    onClick={() => onUpload({ scale, rotation, position })}
                    disabled={isUploading}
                    className="flex-1 sm:flex-none px-6 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
