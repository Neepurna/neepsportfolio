import { useEffect, useRef } from 'react';

interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

interface ProjectSliderProps {
  isOpen: boolean;
  onClose: () => void;
  galleryItems: GalleryItem[];
  projectIndex: number;
}

const ProjectSlider = ({ isOpen, onClose, galleryItems, projectIndex }: ProjectSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleBodyScroll = () => {
      // Prevent body scrolling when slider is open
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('slider-active');
      handleBodyScroll();
    } else {
      document.body.classList.remove('slider-active');
      handleBodyScroll();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('slider-active');
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="slider-overlay" onClick={onClose}></div>
      <div className={`project-expanded-slider project-${projectIndex}`} ref={sliderRef}>
        <button className="slider-close-btn" onClick={onClose}>×</button>
        <h3>Project Gallery</h3>
        
        <div className="expanded-gallery-grid">
          {galleryItems.map((item, index) => (
            <div className="expanded-gallery-item" key={index}>
              {item.type === 'image' ? (
                <img src={item.src} alt={item.alt} />
              ) : (
                <video 
                  src={item.src} 
                  muted 
                  loop 
                  autoPlay 
                  playsInline
                  controls
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectSlider;
