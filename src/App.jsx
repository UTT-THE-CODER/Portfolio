import React, { useEffect, useRef, useState } from "react";

const navigation = [
  ["Home", "Home"],
  ["About", "About"],
  ["Skills", "Skills"],
  ["Projects", "Projects"],
  ["Contact", "Contact"],
];

const skills = [
  ["fa-brands fa-html5", "HTML"],
  ["fa-brands fa-css3-alt", "CSS"],
  ["fa-brands fa-js", "JAVASCRIPT"],
  ["fa-brands fa-react", "REACT"],
  ["fa-brands fa-git-alt", "GIT"],
  ["fa-brands fa-figma", "FIGMA"],
  ["fa-brands fa-node-js", "NODEJS"],
  ["fa-solid fa-fire", "FIREBASE"],
];

const projects = [
  {
    image: "/assets/preview2.png",
    imageAlt: "Productivity Operating System project",
    title: "POS-Productivity opreating system",
    description:
      "A productivity platform built with React and Tailwind CSS that combines task management, priority planning, Pomodoro focus sessions, collaborative study rooms, and team task assignment into a single application.",
    technologies: [
      "React",
      "JavaScript",
      "Tailwind CSS",
      "React Router",
      "Local Storage",
      "Git",
      "GitHub",
    ],
    demo: "https://productivity-operating-system.vercel.app",
    repository: "https://github.com/UTT-THE-CODER/Productivity-operating-system",
  },
  {
    image: "/assets/preview1.png",
    imageAlt: "Currency Converter project",
    title: "Currency Converter",
    description:
      "A modern and responsive currency converter built using React and real-time exchange rate APIs. Features dynamic currency conversion, currency swapping, reusable components, custom hooks, and a clean fintech-style UI.",
    technologies: ["React", "JavaScript", "Tailwind CSS", "API"],
    demo: "https://agent-6a1e7339f716fb28b5--currency-converter-utt.netlify.app/",
    repository: "https://github.com/UTT-THE-CODER/currency-converter",
  },
  {
    image: "/assets/preview.png",
    imageAlt: "Pokédex project",
    title: "Pokédex Web App",
    description:
      "A responsive Pokédex web app built using Vanilla JavaScript and PokéAPI. Features dynamic Pokémon search, type badges, loading states, responsive UI, and interactive animations.",
    technologies: ["HTML", "CSS", "JavaScript", "PokeAPI"],
    demo: "https://pokemon-fetcher-gamma.vercel.app/",
    repository: "https://github.com/UTT-THE-CODER/Pokemon-fetcher",
  },
];

