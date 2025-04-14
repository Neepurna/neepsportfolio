import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Define types locally within Modal or import from App.tsx if shared
interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

interface Project {
  title: string;
  description?: string;
  detailedDescription?: string;
  stack: string[];
  image: string;
  gallery: GalleryItem[];
  link?: string;
}

// Corrected ModalProps interface
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, project }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  // Reset slide index when project changes
  useEffect(() => {
    if (project) {
      setSlideIndex(0);
    }
  }, [project]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return; // Only run if modal is open

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // These useCallback functions are used in the JSX, so keep them
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const nextSlide = useCallback(() => {
    if (project) {
      setSlideIndex(prev => (prev + 1) % project.gallery.length);
    }
  }, [project]);

  const prevSlide = useCallback(() => {
    if (project) {
      setSlideIndex(prev => (prev - 1 + project.gallery.length) % project.gallery.length);
    }
  }, [project]);

  // Don't render anything if not open or no project selected
  if (!isOpen || !project) return null;

  const currentItem = project.gallery[slideIndex];

  return createPortal(
    <div 
      className="modal-overlay"
      onClick={handleBackdropClick}
    >
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-area">
            <h3>{project.title}</h3>
            {project.link && (
              <div className="project-link">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  Visit Website <span className="link-arrow">→</span>
                </a>
              </div>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-gallery-section">
            <div className="gallery-container">
              {currentItem.type === 'image' ? (
                <img 
                  src={currentItem.src} 
                  alt={currentItem.alt} 
                  className="gallery-media" 
                />
              ) : (
                <video 
                  src={currentItem.src} 
                  controls
                  autoPlay
                  muted // Mute autoplay video for better UX
                  loop
                  className="gallery-media"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              
              {project.gallery.length > 1 && (
                <>
                  <button className="gallery-nav prev" onClick={prevSlide}>‹</button>
                  <button className="gallery-nav next" onClick={nextSlide}>›</button>
                  
                  <div className="gallery-dots">
                    {project.gallery.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`gallery-dot ${slideIndex === idx ? 'active' : ''}`}
                        onClick={() => setSlideIndex(idx)}
                      ></span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="modal-details-section">
            <h4>Description</h4>
            <p className="detailed-description">{project.detailedDescription}</p>
            <h4>Stack</h4>
            <p className="stack-info">{project.stack.join(', ')}</p>
            <div className="tech-logo-container" style={{ marginTop: '1rem' }}>
              {project.stack.map((tech, idx) => (
                <div key={idx} className="tech-logo-item">
                  <span className="tech-badge" style={{ 
                    backgroundColor: 'rgba(204, 45, 45, 0.2)', 
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.85em',
                    display: 'inline-block',
                    margin: '0 8px 8px 0',
                    border: '1px solid rgba(204, 45, 45, 0.3)'
                  }}>
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
