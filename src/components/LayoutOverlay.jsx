import React, { useState, useRef, useEffect } from 'react';
import { Mail, ExternalLink, ArrowRight, X, Code2, Cpu, Film, Menu } from 'lucide-react';
import { playClickSound, playHoverSound } from './AudioController';
import ScrollReveal from './ScrollReveal';

const GithubIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Selected Work Data
const PROJECTS = [
  {
    id: '01',
    name: 'IDEA 2.0',
    tagline: 'Financial Graph Intelligence Platform',
    desc: 'Advanced banking fraud detection system leveraging graph network analysis. Correlates transactions and builds neural relationships to flag financial crimes in real-time.',
    tags: ['FastAPI', 'React', 'D3.js', 'Neo4j', 'scikit-learn', 'NetworkX'],
    github: 'https://github.com/zqyrix',
    details: 'IDEA 2.0 compiles multi-hop transactional paths into a dynamic graph intelligence dashboard. By matching entity resolution algorithms against Neo4j databases, it detects complex money laundering rings and fraud circles that traditional tabular database queries fail to capture.'
  },
  {
    id: '02',
    name: 'Python Mini Firewall',
    tagline: 'Cybersecurity Packet-Filtering Engine',
    desc: 'Lightweight, terminal-visualized security firewall designed to inspect, log, and filter incoming network packets. Features real-time volumetric DDoS attack detection.',
    tags: ['Python', 'Scapy', 'Rich CLI', 'Network Security'],
    github: 'https://github.com/zqyrix',
    details: 'Built directly on top of Scapy, this engine operates in raw socket mode. It implements custom IP/TCP rule tables, logs packet sizes, flags anomalies (such as SYN floods or port scans), and visualizes the results on a beautiful real-time terminal UI using Rich.'
  },
  {
    id: '03',
    name: 'ChainIQ',
    tagline: 'Supply Chain Intelligence Dashboard',
    desc: 'Interactive data visualization suite mapping global logistics dependencies. Predicts bottleneck risks using telemetry vectors and visualizes shipping paths.',
    tags: ['React', 'D3.js', 'FastAPI', 'Data Visualization'],
    github: 'https://github.com/zqyrix',
    details: 'ChainIQ pulls shipping, manufacturing, and transit telemetry to structure real-time supply chain networks. It displays dynamic geographic flows and topological node graphs using D3 force simulations, enabling logistics managers to perform immediate what-if dependency analyses.'
  },
  {
    id: '04',
    name: 'Zqyrix AI',
    tagline: 'Local Offline Voice Assistant',
    desc: 'Fully private local AI assistant executing offline voice translation, text-to-speech, and database search. Operates without any internet API dependecies.',
    tags: ['Python', 'Ollama', 'Whisper', 'ChromaDB', 'Edge-TTS'],
    github: 'https://github.com/zqyrix',
    details: 'A complete personal voice coordinator run entirely on local silicon. Utilizing Whisper for speech-to-text, Llama3 via Ollama for reasoning, and ChromaDB for vector memory, Zqyrix AI learns personal schedules and responds offline using high-fidelity edge speech engines.'
  },
  {
    id: '05',
    name: 'Eternal',
    tagline: 'Cinematic Web Simulation',
    desc: 'A dark, technical web experiment exploring micro-physics, interactive particle matrices, and cinematic scroll-driven space geometries.',
    tags: ['HTML5 Canvas', 'Vanilla JS', 'GSAP', 'WebGL'],
    github: 'https://github.com/zqyrix',
    details: 'Eternal represents a creative web laboratory experimenting with organic math functions in javascript. It drives complex mathematical equations, fluid dynamics, and canvas vectors in sync with browser scroll velocities to construct mesmerizing 3D visual tapestries.'
  }
];

// Capabilities Constellation Data
const CAPABILITIES = [
  { id: 'cap-1', name: 'AI / ML', desc: 'Neural networks, local LLMs, private vectors, semantic search systems.', x: 180, y: 100 },
  { id: 'cap-2', name: 'CYBERSECURITY', desc: 'Intrusion detection, packet filtering, network firewall architectures.', x: 420, y: 120 },
  { id: 'cap-3', name: '3D / INTERACTIVE WEB', desc: 'WebGL shaders, Three.js, premium graphic UI, high-performance canvas.', x: 640, y: 220 },
  { id: 'cap-4', name: 'DATA VISUALIZATION', desc: 'Topological node graphs, flow mappings, D3 telemetry boards.', x: 500, y: 380 },
  { id: 'cap-5', name: 'AUTOMATION', desc: 'Autonomous scrapers, ingestion pipelines, system daemon cron automation.', x: 220, y: 340 },
  { id: 'cap-6', name: 'FULL-STACK', desc: 'High-speed Python/Node microservices, modern React interfaces.', x: 340, y: 240 }
];

