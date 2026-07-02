import { useEffect, useState, lazy, Suspense } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useTransform,
  type Variants
} from "motion/react";

const Testimonials = lazy(() => import("@/components/ui/testimonials-demo").then(module => ({ default: module.Testimonials })));

type IconName =
  | "spark"
  | "calendar"
  | "users"
  | "target"
  | "arrow"
  | "chat"
  | "shield"
  | "clock"
  | "book"
  | "check"
  | "plus"
  | "phone"
  | "mail"
  | "star"
  | "layers"
  | "trend";

type SectionIntroProps = Readonly<{
  eyebrow: string;
  title: string;
  copy?: React.ReactNode;
  align?: "left" | "center";
  narrow?: boolean;
  eyebrowClass: string;
  titleClass: string;
  copyClass: string;
}>;

type TrustItem = {
  icon: IconName;
  text: string;
};

type AboutStat = {
  value: string;
  note: string;
};

type WhyItem = {
  title: string;
  copy: string;
  icon: IconName;
  tone: string;
  featured?: boolean;
};

type Course = {
  name: string;
  tag: string;
  outcome: string;
  duration?: string;
  price?: string;
  cta?: string;
  accent: string;
};

type FormatCard = {
  title: string;
  text: string;
  meta: string;
  icon: IconName;
};

const pageContainer = "mx-auto max-w-7xl px-5 sm:px-6 lg:px-8";
const sectionSpacing = "py-16 sm:py-24";

const icons: Record<IconName, string> = {
  spark: "M12 3l1.8 4.7L18.5 9l-4.7 1.3L12 15l-1.8-4.7L5.5 9l4.7-1.3L12 3z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z",
  users: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M16 3.1a4 4 0 010 7.8M23 21v-2a4 4 0 00-3-3.9M9 7a4 4 0 110 8 4 4 0 010-8z",
  target: "M12 12l3-3M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1M12 8a4 4 0 100 8 4 4 0 000-8z",
  arrow: "M5 12h14M13 5l7 7-7 7",
  chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
  shield: "M12 3l7 4v5c0 4.5-2.8 8.1-7 9-4.2-.9-7-4.5-7-9V7l7-4z",
  clock: "M12 7v5l3 3M12 21a9 9 0 100-18 9 9 0 000 18z",
  book: "M4 5.5A2.5 2.5 0 016.5 3H20v17H6.5A2.5 2.5 0 014 17.5v-12zM4 17.5A2.5 2.5 0 016.5 15H20",
  check: "M5 12l4 4L19 6",
  plus: "M12 5v14M5 12h14",
  phone: "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.4 19.4 0 01-6-6A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7l.5 3a2 2 0 01-.6 1.8l-1.3 1.3a16 16 0 006 6l1.3-1.3a2 2 0 011.8-.6l3 .5A2 2 0 0122 16.9z",
  mail: "M4 4h16v16H4V4zm0 2l8 6 8-6",
  star: "M12 3l2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.6 10l6.5-1L12 3z",
  layers: "M12 2L2 7l10 5 10-5-10-5zm-7 9l7 3.5 7-3.5M5 16l7 3.5 7-3.5",
  trend: "M4 16l5-5 4 4 7-8"
};

const navItems = [
  ["About", "#about"],
  ["Courses", "#courses"],
  ["Format", "#format"],
  ["Stories", "#testimonials"],
  ["FAQ", "#faq"]
] as const;

const trustItems: TrustItem[] = [
  { icon: "shield", text: "No artificial politeness - just clear, useful corrections." },
  { icon: "clock", text: "We figure out a routine that you can actually stick to." },
  { icon: "users", text: "I pay attention to the exact moments you stumble." },
  { icon: "chat", text: "We break the habit of thinking in your native language." },
  { icon: "target", text: "We focus entirely on what's actually holding your score back." },
  { icon: "book", text: "You deal directly with me, every single time." }
];

const aboutStats: AboutStat[] = [
  { value: "No Scripts, Real Results", note: "Build authentic responses for real-life situations—no generic templates or PDFs." },
  { value: "Live Instant Feedback", note: "Get real-time corrections on pronunciation and clarity while you speak." },
  { value: "Personalized Pace", note: "Flexible learning that matches your individual progress and speed." },
  { value: "Elite Private Coaching", note: "One-on-one or small group sessions—no crowded batches, just focused attention." }
];

