import { useState, useEffect, useRef } from 'react';

export default function MetricModal({
  id,
  value,
  label,
  description,
  imageSrc,
  imageAlt,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  // Listen for open events from outside
  useEffect(() => {
    const handleOpenModal = e => {
      if (e.detail?.modalId === id) {
        setIsOpen(true);
      }
    };

    window.addEventListener(`open-modal-${id}`, handleOpenModal);
    return () => {
      window.removeEventListener(`open-modal-${id}`, handleOpenModal);
    };
  }, [id]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (modalRef.current && e.target === modalRef.current) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      data-modal
    >
      <div
        className="relative w-full max-w-5xl rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl aspect-video"
        onClick={e => e.stopPropagation()}
      >
        {/* Background Image */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="modal-image absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/40"></div>

        {/* Close button */}
        <button
          className="modal-close-button absolute top-2 right-2 sm:top-4 sm:right-4 z-20 rounded-full bg-black/50 backdrop-blur-sm p-1.5 sm:p-2 text-white transition-colors hover:bg-black/70"
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar modal"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Metric Block - Top Left */}
        <div className="modal-content-metric absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 z-10">
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-montserrat font-bold text-white mb-1 sm:mb-2">
              {value}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-montserrat font-semibold text-white">
              {label}
            </div>
          </div>
        </div>

        {/* Description Block - Bottom Left */}
        <div className="modal-content-description absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 z-10 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl">
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
            <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