// Services Data (10 expanded services)
const SERVICES = [
  {
    num: '01',
    title: 'WEB DEVELOPMENT',
    type: 'grid',
    desc: 'Design and develop modern, responsive, and high-performance websites for startups, businesses, portfolios, and personal brands. From landing pages to interactive web applications, we focus on performance, visual excellence, and clean layouts.',
    details: ['Business websites', 'Portfolio websites', 'Landing pages', 'Responsive web applications', 'Interactive websites', 'Performance optimization']
  },
  {
    num: '02',
    title: 'UI / UX DESIGN',
    type: 'nodes',
    desc: 'Create clean, intuitive, and visually engaging digital interfaces focused on usability, responsiveness, and modern designs. We build seamless user flows and premium prototype models that align user experience with your brand presence.',
    details: ['Website UI design', 'Application interfaces', 'User flows & wireframes', 'Interactive prototypes', 'Design systems', 'Visual quality checks']
  },
  {
    num: '03',
    title: 'SOCIAL MEDIA MANAGEMENT',
    type: 'nodes',
    desc: 'A technology-driven digital presence management service. We help startup and tech businesses build, schedule, and maintain consistent brand awareness and audience engagement across core media platforms.',
    details: ['Content planning', 'Social media scheduling', 'Post design', 'Content publishing', 'Audience engagement', 'Performance tracking']
  },
  {
    num: '04',
    title: 'DIGITAL BRANDING',
    type: 'nodes',
    desc: 'Establish a cohesive, recognizable digital identity across your online platforms. We build consistent visual elements, typography, and color systems designed to match a premium technical brand presence.',
    details: ['Visual identity', 'Brand guidelines', 'Social media creatives', 'Digital assets', 'Typography & color systems', 'Online brand presence']
  },
  {
    num: '05',
    title: 'WEBSITE SUPPORT',
    type: 'paths',
    desc: 'Technical site updates, bug fixes, and security checks to keep your web platforms performing reliably. Ongoing post-launch optimization, speed upgrades, and dependency management.',
    details: ['Content updates', 'Bug fixes', 'Performance improvements', 'Security patches', 'Dependency updates', 'Ongoing technical support']
  },
  {
    num: '06',
    title: 'SEO & OPTIMIZATION',
    type: 'paths',
    desc: 'Improve website visibility, mobile speed, and semantic accessibility. We optimize metadata, structure code templates, and adjust assets so your platform meets modern search-friendly standards.',
    details: ['On-page SEO', 'Technical SEO basics', 'Metadata optimization', 'Performance optimization', 'Mobile speed upgrades', 'Accessibility compliance']
  },
  {
    num: '07',
    title: 'BUSINESS AUTOMATION',
    type: 'paths',
    desc: 'Streamline operations by automating repetitive tasks, form entries, notifications, and data processing. We build custom scripts and internal pipelines to connect your databases and operations.',
    details: ['Workflow automation', 'Form-to-database systems', 'Automated notifications', 'Data processing', 'API integrations', 'Custom internal tools']
  },
  {
    num: '08',
    title: 'COMMERCE SITES',
    type: 'default',
    desc: 'Design and build tailor-made software applications engineered for specific business logic and data workflows. We build fast dashboards, private APIs, and functional software prototypes.',
    details: ['Custom web applications', 'Internal management systems', 'Dashboards', 'API development', 'Database applications', 'Software prototypes']
  },
  {
    num: '09',
    title: 'AI SOLUTIONS',
    type: 'neural',
    desc: 'Develop engineering-focused AI tools and intelligent automations. We integrate models, build custom offline reasoning workflows, and implement local data/document processing prototypes.',
    details: ['AI integrations', 'Intelligent automation', 'Machine learning prototypes', 'Data processing', 'Custom AI workflows']
  },
  {
    num: '10',
    title: 'CYBERSECURITY',
    type: 'circle',
    desc: 'Develop security-focused software, vulnerability monitoring daemons, and system threat visualizers to help identify platform risks and secure networking pipelines.',
    details: ['Security tools', 'Network monitoring', 'Threat detection prototypes', 'Security automation', 'Cybersecurity R&D']
  }
];