const whyItems: WhyItem[] = [
  {
    title: "No generic syllabus. We practice only what you need.",
    copy: "We don't waste time on chapters you already know. On day one, we find your weak spots, map your goal, and work exclusively on what will actually move the needle for your exam or fluency.",
    icon: "target",
    tone: "bg-goldTint"
  },
  {
    title: "Immediate correction, not 'feedback at the end'.",
    copy: "If you stumble on a pronunciation or mess up a grammar tense, we pause. We fix it until it sounds natural. Fluency is built by correcting bad habits the moment they happen.",
    icon: "chat",
    tone: "bg-accent"
  },
  {
    title: "I actually look at your essays and rewrite them with you.",
    copy: "I don't just give you a band score. I take your paragraph, show you exactly why it feels clumsy, and we rewrite it live so you understand the logic behind the score.",
    icon: "layers",
    tone: "bg-[var(--soft-cream)]"
  },
  {
    title: "Built around your chaotic adult schedule.",
    copy: "Whether you're finishing college, managing a 9-to-5, or juggling a family - this isn't a rigid school. We find timings that let you remain consistent without burning out.",
    icon: "clock",
    tone: "bg-[#EEF3ED]"
  },
  {
    title: "Who we train",
    copy: "12th graduates preparing for college admissions; working professionals aiming for career growth; and abroad aspirants preparing for IELTS, PTE, CELPIP, Duolingo, or LanguageCert.",
    icon: "users",
    tone: "bg-goldTint"
  },
  {
    title: "Teaching style",
    copy: "Less lecture, more active guidance, real-time corrections, and custom course design built entirely around the learner's individual level and constraints.",
    icon: "book",
    tone: "bg-accent"
  }
];

const courses: Course[] = [
  {
    name: "IELTS Prep",
    tag: "High impact",
    outcome: "Stop guessing what the examiner wants. We fix your exact speaking and writing blocks.",
    duration: "4-8 weeks",
    accent: "from-[#f3dfcc] via-[#fff7ee] to-white"
  },
  {
    name: "PTE Training",
    tag: "Score driven",
    outcome: "Master the algorithm. I'll show you exactly how the microphone picks up your confidence.",
    duration: "3-6 weeks",
    accent: "from-[#dfeaf2] via-[#f9fbfd] to-white"
  },
  {
    name: "CELPIP",
    tag: "Canada route",
    outcome: "Immigration-focused prep that doesn't feel like returning to high school.",
    duration: "4-6 weeks",
    accent: "from-[#efe3d7] via-[#fdf7f1] to-white"
  },
  {
    name: "Duolingo",
    tag: "Fast-track",
    outcome: "Quick, intense practice for students making sudden university leaps.",
    duration: "2-4 weeks",
    accent: "from-[#e6ece2] via-[#fafcf8] to-white"
  },
  {
    name: "LanguageCert",
    tag: "Hyper focused",
    outcome: "Targeted speaking drills to ensure you don't freeze under pressure.",
    duration: "3-5 weeks",
    accent: "from-[#ece6f4] via-[#fbfafe] to-white"
  },
  {
    name: "Real Fluency",
    tag: "Confidence",
    outcome: "Stop translating from your native language before you speak. Own your voice at work.",
    duration: "Until you're ready",
    accent: "from-[#f5e7dc] via-[#fffaf5] to-white"
  },
  {
    name: "Crash Lessons",
    tag: "Fast fixes",
    outcome: "Brush up fast with targeted 2-5 hour sessions. Perfect before exams or interviews. Fast fixes for real problems.",
    price: "Starting from ₹ 50+",
    cta: "Book Now",
    accent: "from-[#f5e7dc] via-[#fffaf5] to-white"
  },
  {
    name: "Single Module Sessions",
    tag: "Pay per session",
    outcome: "Struggling with one specific part - Fix it without committing to a full course. Pay per session. Learn what you need.",
    price: "Starting from ₹ 50+",
    cta: "Book Now",
    accent: "from-[#f5e7dc] via-[#fffaf5] to-white"
  },
  {
    name: "Writing Corrections",
    tag: "No commitment",
    outcome: "Submit your writing. Get precise corrections and improvements - no fluff. No long-term commitment. Just results.",
    price: "Starting from ₹ 50+",
    cta: "Book Now",
    accent: "from-[#f5e7dc] via-[#fffaf5] to-white"
  }
];

const formats: FormatCard[] = [
  {
    title: "1:1 Mentoring",
    text: "For professionals or students who have zero time to waste. Total focus on your exact speaking and writing blocks.",
    meta: "Best for immediate acceleration",
    icon: "spark"
  },
  {
    title: "Small Groups",
    text: "Instead of hiding in a batch of 50, you practice in a small circle where I still correct your pronunciation every day.",
    meta: "Best for consistency & routine",
    icon: "users"
  },
  {
    title: "Flexible Scheduling",
    text: "Your career and studies don't pause for coaching. We find morning, evening, or weekend slots that actually work.",
    meta: "Best for chaotic calendars",
    icon: "calendar"
  }
];

const isE2E =
  globalThis.window !== undefined &&
  new URLSearchParams(globalThis.window.location.search).has("e2e");

