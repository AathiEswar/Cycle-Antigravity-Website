import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';
import {
  ArrowRight, ArrowUpRight, Bike as BikeIcon, MapPin, Menu, X,
  Instagram, Twitter, Zap, ShieldCheck, Wrench, Clock, Users,
  Coffee, ChevronRight, Phone
} from 'lucide-react';
import siteContent from './contents/siteContent.json';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- ICON MAPPING ---
const ICON_MAP = {
  Zap: <Zap className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  Bike: <BikeIcon className="w-6 h-6" />
};

// --- UTILS ---
const Magnetic = ({ children }: { children: React.ReactElement<any> }) => {
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!magnetic.current) return;
    const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const mouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = magnetic.current!.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    }

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    }

    magnetic.current?.addEventListener("mousemove", mouseMove);
    magnetic.current?.addEventListener("mouseleave", mouseLeave);

    return () => {
      magnetic.current?.removeEventListener("mousemove", mouseMove);
      magnetic.current?.removeEventListener("mouseleave", mouseLeave);
    }
  }, []);

  return React.cloneElement(children, { ref: magnetic } as any);
}

// --- COMPONENTS ---

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // ScrollTrigger integration
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }, []);
  return null;
}

const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const posX = e.clientX;
      const posY = e.clientY;

      if (cursorDotRef.current) gsap.to(cursorDotRef.current, { x: posX, y: posY, duration: 0 });
      if (cursorOutlineRef.current) gsap.to(cursorOutlineRef.current, { x: posX, y: posY, duration: 0.15 });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className="cursor-dot hidden md:block fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 bg-track-green rounded-full mix-blend-difference"></div>
      <div ref={cursorOutlineRef} className="cursor-outline hidden md:block fixed top-0 left-0 pointer-events-none z-[9999] w-10 h-10 border border-track-green/50 rounded-full mix-blend-difference bg-blend-difference"></div>
    </>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: 0, duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      } else {
        gsap.to(window, { duration: 1.8, scrollTo: element, ease: "power4.inOut" });
      }
    }
    setIsOpen(false);
  };

  useLayoutEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, { height: "100vh", duration: 1, ease: "expo.inOut" });
      gsap.fromTo(".mobile-link",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(menuRef.current, { height: "0vh", duration: 0.8, ease: "expo.inOut" });
    }
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center mix-blend-difference text-white">
        <div
          className="font-display font-bold text-2xl tracking-tighter cursor-pointer overflow-hidden group"
          onClick={() => scrollToSection('home')}
        >
          <span className="inline-block group-hover:-translate-y-full transition-transform duration-500">TRACK AND TRIAL.</span>
        </div>

        <div className="hidden md:flex gap-12 items-center">
          {siteContent.navbar.links.map(link => (
            <button
              onClick={() => scrollToSection(link.toLowerCase())}
              key={link}
              className="font-tech text-sm uppercase hover:text-track-green transition-colors font-bold opacity-60 hover:opacity-100"
            >
              {link}
            </button>
          ))}
          {/* <Magnetic>
            <button className="border border-white/10 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all hover:border-white">
              {siteContent.navbar.buttonText}
            </button>
          </Magnetic> */}
        </div>

        <button className="md:hidden z-50 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-full h-0 bg-track-dark z-40 overflow-hidden flex flex-col items-center justify-center"
      >
        <div className="flex flex-col items-center gap-10">
          {siteContent.navbar.links.map((link, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(link.toLowerCase())}
              className="mobile-link text-5xl md:text-7xl font-display font-bold uppercase text-white hover:text-track-green transition-colors"
            >
              {link}
            </button>
          ))}
          {/* <button className="mobile-link mt-10 bg-track-green text-black px-12 py-5 rounded-full font-bold uppercase text-xs tracking-[0.3em]">
            {siteContent.navbar.buttonText}
          </button> */}
        </div>
      </div>
    </>
  );
};

const ImmersiveIntro = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".intro-line", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
      });

      gsap.to(".intro-bg-img", {
        scale: 1.1,
        duration: 10,
        ease: "none",
        repeat: -1,
        yoyo: true
      });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="h-screen w-full bg-track-dark flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <img
          src={siteContent.intro.backgroundImage}
          className="intro-bg-img w-full h-full object-cover opacity-40"
          alt="Intro Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-track-dark via-transparent to-track-dark"></div>
      </div>
      <div className="relative z-10 text-center px-6">
        <h2 className="intro-line text-5xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter text-white leading-none uppercase max-w-5xl mx-auto">
          {siteContent.intro.title}
        </h2>
        <p className="intro-line mt-10 font-tech text-track-green text-sm md:text-xl uppercase tracking-[0.5em] font-bold">
          {siteContent.intro.tagline}
        </p>
      </div>
      <div className="intro-line absolute bottom-12 flex flex-col items-center gap-4 opacity-40">
        <span className="font-tech text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-track-green animate-scroll-indicator"></div>
        </div>
      </div>
    </section>
  );
};

