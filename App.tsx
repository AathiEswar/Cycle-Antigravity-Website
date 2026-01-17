import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowRight, ArrowUpRight, Bike, MapPin, Menu, X, Instagram, Twitter, Zap, ShieldCheck, Wrench, Clock, Users, Coffee, ChevronRight, Phone } from 'lucide-react';
import { Bike as BikeType, Feature } from './types';

gsap.registerPlugin(ScrollTrigger);

// --- MOCK DATA ---
const BIKES: BikeType[] = [
  {
    id: 1,
    name: "Roadeo Turbo X",
    category: "City / Commuter",
    price: "₹14,999",
    image: "https://plus.unsplash.com/premium_photo-1678718713393-2b88cde9605b?q=80&w=1600&auto=format&fit=crop",
    tagline: "Everyday city performance."
  },
  {
    id: 2,
    name: "Mach City iBike Urban",
    category: "City / Commuter",
    price: "₹11,499",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1600&auto=format&fit=crop",
    tagline: "Cruise through town."
  },
  {
    id: 3,
    name: "Firefox Raccoon 20T",
    category: "Hybrid",
    price: "₹9,799",
    image: "https://images.unsplash.com/photo-1618762044398-ec1e7e048bbd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmljeWNsZXxlbnwwfHwwfHx8MA%3D%3D",
    tagline: "Smooth on every road."
  },
  {
    id: 4,
    name: "BSA Ladybird 18T",
    category: "Commuter",
    price: "₹7,250",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJpY3ljbGV8ZW58MHx8MHx8fDA%3Dp",
    tagline: "Reliable everyday ride."
  }
];

// --- UTILS ---
const Magnetic = ({ children }: { children: React.ReactElement }) => {
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  return React.cloneElement(children, { ref: magnetic });
}

// --- COMPONENTS ---

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
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
      <div ref={cursorDotRef} className="cursor-dot hidden md:block fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] w-2 h-2 bg-track-green rounded-full mix-blend-difference"></div>
      <div ref={cursorOutlineRef} className="cursor-outline hidden md:block fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] w-10 h-10 border border-track-green/50 rounded-full mix-blend-difference bg-blend-difference"></div>
    </>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-40 px-6 py-6 md:px-12 md:py-6 flex justify-between items-center mix-blend-difference text-white">
      <div className="font-display font-bold text-2xl tracking-tighter">
        TRACK AND TRIAL<span className="text-track-green">.</span>
      </div>

      <div className="hidden md:flex gap-8 items-center">
        {['Bikes', 'Journal', 'About'].map(link => (
          <a href={`#${link.toLowerCase()}`} key={link} className="font-tech text-sm uppercase tracking-widest hover:text-track-green transition-colors">{link}</a>
        ))}
        <Magnetic>
          <button className="border border-white/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Store
          </button>
        </Magnetic>
      </div>

      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-char", { y: 200, rotateY: 45, opacity: 0, duration: 1, stagger: 0.05, ease: "power4.out" })
        .from(".hero-sub", { opacity: 0, y: 20, duration: 1, ease: "power2.out" }, "-=0.5");

      gsap.to(".hero-bg", {
        scale: 1.1,
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-track-dark">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1605271864611-58dd08d10547?q=80&w=2500&auto=format&fit=crop"
          className="hero-bg w-full h-full object-cover opacity-60 grayscale contrast-125 saturate-0"
          alt="Hero Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-track-dark via-transparent to-black/30" />
        <div className="absolute inset-0 bg-track-dark/20" /> {/* Fine grain overlay simulated */}
      </div>

      <div className="z-10 text-center text-white">
        <div className="overflow-hidden" ref={textRef}>
          <h1 className="font-display text-[15vw] leading-[0.8] font-bold tracking-tighter flex justify-center">
            {"RIDE".split("").map((char, i) => <span key={i} className="hero-char inline-block">{char}</span>)}
            <span className="w-[4vw]"></span>
            {"FURTHER".split("").map((char, i) => <span key={i + 10} className="hero-char inline-block text-track-green">{char}</span>)}
          </h1>
        </div>
        <div className="hero-sub mt-8 max-w-xl mx-auto px-6">
          <p className="font-tech text-white/80 text-sm md:text-lg uppercase tracking-widest border-l-2 border-track-green pl-4">
            Precision Engineering • Carbon Fiber • Pure Adrenaline
          </p>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 hero-sub">
        <Magnetic>
          <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white hover:text-black transition-colors">
            <ArrowRight className="w-6 h-6 rotate-90" />
          </div>
        </Magnetic>
      </div>
    </section>
  );
};