const faqs = [
  [
    "Do you just hand out IELTS and PTE templates ? ",
    "No. Templates only get you so far before the algorithm flags you. I teach you the structure, then correct exactly how you apply it so it sounds completely natural."
  ],
  [
    "What if I'm extremely hesitant to speak in English ? ",
    "That's exactly why we do small groups or 1:1. You won't be judged. We will literally pause the class, fix the sentence structure together, and try again until you don't even have to think about it."
  ],
  [
    "How is this different from local batch coaching ? ",
    "I teach every class. There are no junior tutors or 50-student batches where you never get to speak. If you write an essay, I am the one grading it line by line."
  ],
  [
    "I work late. Can I still attend? ",
    "Yes. Half my students are working professionals. We offer flexible early morning, late evening, and weekend slots so you don't have to miss meetings."
  ],
  [
    "Can I choose one-to-one classes instead of group sessions ? ",
    "Absolutely. If you have severe time constraints or very specific weaknesses, 1:1 is the fastest way to fix them."
  ],
  [
    "Can I try a class before committing ? ",
    "Yes. Book a free demo class. Let's look at where you currently are, and I'll tell you honestly exactly what it will take to hit your goal."
  ]
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const, delay }
  })
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 }
  }
};

function Icon({ path, className = "h-5 w-5" }: Readonly<{ path: string; className: string }>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

function SectionIntro({
  eyebrow,
  title,
  copy,
  align = "left",
  narrow = false,
  eyebrowClass = "text-ink/70",
  titleClass = "text-navy",
  copyClass = "text-slate"
}: Readonly<SectionIntroProps>) {
  const computeClassName = () => {
    if (align === "center") return "mx-auto max-w-3xl text-center";
    return narrow ? "max-w-2xl" : "max-w-4xl";
  };

  return (
    <header className={computeClassName()}>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
      >
        <motion.p variants={fadeUp} className={`mb-4 text-sm font-extrabold uppercase tracking-[0.22em] ${eyebrowClass}`}>
          {eyebrow}
        </motion.p>
        <motion.h2 variants={fadeUp} className={`text-balance font-serif text-4xl leading-snug md:text-5xl md:leading-tight ${titleClass}`}>
          {typeof title === "string" && title.includes(". ") ? (
            title.split(". ").map((sentence, i, arr) => (
              <span key={i} className={i > 0 ? "block mt-2 md:inline md:mt-0" : ""}>
                {sentence}{i < arr.length - 1 ? "." : ""}
                {i < arr.length - 1 ? " " : ""}
              </span>
            ))
          ) : (
            title
          )}
        </motion.h2>
        {copy ? (
          <motion.div
            variants={fadeUp}
            className={`mt-5 text-base md:text-lg ${copyClass} space-y-4`}
          >
            {typeof copy === "string" ? (
              copy.split("\n").map((para, i) => (
                <p key={i} className="leading-relaxed">{para}</p>
              ))
            ) : (
              copy
            )}
          </motion.div>
        ) : null}
      </motion.div>
    </header>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [hideHeader, setHideHeader] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 18);
        const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160;
        setHideHeader(isBottom);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const sections = ["about", "courses", "format", "testimonials", "faq"];
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Reset active link if scrolled near the top (Hero section)
    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      animate={{ 
        paddingTop: scrolled ? 8 : 16, 
        paddingBottom: scrolled ? 8 : 16,
        y: hideHeader ? -80 : 0
      }}
      transition={{ duration: 0.3 }}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-navy/90 border-b border-white/10 backdrop-blur-lg shadow-sm" : "bg-transparent border-b border-transparent"
      ].join(" ")}
    >
      <div className={pageContainer}>
        <div className="flex items-center justify-between">
          <button onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3.5 sm:gap-4.5 font-serif text-3xl sm:text-[32px] md:text-[40px] font-semibold md:font-bold tracking-[0.01em] transition-colors text-white hover:opacity-80" aria-label="Think in English - Home">
            <img src="/logo_transparent.png" alt="Think in English Logo" className="h-[72px] w-[72px] sm:h-[80px] sm:w-[80px] md:h-[96px] md:w-[96px] object-contain rounded-md flex-shrink-0" />
            <span className="hidden sm:inline"><span className="text-gold">Think</span> in English</span>
          </button>
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden items-center gap-8 md:flex">
              {navItems.map(([label, href]) => {
                const isActive = activeSection === href;
                return (
                  <a
                    key={label}
                    href={href}
                    className={[
                      "group relative text-sm font-semibold transition-colors",
                      isActive ? "text-gold" : "text-white/80 hover:text-white"
                    ].join(" ")}
                  >
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">{label}</span>
                    <span
                      className={[
                        "absolute -bottom-1 left-0 h-px w-full origin-center transition-transform duration-300",
                        isActive ? "scale-x-100 bg-gold" : "scale-x-0 group-hover:scale-x-100 bg-white"
                      ].join(" ")}
                    />
                  </a>
                );
              })}
            </nav>
            <motion.a
              whileTap={{ scale: 0.96 }}
              href="#contact"
              className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-gold px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-gold/90 hover:shadow-[0_4px_12px_rgba(182,144,99,0.25)]"
            >
              Start Here
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 40]);
  return (
    <section className="relative overflow-hidden pb-6 pt-32 md:pb-8 md:pt-36 lg:pt-44 bg-navy">
      <motion.div
        animate={
          isE2E
             ? { opacity: 0.55, scale: 1 }
            : { opacity: [0.45, 0.75, 0.45], scale: [1, 1.06, 1] }
        }
        transition={
          isE2E
             ? { duration: 0 }
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
        className="pointer-events-none select-none absolute left-[-12%] top-16 h-72 w-72 rounded-full bg-goldTint/50 blur-3xl"
      />
      <motion.div
        animate={
          isE2E
             ? { opacity: 0.55, scale: 1 }
            : { opacity: [0.42, 0.7, 0.42], scale: [1, 1.08, 1] }
        }
        transition={
          isE2E
             ? { duration: 0 }
            : { duration: 9.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="pointer-events-none select-none absolute right-[-8%] top-20 h-80 w-80 rounded-full bg-navy/80 blur-3xl"
      />

      <div className={`relative ${pageContainer} grid items-start gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-14`}>
        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10">
          <motion.h1
            variants={fadeUp}
            className="text-balance max-w-3xl font-serif text-[2.55rem] leading-[1.02] tracking-[-0.02em] text-white sm:text-[3rem] lg:text-[4.8rem]"
          >
            Speak English with
            <span className="block mt-1 text-gold">clarity and confidence.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-base leading-relaxed text-white md:text-lg">
            You don't need a generic institute. You need personalized coaching to fix where you stumble live.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-6 space-y-3">
            {[
              "Live One-on-One Classes & Group Drills",
              "Flexible Timings tailored to your schedule",
              "Personalized Guidance directly from the founder"
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-base font-medium text-white/90">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <motion.a
              whileTap={{ scale: 0.99 }}
              href="#contact"
              className="gold-glow inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-navy shadow-sm transition hover:bg-white/90 sm:min-h-0 sm:w-auto"
            >
              Get Your Roadmap
              <Icon path={icons.arrow} className="h-4 w-4" />
            </motion.a>
            <motion.a
              whileTap={{ scale: 0.99 }}
              href="https://wa.me/918921233005?text=Hi!%20I%20would%20like%20to%20start%20with%20a%20demo%20class"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-gold bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md shadow-sm transition hover:bg-white/10 sm:min-h-0 sm:w-auto"
            >
              Message me on WhatsApp
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current text-gold" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.49 1.332 5.016L2 22l5.127-1.346c1.472.802 3.123 1.226 4.877 1.226 5.511 0 9.994-4.483 9.994-9.993C21.998 6.483 17.514 2 12.004 2zm5.244 13.021c-.287.41-.836.758-1.36.953-.41.154-.923.277-2.605-.42-2.144-.892-3.477-3.067-3.58-3.21-.1-.133-.825-1.097-.825-2.092 0-.995.523-1.482.708-1.677.185-.195.4-.246.533-.246.133 0 .267.005.37.01.112.005.266-.046.415.318.154.38.528 1.282.574 1.374.046.092.077.2.015.323-.062.123-.123.195-.19.277-.067.077-.144.17-.205.236-.067.072-.138.15-.06.287.077.133.344.564.738.913.507.451.933.595 1.066.661.133.067.21.057.287-.03.077-.093.333-.39.42-.523.087-.133.175-.113.298-.067.123.046.779.37.913.436.133.066.22.1.251.154.03.05.03.3-.256.713z"/>
              </svg>
            </motion.a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 mr-1">Programs:</span>
            {[
              { label: "IELTS", target: "#course-ielts-prep" },
              { label: "PTE", target: "#course-pte-training" },
              { label: "CELPIP", target: "#course-celpip" },
              { label: "Duolingo", target: "#course-duolingo" },
              { label: "LanguageCert", target: "#course-languagecert" },
              { label: "Career English", target: "#course-real-fluency" }
            ].map(({ label, target }) => (
              <a
                key={label}
                href={target}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 shadow-sm hover:border-gold/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                {label}
              </a>
            ))}
          </motion.div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          className="relative"
        >
          <motion.a
            href="#format"
            style={isE2E ? undefined : { y: yImage }}
            whileHover={isE2E ? undefined : { scale: 1.01, rotate: -0.5 }}
            className="block relative mx-auto max-w-[560px] rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl origin-bottom transition-all duration-300 hover:border-gold/30 hover:shadow-[0_24px_48px_rgba(173,151,89,0.12)] cursor-pointer group/card"
          >
            <div className="absolute -left-4 top-4 -z-10 hidden h-full w-full rounded-xl border border-white/10 bg-white/5 lg:block" />
            <div className="relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
              <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1100&q=70"
                srcSet="
                  https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=640&q=70 640w,
                  https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=960&q=70 960w,
                  https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1280&q=70 1280w
                "
                sizes="(max-width: 1024px) 100vw, 560px"
                alt="Founder mentor of Think in English during a session"
                width={1200}
                height={1440}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-[340px] w-full object-cover md:h-[400px] scale-105 transition-transform duration-700 group-hover/card:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-navy/80 to-transparent p-6 pt-24 text-left">
                <p className="text-sm font-bold tracking-widest uppercase text-white/90">
                  Teaching doesn't happen without trust.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-left">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/75">Learning Model</p>
                <p className="mt-1 text-sm font-bold text-white">Live classes / 1:1 & Group options</p>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/75">Student Trust</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-white">
                  <span>Rigorous, measured progress</span>
                  <span className="text-gold transition-transform duration-300 group-hover/card:translate-x-1">&rarr;</span>
                </div>
              </div>
            </div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const list: TrustItem[] = trustItems;
  return (
    <section className="pt-16 md:pt-20 pb-8">
      <div className={`${pageContainer}`}>
        <div className="border-b border-white/10 pb-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/50">What you can expect</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-white max-w-3xl">
            Most people just need someone to sit with them and untangle their hesitation.
          </h2>
        </div>
        <div className="mt-8 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((item, index) => (
            <div
              key={`${item.text}-${index}`}
              className="flex items-start gap-4"
            >
              <span className="mt-1 text-gold">
                <Icon path={icons[item.icon]} className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold leading-7 text-white/80">
                {item.text}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-start">
          <motion.a
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/918921233005?text=Hi!%20I'd%20like%20to%20discuss%20coaching%20with%20you."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-gold/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Talk to a Coach
            <Icon path={icons.arrow} className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className={`section-shell ${sectionSpacing}`}>
      <div className={`relative ${pageContainer} grid gap-14 lg:grid-cols-[1.1fr_0.9fr] items-start`}>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
          >
            <h2 className="font-serif text-[4rem] leading-[0.95] tracking-tighter text-white md:text-[6rem] lg:text-[7.5rem]">
              My <br />
              <span className="text-gold italic">Philosophy.</span>
            </h2>
            <div className="mt-8 border-l-[3px] border-gold/40 pl-6 md:mt-10 md:pl-8">
              <p className="font-serif text-2xl md:text-3xl italic font-medium text-gold">
                &ldquo;You can't lecture someone into fluency.&rdquo;
              </p>
              <div className="mt-6 max-w-xl text-[1.05rem] leading-[1.9] text-white/80 space-y-5 text-left">
                <p>
                  Fluency isn’t about memorizing rules—it’s about moving past hesitation and nerves to express ideas clearly. Instead of traditional lectures, this coaching focuses on real-time practice and instant feedback tailored to your goals, whether you are preparing for IELTS, an interview, or workplace communication.
                </p>
                <p>
                  By identifying your specific speech patterns and correcting them on the spot, the program builds the genuine confidence needed to handle real-world pressure.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {aboutStats.map((item) => (
              <motion.article key={item.value} variants={fadeUp} className="rounded-none border-t border-white/10 pt-6 pb-4">
                <p className="font-serif text-[1.35rem] leading-tight text-white">{item.value}</p>
                <p className="mt-3 text-base leading-relaxed text-white">{item.note}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 relative"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <div className="grid gap-6">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=70"
                srcSet="
                  https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=70 500w,
                  https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=70 800w,
                  https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=70 1000w
                "
                sizes="(max-width: 768px) 100vw, 420px"
                alt="Live founder-led English coaching session"
                width={900}
                height={1200}
                loading="lazy"
                decoding="async"
                className="h-[380px] w-full rounded-xl object-cover"
              />
              <div className="flex flex-col justify-between rounded-xl bg-white/5 border border-white/10 p-8">
                <div>
                  <p className="font-handwriting text-4xl leading-tight text-white opacity-90">
                    "Learners improve when they realize they aren't being judged, they're being guided."
                  </p>
                </div>
                <div className="mt-8">
                  <p className="text-sm font-bold text-white uppercase tracking-widest">Ardra Shaji</p>
                  <p className="mt-1 text-sm text-white/50">Founder, Think in English</p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section id="why-us" className={`section-shell ${sectionSpacing}`}>
      <div className={`relative ${pageContainer}`}>
        <SectionIntro
          eyebrow="My Approach"
          title="Premium without feeling distant. Personal without feeling casual."
          copy={"I don't believe in running a factory. The coaching is designed to feel dependable and distinctly human. That means honest feedback and a clear sense of progress.\nEvery session is led directly by the founder, ensuring consistent quality and personalized attention. We focus on practical communication skills that transfer directly to real-world situations, whether you're preparing for international exams or professional presentations."}
          titleClass="text-white"
          eyebrowClass="text-white/50"
          copyClass="text-white"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyItems.map((item, index) => {
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                className="group flex flex-col justify-between gap-8 rounded-xl border border-white/10 bg-white/5 p-8 sm:p-10 shadow-[0_12px_36px_rgba(1,30,40,0.5)] backdrop-blur-md transition-all hover:border-gold/30 hover:shadow-[0_16px_40px_rgba(173,151,89,0.1)]"
              >
                <div>
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-sky/20 text-gold shadow-sm transition-transform duration-500 group-hover:scale-110">
                    <Icon path={icons[item.icon]} className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-serif leading-tight text-white lg:text-[1.8rem]">{item.title}</h3>
                </div>
                <div>
                  <p className="text-base leading-relaxed text-white">{item.copy}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <motion.a
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/918921233005?text=Hi!%20I'd%20like%20to%20discuss%20my%20fluency%20goals%20and%20start%20my%20trial."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-gold/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Discuss Your Fluency Goals
            <Icon path={icons.arrow} className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // Custom smooth ease out
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const iconVariants: Variants = {
  hidden: { y: 0, scale: 1 },
  show: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.05,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
};

const arrowVariants: Variants = {
  hidden: { x: 0 },
  show: { x: 0 },
  hover: {
    x: 6,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
};

const badgeVariants: Variants = {
  hidden: { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  show: { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  hover: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(173, 151, 89, 0.5)",
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

const glowVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: 0.6, ease: "linear" }
  },
};

function CourseCard({ course }: Readonly<{ course: Course }>) {
  const text = `Hi! I am interested in the ${course.name} course. Please share details.`;
  const encodedText = encodeURIComponent(text);
  const cardId = `course-${course.name.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <motion.a
      id={cardId}
      variants={cardVariants}
      whileHover="hover"
      href={`https://wa.me/918921233005?text=${encodedText}`}
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_16px_40px_rgba(1,30,40,0.5)] hover:shadow-[0_24px_48px_rgba(173,151,89,0.12)] hover:border-gold/30 transition-all duration-700 flex flex-col cursor-pointer scroll-mt-24"
      style={{ transformOrigin: "bottom center" }}
    >
      <motion.div variants={glowVariants} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </motion.div>

      <div className="flex items-start justify-between gap-4 relative z-10">
        <motion.div variants={iconVariants} className="gold-glow rounded-xl bg-white/10 p-3 text-white shadow-sm border border-white/10">
          <Icon path={icons.book} className="h-6 w-6" />
        </motion.div>
        <motion.span variants={badgeVariants} className="rounded-full border px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/80 shadow-sm">
          {course.tag}
        </motion.span>
      </div>

      <h3 className="mt-10 font-serif text-[2rem] leading-tight text-white relative z-10">{course.name}</h3>
      <p className="mt-5 max-w-md text-base leading-relaxed text-white relative z-10">{course.outcome}</p>

      <div className="mt-auto relative z-10">
        <p className="mt-10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">Directed correction</p>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">{course.price ? "Price" : "Duration"}</p>
            <p className="mt-1 text-sm font-bold text-white">{course.price || course.duration}</p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-bold text-white group">
            {course.cta || "Discuss path"}
            <motion.span variants={arrowVariants}>
              <Icon path={icons.arrow} className="h-4 w-4" />
            </motion.span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function CoursesSection() {
  return (
    <section id="courses" className={`section-shell ${sectionSpacing}`}>
      <div className={`relative ${pageContainer}`}>
        <SectionIntro
          eyebrow="Courses"
          title="Programs built for strict score goals and unshakeable confidence."
          copy="Standardized tests shouldn't feel like a casino. We focus relentlessly on the exact rubrics so you don't just 'try' the exam - you control it."
          titleClass="text-white"
          eyebrowClass="text-white/50"
          copyClass="text-white"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={gridVariants}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch"
        >
          {courses.slice(0, 6).map((course) => (
            <CourseCard key={course.name} course={course} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-28 mb-12 pl-6 md:pl-8 border-l-[3px] border-gold"
        >
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/50 mb-4">Additional Help</p>
          <h3 className="font-serif text-[1.75rem] md:text-[2.2rem] leading-tight text-white max-w-2xl">
            No long-term commitment. Just results.
          </h3>
          <p className="mt-3 text-lg text-white">
            Pay per session. Learn what you need.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
            If you only need writing correction, a crash session before an exam, or help with one module, you should not have to join a full batch. This part of the program exists for targeted fixes with minimal wasted time.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={gridVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch"
        >
          {courses.slice(6).map((course) => (
            <CourseCard key={course.name} course={course} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FormatSection() {
  return (
    <section id="format" className={`section-shell bg-primary ${sectionSpacing} text-primary-foreground`}>
      <div className={`relative ${pageContainer}`}>
        <SectionIntro
          eyebrow="Class structure"
          title="We mold the class around your calendar, so you don't burn out."
          copy={"I don't force you into rigid batches. Whether you want intense 1:1 focus or a consistent small group, we figure out a structure that you actually look forward to attending.\nEvery class format is built to keep feedback immediate, progress visible, and practice aligned with your current level."}
          eyebrowClass="text-white/52"
          titleClass="text-white"
          copyClass="text-white/72"
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid gap-5 md:grid-cols-3">
            {formats.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                className="rounded-xl border border-border/30 bg-white/10 p-6 "
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky/20 text-gold">
                  <Icon path={icons[item.icon]} className="h-6 w-6" />
                </div>
                <h3 className="mt-8 font-serif text-2xl leading-tight text-white">{item.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-white/72">{item.text}</p>
                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.16em] text-white/48">{item.meta}</p>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-border/30 bg-white/5 p-7 "
          >
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/50">Weekly flow</p>
            <div className="mt-8 space-y-5">
              {[
                ["01", "Goal mapping", "Current level, target, and class format selection."],
                ["02", "Live sessions", "Speaking practice, task work, correction, and strategy."],
                ["03", "Review rhythm", "Feedback loops that keep momentum visible."]
              ].map(([step, title, copy]) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 text-sm font-extrabold text-[#f1d7b8]">
                    {step}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{title}</p>
                    <p className="mt-1 text-base leading-relaxed text-white">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-7 text-white/68">
              The point of this structure is simple: delayed feedback keeps bad habits alive. Live correction shortens the learning loop, which is why students usually feel progress faster in speaking confidence, sentence flow, and exam control.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <motion.a
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/918921233005?text=Hi!%20I'd%20like%20to%20check%20available%20slots%20for%20the%20weekly%20coaching%20sessions."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-gold/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Check Available Slots
            <Icon path={icons.arrow} className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section id="testimonials" className={`section-shell ${sectionSpacing} overflow-hidden`}>
      <div className={`relative ${pageContainer}`}>
        <div className="flex flex-col gap-8">
          <SectionIntro
            eyebrow="Outcomes"
            title="Don't just take my word for it."
            copy="The only metric that matters at the end of the day is whether you hit your goal. Here are real stories from students who stopped struggling with English and started using it with absolute confidence."
            narrow
            titleClass="text-white"
            eyebrowClass="text-white/50"
            copyClass="text-white"
          />
          <Suspense fallback={<div>Loading testimonials...</div>}>
            <Testimonials />
          </Suspense>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col items-center text-center max-w-xl mx-auto"
          >
            <h4 className="font-serif text-2xl text-white">Ready to be our next success story?</h4>
            <p className="mt-3 text-sm text-white/70">
              Start with a free demo class to get your roadmap and personalized recommendations.
            </p>
            <motion.a
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/918921233005?text=Hi!%20I%20would%20like%20to%20start%20with%20a%20demo%20class"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs uppercase tracking-wider font-extrabold text-white shadow-sm transition hover:bg-gold/90"
            >
              Start Free Trial
              <Icon path={icons.arrow} className="h-3.5 w-3.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className={`section-shell ${sectionSpacing}`}>
      <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Clear answers"
          title="Questions people usually ask in the demo class."
          copy="I believe in complete transparency. If you have any other questions, you can always WhatsApp me directly. Most learners want to know how the classes work, whether they need one-to-one support or a small group, and how quickly they can expect measurable improvement."
          align="center"
          titleClass="text-white"
          eyebrowClass="text-white/50"
          copyClass="text-white"
        />

        <div className="mt-12 space-y-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <motion.div
                key={question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left md:px-7"
                >
                  <span className="text-base font-bold leading-7 text-white md:text-lg">{question}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-white">
                    <Icon path={isOpen ? "M5 12h14" : icons.plus} className="h-5 w-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-7 text-base leading-relaxed text-white md:px-7">{answer}</div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col items-center text-center"
        >
          <p className="text-sm text-white/60 mb-4">Still have questions? I'm happy to help.</p>
          <motion.a
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/918921233005?text=Hi!%20I%20have%20a%20question%20about%20the%20coaching%20program."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold bg-white/5 px-6 py-3.5 text-xs uppercase tracking-wider font-extrabold text-white shadow-sm transition hover:bg-white/10"
          >
            Chat with me
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gold" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.49 1.332 5.016L2 22l5.127-1.346c1.472.802 3.123 1.226 4.877 1.226 5.511 0 9.994-4.483 9.994-9.993C21.998 6.483 17.514 2 12.004 2zm5.244 13.021c-.287.41-.836.758-1.36.953-.41.154-.923.277-2.605-.42-2.144-.892-3.477-3.067-3.58-3.21-.1-.133-.825-1.097-.825-2.092 0-.995.523-1.482.708-1.677.185-.195.4-.246.533-.246.133 0 .267.005.37.01.112.005.266-.046.415.318.154.38.528 1.282.574 1.374.046.092.077.2.015.323-.062.123-.123.195-.19.277-.067.077-.144.17-.205.236-.067.072-.138.15-.06.287.077.133.344.564.738.913.507.451.933.595 1.066.661.133.067.21.057.287-.03.077-.093.333-.39.42-.523.087-.133.175-.113.298-.067.123.046.779.37.913.436.133.066.22.1.251.154.03.05.03.3-.256.713z"/>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className={`section-shell ${sectionSpacing}`}>
      <div className={`relative ${pageContainer}`}>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-navy shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[.95fr_1.05fr]">
            <div className="p-8 text-white md:p-10 lg:p-12 text-center lg:text-left">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/52">Contact</p>
              <h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight text-white md:text-[3.2rem] mx-auto lg:mx-0">
                Start with a free trial and get the right recommendation.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/74 mx-auto lg:mx-0">
                Share your goal, target exam, or confidence challenge. We will suggest the most suitable course format and timing instead of pushing a generic batch.
              </p>
            </div>

            <div className="bg-navy p-8 md:p-10 lg:p-12 lg:border-l lg:border-white/10">
              <div className="mx-auto max-w-xl">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/50">Direct access</p>
                <p className="mt-4 text-3xl font-serif leading-tight text-white md:text-4xl">
                  Stop scrolling. Let's look at your current level and build a roadmap.
                </p>
                <p className="mt-5 text-base leading-8 text-white">
                  No sales teams, no pressure. You'll speak directly with me. We'll identify what's blocking your fluency or score, and decide if I'm the right mentor for you.
                </p>

                <motion.a
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/918921233005?text=Hi!%20I%20would%20like%20to%20start%20with%20a%20demo%20class"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-bold text-white shadow-[0_4px_12px_rgba(182,144,99,0.2)] transition-all hover:bg-gold/90 hover:scale-[1.02] active:scale-[0.98] sm:w-fit"
                >
                  Message me on WhatsApp
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.49 1.332 5.016L2 22l5.127-1.346c1.472.802 3.123 1.226 4.877 1.226 5.511 0 9.994-4.483 9.994-9.993C21.998 6.483 17.514 2 12.004 2zm5.244 13.021c-.287.41-.836.758-1.36.953-.41.154-.923.277-2.605-.42-2.144-.892-3.477-3.067-3.58-3.21-.1-.133-.825-1.097-.825-2.092 0-.995.523-1.482.708-1.677.185-.195.4-.246.533-.246.133 0 .267.005.37.01.112.005.266-.046.415.318.154.38.528 1.282.574 1.374.046.092.077.2.015.323-.062.123-.123.195-.19.277-.067.077-.144.17-.205.236-.067.072-.138.15-.06.287.077.133.344.564.738.913.507.451.933.595 1.066.661.133.067.21.057.287-.03.077-.093.333-.39.42-.523.087-.133.175-.113.298-.067.123.046.779.37.913.436.133.066.22.1.251.154.03.05.03.3-.256.713z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const socialIcons = [
    ["Instagram", "https://www.instagram.com/thinknspeak_in_english", "M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zM12 7a5 5 0 100 10 5 5 0 000-10z"],
    ["YouTube", "https://www.youtube.com/@thinkinenglish1111", "M22 12s0-3.4-.4-5c-.2-1.1-1.1-2-2.2-2.2C17.8 4.4 12 4.4 12 4.4s-5.8 0-7.4.4c-1.1.2-2 1.1-2.2 2.2C2 8.6 2 12 2 12s0 3.4.4 5c.2 1.1 1.1 2 2.2 2.2 1.6.4 7.4.4 7.4.4s5.8 0 7.4-.4c1.1-.2 2-1.1 2.2-2.2.4-1.6.4-5 .4-5zM10 15.5v-7l6 3.5-6 3.5z"]
  ] as const;

  return (
    <footer className="border-t border-white/10 bg-navy py-6">
      <div className={pageContainer}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-left">
          <div>
            <button onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 font-serif text-xl text-white hover:opacity-80 font-bold" aria-label="Think in English - Home">
              <img src="/logo_transparent.png" alt="Think in English Logo" className="h-10 w-10 object-contain rounded-md flex-shrink-0" />
              <span><span className="text-gold">Think</span> in English</span>
            </button>
            <p className="mt-1.5 text-xs text-white/60">Unravel your journey of English</p>
          </div>
          
          <div className="flex flex-col sm:items-end gap-3">
            <div className="text-xs leading-5 text-white/70 sm:text-right">
              <span>Phone: +91 89212 33005</span>
              <span className="hidden sm:inline mx-2">•</span>
              <br className="sm:hidden" />
              <span>Email: mail@thinkinenglish.co.in</span>
            </div>
            <div className="flex gap-2.5">
              {socialIcons.map(([label, href, path]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                  aria-label={label}
                >
                  <Icon path={path} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-white/5 pt-4 text-center text-[11px] text-white/40">
          Copyright &copy; 2024 Think in English. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/918921233005"
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.98 }}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-navy shadow-sm hover:bg-gold/90 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.49 1.332 5.016L2 22l5.127-1.346c1.472.802 3.123 1.226 4.877 1.226 5.511 0 9.994-4.483 9.994-9.993C21.998 6.483 17.514 2 12.004 2zm5.244 13.021c-.287.41-.836.758-1.36.953-.41.154-.923.277-2.605-.42-2.144-.892-3.477-3.067-3.58-3.21-.1-.133-.825-1.097-.825-2.092 0-.995.523-1.482.708-1.677.185-.195.4-.246.533-.246.133 0 .267.005.37.01.112.005.266-.046.415.318.154.38.528 1.282.574 1.374.046.092.077.2.015.323-.062.123-.123.195-.19.277-.067.077-.144.17-.205.236-.067.072-.138.15-.06.287.077.133.344.564.738.913.507.451.933.595 1.066.661.133.067.21.057.287-.03.077-.093.333-.39.42-.523.087-.133.175-.113.298-.067.123.046.779.37.913.436.133.066.22.1.251.154.03.05.03.3-.256.713z"/>
      </svg>
    </motion.a>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <NavBar />
        <main>
          <Hero />
          <TrustStrip />
          <AboutSection />
          <WhySection />
          <CoursesSection />
          <FormatSection />
          <TestimonialSection />
          <FAQSection />
          <ContactSection />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </MotionConfig>
  );
}
