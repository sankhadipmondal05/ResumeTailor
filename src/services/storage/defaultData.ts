import { Resume } from "../../types/resume";

export const defaultMasterResume: Resume = {
  id: "master-default-001",
  name: "Master Resume",
  type: "master",
  contact: {
    fullName: "Sankhadip Mondal",
    title: "Full Stack Developer",
    email: "sankhadip.mondal05@gmail.com",
    phone: "9748902965",
    location: "Kolkata, West Bengal, India",
    linkedin: "https://www.linkedin.com/in/sankhadip-mondal-506b953ba/",
    github: "https://github.com/sankhadipmondal05",
    portfolio: "https://sankhadip-professional-portfolio.vercel.app/"
  },
  summary: "Frontend Developer and UI/UX Designer skilled in React, JavaScript, Figma, and responsive web development. Experienced in translating designs and references into polished, interactive web interfaces, with a focus on usability, visual quality, animations, testing, and refinement.",
  experience: [
    {
      id: "exp-1",
      company: "MathPirate",
      role: "Freelance UI/UX & Frontend Developer",
      location: "Remote",
      startDate: "April 2026",
      endDate: "",
      current: true,
      bullets: [
        "Designed wireframes, prototypes, and the frontend for a STEM institute's highly converting enrollment site",
        "Helped the institute sign 25+ new students after launch, increased enrollment by 20%.",
        "Organized course info into clear tracks so parents self-serve schedules and fees."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Origamy - Document Scanner & PDF Application",
      url: "https://github.com/sankhadipmondal05/Origamy",
      technologies: [
        "React 19 • Vite • OpenCV.js • Tesseract.js • Capacitor"
      ],
      bullets: [
        "Built a cross-platform document-scanning application with 50+ downloads, covering scanning, perspective correction, OCR extraction, and PDF generation.",
        "Optimized the document-processing workflow, reducing processing friction by 96% through client-side image processing and streamlined UI interactions.",
        "Developed a responsive mobile-first interface with React and Capacitor, focusing on usability across web and Android environments."
      ]
    },
    {
      id: "proj-2",
      name: "TechVault - Technical Learning Platform",
      url: "https://techvault-one-blush.vercel.app/",
      technologies: [
        "React • TypeScript • Node.js • Express • MongoDB • YouTube IFrame API"
      ],
      bullets: [
        "Designed and developed a structured technical learning platform with focused learning paths, that has been used and tested by 25+ users across different devices and learning scenarios.",
        "Implemented a 92% video-completion tracking threshold using the YouTube IFrame API to monitor learner progress.",
        "Iteratively refined the interface based on user feedback, improving navigation clarity and overall usability by 98% based on testing results."
      ]
    },
    {
      id: "proj-mu7uybnn",
      name: "Wallify - Wallpaper Platform",
      url: "https://wallify-theta.vercel.app/",
      technologies: [
        "React • Vite • CSS • GSAP • JavaScript"
      ],
      bullets: [
        "Designed and developed an immersive wallpaper showcase focused on visual discovery, high-quality presentation, and smooth interactions.",
        "Built a self-developed animation engine to power custom UI animations, transitions, and interactive visual effects. Optimized animation sequencing and transitions to create a smooth, immersive browsing experience across the interface.",
        "Reduced visual rendering and interaction overhead by 87% through optimized animation handling and frontend implementation."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Future Institute of Engineering and Management",
      degree: "B.Tech",
      field: "Computer Science & Engineering",
      location: "",
      startDate: "",
      endDate: "May 2027",
      gpa: "8.33",
      details: ""
    }
  ],
  skills: [
    {
      id: "sk-1",
      name: "Frontend Development",
      skills: [
        "React",
        "JavaScript (ES6+)",
        "HTML5",
        "CSS",
        "Tailwind CSS",
        "Vite",
        "Responsive Web Design"
      ]
    },
    {
      id: "sk-2",
      name: "UI/UX Design",
      skills: [
        "Figma",
        "UI Design",
        "UX Design",
        "Wireframing",
        "Prototyping",
        "Design Systems",
        "Relume"
      ]
    },
    {
      id: "sk-3",
      name: "Testing & Quality",
      skills: [
        "Functional Testing",
        "A/B Testing",
        "Responsive Testing",
        "Debugging",
        "Cross-Browser Testing"
      ]
    },
    {
      id: "sk-mu7vrhu9",
      name: "Backend",
      skills: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "REST APIs"
      ]
    },
    {
      id: "sk-4",
      name: "Databases & Tools",
      skills: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Git"
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "MERN Stack Development",
      issuer: "Ardent Computech Pvt. Ltd.",
      date: "Mar 2025",
      url: ""
    },
    {
      id: "cert-2",
      name: "Cloud-Based Full Stack Development with AI & ML Integration",
      issuer: "Ardent Computech Pvt. Ltd.",
      date: "Mar 2025",
      url: ""
    }
  ],
  settings: {
    fontFamily: "Inter",
    fontSize: 9.5,
    lineHeight: 1.15,
    margin: 10,
    sectionSpacing: 7,
    letterSpacing: 0
  },
  createdAt: "2026-09-18T13:35:27.366Z",
  updatedAt: new Date().toISOString()
};
