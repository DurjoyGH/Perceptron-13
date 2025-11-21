import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';

const AvatarModal = ({ user, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  // Get initials from name
  const getInitials = (name) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (user.profilePicture?.url) {
      const link = document.createElement('a');
      link.href = user.profilePicture.url;
      link.download = `${user.name.replace(/\s+/g, '_')}_profile.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-2xl w-full animate-scaleIn">
        {/* Top Action Buttons */}
        <div className="absolute -top-12 right-0 flex items-center gap-3 z-10">
          {user.profilePicture?.url && (
            <button
              onClick={handleDownload}
              className="text-white hover:text-gray-300 transition-colors"
              title="Download image"
            >
              <Download size={28} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
            title="Close"
          >
            <X size={32} />
          </button>
        </div>

        {/* Image Only */}
        <div className="flex justify-center">
          {user.profilePicture?.url ? (
            <img
              src={user.profilePicture.url}
              alt={user.name}
              className="max-w-full max-h-[80vh] rounded-lg object-contain shadow-2xl"
            />
          ) : (
            <div className="w-96 h-96 rounded-lg bg-gradient-to-br from-[#19aaba] to-[#158c99] flex items-center justify-center text-white shadow-2xl">
              <span className="text-9xl font-bold">{getInitials(user.name)}</span>
            </div>
          )}
        </div>

        {/* Optional Name Tag at Bottom */}
        <div className="text-center mt-4">
          <p className="text-white text-lg font-semibold drop-shadow-lg">{user.name}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AvatarModal;
