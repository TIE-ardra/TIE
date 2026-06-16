import { useEffect, useState, useRef, lazy, Suspense } from "react";
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
  copy: string;
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

const pageContainer = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
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
    tone: "bg-[var(--soft-cream)]",
    featured: true
  },
  {
    title: "Built around your chaotic adult schedule.",
    copy: "Whether you're finishing college, managing a 9-to-5, or juggling a family - this isn't a rigid school. We find timings that let you remain consistent without burning out.",
    icon: "clock",
    tone: "bg-[#EEF3ED]"
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
    price: "Starting from Rs. 50+",
    cta: "Book Now",
    accent: "from-[#f5e7dc] via-[#fffaf5] to-white"
  },
  {
    name: "Single Module Sessions",
    tag: "Pay per session",
    outcome: "Struggling with one specific part - Fix it without committing to a full course. Pay per session. Learn what you need.",
    price: "Starting from Rs. 50+",
    cta: "Book Now",
    accent: "from-[#f5e7dc] via-[#fffaf5] to-white"
  },
  {
    name: "Writing Corrections",
    tag: "No commitment",
    outcome: "Submit your writing. Get precise corrections and improvements - no fluff. No long-term commitment. Just results.",
    price: "Starting from Rs. 50+",
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
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={stagger}
      className={computeClassName()}
    >
      <motion.p variants={fadeUp} className={`mb-4 text-sm font-extrabold uppercase tracking-[0.22em] ${eyebrowClass}`}>
        {eyebrow}
      </motion.p>
      <motion.h2 variants={fadeUp} className={`text-balance font-serif text-4xl leading-tight md:text-5xl ${titleClass}`}>
        {title}
      </motion.h2>
      {copy ? (
        <motion.p variants={fadeUp} className={`mt-5 text-base leading-8 md:text-lg ${copyClass}`}>
          {copy}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 18);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <motion.header
      animate={{ paddingTop: scrolled ? 8 : 18, paddingBottom: scrolled ? 8 : 18 }}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
    >
      <div className={pageContainer}>
        <div
          className={[
            "flex items-center justify-between rounded-full border px-4 transition-all duration-300 md:px-6",
            scrolled ? "bg-navy/95 py-2 backdrop-blur-md border-white/10 shadow-sm" : "bg-transparent py-3 border-transparent"
          ].join(" ")}
        >
          <button onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 font-serif text-2xl tracking-[0.01em] transition-colors text-white hover:opacity-80" aria-label="Think in English - Home">
            <img src="/logo.png" alt="Think in English Logo" className="h-14 w-auto object-contain rounded-md" />
            <span><span className="text-gold">Think</span> in English</span>
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="group relative text-sm font-semibold transition-colors text-white/80 hover:text-white">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">{label}</span>
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-white" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 40]);
  const yParticle = useTransform(scrollY, [0, 500], [0, 24]);

  return (
    <section className="relative overflow-hidden pb-6 pt-20 md:pb-10 md:pt-24 bg-navy">
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
        className="absolute left-[-12%] top-16 h-72 w-72 rounded-full bg-goldTint/50 blur-3xl"
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
        className="absolute right-[-8%] top-20 h-80 w-80 rounded-full bg-navy/80 blur-3xl"
      />
      <motion.div style={isE2E ? undefined : { y: yParticle }} className="absolute inset-0 hidden md:block">
        <span className="absolute left-[10%] top-[22%] h-2.5 w-2.5 rounded-full bg-gold/40 blur-[1px]" />
        <span className="absolute left-[19%] top-[34%] h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="absolute right-[16%] top-[24%] h-3 w-3 rounded-full bg-goldTint/70 blur-[1px]" />
        <span className="absolute right-[12%] top-[44%] h-1.5 w-1.5 rounded-full bg-white/20" />
      </motion.div>

      <div className={`relative ${pageContainer} grid items-start gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-14`}>
        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10">
          <motion.h1
            variants={fadeUp}
            className="text-balance max-w-3xl font-serif text-[2.55rem] leading-[1.02] tracking-[-0.02em] text-white sm:text-[3.2rem] lg:text-[5.5rem]"
          >
            Speak English with
            <span className="block mt-1 text-gold">clarity and confidence.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-base leading-7 text-white md:text-[1.05rem]">
            You don't need a generic institute. You just need someone to hear where you stumble and fix it live. We offer highly personalized online coaching for IELTS, PTE, CELPIP, Duolingo, LanguageCert, and career English, focused entirely on removing your specific hesitation blocks.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-white/80">
            {["Live Classes", "Flexible Timings", "Personal Guidance"].map((item, index) => (
              <span key={item} className="flex items-center gap-3">
                {item}
                {index < 2 ? <span className="text-gold">/</span> : null}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <motion.a
              whileTap={{ scale: 0.99 }}
              href="#format"
              className="gold-glow inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-navy shadow-sm transition hover:bg-white/90 sm:min-h-0 sm:w-auto"
            >
              Let's figure out what's holding you back
              <Icon path={icons.arrow} className="h-4 w-4" />
            </motion.a>
            <motion.a

              href="https://wa.me/918921233005"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/10 sm:min-h-0 sm:w-auto"
            >
              Or just drop me a quick text
              <Icon path={icons.chat} className="h-4 w-4" />
            </motion.a>
          </motion.div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          className="relative"
        >
          <motion.div
            style={isE2E ? undefined : { y: yImage }}
            whileHover={isE2E ? undefined : { scale: 1.01, rotate: -0.5 }}
            className="relative mx-auto max-w-[560px] rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl origin-bottom"
          >
            <div className="absolute -left-7 top-12 hidden h-52 w-40 rounded-xl border border-white/10 bg-white/5 lg:block rotate-3" />
            <div className="absolute -right-6 bottom-10 hidden h-48 w-36 rounded-xl border border-white/10 bg-white/5 lg:block" />
            <div className="relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
              <img
                src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=1100&q=70"
                srcSet="
                  https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=640&q=70 640w,
                  https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=960&q=70 960w,
                  https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=1280&q=70 1280w
                "
                sizes="(max-width: 1024px) 100vw, 560px"
                alt="Founder mentor of Think in English"
                width={1200}
                height={1440}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-[340px] w-full object-cover md:h-[400px] scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-navy/80 to-transparent p-6 pt-24 text-center md:text-left">
                <p className="text-sm font-bold tracking-widest uppercase text-white/90">
                  Teaching doesn't happen without trust.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/50">Learning Model</p>
                <p className="mt-1 text-sm font-bold text-white">Live classes / 1:1 & Group options</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/50">Student Trust</p>
                <p className="mt-1 text-sm font-bold text-white whitespace-nowrap">Rigorous, measured progress</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const list: TrustItem[] = trustItems;
  return (
    <section className="pt-24 md:pt-32 pb-10">
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
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className={`section-shell ${sectionSpacing}`}>
      <div className={`relative ${pageContainer} grid gap-14 lg:grid-cols-[1.25fr_0.75fr] items-start`}>
        <div className="relative z-10 lg:-mr-12">
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
            <div className="mt-8 border-l-[3px] border-white/20 pl-6 md:mt-10 md:pl-8">
              <p className="text-xl font-medium text-white md:text-[1.35rem]">
                You can't lecture someone into fluency.
              </p>
              <p className="mt-5 max-w-xl text-[1.05rem] leading-[1.8] text-white text-justify">
                Fluency isn’t about memorizing rules—it’s about moving past hesitation and nerves to express ideas clearly. Instead of traditional lectures, this coaching focuses on real-time practice and instant feedback tailored to your goals, whether you are preparing for IELTS, an interview, or workplace communication. By identifying your specific speech patterns and correcting them on the spot, the program builds the genuine confidence needed to handle real-world pressure.
              </p>
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
                <p className="mt-3 text-sm leading-7 text-white">{item.note}</p>
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

          <div className="grid gap-4 md:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/50">Who we train</p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-white/80">
                {[
                  "12th graduates preparing for higher studies, interviews, and admissions.",
                  "Working professionals who need confident spoken English for career growth.",
                  "Abroad aspirants preparing for IELTS, PTE, CELPIP, Duolingo, and LanguageCert."
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/50">Teaching style</p>
              <p className="mt-4 text-lg font-semibold leading-8 text-white">
                Less lecture. More guidance, speaking correction, and course design built around the learner.
              </p>
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
          copy="I don't believe in running a factory. The coaching is designed to feel dependable and distinctly human. That means honest feedback and a clear sense of progress. Every session is led directly by the founder, ensuring consistent quality and personalized attention. We focus on practical communication skills that transfer directly to real-world situations, whether you're preparing for international exams or professional presentations."
          titleClass="text-white"
          eyebrowClass="text-white/50"
          copyClass="text-white"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {whyItems.map((item, index) => {
            const isWide = index === 0 || index === 3;
            const spanClass = isWide ? "md:col-span-2 xl:col-span-2" : "col-span-1";
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}

                className={[
                  "group flex flex-col justify-between gap-8 rounded-xl border border-white/10 bg-white/5 p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all",
                  spanClass,
                  isWide ? "lg:flex-row lg:items-center" : ""
                ].join(" ")}
              >
                <div>
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-gold shadow-sm transition-transform duration-500 group-hover:scale-110">
                    <Icon path={icons[item.icon]} className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-serif leading-tight text-white lg:text-[1.8rem]">{item.title}</h3>
                </div>
                <div className={isWide ? "lg:max-w-md" : ""}>
                  <p className="text-sm leading-8 text-white md:text-base">{item.copy}</p>
                  <div className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                    <span className="h-px w-10 bg-gold/50" />

                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
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
  return (
    <motion.article
      variants={cardVariants}
      whileHover="hover"
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_16px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.2)] hover:border-gold/30 transition-all duration-700 flex flex-col cursor-pointer"
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
      <p className="mt-5 max-w-md text-sm leading-8 text-white md:text-[0.95rem] relative z-10">{course.outcome}</p>

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
    </motion.article>
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
          copy="I don't force you into rigid batches. Whether you want intense 1:1 focus or a consistent small group, we figure out a structure that you actually look forward to attending. Every class format is built to keep feedback immediate, progress visible, and practice aligned with your current level."
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
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/12 text-[#f3d7b5]">
                  <Icon path={icons[item.icon]} className="h-6 w-6" />
                </div>
                <h3 className="mt-8 font-serif text-3xl leading-tight text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/72">{item.text}</p>
                <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.16em] text-white/48">{item.meta}</p>
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
                    <p className="mt-1 text-sm leading-7 text-white">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-7 text-white/68">
              The point of this structure is simple: delayed feedback keeps bad habits alive. Live correction shortens the learning loop, which is why students usually feel progress faster in speaking confidence, sentence flow, and exam control.
            </p>
          </motion.div>
        </div>
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
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className={`section-shell ${sectionSpacing}`}>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
                      <div className="px-6 pb-7 text-sm leading-8 text-white md:px-7 md:text-base">{answer}</div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const currentForm = form.current;
    if (!currentForm) return;

    setLoading(true);

    const formData = new FormData(currentForm);
    const data = {
      user_name: formData.get('user_name'),
      user_phone: formData.get('user_phone'),
      user_email: formData.get('user_email'),
      message: formData.get('message'),
      exam_date: formData.get('exam_date'),
    };

    fetch('/api/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || 'Server error');
          });
        }
        return res.json();
      })
      .then(() => {
        setLoading(false);
        setSubmitted(true);
        currentForm.reset();
        globalThis.setTimeout(() => setSubmitted(false), 3000);
      })
      .catch((error) => {
        setLoading(false);
        console.error("FAILED...", error);
        alert(`Failed to send message: ${error.message}`);
      });
  };

  const contactChips = [
    ["WhatsApp/Call", "+91 89212 33005", "https://wa.me/918921233005", "chat"],
    ["Email", "hello@thinkinenglish.in", "mailto:hello@thinkinenglish.in", "mail"]
  ] as const;

  const getButtonText = () => {
    if (loading) return "Sending...";
    if (submitted) return "I'll be in touch soon";
    return "Send directly to my inbox";
  };

  const getButtonIcon = () => {
    return submitted ? icons.check : icons.arrow;
  };

  return (
    <section id="contact" className={`section-shell ${sectionSpacing}`}>
      <div className={`relative ${pageContainer}`}>
        <div className="overflow-hidden rounded-xl border border-border bg-navy shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[.95fr_1.05fr]">
            <div className="p-8 text-white md:p-10 lg:p-12">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/52">Contact</p>
              <h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight text-white md:text-[3.2rem]">
                Start with a demo class and get the right recommendation.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/74">
                Share your goal, target exam, or confidence challenge. We will suggest the most suitable course format and timing instead of pushing a generic batch.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {contactChips.map(([label, value, href, icon]) => {

                  return (
                    <motion.a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex min-h-12 w-full items-center gap-3 rounded-full border border-border/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white sm:w-auto"
                    >
                      <span className="rounded-full bg-white/12 p-2">
                        <Icon path={icons[icon]} className="h-4 w-4" />
                      </span>
                      <span>{label}: {value}</span>
                    </motion.a>
                  );
                })}
              </div>


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

                  href="https://wa.me/918714278397?text=Hi%2C%20I%20would%20like%20to%20book%20a%20demo%20class.%20Please%20share%20available%20slots."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-gold bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md shadow-[0_12px_30px_rgba(1,54,72,0.08)] transition-all hover:bg-white/10 sm:w-fit"
                >
                  Message me on WhatsApp
                  <Icon path={icons.chat} className="h-[18px] w-[18px]" />
                </motion.a>

                <form ref={form} onSubmit={handleSubmit} className="mt-10 grid gap-6">
                  <p className="flex items-center gap-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white/40">
                    <span className="flex-1 h-px bg-white/10" />
                    <span className="mx-3">Or send an email enquiry</span>
                    <span className="flex-1 h-px bg-white/10" />
                  </p>
                  {[
                    ["Your Name", "text", "How should I address you - ", "user_name"],
                    ["WhatsApp Number", "tel", "So I can reach out directly", "user_phone"],
                    ["Your Email ID", "email", "So I can send you a mail", "user_email"],
                    ["What are you struggling with - ", "text", "Example: IELTS Writing or spoken hesitation", "message"]
                  ].map(([label, type, placeholder, name]) => (
                    <label key={label} className="grid gap-2 text-sm font-bold text-white">
                      {label}
                      <input
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        required
                        onInput={name === "user_phone" ? (e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9+]/g, '') } : undefined}
                        className="rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-sm font-medium text-white placeholder-white/40 outline-none transition-all focus:-translate-y-[2px] focus:border-gold focus:shadow-[0_8px_20px_rgba(182,144,99,0.12)]"
                      />
                    </label>
                  ))}

                  <label className="grid gap-2 text-sm font-bold text-white">
                    When is your exam - (If applicable)
                    <textarea
                      name="exam_date"
                      placeholder="Give me an idea of your timeline and constraints."
                      className="min-h-[120px] rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-sm font-medium text-white placeholder-white/40 outline-none transition-all focus:-translate-y-[2px] focus:border-gold focus:shadow-[0_8px_20px_rgba(182,144,99,0.12)] resize-none"
                    />
                  </label>

                  <motion.button

                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading || submitted}
                    className={[
                      "mt-4 inline-flex items-center justify-center gap-3 rounded-full px-8 py-5 text-[13px] font-extrabold uppercase tracking-[0.16em] shadow-sm transition-colors",
                      submitted ? "bg-white text-navy" : "bg-gold text-white hover:bg-gold/90",
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    ].join(" ")}
                  >
                    {getButtonText()}
                    <Icon path={getButtonIcon()} className="h-4 w-4" />
                  </motion.button>
                  <p className="text-center text-[13px] font-semibold text-white/50">I personally read and reply within hours.</p>
                </form>


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
    <footer className="border-t border-white/10 bg-navy py-12">
      <div className={pageContainer}>
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <button onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 font-serif text-2xl text-white hover:opacity-80" aria-label="Think in English - Home">
              <img src="/logo.png" alt="Think in English Logo" className="h-14 w-auto object-contain rounded-md" />
              <span><span className="text-gold">Think</span> in English</span>
            </button>
            <p className="mt-2 text-sm text-white">Unravel your journey of English</p>
            <div className="mt-4 text-xs leading-6 text-white/50">
              <p>Phone: +91 89212 33005</p>
              <p>Email: hello@thinkinenglish.in</p>
            </div>
          </div>
          <div className="flex justify-start md:justify-end gap-3">
            {socialIcons.map(([label, href, path]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                aria-label={label}
              >
                <Icon path={path} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          Copyright 2024 Think in English. Unravel Your Journey of English.
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <>
      <motion.a
        href="https://wa.me/918921233005"
        target="_blank"
        rel="noopener noreferrer"

        whileTap={{ scale: 0.98 }}
        className="fixed bottom-5 right-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-gold text-navy shadow-sm md:inline-flex hover:bg-gold/90 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <Icon path={icons.chat} className="h-6 w-6" />
      </motion.a>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy/95 backdrop-blur-md px-4 py-3 md:hidden">
        <div className="mx-auto flex w-full max-w-md gap-3">
          <a href="#contact" className="flex-1 rounded-full bg-white px-4 py-3 text-center text-base font-extrabold uppercase tracking-[0.08em] text-navy">
            Book Demo
          </a>
          <a
            href="https://wa.me/918921233005"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-3 text-center text-base font-extrabold uppercase tracking-[0.08em] text-white"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
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