const CraftedDetail = () => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".detail-text-item", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2,
        scrollTrigger: { trigger: ref.current, start: "top 60%" }
      });
      gsap.to(".detail-img", {
        scale: 1.05,
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 }
      })
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-48 bg-track-dark relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-4 z-10">
          <div className="detail-text-item mb-8">
            <span className="text-track-green font-tech text-xs uppercase tracking-[0.2em]">Crafted for the Ride</span>
            <h2 className="text-4xl md:text-6xl font-display text-white mt-4 font-bold leading-none">
              ENGINEERED <br /> FOR THE <br /> OBSESSED.
            </h2>
          </div>
          <div className="detail-text-item max-w-sm">
            <p className="text-track-gray font-tech text-base leading-relaxed opacity-80">
              Every curve is calculated. Every gram is accounted for. We don't just build bikes; we sculpt wind-cheating machines designed to disappear beneath you.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <h4 className="text-3xl font-display text-white">800<span className="text-track-green text-lg">g</span></h4>
                <p className="text-track-gray text-xs uppercase tracking-wider mt-1">Frame Weight</p>
              </div>
              <div>
                <h4 className="text-3xl font-display text-white">12<span className="text-track-green text-lg">%</span></h4>
                <p className="text-track-gray text-xs uppercase tracking-wider mt-1">Less Drag</p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-8 relative">
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden w-full relative">
            <img
              src="https://images.unsplash.com/photo-1641546088653-825bebd28fe2?q=80&w=2000&auto=format&fit=crop"
              className="detail-img w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700"
              alt="Engineering Detail"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-track-dark via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Statement = () => {
  const text = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(text.current, {
        opacity: 0.2,
        scrollTrigger: {
          trigger: text.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true
        }
      })
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-40 px-6 bg-track-dark flex justify-center items-center">
      <h2 ref={text} className="text-4xl md:text-7xl lg:text-8xl font-display text-white font-bold text-center leading-[0.9] tracking-tighter max-w-6xl mx-auto opacity-100">
        <span className="block">NOT JUST A BIKE.</span>
        <span className="block text-track-gray">A MASTERPIECE</span>
        <span className="block text-track-green">IN MOTION.</span>
      </h2>
    </section>
  );
}