export default function LayoutOverlay({ activeSection, onNavigate, onHoverService }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCapNode, setActiveCapNode] = useState(null);
  const [hoveredServiceIdx, setHoveredServiceIdx] = useState(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState(2); // start with middle index (ChainIQ) for symmetrical Cover Flow balance
  
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reference variables for card 3D tilt tracking
  const cardRefs = useRef([]);

  // Refs and handlers for 3D Cover Flow Carousel mouse/touch dragging
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);

  const cleanupDragListeners = () => {
    window.removeEventListener('mousemove', handleGlobalMouseMove);
    window.removeEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleCarouselMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    
    // Register temporary window listeners to follow dragging smoothly anywhere
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = (e) => {
    if (!isDragging.current) return;
    const diff = e.clientX - dragStartX.current;
    
    if (Math.abs(diff) > 15) {
      hasDragged.current = true; // Mark as drag to bypass click modal trigger
    }
    
    if (diff > 60) {
      setActiveProjectIdx((prev) => Math.max(0, prev - 1));
      isDragging.current = false;
      cleanupDragListeners();
    } else if (diff < -60) {
      setActiveProjectIdx((prev) => Math.min(PROJECTS.length - 1, prev + 1));
      isDragging.current = false;
      cleanupDragListeners();
    }
  };

  const handleGlobalMouseUp = () => {
    isDragging.current = false;
    // Delay clearing hasDragged slightly so click handler evaluates it first
    setTimeout(() => {
      hasDragged.current = false;
      cleanupDragListeners();
    }, 50);
  };

  const handleCarouselTouchStart = (e) => {
    if (e.touches.length > 0) {
      isDragging.current = true;
      hasDragged.current = false;
      dragStartX.current = e.touches[0].clientX;
      dragStartTime.current = Date.now();
    }
  };

  const handleCarouselTouchMove = (e) => {
    if (!isDragging.current || e.touches.length === 0) return;
    const diff = e.touches[0].clientX - dragStartX.current;
    
    if (Math.abs(diff) > 15) {
      hasDragged.current = true;
    }
    
    if (diff > 45) {
      setActiveProjectIdx((prev) => Math.max(0, prev - 1));
      isDragging.current = false;
    } else if (diff < -45) {
      setActiveProjectIdx((prev) => Math.min(PROJECTS.length - 1, prev + 1));
      isDragging.current = false;
    }
  };

  // Cleanup active window events on unmount if user drags off screen
  useEffect(() => {
    return () => cleanupDragListeners();
  }, []);

  const handleCardMouseMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within client
    const y = e.clientY - rect.top;  // y coordinate within client
    
    // Normalize coordinates (-0.5 to 0.5)
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;

    // Apply rotation transforms (tilt)
    card.style.transform = `perspective(800px) rotateY(${px * 16}deg) rotateX(${-py * 16}deg) scale3d(1.03, 1.03, 1.03)`;
    
    // Pass coordinate values as CSS custom properties for hover radial glows
    card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
  };

  const handleCardMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    // Reset rotation with smooth transition
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div className="ui-layer" style={{ width: '100%' }}>
      {/* ────────────────── GLOBAL NAVIGATION HEADER ────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.4rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 400,
          pointerEvents: 'auto',
          backgroundColor: 'rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.02)'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate(0)}
          data-cursor-text="HOME"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.18em',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            cursor: 'pointer'
          }}
        >
          ZQYRIX<span style={{ color: 'var(--accent)', fontSize: '1.2rem', lineHeight: 0 }}>.</span>
        </div>

        {/* Technical Nav Links or Hamburger Menu */}
        {isMobile ? (
          <button
            onClick={() => {
              playClickSound();
              setMenuOpen(!menuOpen);
            }}
            data-cursor-text={menuOpen ? "CLOSE" : "MENU"}
            style={{
              padding: '0.5rem',
              color: '#ffffff',
              cursor: 'pointer',
              zIndex: 401
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        ) : (
          <nav style={{ display: 'flex', gap: '2.5rem' }}>
            {['LAB', 'WORK', 'CAPABILITIES', 'SERVICES', 'CONTACT'].map((item, idx) => (
              <button
                key={item}
                onClick={() => {
                  playClickSound();
                  onNavigate(idx + 1); // map directly to section indices 1 to 5
                }}
                data-cursor-text={item}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.15em',
                  color: activeSection === idx + 1 ? 'var(--text)' : 'var(--muted)',
                  position: 'relative',
                  padding: '0.2rem 0',
                  transition: 'color 0.25s'
                }}
              >
                {item}
                {activeSection === idx + 1 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: '100%',
                      height: '1px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 3, 3, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 399,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2.5rem',
            padding: '2rem',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {['LAB', 'WORK', 'CAPABILITIES', 'SERVICES', 'CONTACT'].map((item, idx) => (
            <button
              key={item}
              onClick={() => {
                setMenuOpen(false);
                playClickSound();
                onNavigate(idx + 1);
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.3rem',
                letterSpacing: '0.2em',
                color: activeSection === idx + 1 ? 'var(--text)' : 'var(--muted)',
                padding: '0.8rem',
                width: '100%',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* ────────────────── SECTION 01: EVENT HORIZON (HERO) ────────────────── */}
      <section
        id="section-hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '6rem 1.5rem 3rem 1.5rem' : '2rem 10% 2rem 5%',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '650px', zIndex: 10, pointerEvents: 'auto' }}>
          {/* Eyebrow */}
          <ScrollReveal delay={0.1}>
            <div
              className="technical-label"
              style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#ffffff' }} />
              SEC_01 // EVENT_HORIZON
            </div>
          </ScrollReveal>

          {/* Title */}
          <ScrollReveal delay={0.25}>
            <h1
              style={{
                fontSize: 'clamp(2.0rem, 7vw, 5.2rem)',
                lineHeight: 0.95,
                fontWeight: 700,
                letterSpacing: '-0.04em',
                marginBottom: '1.6rem',
                color: '#ffffff'
              }}
            >
              SOFTWARE BEYOND THE ORDINARY<span style={{ color: 'var(--accent)' }}>.</span>
            </h1>
          </ScrollReveal>

          {/* Supporting Text */}
          <ScrollReveal delay={0.4}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                color: 'var(--muted)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                fontWeight: 300,
                maxWidth: '520px'
              }}
            >
              Engineering intelligent systems, advanced cyber security mechanisms and custom immersive 3D digital experiences built for difficult problems.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={0.55}>
            <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { playClickSound(); onNavigate(1); }}
                data-cursor-text="ENTER"
                className="glow-text hero-btn-explore"
                style={{
                  padding: '0.85rem 2.2rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #ffffff',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(255, 94, 0, 0.1)'
                }}
              >
                EXPLORE ZQYRIX →
              </button>
              <button
                onClick={() => { playClickSound(); onNavigate(2); }}
                data-cursor-text="WORK"
                className="hero-btn-work"
                style={{
                  padding: '0.85rem 2.2rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderRadius: '2px'
                }}
              >
                VIEW WORK
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ────────────────── SECTION 02: THE LAB ────────────────── */}
      <section
        id="section-lab"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '4rem 1.5rem' : '6rem 5%',
          backgroundColor: 'rgba(3,3,3,0.85)',
          backdropFilter: isMobile ? 'none' : 'blur(8px)',
          borderTop: '1px solid var(--border)',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '800px', pointerEvents: 'auto' }}>
          <ScrollReveal>
            <div className="technical-label" style={{ marginBottom: '1.2rem' }}>
              SEC_02 // SYSTEM_DIAGNOSTICS
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.15}>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 3.8rem)',
                lineHeight: 1.05,
                marginBottom: '2rem',
                color: '#ffffff'
              }}
            >
              WE BUILD SYSTEMS THAT MOVE<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </ScrollReveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            marginTop: '3rem'
          }}>
            {[
              {
                title: 'INTELLIGENT SYSTEMS',
                desc: 'Designing state-of-the-art offline AI assistants, neural embeddings, and vector network models engineered on local hardware silicon.'
              },
              {
                title: 'CYBERSECURITY LABS',
                desc: 'Compiling packet-filtering systems and socket inspectors to defend software infrastructures against high-volume traffic intrusions.'
              },
              {
                title: 'IMMERSIVE ARCHITECTURE',
                desc: 'Deploying high-speed WebGL structures and custom shader models that translate tabular information datasets into premium visual experiences.'
              }
            ].map((box, i) => (
              <ScrollReveal key={i} delay={0.3 + i * 0.15}>
                <div
                  style={{
                    borderLeft: '2px solid var(--border)',
                    paddingLeft: '1.2rem',
                    transition: 'border-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    color: 'var(--text)',
                    marginBottom: '0.6rem'
                  }}>
                    {box.title}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.86rem',
                    lineHeight: 1.7,
                    color: 'var(--muted)',
                    fontWeight: 300
                  }}>
                    {box.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── SECTION 03: SELECTED WORK (3D TILES) ────────────────── */}
      <section
        id="section-work"
        style={{
          minHeight: '100vh',
          padding: isMobile ? '4rem 1.5rem' : '6rem 5%',
          backgroundColor: 'rgba(3,3,3,0.65)',
          backdropFilter: isMobile ? 'none' : 'blur(4px)',
          borderTop: '1px solid var(--border)',
          position: 'relative'
        }}
      >
        <ScrollReveal>
          <div className="technical-label" style={{ marginBottom: '1.2rem' }}>
            SEC_03 // SELECTED_LAB_PROJECTS
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.15}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.8rem)', marginBottom: '3rem', color: '#ffffff' }}>
            SELECTED LAB WORK
          </h2>
        </ScrollReveal>

        {/* 3D Sliding Cover Flow Carousel with Drag & Swipe Gestures */}
        <ScrollReveal delay={0.3}>
          <div
            onMouseDown={handleCarouselMouseDown}
            onTouchStart={handleCarouselTouchStart}
            onTouchMove={handleCarouselTouchMove}
            onTouchEnd={handleGlobalMouseUp}
            style={{
              position: 'relative',
              height: isMobile ? '380px' : '420px',
              width: '100%',
              maxWidth: '900px',
              margin: '0 auto',
              perspective: '1200px',
              transformStyle: 'preserve-3d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '2rem',
              pointerEvents: 'auto',
              userSelect: 'none' // Prevent text highlight while dragging
            }}
          >
            {PROJECTS.map((proj, idx) => {
              const offset = idx - activeProjectIdx;
              const absOffset = Math.abs(offset);
              const isActive = offset === 0;
              const zIndex = 10 - absOffset;
              
              // Compute cover flow positions dynamically for mobile responsiveness
              const spacing = isMobile ? 120 : 240;
              const translateZ = isMobile ? (isActive ? 40 : -100) : (isActive ? 80 : -150);
              const scale = isMobile ? (isActive ? 0.95 : 0.72) : (isActive ? 1.0 : 0.82);
              const rotateY = offset < 0 ? (isMobile ? 15 : 30) : (isMobile ? -15 : -30);
              const translateX = offset * spacing;
              const opacity = isActive ? 1.0 : 0.5;

              return (
                <div
                  key={proj.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  onMouseMove={(e) => isActive && handleCardMouseMove(e, idx)}
                  onMouseLeave={() => isActive && handleCardMouseLeave(idx)}
                  onClick={() => {
                    const clickDuration = Date.now() - dragStartTime.current;
                    if (clickDuration > 250 && hasDragged.current) return; // Prevent click opening if mouse was dragged or held long
                    playClickSound();
                    if (!isActive) {
                       setActiveProjectIdx(idx);
                    } else {
                      setSelectedProject(proj);
                    }
                  }}
                  data-cursor-text={isActive ? "VIEW DETAILS" : "SELECT WORK"}
                  className="project-panel"
                  style={{
                    position: 'absolute',
                    width: '360px',
                    maxWidth: '85vw',
                    height: isMobile ? '310px' : '350px',
                    backgroundColor: 'rgba(10, 10, 10, 0.85)', // higher opacity for cover flow cards
                    border: '1px solid var(--border)',
                    padding: '2rem',
                    borderRadius: '16px', // curved rounded corners
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, background-color 0.3s',
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'auto',
                    overflow: 'hidden'
                  }}
                >
                  {/* Radial gradient follow effect inside card */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(214, 228, 255, 0.06) 0%, transparent 60%)',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  />

                  <div style={{ transform: 'translateZ(30px)', position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Project Number */}
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.2em',
                        color: 'var(--muted)',
                        marginBottom: '1rem'
                      }}>
                        PROJECT // {proj.id}
                      </div>

                      {/* Project Title */}
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        fontWeight: 600,
                        marginBottom: '0.4rem',
                        color: '#ffffff'
                      }}>
                        {proj.name}
                      </h3>

                      {/* Tagline */}
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: 'var(--accent)',
                        letterSpacing: '0.05em',
                        marginBottom: '1rem'
                      }}>
                        {proj.tagline}
                      </div>

                      {/* Description */}
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: 'var(--muted)',
                        fontWeight: 300,
                        marginBottom: '1rem'
                      }}>
                        {proj.desc}
                      </p>
                    </div>

                    {/* Tech Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {proj.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.58rem',
                            color: 'var(--muted)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '8px', // rounded curves for tags
                            backgroundColor: 'rgba(255,255,255,0.01)'
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {proj.tags.length > 3 && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.58rem',
                          color: 'var(--dim)',
                          padding: '0.15rem 0.1rem'
                        }}>
                          +{proj.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Carousel Navigation Controls */}
        <ScrollReveal delay={0.45}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem', pointerEvents: 'auto' }}>
            <button
              onClick={() => {
                playClickSound();
                setActiveProjectIdx((prev) => Math.max(0, prev - 1));
              }}
              disabled={activeProjectIdx === 0}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: activeProjectIdx === 0 ? 'var(--dim)' : '#ffffff',
                cursor: activeProjectIdx === 0 ? 'default' : 'pointer',
                backgroundColor: 'rgba(255,255,255,0.01)',
                transition: 'all 0.2s'
              }}
            >
              ← PREV
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {PROJECTS.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    playClickSound();
                    setActiveProjectIdx(idx);
                  }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: idx === activeProjectIdx ? '#ffffff' : 'var(--dim)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => {
                playClickSound();
                setActiveProjectIdx((prev) => Math.min(PROJECTS.length - 1, prev + 1));
              }}
              disabled={activeProjectIdx === PROJECTS.length - 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: activeProjectIdx === PROJECTS.length - 1 ? 'var(--dim)' : '#ffffff',
                cursor: activeProjectIdx === PROJECTS.length - 1 ? 'default' : 'pointer',
                backgroundColor: 'rgba(255,255,255,0.01)',
                transition: 'all 0.2s'
              }}
            >
              NEXT →
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ────────────────── SECTION 04: CAPABILITIES (CONSTELLATION) ────────────────── */}
      <section
        id="section-capabilities"
        style={{
          minHeight: '100vh',
          padding: isMobile ? '4rem 1.5rem' : '6rem 5%',
          backgroundColor: 'rgba(3,3,3,0.85)',
          backdropFilter: isMobile ? 'none' : 'blur(10px)',
          borderTop: '1px solid var(--border)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ScrollReveal style={{ width: '100%' }}>
          <div className="technical-label" style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
            SEC_04 // SKILLS_CONSTELLATION
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.15} style={{ width: '100%' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.8rem)', marginBottom: '1rem', color: '#ffffff', textAlign: 'center' }}>
            CORE CAPABILITIES
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={0.25} style={{ width: '100%' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--muted)',
            marginBottom: '3rem',
            maxWidth: '500px',
            fontWeight: 300,
            textAlign: 'center',
            marginInline: 'auto'
          }}>
            {isMobile ? 'Tap nodes within our technical constellation matrix to review sub-system specifications and technology structures.' : 'Hover nodes within our technical constellation matrix to review sub-system specifications and technology structures.'}
          </p>
        </ScrollReveal>

        {/* Responsive Interactive SVG Constellation Layout / Mobile Touch Grid */}
        <ScrollReveal delay={0.35} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {isMobile ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                pointerEvents: 'auto'
              }}
            >
              {/* Touch grid of nodes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.8rem',
                  width: '100%'
                }}
              >
                {CAPABILITIES.map((node) => {
                  const isActive = activeCapNode?.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => {
                        playClickSound();
                        setActiveCapNode(isActive ? null : node);
                      }}
                      style={{
                        border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                        padding: '1rem',
                        borderRadius: '12px',
                        backgroundColor: isActive ? 'rgba(214, 228, 255, 0.05)' : 'rgba(10,10,10,0.6)',
                        boxShadow: isActive ? '0 0 10px rgba(214, 228, 255, 0.15)' : 'none',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.3rem',
                        transition: 'all 0.25s'
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.52rem',
                        color: isActive ? 'var(--accent)' : 'var(--dim)',
                        letterSpacing: '0.05em'
                      }}>
                        NODE // {node.id.toUpperCase()}
                      </span>
                      <h4 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        color: '#ffffff',
                        fontWeight: 600
                      }}>
                        {node.name}
                      </h4>
                    </button>
                  );
                })}
              </div>

              {/* Readout panel under grid */}
              <div
                style={{
                  backgroundColor: 'rgba(10, 10, 10, 0.96)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.2rem 1.4rem',
                  minHeight: '75px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'opacity 0.3s'
                }}
              >
                {activeCapNode ? (
                  <>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.05em',
                      color: 'var(--accent)',
                      marginBottom: '0.2rem'
                    }}>
                      SPECIFICATION_READOUT // {activeCapNode.name}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.78rem',
                      lineHeight: '1.5',
                      color: 'var(--text)',
                      fontWeight: 300
                    }}>
                      {activeCapNode.desc}
                    </p>
                  </>
                ) : (
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    color: 'var(--dim)',
                    letterSpacing: '0.05em',
                    textAlign: 'center'
                  }}>
                    [ STANDBY — TAP NODES FOR MATRIX INFO ]
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                maxWidth: '820px',
                height: '580px', // extended height to fully show DATA VISUALIZATION and AUTOMATION nodes
                backgroundColor: 'rgba(3, 3, 3, 0.95)', // higher opacity for perfect capabilities visibility
                border: '1px solid var(--border)',
                borderRadius: '16px', // curved rounded corners
                position: 'relative',
                overflow: 'hidden',
                pointerEvents: 'auto',
                alignSelf: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Animated Glowing Laser Connection Paths */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
                {/* Draw connection paths between nodes - updated to high-visibility silver-blue and thicker paths */}
                <line x1="180" y1="100" x2="340" y2="240" stroke="rgba(214, 228, 255, 0.38)" strokeWidth="1.2" />
                <line x1="420" y1="120" x2="340" y2="240" stroke="rgba(214, 228, 255, 0.38)" strokeWidth="1.2" />
                <line x1="640" y1="220" x2="340" y2="240" stroke="rgba(214, 228, 255, 0.38)" strokeWidth="1.2" />
                <line x1="640" y1="220" x2="500" y2="380" stroke="rgba(214, 228, 255, 0.38)" strokeWidth="1.2" />
                <line x1="220" y1="340" x2="340" y2="240" stroke="rgba(214, 228, 255, 0.38)" strokeWidth="1.2" />
                <line x1="220" y1="340" x2="500" y2="380" stroke="rgba(214, 228, 255, 0.38)" strokeWidth="1.2" />
                <line x1="180" y1="100" x2="420" y2="120" stroke="rgba(214, 228, 255, 0.38)" strokeWidth="1.2" />

                {/* Glowing animated pulse lines */}
                <line
                  x1="180" y1="100" x2="340" y2="240"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeDasharray="8 30"
                  style={{ animation: 'laser-pulse 3s linear infinite' }}
                />
                <line
                  x1="640" y1="220" x2="340" y2="240"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeDasharray="8 30"
                  style={{ animation: 'laser-pulse 4s linear infinite reverse' }}
                />
              </svg>

              <style>{`
                @keyframes laser-pulse {
                  0% { stroke-dashoffset: 0; }
                  100% { stroke-dashoffset: -100; }
                }
              `}</style>

              {/* Render Nodes */}
              {CAPABILITIES.map((node) => {
                const isActive = activeCapNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onMouseEnter={() => {
                      playHoverSound();
                      setActiveCapNode(node);
                    }}
                    onMouseLeave={() => setActiveCapNode(null)}
                    data-cursor-text="INFO"
                    className="constellation-node"
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Node Ring */}
                    <div
                      style={{
                        width: isActive ? '14px' : '8px',
                        height: isActive ? '14px' : '8px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? '#ffffff' : 'var(--muted)',
                        border: isActive ? '3px solid rgba(255, 94, 0, 0.3)' : '1px solid transparent',
                        boxShadow: isActive ? '0 0 12px var(--accent)' : 'none',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />

                    {/* Node Text Label */}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.58rem',
                        letterSpacing: '0.08em',
                        color: isActive ? '#ffffff' : 'var(--muted)',
                        marginTop: '0.5rem',
                        whiteSpace: 'nowrap',
                        transition: 'color 0.2s'
                      }}
                    >
                      {node.name}
                    </span>
                  </button>
                );
              })}

              {/* Detail readout card inside panel */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.2rem',
                  left: '1.2rem',
                  right: '1.2rem',
                  backgroundColor: 'rgba(10, 10, 10, 0.96)', // high contrast
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.2rem 1.6rem',
                  minHeight: '75px',
                  borderRadius: '12px', // curved rounded corners
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  zIndex: 5,
                  opacity: activeCapNode ? 1 : 0.8,
                  transition: 'opacity 0.3s'
                }}
              >
                {activeCapNode ? (
                  <>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.05em',
                      color: 'var(--accent)',
                      marginBottom: '0.2rem'
                    }}>
                      SPECIFICATION_READOUT // {activeCapNode.name}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.78rem',
                      lineHeight: '1.5',
                      color: 'var(--text)',
                      fontWeight: 300
                    }}>
                      {activeCapNode.desc}
                    </p>
                  </>
                ) : (
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'var(--dim)',
                    letterSpacing: '0.05em',
                    textAlign: 'center'
                  }}>
                    [ STANDBY — HOVER NODES FOR MATRIX INFO ]
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* ────────────────── SECTION 05: SERVICES ────────────────── */}
      <section
        id="section-services"
        style={{
          minHeight: '100vh',
          padding: isMobile ? '4rem 1.5rem' : '6rem 5%',
          backgroundColor: 'rgba(3,3,3,0.88)',
          backdropFilter: isMobile ? 'none' : 'blur(12px)',
          borderTop: '1px solid var(--border)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <ScrollReveal>
          <div className="technical-label" style={{ marginBottom: '1.2rem' }}>
            SEC_05 // WORKSPACE_CAPACITY
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.15}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.8rem)', marginBottom: '1.5rem', color: '#ffffff' }}>
            SERVICES & CAPACITIES
          </h2>
        </ScrollReveal>

        {/* Vertical Interactive Services list */}
        <ScrollReveal delay={0.3}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '3.0rem',
              pointerEvents: 'auto',
              width: '100%'
            }}
          >
            {SERVICES.map((serv, index) => {
              const isHovered = hoveredServiceIdx === index;
              return (
                <div
                  key={serv.num}
                  onMouseEnter={() => {
                    setHoveredServiceIdx(index);
                    if (onHoverService) onHoverService(serv.type);
                  }}
                  onMouseLeave={() => {
                    setHoveredServiceIdx(null);
                    if (onHoverService) onHoverService(null);
                  }}
                  data-cursor-text="SERVICE"
                  style={{
                    borderBottom: '1px solid var(--border)',
                    padding: '2.0rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    opacity: hoveredServiceIdx !== null && !isHovered ? 0.25 : 1.0,
                    transform: isHovered ? 'translate3d(12px, 0, 30px) scale(1.01)' : 'translate3d(0, 0, 0)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    transformStyle: 'preserve-3d',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: isMobile ? '1rem' : '2rem' }}>
                    {/* Service Number */}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isHovered ? '1.05rem' : '0.72rem',
                        color: isHovered ? '#ffffff' : 'var(--muted)',
                        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'inline-block',
                        width: '32px'
                      }}
                    >
                      {serv.num}
                    </span>

                    {/* Service Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.1rem, 3.2vw, 1.8rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: isHovered ? '#ffffff' : 'var(--text)',
                        transform: isHovered ? 'translate3d(0, 0, 10px)' : 'translate3d(0, 0, 0)',
                        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {serv.title}
                    </h3>
                  </div>

                  {/* Description & specifications container (slides down) */}
                  <div
                    style={{
                      maxHeight: isHovered ? (isMobile ? '350px' : '240px') : '0px',
                      opacity: isHovered ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      paddingLeft: isMobile ? '1.5rem' : '3.8rem',
                      maxWidth: '750px'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.86rem',
                        lineHeight: 1.7,
                        color: '#ffffff', // pure bright white
                        fontWeight: 400,   // slightly higher weight for perfect readability
                        marginBottom: '1.2rem'
                      }}
                    >
                      {serv.desc}
                    </p>

                    {/* Bullet tags inside hovered description */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {serv.details.map((det) => (
                        <span
                          key={det}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.58rem',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '0.18rem 0.5rem',
                            borderRadius: '12px', // curved rounded corners
                            backgroundColor: 'rgba(255, 255, 255, 0.02)'
                          }}
                        >
                          {det}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ────────────────── SERVICE CTA ────────────────── */}
        <ScrollReveal delay={0.45}>
          <div
            style={{
              marginTop: '5rem',
              borderTop: '1px dashed var(--border)',
              paddingTop: '3.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              pointerEvents: 'auto'
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}
            >
              NEED SOMETHING CUSTOM?
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.86rem',
                color: 'var(--muted)',
                marginBottom: '2.0rem',
                fontWeight: 300
              }}
            >
              Tell us what you're trying to build. We'll figure out the technology behind it.
            </p>
            <button
              onClick={() => onNavigate(5)} // scroll to contact section
              data-cursor-text="CONTACT"
              className="glow-text"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '1.0rem 2.8rem',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderRadius: '8px', // curved rounded corners
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 16px rgba(255, 255, 255, 0.25)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.4)';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              START A PROJECT <ArrowRight size={15} />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ────────────────── SECTION 06: CONTACT (SPACE BLACKOUT) ────────────────── */}
      <section
        id="section-contact"
        style={{
          minHeight: '100vh',
          padding: isMobile ? '6rem 1.5rem 4rem 1.5rem' : '8rem 5% 4rem 5%',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        <div style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          pointerEvents: 'auto'
        }}>
          <ScrollReveal>
            <div className="technical-label" style={{ marginBottom: '1.5rem' }}>
              SEC_06 // INITIATE_CONTACT
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 style={{
              fontSize: 'clamp(2.0rem, 7vw, 5.2rem)',
              lineHeight: 0.95,
              marginBottom: '2.5rem',
              color: '#ffffff'
            }}>
              READY TO BUILD SOMETHING IMPOSSIBLE?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <a
              href="https://wa.me/918344581155"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              data-cursor-text="WHATSAPP"
              className="glow-text"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '1.1rem 3rem',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderRadius: '8px', // curved rounded corners
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 16px rgba(255, 255, 255, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 255, 255, 0.25)';
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '0.2rem' }}>
                <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.908.533 3.75 1.547 5.385L2 22l4.757-1.503c1.55.972 3.324 1.507 5.247 1.507 5.524 0 10.004-4.48 10.004-10.004C22.008 6.48 17.528 2 12.004 2zm0 1.833c4.505 0 8.17 3.666 8.17 8.17 0 4.506-3.665 8.171-8.17 8.171-1.636 0-3.155-.487-4.437-1.326l-.317-.208-2.697.852.868-2.613-.231-.338A8.125 8.125 0 013.837 12c0-4.504 3.665-8.167 8.167-8.167zm-2.022 3.4c-.167 0-.323.018-.466.05-.289.068-.535.247-.7.502-.164.256-.475.845-.475 1.956 0 1.258.916 2.47 1.047 2.65 1.332 1.83 2.87 2.94 4.504 3.513.622.217 1.108.273 1.507.247.439-.03 1.348-.55 1.538-1.082.19-.533.19-.99.133-1.082-.057-.091-.21-.148-.44-.262-.23-.114-1.348-.666-1.557-.742-.21-.076-.36-.114-.513.114-.152.228-.59.742-.723.895-.133.152-.266.171-.495.057-.23-.114-.967-.356-1.84-1.135-.68-.607-1.139-1.356-1.272-1.585-.133-.228-.014-.352.1-.466.104-.103.23-.266.342-.4.114-.133.152-.228.228-.38.076-.153.038-.286-.019-.4-.057-.114-.513-1.237-.704-1.694-.186-.446-.375-.385-.515-.393l-.439-.008z"/>
              </svg>
              MESSAGE ON WHATSAPP
            </a>
          </ScrollReveal>
        </div>

        {/* ────────────────── FOOTER READOUT ────────────────── */}
        <ScrollReveal delay={0.45}>
          <footer
            style={{
              borderTop: '1px solid rgba(255,255,255,0.03)',
              paddingTop: '2.5rem',
              marginTop: '5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              pointerEvents: 'auto'
            }}
          >
            {/* Metadata details */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--dim)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span>LATITUDE_CORRELATE: 13.0827° N, 80.2707° E</span>
              <span>SYSTEMS ONLINE // DEPLOYMENT_SECURE</span>
              <span>© {new Date().getFullYear()} ZQYRIX. ALL RIGHTS RESERVED.</span>
            </div>

            {/* Social connections */}
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a
                href="mailto:zqyrix@gmail.com"
                data-cursor-text="EMAIL"
                onClick={playClickSound}
                style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              >
                <Mail size={18} />
              </a>
              <a
                href="https://github.com/zqyrix"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-text="GITHUB"
                onClick={playClickSound}
                style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              >
                <GithubIcon size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-text="LINKEDIN"
                onClick={playClickSound}
                style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href="https://instagram.com/zqyrix"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-text="INSTAGRAM"
                onClick={playClickSound}
                style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </footer>
        </ScrollReveal>
      </section>

      {/* ────────────────── WORK DETAIL MODAL ────────────────── */}
      {selectedProject && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(15px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            pointerEvents: 'auto'
          }}
        >
          <div
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid var(--border)',
              borderRadius: '16px', // curved rounded corners
              maxWidth: '650px',
              width: '100%',
              padding: '2.5rem 2rem',
              position: 'relative',
              boxShadow: '0 0 35px rgba(255, 94, 0, 0.08)'
            }}
          >
            {/* Close Close Button */}
            <button
              onClick={() => { playClickSound(); setSelectedProject(null); }}
              data-cursor-text="CLOSE"
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                color: 'var(--muted)',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              color: 'var(--dim)',
              marginBottom: '1rem'
            }}>
              PROJECT_READOUT_CALIBRATED // {selectedProject.id}
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.4rem',
              letterSpacing: '-0.02em'
            }}>
              {selectedProject.name}
            </h2>

            {/* Tagline */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--accent)',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem'
            }}>
              {selectedProject.tagline}
            </div>

            {/* In-depth details */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.92rem',
              lineHeight: 1.7,
              color: '#d5d5d5',
              fontWeight: 300,
              marginBottom: '1.8rem'
            }}>
              {selectedProject.details}
            </p>

            {/* Full Tech Specs */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--muted)',
                letterSpacing: '0.08em',
                marginBottom: '0.6rem'
              }}>
                SPECIFIED_COMPILERS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedProject.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: '#ffffff',
                      border: '1px solid var(--border)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255,255,255,0.02)'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer action links */}
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                data-cursor-text="GITHUB"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text)',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  paddingBottom: '0.2rem',
                  transition: 'border-color 0.25s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              >
                ACCESS SOURCE CODE <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