const PhilosophySection = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".philosophy-line", {
        x: -100,
        opacity: 0,
        stagger: 0.3,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
          end: "bottom 20%",
          scrub: 1
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" ref={container} className="min-h-screen bg-track-dark py-40 flex items-center">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-20">
        <div className="flex-1">
          <p className="text-track-green font-tech text-xs uppercase tracking-[0.4em] mb-10 font-bold">{siteContent.philosophy.badge}</p>
          <div className="space-y-4">
            {siteContent.philosophy.lines.map((line, i) => (
              <h2 key={i} className="philosophy-line text-6xl md:text-9xl font-display font-bold text-white tracking-tighter leading-none uppercase">
                {line}
              </h2>
            ))}
          </div>
        </div>
        <div className="max-w-md mt-20 md:mt-auto">
          <p className="font-tech text-white/80 text-xl md:text-2xl leading-relaxed">
            {siteContent.philosophy.description}
          </p>
          <div className="mt-12 w-20 h-px bg-track-green/30"></div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".hero-bg", {
        scale: 1.15,
        scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: true }
      });
      gsap.from(".hero-content > *", {
        y: 40, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 60%" }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-track-dark border-y border-white/5">
      <div className="absolute inset-0 z-0">
        <img
          src={siteContent.hero.backgroundImage}
          className="hero-bg w-full h-full object-cover opacity-50 grayscale"
          alt="Hero Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-track-dark via-transparent to-track-dark" />
      </div>

      <div className="z-10 text-center text-white hero-content px-6">
        <h1 className="font-display text-[12vw] leading-[0.85] font-bold tracking-tighter uppercase">
          {siteContent.hero.title.part1} <span className="text-track-green">{siteContent.hero.title.part2}</span>
        </h1>
        <div className="mt-12 max-w-xl mx-auto flex items-center justify-center gap-6">
          <div className="w-12 h-px bg-white/20"></div>
          <p className="font-tech text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] font-bold">
            {siteContent.hero.tagline}
          </p>
          <div className="w-12 h-px bg-white/20"></div>
        </div>
      </div>
    </section>
  );
};

