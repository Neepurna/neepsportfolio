import { Player } from '@lottiefiles/react-lottie-player';
import Quiz from './Quiz';
import './App.css';

// Simplified tech logo mapping - only keeping what's needed for Artstation
const techLogos: Record<string, string> = {
  'Blender': '/icons/blender.svg',
  'Photoshop': '/icons/photoshop.svg',
};

// Define types for gallery items
interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

// Define project interface
interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  url?: string;
}

function App() {
  // Define gallery media for Artstation section
  const galleryMedia = [
    { type: 'video', src: '/videos/0002.mp4', alt: 'Gallery video 2' },
    { type: 'video', src: '/videos/0003.mp4', alt: 'Gallery video 3' },
    { type: 'video', src: '/videos/01.mp4', alt: 'Gallery video 1' }, 
    { type: 'image', src: '/gallery/1.jpg', alt: 'Gallery item 1' },
    { type: 'image', src: '/gallery/2.jpg', alt: 'Gallery item 2' },
    { type: 'image', src: '/gallery/3.jpg', alt: 'Gallery item 3' },
    { type: 'image', src: '/gallery/4.jpg', alt: 'Gallery item 4' },
    { type: 'image', src: '/gallery/5.jpg', alt: 'Gallery item 5' },
    { type: 'image', src: '/gallery/6.jpg', alt: 'Gallery item 6' },
    { type: 'image', src: '/gallery/7.jpg', alt: 'Gallery item 7' },
    { type: 'image', src: '/gallery/8.jpg', alt: 'Gallery item 8' },
    { type: 'image', src: '/gallery/9.jpg', alt: 'Gallery item 9' },
    { type: 'image', src: '/gallery/10.jpg', alt: 'Gallery item 10' },
  ];
  
  // Define tools used in Artstation section
  const artstationTools = ['Blender', 'Photoshop'];

  // Define projects data
  const projects: Project[] = [
    {
      id: 'project-1',
      title: 'Inclivo',
      category: 'Full Stack Mobile App',
      image: '/images/inclivo-static.png',
      url: 'https://github.com/Neepurna/Seenafile', // Change this path to reference your new image
    },
    {
      id: 'project-2',
      title: 'Hanumanverse',
      category: 'Web3 FrontEnd Development',
      image: '/images/hanumanverse-static.png', // Change this path to reference your new image
      url:'https://hanumanuniverse.com/',
    },
    {
      id: 'project-3',
      title: 'Kidorama',
      category: 'Educatinoal Web Game',
      image: '/images/Kidorama.png',
      url: 'https://simmer.io/@shibakriwo/kidorama-demo-0-2',
    },
    {
      id: 'project-4',
      title: 'Foodmandu',
      category: 'VR Game',
      image: '/images/VR.png',
      url: 'https://www.linkedin.com/posts/neepurna_work-experience-opportunity-activity-7084882822053732353-E1Qc?utm_source=share&utm_medium=member_desktop&rcm=ACoAABUeRqMBdzVy1cvSDKNiKeWxXe71WbXIqZc',
    },
  ];

  // Define social links data
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/neepurna/',
      icon: '/icons/LinkedIn.svg'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Neepurna',
      icon: '/icons/Github.svg'
    },
    {
      name: 'Artstation',
      url: 'https://www.artstation.com/neepurna',
      icon: '/icons/artstation.svg'
    },
    {
      name: 'Vimeo',
      url: 'https://vimeo.com/user100234074',
      icon: '/icons/vimeo.svg'
    },
    {
      name: 'Sketchfab',
      url: 'https://sketchfab.com/neepurna',
      icon: '/icons/sketchfab.svg'
    }
  ];

  return (
    <div className="portfolio-container">
      <header className="header">
        <h1>Neeps</h1>
        <p>Motion Graphics | Developer | 3d Artist </p>
        <div className="header-social-links">
          <a href="https://www.linkedin.com/in/neepurna/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <img src="/icons/LinkedIn.svg" alt="LinkedIn" className="social-icon" />
          </a>
          <a href="https://github.com/Neepurna" target="_blank" rel="noopener noreferrer" title="GitHub">
            <img src="/icons/Github.svg" alt="GitHub" className="social-icon" />
          </a>
          <a href="https://www.artstation.com/neepurna" target="_blank" rel="noopener noreferrer" title="Artstation">
            <img src="/icons/artstation.svg" alt="Artstation" className="social-icon" />
          </a>
        </div>
      </header>

      <section className="about">
        <div className="about-content">
          <div className="about-text text-left">
            <p>
              Hi, I'm Neeps.<br/>
              I craft interactive <span className="highlight-1">websites</span> and <span className="highlight-1">mobile</span> applications, immersive <span className="highlight-1">AR/VR</span> worlds, and <span className="highlight-1">Web3 Games</span>. I bring futuristic ideas to life through code, design, immersive experiences, and blockchain magic.
            </p>
          </div>
          <div className="about-lottie" style={{ marginTop: '.5%' }}>
            <Player
              autoplay
              loop
              src="/Me.json"
              style={{ height: '300px', width: '300px' }}
            >
            </Player>
          </div>
        </div>
      </section>

      {/* Modern Down Arrow */}
      <div 
        className="down-arrow-container" 
        onClick={() => {
          const artstationSection = document.querySelector('.artstation-gallery');
          if (artstationSection) {
            artstationSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <div className="modern-down-arrow">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Stats/Experience Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Motion Graphics</div>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-description">creative animated/infographics videos for products </div>
            <a href="https://vimeo.com/user100234074" className="learn-more">Learn more →</a>
          </div>
          
          <div className="stat-card active">
            <div className="stat-label">Developer</div>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-description">Full Stack development of web,mobile and game applications</div>
            <a href="https://github.com/Neepurna" className="learn-more">Learn more →</a>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">3d Modeling</div>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L3 13V3H13L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-description">game characters with texture,material,rigging and animation</div>
            <a href="https://sketchfab.com/neepurna" className="learn-more">Learn more →</a>
          </div>
        </div>
        
        <div className="stats-counters">
          <div className="counter-item">
            <div className="counter-value">5</div>
            <div className="counter-label">Years Experience</div>
          </div>
          <div className="counter-item">
            <div className="counter-value">30+</div>
            <div className="counter-label">Motion Graphics Project</div>
          </div>
          <div className="counter-item">
            <div className="counter-value">2</div>
            <div className="counter-label">Years Blockchain Experience</div>
          </div>
          <div className="counter-item">
            <div className="counter-value">10+</div>
            <div className="counter-label">Development Projects</div>
          </div>
          <div className="counter-item">
            <div className="counter-value">5+</div>
            <div className="counter-label">3d and VFX projects</div>
          </div>
          
        </div>
        
        {/* Skills Section */}
        <div className="skills-section">
          <h3 className="skills-title">Skills & Technologies</h3>
          <div className="skills-grid">
            {[
              { name: 'React', icon: '/icons/react-native.svg' },
              { name: 'JavaScript', icon: '/icons/javascript.svg' },
              
              { name: 'Node.js', icon: '/icons/node-js.svg' },
              { name: 'python', icon: '/icons/python.svg' },
              
              
              { name: 'Git', icon: '/icons/Github.svg' },
              { name: 'Blender', icon: '/icons/blender.svg' },
              { name: 'Photoshop', icon: '/icons/photoshop.svg' },
              
              { name: 'Solidity', icon: '/icons/solidity.svg' },
             
             
              { name: 'Unity', icon: '/icons/unity.svg' },
              { name: 'firebase', icon: '/icons/firebase.svg' },
              
            ].map((skill, index) => (
              <div key={index} className="skill-item">
                <img 
                  src={skill.icon} 
                  alt={skill.name} 
                  className="skill-icon"
                  onError={(e) => { e.currentTarget.src = '/icons/fallback.svg'; }}
                />
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <p className="section-description">
            A collection of my recent work. Each project represents a unique challenge and solution.
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-item">
              <div className="project-info">
                <div className="project-category">{project.category}</div>
                <h3 className="project-title">{project.title}</h3>
              </div>
              <div className="project-image-container">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                />
                <div className="project-overlay">
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="view-project">
                      View Project
                    </a>
                  ) : (
                    <div className="view-project" onClick={() => handleProjectClick(project)}>
                      View Project
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </section>

      {/* Artstation Gallery Section */}
      <section className="artstation-gallery">
        <h2>Artstation</h2>
        <p className="tools-subtext">A collection of my design work</p>
        <div className="gallery-grid">
          {galleryMedia.map((media, index) => (
            <div key={index} className="gallery-item">
              {media.type === 'image' ? (
                <img
                  src={media.src}
                  alt={media.alt}
                  className="gallery-image"
                />
              ) : (
                <div className="gallery-video-container">
                  <video 
                    src={media.src}
                    className="gallery-video"
                    muted
                    loop
                    playsInline
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => e.currentTarget.pause()}
                    onClick={(e) => {
                      if (e.currentTarget.paused) {
                        e.currentTarget.play();
                      } else {
                        e.currentTarget.pause();
                      }
                    }}
                  />
                  <div className="video-play-indicator"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quiz Game - Goodbye Message */}
      <Quiz />

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-social-links">
          {socialLinks
            .filter(link => link.name !== 'LinkedIn' && 
                            link.name !== 'GitHub' && 
                            link.name !== 'Artstation' && 
                            link.name !== 'Vimeo' && 
                            link.name !== 'Sketchfab')
            .map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" title={link.name}>
                <img src={link.icon} alt={link.name} className="social-icon" />
              </a>
            ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