function InteractiveSurface({ as: Element = "a", className, children, ...props }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const nextRippleId = useRef(0);
  const timers = useRef(new Set());

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 8,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 8,
    });
    props.onMouseMove?.(event);
  }

  function handleClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const id = nextRippleId.current++;
    setRipples((current) => [
      ...current,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
    }, 600);
    timers.current.add(timer);
    props.onClick?.(event);
  }

  const { onMouseMove, onMouseLeave, onClick, style, ...elementProps } = props;

  return (
    <Element
      {...elementProps}
      className={className}
      style={{
        ...style,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${offset.x || offset.y ? 1.02 : 1})`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={(event) => {
        setOffset({ x: 0, y: 0 });
        onMouseLeave?.(event);
      }}
      onClick={handleClick}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          aria-hidden="true"
          className="ripple"
          key={ripple.id}
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </Element>
  );
}

function TypingText() {
  const [text, setText] = useState("");

  useEffect(() => {
    const words = ["Frontend Developer", "Creative Coder", "UI Enthusiast", "React Learner"];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    function typeNext() {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex += 1;
        setText(word.substring(0, charIndex));
        if (charIndex > word.length) {
          deleting = true;
          timer = window.setTimeout(typeNext, 1000);
          return;
        }
      } else {
        charIndex -= 1;
        setText(word.substring(0, charIndex));
        if (charIndex < 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      timer = window.setTimeout(typeNext, deleting ? 60 : 120);
    }

    timer = window.setTimeout(typeNext, 120);
    return () => window.clearTimeout(timer);
  }, []);

  return <span className="typing">{text}</span>;
}

function App() {
  const [activeSection, setActiveSection] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transitionVisible, setTransitionVisible] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });
  const cursorGlowRef = useRef(null);
  const popupTimer = useRef(null);
  const transitionTimer = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
      setTransitionVisible(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let ticking = false;

    function updateOnScroll() {
      const { scrollY } = window;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollY > 24);
      setShowScrollTop(scrollY > 600);
      setScrollPercent(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);

      const sections = document.querySelectorAll("section[id]");
      let currentSection = "Home";
      sections.forEach((section) => {
        if (scrollY + 150 >= section.offsetTop) currentSection = section.id;
      });
      setActiveSection(currentSection);
      ticking = false;
    }

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    }

    updateOnScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((element) => element.classList.add("active"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -90px 0px" },
    );
    reveals.forEach((element, index) => {
      element.style.transitionDelay = `${index * 70}ms`;
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || !cursorGlowRef.current) {
      return undefined;
    }

    let frame;
    function handlePointerMove(event) {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (cursorGlowRef.current) {
          cursorGlowRef.current.style.left = `${event.clientX}px`;
          cursorGlowRef.current.style.top = `${event.clientY}px`;
        }
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(popupTimer.current);
      window.clearTimeout(transitionTimer.current);
    },
    [],
  );

  function handleNavigationClick() {
    setMenuOpen(false);
    setTransitionVisible(true);
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => setTransitionVisible(false), 220);
  }

  function handleContactSubmit(event) {
    event.preventDefault();
    event.currentTarget.reset();
    setPopupVisible(true);
    window.clearTimeout(popupTimer.current);
    popupTimer.current = window.setTimeout(() => setPopupVisible(false), 3000);
  }

  function handleHeroPointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setHeroOffset({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 10,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 10,
    });
  }

  return (
    <>
      <div className={`loading-screen${loading ? "" : " hide"}`} aria-hidden="true">
        <div className="loading-ring" />
        <p>Loading experience</p>
      </div>
      <div
        className={`page-transition${transitionVisible ? "" : " hide"}`}
        aria-hidden="true"
      />
      <div className="scroll-bar" style={{ width: `${scrollPercent}%` }} />
      <div className="cursor-glow" aria-hidden="true" ref={cursorGlowRef} />
      <button
        className={`scroll-top${showScrollTop ? " show" : ""}`}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fa-solid fa-arrow-up" />
      </button>

      <nav className={`navbar${scrolled ? " scrolled" : ""}`} aria-label="Main navigation">
        <h1 className="Logo">Uttkarsh Lawania</h1>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`list${menuOpen ? " open" : ""}`}>
          {navigation.map(([label, id]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? "active" : undefined}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={handleNavigationClick}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <section
          className="Hero_Section"
          id="Home"
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={() => setHeroOffset({ x: 0, y: 0 })}
        >
          <div className="hero-mesh" aria-hidden="true">
            <span className="particle p1" />
            <span className="particle p2" />
            <span className="particle p3" />
            <span className="particle p4" />
          </div>
          <div
            className="content reveal"
            style={{
              transform: `translate3d(${heroOffset.x * 0.85}px, ${heroOffset.y * 0.85}px, 0)`,
            }}
          >
            <h3>Hello there</h3>
            <h1>
              I&apos;m <span>Uttkarsh</span>
            </h1>
            <p>
              <TypingText />
              <br />
              building modern and interactive web experiences.
            </p>
            <div className="buttons">
              <InteractiveSurface
                href="#Projects"
                className="btn1"
                onClick={handleNavigationClick}
              >
                View Projects
              </InteractiveSurface>
              <InteractiveSurface
                href="#Contact"
                className="btn2"
                onClick={handleNavigationClick}
              >
                Contact Me
              </InteractiveSurface>
            </div>
          </div>
          <div
            className="hero-image reveal"
            style={{
              transform: `translate3d(${heroOffset.x * -0.95}px, ${heroOffset.y * -0.95}px, 0)`,
            }}
          >
            <div className="circle">
              <img src="/sample.jpg" alt="Uttkarsh" />
            </div>
          </div>
          <div
            className="hero-orb orb-one"
            style={{
              transform: `translate3d(${heroOffset.x * 0.45}px, ${heroOffset.y * 0.45}px, 0)`,
            }}
          />
          <div
            className="hero-orb orb-two"
            style={{
              transform: `translate3d(${heroOffset.x * 0.9}px, ${heroOffset.y * 0.9}px, 0)`,
            }}
          />
          <div className="scroll-indicator">
            <span />
            <p>Scroll</p>
          </div>
        </section>

        <section className="About_Me reveal" id="About">
          <div className="img">
            <div className="side-card">
              <h1 className="card">Code.</h1>
              <h1 className="card">Create.</h1>
              <h1 className="card">Innovate.</h1>
            </div>
          </div>
          <div className="about-content">
            <h3>About Me</h3>
            <h1>
              Passionate Developer <span>&amp;</span> Creative Thinker
            </h1>
            <p>
              I’m Uttkarsh, a BTech student passionate about frontend development and currently
              expanding into full-stack development with Node.js, Express, and databases. I enjoy
              learning new technologies and turning ideas into real-world projects.
            </p>
            <div className="about-stats">
              <div className="stat">
                <h2>4</h2>
                <p>Projects</p>
              </div>
              <div className="stat">
                <h2>2+</h2>
                <p>Years Learning</p>
              </div>
              <div className="stat">
                <h2>∞</h2>
                <p>Ideas</p>
              </div>
            </div>
          </div>
        </section>

        <section id="Skills">
          <h1 className="heading">Skills</h1>
          <h4 className="info">Technologies &amp; Tools I Use</h4>
          <div className="Skills">
            {skills.map(([icon, label]) => (
              <div className="skill reveal" key={label}>
                <i className={icon} />
                <p>{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="Projects" id="Projects">
          <h1 className="project-heading">Projects</h1>
          {projects.map((project) => (
            <article className="project-card reveal" key={project.title}>
              <img src={project.image} alt={project.imageAlt} />
              <div className="project-content">
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                <div className="project-buttons">
                  <InteractiveSurface
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} live demo (opens in a new tab)`}
                  >
                    Live Demo
                  </InteractiveSurface>
                  <InteractiveSurface
                    href={project.repository}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} GitHub repository (opens in a new tab)`}
                  >
                    GitHub
                  </InteractiveSurface>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="Contact" id="Contact">
          <h1 className="contact-head">Contact Me</h1>
          <p className="contact-content">Let&apos;s build something together</p>
          <form className="contact-card" onSubmit={handleContactSubmit}>
            <label className="contact-detail" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your Name"
              required
              pattern="[A-Za-z ]+"
              title="Only letters are allowed"
            />
            <label className="contact-detail" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Your Email"
              required
            />
            <label className="contact-detail" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Your Message"
              required
            />
            <InteractiveSurface as="button" type="submit">
              Send Message
            </InteractiveSurface>
            <div
              className={`popup${popupVisible ? " show" : ""}`}
              role="status"
              aria-live="polite"
            >
              Message Sent Successfully
            </div>
          </form>

          <div className="card-container">
            <InteractiveSurface
              href="https://github.com/UTT-THE-CODER"
              target="_blank"
              rel="noreferrer"
              className="contacts"
            >
              <i className="fa-brands fa-github" />
              <h2>GitHub</h2>
              <p>Check Out My Projects</p>
            </InteractiveSurface>
            <InteractiveSurface
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noreferrer"
              className="contacts"
            >
              <i className="fa-brands fa-linkedin" />
              <h2>LinkedIn</h2>
              <p>Let&apos;s Connect Professionally</p>
            </InteractiveSurface>
            <InteractiveSurface href="mailto:lawaniauttkarsh@gmail.com" className="contacts">
              <i className="fa-solid fa-envelope" />
              <h2>Email</h2>
              <p>Reach Out Anytime</p>
            </InteractiveSurface>
            <InteractiveSurface href="/resume.pdf" download className="contacts">
              <i className="fa-solid fa-download" />
              <h2>Resume</h2>
              <p>Download My Resume</p>
            </InteractiveSurface>
          </div>
        </section>
      </main>

      <footer className="footer">
        <h2>Uttkarsh Lawania</h2>
        <p>Frontend Developer • UI Enthusiast • Creative Coder</p>
        <div className="footer-links">
          <a href="https://github.com/UTT-THE-CODER" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:lawaniauttkarsh@gmail.com">Email</a>
        </div>
        <p className="copyright">© 2026 Uttkarsh • Built with React &amp; CSS</p>
      </footer>
    </>
  );
}

export default App;