const CraftedDetail = () => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".detail-text-item", {
        y: 50, opacity: 0, duration: 1.5, stagger: 0.3, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 60%" }
      });
      gsap.to(".detail-img", {
        scale: 1.1,
        yPercent: -10,
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
      })
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-40 md:py-20 bg-track-dark relative overflow-hidden text-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-24 items-center">
        <div className="md:col-span-5 z-10">
          <div className="detail-text-item mb-12">
            <span className="text-track-green font-tech text-[10px] uppercase tracking-[0.5em] font-bold block mb-6">{siteContent.craftedDetail.badge}</span>
            <h2 className="text-5xl md:text-8xl font-display text-white mt-4 font-bold leading-[0.9] uppercase tracking-tighter">
              {siteContent.craftedDetail.title.split("<br />").map((line, i) => (
                <React.Fragment key={i}>{line} <br /></React.Fragment>
              ))}
            </h2>
          </div>
          <div className="detail-text-item max-w-md">
            <p className="text-white/70 font-tech text-lg leading-relaxed">
              {siteContent.craftedDetail.description}
            </p>
            <div className="mt-16 grid grid-cols-2 gap-12">
              {siteContent.craftedDetail.stats.map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <h4 className="text-4xl font-display text-white group-hover:text-track-green transition-colors duration-500">
                    {stat.value.replace(/[a-z%]/g, "")}<span className="text-track-green text-xl">{stat.value.match(/[a-z%]/g)}</span>
                  </h4>
                  <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold font-tech">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-7 relative">
          <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden w-full relative group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <img
              src={siteContent.craftedDetail.image}
              className="detail-img w-full h-[120%] object-cover grayscale opacity-70 hover:grayscale-0 transition-all duration-[2000ms]"
              alt="Engineering Detail"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-track-dark/60 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

const ProductShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const trigger = triggerRef.current;
      if (!section || !trigger) return;

      const getScrollAmount = () => {
        return -(section.scrollWidth - window.innerWidth);
      };

      gsap.to(section, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: () => `+=${section.scrollWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        }
      });
    }, triggerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="bikes" ref={triggerRef} className="h-screen bg-track-charcoal overflow-hidden relative">
      <div className="mix-blend-difference absolute top-20 left-6 md:left-12 z-10">
        {/* <p className="text-track-green font-tech text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Discovery</p> */}
        <h2 className="text-white font-display text-5xl md:text-7xl uppercase font-bold tracking-tighter leading-none">The <br /> Collection</h2>
      </div>

      <div ref={sectionRef} className="flex h-screen items-center pl-6 md:pl-[30vw] pr-6 md:pr-[20vw] gap-20 md:gap-[10vw] w-fit">
        {siteContent.bikes.map((bike) => (
          <div key={bike.id} className="relative group w-[75vw] md:w-[45vw] flex-shrink-0">
            <div className="aspect-[16/10] overflow-hidden grayscale-0 md:grayscale group-hover:grayscale-0 transition-all duration-[1000ms] bg-track-dark border border-white/5">
              <img src={bike.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={bike.name} />
            </div>
            <div className="mt-8 flex justify-between items-start">
              <div className="max-w-[70%]">
                <h3 className="text-2xl md:text-5xl font-display text-white font-bold uppercase tracking-tighter leading-none mb-3">{bike.name}</h3>
                <p className="text-white/60 font-tech text-xs uppercase tracking-[0.3em] font-bold">{bike.category}</p>
                <p className="text-white/40 font-tech text-[10px] mt-4 uppercase leading-relaxed max-w-xs">{bike.tagline}</p>
              </div>
              <p className="text-track-green font-tech text-xl md:text-3xl font-bold tracking-tighter">{bike.price}</p>
            </div>
            <div className="absolute bottom-10 right-0 translate-y-full md:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-4 text-white font-tech text-[10px] uppercase tracking-[0.3em] font-bold hover:text-track-green cursor-pointer">
                View Details <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
        <div className="w-[50vw] md:w-[40vw] flex-shrink-0 flex items-center justify-center">
          <div className="group cursor-pointer text-center relative">
            <span className="block text-track-green font-tech text-[10px] uppercase tracking-[0.5em] font-bold mb-6 opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
            <h3 className="text-6xl md:text-9xl font-display text-white/5 group-hover:text-white transition-all duration-700 font-bold tracking-tighter scale-90 group-hover:scale-100">
              LATEST <br /> RELEASES
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

const LifestyleBreak = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".lifestyle-img", {
        yPercent: 30,
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
      gsap.from(".lifestyle-title", {
        y: 100, opacity: 0, duration: 2, ease: "power4.out",
        scrollTrigger: { trigger: container.current, start: "top 40%" }
      })
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={container} className="h-screen w-full relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src={siteContent.lifestyleBreak.image}
          className="lifestyle-img w-full h-[140%] object-cover -mt-[20%]"
          alt="Lifestyle Landscape"
        />
        <div className="absolute inset-0 bg-black/60 blend-multiply"></div>
      </div>
      <div className="relative z-10 text-center px-6">
        <h2 className="lifestyle-title text-7xl md:text-[12vw] font-display text-white font-bold tracking-tighter leading-none uppercase mix-blend-overlay">
          {siteContent.lifestyleBreak.title[0]} <br /> {siteContent.lifestyleBreak.title[1]}
        </h2>
      </div>
    </section>
  )
}

const Specs = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".spec-card", {
        y: 80,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: container.current, start: "top 70%" }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="tech" ref={container} className="py-40 bg-track-dark relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-0 w-full h-w bg-[radial-gradient(circle_at_0%_0%,rgba(212,255,0,0.03)_0%,transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-32">
          <p className="text-track-green font-tech text-[10px] uppercase tracking-[0.5em] mb-6 font-bold">{siteContent.specs.badge}</p>
          <h2 className="text-5xl md:text-[5rem] font-display font-bold uppercase tracking-tighter text-white leading-none">
            {siteContent.specs.title.split(" ")[0]} <br /> <span className="text-track-green text-[0.8em]">{siteContent.specs.title.split(" ")[1]}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {siteContent.specs.features.map((f, i) => (
            <div key={i} className="spec-card group relative p-16 border border-white/5 hover:bg-white/[0.02] transition-colors duration-1000 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-0 translate-x-4 -translate-y-4 group-hover:opacity-40 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700 text-track-green">
                <ArrowUpRight className="w-8 h-8" />
              </div>

              <div className="mb-12 p-6 bg-track-charcoal w-fit rounded-full text-track-green group-hover:bg-track-green group-hover:text-black transition-all duration-700 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                {ICON_MAP[f.icon as keyof typeof ICON_MAP]}
              </div>

              <h3 className="text-3xl font-display text-white uppercase mb-6 tracking-tight font-bold">{f.title}</h3>
              <p className="text-white/70 font-tech text-base leading-relaxed group-hover:text-white transition-colors duration-700">
                {f.description}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-track-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TrustSection = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const stats = document.querySelectorAll(".trust-stat-val");
      stats.forEach(stat => {
        const value = parseInt(stat.getAttribute("data-val") || "0");
        gsap.fromTo(stat, { innerText: 0 }, {
          innerText: value,
          duration: 3,
          ease: "power2.out",
          scrollTrigger: { trigger: stat, start: "top 90%" },
          snap: { innerText: 1 },
          onUpdate: function () {
            stat.innerHTML = Math.ceil(Number(this.targets()[0].innerText)) + (stat.getAttribute("data-suffix") || "");
          }
        });
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="trust" ref={container} className="py-40 bg-track-dark border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-20">
          <div className="flex-1">
            <p className="text-track-green font-tech text-[10px] uppercase tracking-[0.5em] mb-6 font-bold">{siteContent.trust.badge}</p>
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-white leading-none">THE <br /> STANDARD.</h2>
          </div>
          <div className="flex-[2] grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32 w-full">
            {siteContent.trust.stats.map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <h4 className="trust-stat-val text-6xl md:text-8xl font-display text-white font-bold tracking-tighter"
                  data-val={stat.value.replace(/\D/g, "")}
                  data-suffix={stat.value.match(/\D/g)?.join("")}>
                  0
                </h4>
                <p className="text-white/60 font-tech text-[11px] uppercase tracking-[0.3em] font-bold mt-4">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const StoreCommunity = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".community-header > *", {
        y: 40, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: container.current, start: "top 70%" }
      });
      gsap.from(".community-item", {
        y: 100, opacity: 0, scale: 0.8, stagger: 0.2, duration: 1.5, ease: "expo.out",
        scrollTrigger: { trigger: ".community-grid", start: "top 80%" }
      })
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="community" ref={container} className="py-40 bg-track-charcoal text-white overflow-hidden relative">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="community-header flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
          <div className="max-w-3xl">
            <h2 className="text-7xl md:text-[10rem] font-display font-bold uppercase tracking-tighter leading-[0.8]">CLUBHOUSE<span className="text-track-green">.</span></h2>
            <p className="font-tech text-white/70 mt-12 max-w-xl text-xl md:text-2xl leading-relaxed font-light italic">
              {siteContent.community.description}
            </p>
          </div>
          <div className="hidden md:block pb-5">
            <Magnetic>
              <button className="flex items-center gap-4 border-2 border-track-green text-track-green px-12 py-5 rounded-full hover:bg-track-green hover:text-black transition-all font-tech uppercase text-xs font-bold tracking-[0.3em]">
                Visit Atmosphere <ArrowUpRight className="w-5 h-5" />
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="community-grid grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[120vh]">
          <div className="community-item md:col-span-8 group relative overflow-hidden bg-track-dark shadow-2xl">
            <img src={siteContent.community.items[0].src} className="w-full h-full object-cover group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1500ms]" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 z-10 transition-all duration-700 group-hover:translate-x-4">
              <p className="text-track-green font-tech text-xs uppercase tracking-[0.3em] mb-4 font-bold">{siteContent.community.items[0].subtitle}</p>
              <h3 className="text-4xl md:text-6xl font-display uppercase font-bold tracking-tighter leading-none">{siteContent.community.items[0].title}</h3>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-8">
            {siteContent.community.items.slice(1).map((img, i) => (
              <div key={i} className="community-item flex-1 group relative overflow-hidden bg-track-dark shadow-2xl">
                <img src={img.src} className="w-full h-full object-cover group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1500ms]" alt="" />
                <div className="absolute inset-0 bg-black/40 group-hover:opacity-0 transition-opacity"></div>
                <div className="absolute bottom-8 left-8 z-10 transition-all duration-700 group-hover:translate-x-2">
                  <p className="text-track-green font-tech text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">{img.subtitle}</p>
                  <h3 className="text-2xl font-display uppercase font-bold tracking-tighter leading-none">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const ContactSection = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        y: 100, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power4.out",
        scrollTrigger: { trigger: container.current, start: "top 70%" }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={container} className="py-60 bg-track-dark relative overflow-hidden text-white">
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-track-green/[0.03] blur-[200px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <p className="contact-reveal text-track-green font-tech text-xs uppercase tracking-[0.5em] mb-10 font-bold">{siteContent.contact.badge}</p>
        <h2 className="contact-reveal text-6xl md:text-[10rem] font-display font-bold text-white tracking-tighter leading-[0.85] mb-24 uppercase">
          {siteContent.contact.title[0]} <br /> <span className="text-track-green">{siteContent.contact.title[1]}</span>
        </h2>

        <div className="contact-reveal grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <Magnetic>
            <div className="bg-track-charcoal border border-white/5 p-12 hover:border-track-green/50 transition-all duration-700 cursor-pointer group">
              <Phone className="w-10 h-10 text-track-green mb-8 mx-auto group-hover:scale-110 transition-transform" />
              <p className="text-white/60 font-tech text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Voice</p>
              <h4 className="text-3xl font-display font-bold tracking-tight text-white mb-6 group-hover:text-track-green transition-colors">{siteContent.contact.phone}</h4>
              <div className="w-10 h-px bg-white/10 mx-auto"></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className="bg-track-charcoal border border-white/5 p-12 hover:border-track-green/50 transition-all duration-700 cursor-pointer group">
              <MapPin className="w-10 h-10 text-track-green mb-8 mx-auto group-hover:scale-110 transition-transform" />
              <p className="text-white/60 font-tech text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Location</p>
              <p className="text-sm font-tech leading-relaxed text-white/50 group-hover:text-white transition-colors max-w-xs mx-auto mb-6">{siteContent.contact.address}</p>
              <div className="w-10 h-px bg-white/10 mx-auto"></div>
            </div>
          </Magnetic>
        </div>

        <button className="contact-reveal mt-32 font-display text-2xl md:text-4xl text-white/70 hover:text-track-green transition-all duration-700 uppercase tracking-tighter underline underline-offset-[20px] decoration-white/10 hover:decoration-track-green">
          View on Google Maps <ArrowUpRight className="inline-block ml-4" />
        </button>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-track-dark text-white py-20 px-6 border-t border-white/5 relative z-10 overflow-hidden">
    <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-24">
      <div className="md:col-span-6">
        <h2 className="font-display text-6xl md:text-[8rem] mb-12 tracking-tighter font-bold leading-none">TRACK AND <br /> TRIAL<span className="text-track-green">.</span></h2>
        <div className="flex gap-10">
          <a href="#" className="font-tech text-[10px] uppercase tracking-[0.4em] font-bold text-white/60 hover:text-track-green transition-colors">Instagram</a>
          <a href="#" className="font-tech text-[10px] uppercase tracking-[0.4em] font-bold text-white/60 hover:text-track-green transition-colors">Twitter</a>
          <a href="#" className="font-tech text-[10px] uppercase tracking-[0.4em] font-bold text-white/60 hover:text-track-green transition-colors">Facebook</a>
        </div>
      </div>
      <div className="md:col-span-6 grid grid-cols-2 gap-20">
        <div>
          <p className="font-tech text-white/70 text-[10px] uppercase tracking-[0.5em] font-bold mb-10">Directory</p>
          <ul className="space-y-6 font-tech text-xs uppercase tracking-[0.2em] font-bold text-white/60">
            <li><a href="#philosophy" className="hover:text-track-green transition-colors">Philosophy</a></li>
            <li><a href="#bikes" className="hover:text-track-green transition-colors">Bikes</a></li>
            <li><a href="#tech" className="hover:text-track-green transition-colors">Tech</a></li>
            <li><a href="#community" className="hover:text-track-green transition-colors">Community</a></li>
          </ul>
        </div>
        <div>
          <p className="font-tech text-white/70 text-[10px] uppercase tracking-[0.5em] font-bold mb-10">Presence</p>
          <p className="font-tech text-xs leading-relaxed text-white/60 uppercase tracking-widest max-w-[200px]">
            {siteContent.footer.locationAddress}
          </p>
        </div>
      </div>
    </div>
    <div className="max-w-[1800px] mx-auto mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] text-white font-tech uppercase tracking-[0.4em] font-bold text-center">
      <p>{siteContent.footer.copyright}</p>
      <p className="text-track-green/40">{siteContent.footer.tagline}</p>
      <div className="flex gap-8">
        <span>Privacy</span>
        <span>Legal</span>
      </div>
    </div>
  </footer>
);


export default function App() {
  return (
    <div className="bg-track-dark min-h-screen text-white selection:bg-track-green selection:text-black overflow-x-hidden">
      <SmoothScroll />
      <CustomCursor />
      <Navbar />

      <main>
        <ImmersiveIntro />
        <PhilosophySection />
        <Hero />
        <ProductShowcase />
        <CraftedDetail />
        <LifestyleBreak />
        <Specs />
        <TrustSection />
        <StoreCommunity />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}