const LifestyleBreak = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".lifestyle-img", {
        yPercent: 20,
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="h-[80vh] w-full relative overflow-hidden flex items-center justify-center mb-6">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1452573992436-6d508f200b30?q=80&w=2600&auto=format&fit=crop"
          className="lifestyle-img w-full h-[120%] object-cover -mt-[10%]"
          alt="Lifestyle Landscape"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="relative z-10 text-center">
        <h2 className="text-6xl md:text-9xl font-display text-white font-bold tracking-tighter mix-blend-overlay opacity-90">
          SILENCE <br /> THE NOISE
        </h2>
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
    <section ref={triggerRef} className="h-screen bg-track-charcoal overflow-hidden relative">
      <div className="absolute top-12 left-6 md:left-12 z-10">
        <h2 className="text-white font-display text-3xl md:text-4xl uppercase">Collection</h2>
        <p className="text-track-gray font-tech text-xs md:text-sm mt-2">01 / 04</p>
      </div>

      <div ref={sectionRef} className="flex h-[80%] items-center pl-6 md:pl-[20vw] pr-6 md:pr-[10vw] gap-8 md:gap-[5vw] w-fit">
        {BIKES.map((bike) => (
          <div key={bike.id} className="relative group w-[65vw] md:w-[35vw] flex-shrink-0">
            <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-track-dark">
              <img src={bike.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={bike.name} />
            </div>
            <div className="mt-4 md:mt-6 flex justify-between items-end">
              <div>
                <h3 className="text-xl md:text-4xl font-display text-white font-bold uppercase leading-tight">{bike.name}</h3>
                <p className="text-track-green font-tech text-[10px] md:text-sm mt-1">{bike.category}</p>
              </div>
              <p className="text-white font-tech text-base md:text-xl">{bike.price}</p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              <div className="bg-track-green text-black px-4 py-2 font-bold uppercase tracking-widest text-[10px] md:text-sm">
                View Model
              </div>
            </div>
          </div>
        ))}
        <div className="w-[50vw] md:w-[30vw] flex-shrink-0 flex items-center justify-center">
          <div className="group cursor-pointer">
            <h3 className="text-3xl md:text-6xl font-display text-white/20 group-hover:text-white transition-colors duration-500 text-center">
              VIEW ALL <br /> MODELS
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

const Specs = () => {
  const container = useRef(null);

  const features: Feature[] = [
    { title: "AERODYNAMICS", description: "Sculpted by wind. Every tube profile is optimized for maximum efficiency at speed.", icon: <Zap className="w-6 h-6" /> },
    { title: "PRECISION", description: "Electronic shifting defined. Instant, accurate gear changes under any load.", icon: <Wrench className="w-6 h-6" /> },
    { title: "LIGHTWEIGHT", description: "Featherweight carbon layups. Climbing efficiency meets sprinting stiffness.", icon: <Bike className="w-6 h-6" /> }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Use fromTo to ensure distinct start/end states and autoAlpha for performance
      gsap.fromTo(".spec-card",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.2,
          scrollTrigger: {
            trigger: container.current,
            start: "top 90%", // Trigger earlier (when top of section hits 90% of viewport height)
          }
        }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="py-32 bg-track-dark relative overflow-hidden min-h-[50vh]">
      {/* Background ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-track-green/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <p className="text-track-green font-tech text-xs uppercase tracking-[0.3em] mb-4">Performance Data</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white">
            Technical <span className="text-track-green">Superiority</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="spec-card group relative p-10 bg-white/5 border border-white/10 hover:border-track-green/50 hover:bg-white/10 transition-all duration-500 overflow-hidden opacity-0"> {/* Initial opacity-0 for standard CSS fallback if JS delays */}
              <div className="absolute top-0 right-0 p-6 opacity-0 translate-x-4 -translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 text-track-green">
                <ArrowUpRight className="w-6 h-6" />
              </div>

              <div className="mb-8 p-4 bg-track-dark w-fit rounded-full text-track-green group-hover:scale-110 group-hover:bg-track-green group-hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,255,0,0.1)] group-hover:shadow-[0_0_30px_rgba(212,255,0,0.4)]">
                {f.icon}
              </div>

              <h3 className="text-2xl font-display text-white uppercase mb-4 tracking-wide">{f.title}</h3>
              <p className="text-track-gray font-tech text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                {f.description}
              </p>

              {/* Bottom decorative line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-track-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const StoreCommunity = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".community-item", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%"
        }
      })
    }, container);
    return () => ctx.revert();
  }, []);

  const images = [
    { src: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=800", title: "THE WORKSHOP", subtitle: "Expert Service" },
    { src: "https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?q=80&w=800", title: "COFFEE BAR", subtitle: "Fuel Up" },
    { src: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800", title: "GROUP RIDES", subtitle: "Join The Club" }
  ];

  return (
    <section ref={container} className="py-32 bg-track-charcoal text-white overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter">The Clubhouse</h2>
            <p className="font-tech text-track-gray mt-4 max-w-md">More than a store. A sanctuary for those who live to ride. Come for the gear, stay for the coffee and conversation.</p>
          </div>
          <div className="hidden md:block">
            <Magnetic>
              <button className="flex items-center gap-2 border border-track-green text-track-green px-8 py-3 rounded-full hover:bg-track-green hover:text-black transition-all font-tech uppercase text-xs tracking-widest">
                Visit Us <ArrowUpRight className="w-4 h-4" />
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className="community-item group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-track-dark cursor-pointer">
              <img src={img.src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={img.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 z-10">
                <p className="text-track-green font-tech text-xs uppercase tracking-widest mb-1">{img.subtitle}</p>
                <h3 className="text-2xl font-display uppercase font-bold">{img.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ContactSection = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".contact-item", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%"
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="py-24 bg-track-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="contact-item text-track-green font-tech text-xs uppercase tracking-[0.3em] mb-6 font-bold">Get In Touch</h2>
            <h3 className="contact-item text-4xl md:text-6xl font-display font-bold text-white tracking-tighter leading-none mb-12">
              VISIT OUR <br /> CHENNAI SHOWROOM.
            </h3>
            <div className="contact-item flex items-center gap-6 group cursor-pointer">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/40 font-tech text-[10px] uppercase tracking-widest mb-1">Call Us</p>
                <p className="text-white text-2xl font-display font-medium">095000 62263</p>
              </div>
            </div>
          </div>
          <div className="bg-track-charcoal p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-track-green/10 blur-[100px] group-hover:bg-track-green/20 transition-all"></div>
            <MapPin className="contact-item text-track-green w-8 h-8 mb-8" />
            <h4 className="contact-item text-white font-display text-2xl font-bold mb-4">Location</h4>
            <p className="contact-item font-tech text-track-gray text-lg leading-relaxed max-w-sm">
              044, 1 united colony, Kolathur Road, Next to Union Bank, before Rettari Signal, Kolathur, Chennai, Tamil Nadu 600099
            </p>
            <div className="contact-item mt-12">
              <Magnetic>
                <div className="inline-flex items-center gap-2 text-track-green font-tech text-xs uppercase tracking-widest cursor-pointer border-b border-track-green pb-1 hover:gap-4 transition-all">
                  Open in Maps <ChevronRight className="w-4 h-4" />
                </div>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black text-white py-24 px-6 border-t border-white/10 relative z-10">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
      <div className="max-w-xs">
        <h2 className="font-display text-4xl mb-6 tracking-tighter">TRACK AND TRIAL<span className="text-track-green">.</span></h2>
        <p className="font-tech text-white/40 text-[10px] uppercase tracking-widest mb-4">Location</p>
        <p className="font-tech text-white/60 text-sm mb-8 leading-relaxed">
          Kolathur Road, Next to Union Bank, Kolathur, Chennai, Tamil Nadu 600099
        </p>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"><Instagram size={18} /></a>
          <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"><Twitter size={18} /></a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-12 font-tech text-sm uppercase tracking-widest text-white/60">
        <div className="flex flex-col gap-4">
          <a href="#" className="hover:text-white transition-colors">Bikes</a>
          <a href="#" className="hover:text-white transition-colors">Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex flex-col gap-4">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Shipping</a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex justify-between items-center text-xs text-white/40 font-tech">
      <p>© 2026 Track & Trail.</p>
      <p>Designed for Speed.</p>
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
        <Hero />
        <CraftedDetail />
        <Statement />
        <LifestyleBreak />
        <ProductShowcase />
        <Specs />
        <StoreCommunity />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}