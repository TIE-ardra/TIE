import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const testimonials = [
  {
    text: "The founder doesn't just grade your essays. He corrects how you think when constructing sentences. The impact on my IELTS score was immediate.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Anjali Nair",
    role: "IELTS 8.0 Achiever",
  },
  {
    text: "Finally, coaching that doesn't feel like a factory. We broke down my hesitations in spoken English during the 1:1 sessions until I stopped translating in my head.",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Akhil Joseph",
    role: "Working Professional",
  },
  {
    text: "I was extremely anxious about speaking, but the live corrections were done with so much patience. It never felt like I was being judged.",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Riya Mathew",
    role: "Study Abroad Aspirant",
  },
  {
    text: "PTE templates only take you so far. The coaching helped me apply them so naturally that the algorithm didn't flag me. Got my desired score in 4 weeks.",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Akash Kurian",
    role: "PTE Cleared",
  },
  {
    text: "Flexible scheduling saved me. Being able to prep for my CELPIP during the weekends with direct founder guidance made all the difference.",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Sneha Pillai",
    role: "Migrating to Canada",
  },
  {
    text: "No junior tutors. No massive batches. Every single piece of my writing was reviewed line by line. You just don't get this level of care elsewhere.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Meera Krishnan",
    role: "Duolingo Prep",
  },
  {
    text: "My corporate emails and presentation confidence completely transformed. The focus is on authentic expression rather than robotic grammar.",
    image: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Rahul Rajan",
    role: "Marketing Director",
  },
  {
    text: "The roadmap we built in the demo class was exactly what we executed over the next two months. Absolute clarity and transparency from day one.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Dhanya Varma",
    role: "LanguageCert Passed",
  },
  {
    text: "He pushes you past your comfort zone but ensures you always feel supported. Best investment I made for my career communication.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=320&h=320&q=80",
    name: "Gokul Das",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 5);
const secondColumn = testimonials.slice(5);

export const Testimonials = () => {
  return (
    <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_70%,transparent)] max-h-[740px] overflow-hidden relative z-0">
      <TestimonialsColumn testimonials={firstColumn} duration={25} className="w-full max-w-sm" />
      <TestimonialsColumn testimonials={secondColumn} className="hidden sm:block w-full max-w-sm" duration={22} />
    </div>
  );
};
