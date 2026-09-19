export const DOMAIN_DICTIONARY = {
  technical: [
    "react", "typescript", "javascript", "python", "golang", "go", "java", "c++", "c#", "ruby", "rust", "php",
    "html", "html5", "css", "css3", "sass", "sql", "nosql", "node.js", "nodejs", "node", "express", "next.js",
    "nextjs", "vue", "angular", "fastapi", "django", "flask", "spring", "asp.net", "graphql", "rest", "restful",
    "apis", "api", "microservices", "distributed systems", "websocket", "grpc", "redux", "zustand", "mobx",
    "tailwind", "tailwindcss", "material-ui", "mui", "bootstrap", "pandas", "numpy", "pytorch", "tensorflow",
    "swift", "kotlin", "scala", "dart", "flutter", "react native", "graphql", "trpc", "prisma", "drizzle",
    "electron", "serverless"
  ],
  tools: [
    "git", "github", "gitlab", "docker", "kubernetes", "k8s", "aws", "amazon web services", "azure", "gcp",
    "google cloud", "terraform", "ci/cd", "github actions", "jenkins", "linux", "redis", "postgresql", "postgres",
    "mysql", "mongodb", "kafka", "rabbitmq", "elasticsearch", "jest", "cypress", "playwright", "webpack", "vite",
    "jira", "datadog", "sentry", "prometheus", "grafana", "figma", "postman", "snowflake", "bigquery", "dynamodb",
    "sqs", "sns", "nginx", "supabase", "firebase", "vercel"
  ],
  methodologies: [
    "agile", "scrum", "kanban", "tdd", "test driven development", "bdd", "ci/cd", "continuous integration",
    "continuous delivery", "clean architecture", "domain driven design", "code review", "system design",
    "performance optimization", "refactoring", "object oriented programming", "functional programming",
    "accessibility", "wcag", "seo", "security", "devops", "mlops", "data modeling", "unit testing",
    "integration testing", "e2e testing", "event-driven", "restful api design"
  ],
  softSkills: [
    "collaboration", "cross-functional", "leadership", "mentorship", "communication", "problem solving",
    "project management", "time management", "stakeholder management", "adaptability", "analytical thinking",
    "team player", "critical thinking", "ownership", "strategic thinking", "troubleshooting", "innovation"
  ]
};

// Aliases and standardizations
export const SYNONYMS: Record<string, string> = {
  "react.js": "react",
  "reactjs": "react",
  "ts": "typescript",
  "js": "javascript",
  "node": "node.js",
  "nodejs": "node.js",
  "next": "next.js",
  "nextjs": "next.js",
  "k8s": "kubernetes",
  "amazon web services": "aws",
  "google cloud platform": "gcp",
  "google cloud": "gcp",
  "postgres": "postgresql",
  "ui/ux": "ux",
  "ui ux": "ux",
  "user experience": "ux",
  "ci-cd": "ci/cd",
  "cicd": "ci/cd",
  "test-driven development": "tdd",
  "tailwind": "tailwindcss",
  "mui": "material-ui"
};
