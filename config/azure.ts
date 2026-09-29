/* ============================================================
   AZURE STAFFING · /services/azure (the Cloud service)

   A specialist page, listed under Services as "Cloud", drawn by the
   shared SpecialistPage renderer, the same shape as Oracle ERP.

   Source: the client's "Azure Staffing Website Content" document.
   Everything here is taken from it or plainly derived from it. It
   carries no statistics, clients, partnerships or Microsoft
   credentials of our own, and neither may this page. "Certifications"
   appears only as something we screen candidates against, which is
   how the source uses it. Product names are role vocabulary.
   ============================================================ */

import type { Discipline, StackGroup } from "./industry-pages";
import type { SpecialistPage } from "./specialist-page";

export const AZURE = {
  slug: "azure",
  meta: {
    title: "Azure staffing",
    description:
      "Microsoft Azure talent for cloud transformation: cloud and infrastructure, data and analytics, AI and machine learning, DevOps and application development, security and program talent, on contract, contract-to-hire, direct hire or as a project team.",
  },
  hireContext: { industry: "information-technology", service: "Azure staffing" },
  jobsLabel: "View Azure jobs",

  hero: {
    eyebrow: "Azure staffing",
    lead: "Microsoft Azure talent",
    accent: "for your cloud transformation.",
    photo: "industryItHero",
    sub: "Skilled Azure professionals for cloud migrations, modernization, application development, data platforms and ongoing cloud operations. From individual specialists to complete project teams.",
    facts: [
      {
        figure: "Infrastructure to AI",
        caption: "cloud, data, AI, DevOps, application, security and architecture talent",
      },
      {
        figure: "One specialist to a team",
        caption: "a single hard-to-find skill, or a project team built around the work",
      },
      {
        figure: "Migration to operations",
        caption: "talent for every stage of the Azure journey, from cloud strategy to ongoing operations",
      },
    ],
  },

  overview: {
    eyebrow: "Why it is hard",
    heading: "Azure teams need more than one kind of cloud skill.",
    paragraphs: [
      "Building and scaling an Azure team takes specialized skills across cloud infrastructure, application modernization, data, AI, DevOps, security and architecture.",
      "We find and deploy the Azure professionals behind migrations, modernization initiatives, application development, data platforms and ongoing cloud operations, when you need them.",
    ],
    values: [
      {
        name: "Specialized Azure talent",
        body: "Professionals across Azure infrastructure, data, AI, DevOps, application development and security.",
      },
      {
        name: "Flexible workforce models",
        body: "Contract staffing, direct hire, contract-to-hire, staff augmentation or a project team.",
      },
      {
        name: "Faster access to skills",
        body: "Less of your own effort spent finding hard-to-source cloud professionals.",
      },
      {
        name: "Technology-focused screening",
        body: "Candidates evaluated against the specific technical requirements of your role.",
      },
      {
        name: "Scalable talent",
        body: "One specialist or an entire Azure team, as your workforce requirements change.",
      },
      {
        name: "A long-term partner",
        body: "As your cloud strategy evolves, your talent needs evolve with it, and we scale with you.",
      },
    ],
    photo: "industriesTeam",
    caption: "The right person for the role, not the nearest resume.",
  },

  talent: {
    eyebrow: "What we staff",
    heading: "Build your Azure team with the right expertise.",
    intro: "Specialized Azure talent across the cloud lifecycle, from one role to every discipline a program needs.",
    labels: { tools: "Roles we fill", standards: "Platforms" },
    disciplines: [
      {
        id: "cloud",
        name: "Cloud and infrastructure",
        photo: "/photos/roles/information-technology-cloud.jpg",
        photoAlt: "A cloud engineer talking a colleague through an architecture diagram",
        builds: "Cloud infrastructure, networking, compute, storage, containers and virtualization on Azure.",
        seniority: "Azure administrator and engineer through to cloud and solutions architect",
        tools: [
          "Azure Cloud Engineer",
          "Azure Cloud Architect",
          "Infrastructure Engineer",
          "Azure Administrator",
          "Solutions Architect",
          "Network Engineer",
          "AVD Specialist",
          "AKS Engineer",
        ],
        standards: ["Azure Virtual Desktop", "AKS", "Networking", "Containers"],
      },
      {
        id: "data",
        name: "Data and analytics",
        photo: "/photos/roles/information-technology-data.jpg",
        photoAlt: "A data engineer working between a dashboard and a notebook",
        builds: "Data engineering and analytics on Azure Data Factory, Synapse, Databricks and Microsoft Fabric, through to the reporting a business decides on.",
        seniority: "Data analyst through to data architect",
        tools: [
          "Azure Data Engineer",
          "Azure Data Architect",
          "Databricks Engineer",
          "Synapse Specialist",
          "Fabric Professional",
          "Power BI Developer",
          "Data Analyst",
        ],
        standards: ["Data Factory", "Synapse", "Databricks", "Microsoft Fabric", "Power BI"],
      },
      {
        id: "ai",
        name: "AI and machine learning",
        photo: "/photos/level-specialized.jpg",
        photoAlt: "A data scientist studying model results across two screens",
        builds: "Azure AI, Azure OpenAI, machine learning, generative AI and the MLOps that keeps models running in production.",
        seniority: "Machine learning engineer through to AI solution architect",
        tools: [
          "Azure AI Engineer",
          "ML Engineer",
          "Data Scientist",
          "Azure OpenAI Specialist",
          "Generative AI Engineer",
          "AI Solution Architect",
          "MLOps Engineer",
        ],
        standards: ["Azure AI", "Azure OpenAI", "Machine learning", "MLOps"],
      },
      {
        id: "devops",
        name: "DevOps and applications",
        photo: "/photos/roles/information-technology-software.jpg",
        photoAlt: "A developer working across two monitors of code",
        builds: "Cloud-native applications and services on Azure, and the CI/CD, automation and platform engineering that ship them.",
        seniority: "Developer and DevOps engineer through to application and DevOps architect",
        tools: [
          "Azure DevOps Engineer",
          "DevOps Architect",
          "Cloud-Native Developer",
          ".NET Developer",
          "Full-Stack Developer",
          "Application Architect",
          "Site Reliability Engineer",
          "Platform Engineer",
        ],
        standards: ["Azure DevOps", "GitHub", "CI/CD", "Kubernetes"],
      },
      {
        id: "security",
        name: "Security and compliance",
        photo: "/photos/roles/information-technology-security.jpg",
        photoAlt: "A cloud security engineer monitoring alerts across three screens",
        builds: "Azure security, identity, governance, compliance and security operations that protect the environment.",
        seniority: "Security operations engineer through to cloud security architect",
        tools: [
          "Azure Security Engineer",
          "Cloud Security Architect",
          "IAM Specialist",
          "Entra ID Specialist",
          "SecOps Engineer",
          "Cloud Governance Specialist",
          "Compliance and Risk",
        ],
        standards: ["Microsoft Entra ID", "Identity", "Governance", "Security operations"],
      },
      {
        id: "program",
        name: "Project and program",
        photo: "/photos/employer-team.jpg",
        photoAlt: "A program lead briefing a small team around a desk",
        builds: "The leadership, analysis and change management that turn a cloud roadmap into a delivered transformation.",
        seniority: "Business analyst and technical lead through to program manager and cloud transformation lead",
        tools: [
          "Program Manager",
          "Project Manager",
          "Transformation Lead",
          "Cloud Architect",
          "Business Analyst",
          "Technical Lead",
          "Solution Architect",
          "Change Management",
        ],
        standards: ["Cloud transformation", "Delivery", "Change management"],
      },
    ] satisfies Discipline[],
  },

  scope: {
    eyebrow: "The Microsoft ecosystem",
    heading: "Find Azure talent across the Microsoft ecosystem.",
    intro:
      "One talent partner across your cloud technology landscape. Tell us which of these your team runs on and we will tell you how we would staff it.",
    groups: [
      {
        name: "Azure infrastructure",
        items: ["Cloud infrastructure", "Networking", "Compute", "Storage", "Containers", "Virtualization"],
      },
      {
        name: "Azure data",
        items: ["Azure Data Factory", "Azure Synapse", "Databricks", "Microsoft Fabric", "Data engineering", "Analytics"],
      },
      {
        name: "Azure AI",
        items: ["Azure AI", "Azure OpenAI", "Machine learning", "Generative AI", "MLOps"],
      },
      {
        name: "DevOps and engineering",
        items: ["Azure DevOps", "CI/CD", "GitHub", "Kubernetes", "Containers", "Automation", "Platform engineering"],
      },
      {
        name: "Security and identity",
        items: ["Microsoft Entra ID", "Azure security", "Identity", "Governance", "Compliance", "Security operations"],
      },
      {
        name: "Microsoft Power Platform",
        items: ["Power BI", "Power Apps", "Power Automate", "Microsoft business applications"],
      },
    ] satisfies StackGroup[],
  },

  pullQuote: "The right cloud talent can accelerate your transformation.",

  path: {
    eyebrow: "Our approach",
    heading: "More than resumes. The right Azure talent for the role.",
    intro:
      "Our approach to technology staffing starts with your environment and ends with the right person working in it, and it keeps going as the program changes.",
    steps: [
      {
        title: "Understand",
        body: "Your cloud environment, project objectives, technical requirements and workforce gaps.",
      },
      {
        title: "Identify",
        body: "Professionals sourced for relevant Azure skills and experience.",
      },
      {
        title: "Screen",
        body: "Candidates evaluated against your required technical experience, certifications, project exposure and role requirements.",
      },
      {
        title: "Validate",
        body: "Technical and functional alignment assessed before anyone is presented to you.",
      },
      {
        title: "Deploy",
        body: "Selected professionals join your team through the engagement model that fits your requirements.",
      },
      {
        title: "Scale",
        body: "As your cloud program changes, specialized talent added or adjusted with it.",
      },
    ],
  },

  lifecycle: {
    eyebrow: "Across the journey",
    heading: "Talent for every stage of your Azure journey.",
    intro: "From cloud strategy to ongoing operations, the skills you need change with the work.",
    stages: [
      {
        name: "Cloud migration",
        body: "Teams with the expertise to assess, plan, migrate and optimize workloads on Azure.",
      },
      {
        name: "Modernization",
        body: "Application, architecture, DevOps and cloud-native talent to modernize legacy environments.",
      },
      {
        name: "Cloud-native development",
        body: "Developers and architects experienced in building scalable applications and services on Azure.",
      },
      {
        name: "Data and AI",
        body: "Azure data engineers, AI engineers, data scientists and MLOps professionals for data and AI initiatives.",
      },
      {
        name: "Security",
        body: "Specialized cloud security and identity expertise to protect your Azure environment.",
      },
      {
        name: "Cloud operations",
        body: "Azure infrastructure, DevOps, SRE and platform engineering professionals to scale your operations team.",
      },
    ],
  },

  engagements: {
    eyebrow: "Staffing models",
    heading: "Flexible staffing models for Azure teams.",
    intro: "Workforce solutions built around your requirements, not ours.",
    options: [
      {
        name: "Contract staffing",
        body: "Specialized Azure professionals for a defined project, skill requirement or period.",
      },
      {
        name: "Contract-to-hire",
        body: "Azure talent evaluated in your environment before you make a permanent hiring decision.",
      },
      {
        name: "Direct hire",
        body: "Experienced Azure professionals for long-term positions in your organization.",
      },
      {
        name: "Staff augmentation",
        body: "Specialized cloud expertise added to your technology team without increasing permanent headcount.",
      },
      {
        name: "Project-based teams",
        body: "Dedicated teams across architecture, development, DevOps, data, AI, security and cloud operations.",
      },
    ],
  },

  brief: {
    eyebrow: "Start here",
    heading: "Need Azure talent?",
    intro:
      "Tell us about your cloud environment, your objectives and the gap you need filled. That is enough for a straight answer on the profiles and the staffing model that fit.",
    items: [
      "Your Azure environment and the services in scope",
      "The objective: migration, modernization, data and AI, security or operations",
      "The technical requirements, and any certifications the role needs",
      "The gap: one specialist, several roles or a whole team",
      "Location, and whether the work is on site, hybrid or remote",
      "Start date, duration and the staffing model you prefer",
    ],
  },

  candidates: {
    eyebrow: "For Azure professionals",
    heading: "Work in Azure? Tell us where you fit.",
    body: "We place Azure professionals into migrations, modernization programs, data and AI platforms and cloud operations teams. Pick the area closest to your experience to register interest, and a recruiter will come back to you with what is actually open.",
    roles: [
      { title: "Azure Cloud Engineer", area: "Cloud and infrastructure" },
      { title: "Azure Solutions Architect", area: "Cloud and infrastructure" },
      { title: "Azure Data Engineer", area: "Data and analytics" },
      { title: "Azure AI Engineer", area: "AI and machine learning" },
      { title: "Azure DevOps Engineer", area: "DevOps and applications" },
      { title: "Site Reliability Engineer", area: "DevOps and applications" },
      { title: "Azure Security Engineer", area: "Security and compliance" },
      { title: "Cloud Transformation Lead", area: "Project and program" },
    ],
  },

  faqs: [
    {
      q: "Can you provide a whole Azure team, not just one person?",
      a: "Yes. Project-based teams can span architecture, development, DevOps, data, AI, security and cloud operations, and you can start with one specialist and add to it as the program grows.",
    },
    {
      q: "Which staffing models can we use?",
      a: "Contract staffing, contract-to-hire, direct hire, staff augmentation and project-based teams. Many programs use more than one.",
    },
    {
      q: "How do you screen Azure candidates?",
      a: "Against your required technical experience, certifications, project exposure and role requirements, and we assess technical and functional alignment before we present anyone.",
    },
    {
      q: "Do you cover data and AI, or only infrastructure?",
      a: "Both. Alongside cloud and infrastructure we staff Azure data engineers and architects, Databricks, Synapse and Fabric specialists, AI and machine learning engineers, data scientists and MLOps professionals.",
    },
    {
      q: "Can we try someone before hiring them permanently?",
      a: "Yes. Contract-to-hire lets you evaluate Azure talent in your own environment before you make a permanent decision.",
    },
    {
      q: "Can you help beyond Azure itself?",
      a: "Yes, across the Microsoft ecosystem: Microsoft Entra ID for identity, GitHub and Azure DevOps for engineering, and the Power Platform, including Power BI, Power Apps and Power Automate.",
    },
  ],

  cta: {
    heading: "Build the cloud team your transformation requires.",
    body: "Migrating workloads, modernizing applications, building an AI platform, strengthening cloud security or expanding your operations team: tell us which, and we will find the Azure talent for it.",
  },
} satisfies SpecialistPage;
