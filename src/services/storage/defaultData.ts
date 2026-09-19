import { Resume } from "../../types/resume";

export const defaultMasterResume: Resume = {
  id: "master-default-001",
  name: "Master Resume",
  type: "master",
  contact: {
    fullName: "Sankhadip Mondal",
    title: "Full Stack Software Engineer",
    email: "sankhadip.mondal05@gmail.com",
    phone: "9748902965",
    location: "Kolkata, West Bengal, India",
    linkedin: "https://www.linkedin.com/in/sankhadip-mondal-506b953ba/",
    github: "https://github.com/sankhadipmondal05",
    portfolio: "https://sankhadip-professional-portfolio.vercel.app/"
  },
  summary: "Results-driven Software Engineer with 6+ years of experience architecting resilient cloud-native web applications and distributed backend systems. Proficient in React, TypeScript, Node.js, and AWS. Proven track record of improving application latency by 35% and scaling enterprise services to support over 2 million active users.",
  experience: [
    {
      id: "exp-1",
      company: "Apex Cloud Solutions",
      role: "Senior Full Stack Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "",
      current: true,
      bullets: [
        "Architected modular microservices using TypeScript, Node.js, and Docker, reducing API response times by 32% across 15 critical customer workflows.",
        "Engineered real-time collaboration dashboards using React, WebSocket, and Redux Toolkit, serving 450,000+ daily active enterprise users.",
        "Established CI/CD pipelines via GitHub Actions and AWS ECS, cutting production release turnaround from 4 hours to under 18 minutes.",
        "Mentored team of 6 junior and mid-level engineers in code review practices, clean architecture, and automated test coverage."
      ]
    },
    {
      id: "exp-2",
      company: "Beacon Data Systems",
      role: "Software Engineer",
      location: "San Jose, CA",
      startDate: "Aug 2019",
      endDate: "Dec 2021",
      current: false,
      bullets: [
        "Developed resilient RESTful and GraphQL APIs with Python FastAPI and PostgreSQL, supporting high-concurrency ingestion of 10M+ events daily.",
        "Implemented Redis caching layers that decreased database query load by 45% during peak trading intervals.",
        "Migrated legacy monolithic frontends to modern React and TypeScript with component design systems, improving Lighthouse performance score to 96."
      ]
    },
    {
      id: "exp-3",
      company: "Catalyst Interactive",
      role: "Junior Web Developer",
      location: "San Francisco, CA",
      startDate: "Jun 2018",
      endDate: "Jul 2019",
      current: false,
      bullets: [
        "Built responsive web user interfaces adhering to WCAG 2.1 AA accessibility guidelines using HTML5, CSS3, and JavaScript.",
        "Collaborated with UX designers to translate wireframes into interactive functional prototypes with automated Jest and Cypress suites."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "PulseStream Analytics Platform",
      url: "github.com/alexmorgan/pulsestream",
      technologies: ["React", "TypeScript", "Node.js", "Kafka", "PostgreSQL", "Docker"],
      bullets: [
        "Constructed an open-source real-time event analytics dashboard handling 5,000 requests/sec with sub-second aggregation.",
        "Packaged complete multi-service deployment with Docker Compose and Kubernetes Helm charts."
      ]
    },
    {
      id: "proj-2",
      name: "TaskSync Distributed Engine",
      url: "github.com/alexmorgan/tasksync",
      technologies: ["Go", "gRPC", "Redis", "AWS Lambda"],
      bullets: [
        "Designed a distributed background task scheduler offering at-least-once delivery semantics and automated failover recovery."
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
      endDate: "2027",
      gpa: "3.85 / 4.0",
      details: ""
    }
  ],
  skills: [
    {
      id: "sk-1",
      name: "Languages",
      skills: ["TypeScript", "JavaScript (ES6+)", "Python", "Go", "SQL", "HTML5/CSS3"]
    },
    {
      id: "sk-2",
      name: "Frameworks & Libraries",
      skills: ["React", "Node.js", "Express", "Next.js", "FastAPI", "Redux", "Material UI", "Tailwind CSS"]
    },
    {
      id: "sk-3",
      name: "Cloud & DevOps",
      skills: ["AWS (ECS, S3, RDS, Lambda)", "Docker", "Kubernetes", "CI/CD (GitHub Actions)", "Terraform", "Linux"]
    },
    {
      id: "sk-4",
      name: "Databases & Tools",
      skills: ["PostgreSQL", "MongoDB", "Redis", "Git", "REST APIs", "GraphQL", "Jest", "Jira"]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "Nov 2023",
      url: "aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      name: "Meta Certified Frontend Developer Professional",
      issuer: "Meta",
      date: "Mar 2022",
      url: ""
    }
  ],
  settings: {
    fontFamily: "Inter",
    fontSize: 10.5,
    lineHeight: 1.15,
    margin: 16.5,
    sectionSpacing: 12,
    letterSpacing: 0
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
