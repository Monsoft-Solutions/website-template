import { db } from "../../index";
import {
  services,
  serviceFeatures,
  serviceBenefits,
  serviceProcessSteps,
  servicePricingTiers,
  servicePricingFeatures,
  serviceTechnologies,
  serviceDeliverables,
  serviceGalleryImages,
  serviceTestimonials,
  serviceFaqs,
  serviceRelated,
} from "../../schema/index";
import type {
  NewServiceFeature,
  NewServiceBenefit,
  NewServiceProcessStep,
  NewServicePricingFeature,
  NewServiceTechnology,
  NewServiceDeliverable,
  NewServiceGalleryImage,
  NewServiceTestimonial,
  NewServiceFaq,
  NewServiceRelated,
} from "@/lib/types/service";
import type { SeedOperation } from "../types/seed-config.type";

/**
 * Service data for seeding - structured data that will be normalized into multiple tables
 */
const servicesData = [
  {
    id: "1",
    title: "Web Development",
    slug: "web-development",
    shortDescription:
      "Custom websites and web applications built with modern technologies for optimal performance and user experience.",
    fullDescription:
      "Transform your digital presence with our comprehensive web development services. We create responsive, high-performance websites and web applications using cutting-edge technologies like React, Next.js, and TypeScript. Our solutions are designed to scale with your business and provide exceptional user experiences across all devices.",
    features: [
      "Responsive Design",
      "SEO Optimization",
      "Performance Optimization",
      "Content Management Systems",
      "E-commerce Integration",
      "Progressive Web Apps",
      "API Development",
      "Database Design",
    ],
    benefits: [
      "Increased online visibility and engagement",
      "Improved user experience and conversion rates",
      "Scalable architecture for future growth",
      "Fast loading times and mobile optimization",
      "Search engine friendly structure",
      "Ongoing maintenance and support",
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Planning",
        description:
          "We analyze your requirements, target audience, and business goals to create a comprehensive project roadmap.",
        duration: "1-2 weeks",
      },
      {
        step: 2,
        title: "Design & Wireframing",
        description:
          "Create wireframes and design mockups that align with your brand and user experience goals.",
        duration: "2-3 weeks",
      },
      {
        step: 3,
        title: "Development",
        description:
          "Build your website using modern technologies with clean, maintainable code and best practices.",
        duration: "4-8 weeks",
      },
      {
        step: 4,
        title: "Testing & Launch",
        description:
          "Thorough testing across devices and browsers, followed by deployment and launch.",
        duration: "1-2 weeks",
      },
      {
        step: 5,
        title: "Maintenance & Support",
        description:
          "Ongoing updates, security monitoring, and technical support to keep your site running smoothly.",
        duration: "Ongoing",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "$5,000 - $15,000",
        description: "Perfect for small businesses and startups",
        features: [
          "Up to 10 pages",
          "Responsive design",
          "Basic SEO setup",
          "Contact forms",
          "3 months support",
        ],
      },
      {
        name: "Professional",
        price: "$15,000 - $35,000",
        description: "Ideal for growing businesses",
        features: [
          "Up to 25 pages",
          "Custom functionality",
          "Advanced SEO",
          "CMS integration",
          "E-commerce features",
          "6 months support",
        ],
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$35,000+",
        description: "For large organizations with complex needs",
        features: [
          "Unlimited pages",
          "Custom integrations",
          "Advanced analytics",
          "Multi-language support",
          "Priority support",
          "12 months support",
        ],
      },
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
    ],
    deliverables: [
      "Fully responsive website",
      "Source code and documentation",
      "SEO-optimized content structure",
      "Admin dashboard (if applicable)",
      "Testing documentation",
      "Deployment and hosting setup",
    ],
    timeline: "6-12 weeks",
    category: "Development" as const,
    featuredImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=center",
    gallery: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop&crop=center",
    ],
    testimonial: {
      quote:
        "The web development team delivered exactly what we needed. Our new website has increased our leads by 150% and the user experience is fantastic.",
      author: "Sarah Johnson",
      company: "TechStart Inc.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    faq: [
      {
        question: "What technologies do you use for web development?",
        answer:
          "We use modern technologies like React, Next.js, TypeScript, and Tailwind CSS for frontend development, and Node.js with PostgreSQL for backend solutions.",
      },
      {
        question: "Do you provide ongoing maintenance?",
        answer:
          "Yes, we offer comprehensive maintenance packages that include security updates, performance optimization, and technical support.",
      },
      {
        question: "Can you integrate with our existing systems?",
        answer:
          "Absolutely! We have experience integrating with various third-party services, APIs, and existing business systems.",
      },
      {
        question: "How long does a typical project take?",
        answer:
          "Project timelines vary based on complexity, but most websites take 6-12 weeks from initial consultation to launch.",
      },
    ],
    relatedServices: [
      "mobile-app-development",
      "ui-ux-design",
      "digital-consulting",
    ],
  },
  {
    id: "2",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    shortDescription:
      "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.",
    fullDescription:
      "Bring your ideas to life with our mobile app development services. We create native iOS and Android applications, as well as cross-platform solutions using React Native and Flutter. Our apps are designed for performance, usability, and scalability.",
    features: [
      "Native iOS Development",
      "Native Android Development",
      "Cross-platform Solutions",
      "App Store Optimization",
      "Push Notifications",
      "Offline Functionality",
      "Real-time Features",
      "Payment Integration",
    ],
    benefits: [
      "Reach customers on their preferred devices",
      "Improved customer engagement and retention",
      "Direct communication through push notifications",
      "Enhanced brand visibility",
      "Revenue generation through app monetization",
      "Access to device-specific features",
    ],
    process: [
      {
        step: 1,
        title: "Strategy & Planning",
        description:
          "Define app concept, target audience, platform selection, and feature requirements.",
        duration: "1-2 weeks",
      },
      {
        step: 2,
        title: "UI/UX Design",
        description:
          "Create user-centered designs that follow platform-specific guidelines and best practices.",
        duration: "3-4 weeks",
      },
      {
        step: 3,
        title: "Development",
        description:
          "Build the app with clean, efficient code and implement all planned features.",
        duration: "8-16 weeks",
      },
      {
        step: 4,
        title: "Testing & QA",
        description:
          "Comprehensive testing on multiple devices and platforms to ensure quality.",
        duration: "2-3 weeks",
      },
      {
        step: 5,
        title: "App Store Submission",
        description:
          "Handle app store submission process and launch preparation.",
        duration: "1-2 weeks",
      },
    ],
    pricing: [
      {
        name: "Basic App",
        price: "$15,000 - $30,000",
        description: "Simple apps with core functionality",
        features: [
          "Single platform (iOS or Android)",
          "Basic UI/UX design",
          "Up to 5 screens",
          "Basic backend integration",
          "App store submission",
        ],
      },
      {
        name: "Advanced App",
        price: "$30,000 - $75,000",
        description: "Feature-rich apps for both platforms",
        features: [
          "Cross-platform development",
          "Custom UI/UX design",
          "User authentication",
          "Push notifications",
          "Payment integration",
          "Backend development",
        ],
        popular: true,
      },
      {
        name: "Enterprise App",
        price: "$75,000+",
        description: "Complex apps with advanced features",
        features: [
          "Native development",
          "Advanced integrations",
          "Real-time features",
          "Offline functionality",
          "Analytics dashboard",
          "Ongoing maintenance",
        ],
      },
    ],
    technologies: [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "Firebase",
      "AWS",
    ],
    deliverables: [
      "Mobile application for target platforms",
      "Source code and documentation",
      "App store assets and metadata",
      "Testing documentation",
      "Deployment guide",
      "User manual",
    ],
    timeline: "12-20 weeks",
    category: "Development" as const,
    featuredImage:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center",
    testimonial: {
      quote:
        "Our mobile app has been a game-changer for our business. The team delivered a beautiful, functional app that our users love.",
      author: "Mike Chen",
      company: "FitLife App",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    faq: [
      {
        question: "Should I build for iOS, Android, or both?",
        answer:
          "It depends on your target audience and budget. We can help analyze your user base and recommend the best approach, whether native or cross-platform.",
      },
      {
        question: "How much does app store approval take?",
        answer:
          "Apple App Store typically takes 1-7 days for review, while Google Play Store usually approves apps within 1-3 days.",
      },
      {
        question: "Do you help with app store optimization?",
        answer:
          "Yes, we provide complete app store optimization including metadata, screenshots, and description optimization to improve discoverability.",
      },
    ],
    relatedServices: ["web-development", "ui-ux-design", "digital-consulting"],
  },
  {
    id: "3",
    title: "UI/UX Design",
    slug: "ui-ux-design",
    shortDescription:
      "User-centered design solutions that create intuitive, engaging, and accessible digital experiences.",
    fullDescription:
      "Create exceptional user experiences with our comprehensive UI/UX design services. We combine user research, information architecture, and visual design to craft interfaces that are both beautiful and functional. Our design process ensures your digital products are intuitive, accessible, and aligned with your business goals.",
    features: [
      "User Research & Analysis",
      "Information Architecture",
      "Wireframing & Prototyping",
      "Visual Design",
      "Interaction Design",
      "Usability Testing",
      "Design Systems",
      "Accessibility Design",
    ],
    benefits: [
      "Improved user satisfaction and engagement",
      "Higher conversion rates and sales",
      "Reduced development costs through clear specifications",
      "Enhanced brand perception and credibility",
      "Better accessibility and inclusivity",
      "Data-driven design decisions",
    ],
    process: [
      {
        step: 1,
        title: "Research & Discovery",
        description:
          "Understand your users, business goals, and competitive landscape through research and analysis.",
        duration: "1-2 weeks",
      },
      {
        step: 2,
        title: "Information Architecture",
        description:
          "Structure content and functionality to create intuitive navigation and user flows.",
        duration: "1-2 weeks",
      },
      {
        step: 3,
        title: "Wireframing",
        description:
          "Create low-fidelity wireframes to establish layout and functionality without visual distractions.",
        duration: "2-3 weeks",
      },
      {
        step: 4,
        title: "Visual Design",
        description:
          "Develop high-fidelity designs that align with your brand and create engaging user interfaces.",
        duration: "3-4 weeks",
      },
      {
        step: 5,
        title: "Prototyping & Testing",
        description:
          "Build interactive prototypes and conduct usability testing to validate design decisions.",
        duration: "2-3 weeks",
      },
    ],
    pricing: [
      {
        name: "Basic Design",
        price: "$5,000 - $15,000",
        description: "Essential design for small projects",
        features: [
          "User research",
          "Wireframes",
          "Visual design",
          "Style guide",
          "Design handoff",
        ],
      },
      {
        name: "Complete UX",
        price: "$15,000 - $35,000",
        description: "Comprehensive design solution",
        features: [
          "In-depth user research",
          "Information architecture",
          "Interactive prototypes",
          "Usability testing",
          "Design system",
          "Developer handoff",
        ],
        popular: true,
      },
      {
        name: "Enterprise Design",
        price: "$35,000+",
        description: "Full-scale design for complex products",
        features: [
          "Advanced user research",
          "Multiple design iterations",
          "Accessibility audit",
          "Design system documentation",
          "Ongoing design support",
          "Team training",
        ],
      },
    ],
    technologies: [
      "Figma",
      "Adobe Creative Suite",
      "Principle",
      "InVision",
      "Maze",
      "Hotjar",
    ],
    deliverables: [
      "User research report",
      "Information architecture diagrams",
      "Wireframes and user flows",
      "High-fidelity designs",
      "Interactive prototypes",
      "Design system documentation",
      "Developer handoff assets",
    ],
    timeline: "8-12 weeks",
    category: "Design" as const,
    featuredImage:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&crop=center",
    testimonial: {
      quote:
        "The UX design process completely transformed our product. User engagement increased by 200% after implementing their recommendations.",
      author: "Emily Rodriguez",
      company: "DataFlow Solutions",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    faq: [
      {
        question: "What's the difference between UI and UX design?",
        answer:
          "UX design focuses on the overall user experience and journey, while UI design deals with the visual interface elements. Both are essential for creating successful digital products.",
      },
      {
        question: "Do you conduct user testing?",
        answer:
          "Yes, we conduct various types of user testing including usability testing, A/B testing, and user interviews to validate design decisions.",
      },
      {
        question: "Can you work with our existing brand guidelines?",
        answer:
          "Absolutely! We can work within your existing brand guidelines or help develop new ones that align with your digital product goals.",
      },
    ],
    relatedServices: [
      "web-development",
      "mobile-app-development",
      "digital-consulting",
    ],
  },
  {
    id: "4",
    title: "Digital Consulting",
    slug: "digital-consulting",
    shortDescription:
      "Strategic guidance to help businesses navigate digital transformation and optimize their technology investments.",
    fullDescription:
      "Navigate the complex digital landscape with our expert consulting services. We help businesses develop comprehensive digital strategies, optimize existing processes, and implement technology solutions that drive growth. Our consultants bring years of experience to help you make informed decisions about your digital future.",
    features: [
      "Digital Strategy Development",
      "Technology Assessment",
      "Process Optimization",
      "Digital Transformation Planning",
      "Vendor Selection & Management",
      "Performance Analysis",
      "Risk Assessment",
      "Training & Change Management",
    ],
    benefits: [
      "Clear roadmap for digital transformation",
      "Improved operational efficiency",
      "Better technology ROI",
      "Reduced implementation risks",
      "Enhanced competitive advantage",
      "Data-driven decision making",
    ],
    process: [
      {
        step: 1,
        title: "Current State Assessment",
        description:
          "Analyze your existing digital infrastructure, processes, and capabilities.",
        duration: "2-3 weeks",
      },
      {
        step: 2,
        title: "Goal Definition",
        description:
          "Work with stakeholders to define clear objectives and success metrics.",
        duration: "1 week",
      },
      {
        step: 3,
        title: "Strategy Development",
        description:
          "Create a comprehensive digital strategy aligned with your business goals.",
        duration: "3-4 weeks",
      },
      {
        step: 4,
        title: "Implementation Planning",
        description:
          "Develop detailed implementation roadmap with timelines, resources, and milestones.",
        duration: "2-3 weeks",
      },
      {
        step: 5,
        title: "Execution Support",
        description:
          "Provide ongoing guidance and support during strategy implementation.",
        duration: "Ongoing",
      },
    ],
    pricing: [
      {
        name: "Assessment",
        price: "$5,000 - $15,000",
        description: "Digital readiness evaluation",
        features: [
          "Current state analysis",
          "Technology audit",
          "Recommendations report",
          "Priority roadmap",
          "Executive presentation",
        ],
      },
      {
        name: "Strategy Development",
        price: "$15,000 - $50,000",
        description: "Comprehensive digital strategy",
        features: [
          "In-depth analysis",
          "Stakeholder workshops",
          "Detailed strategy document",
          "Implementation roadmap",
          "Change management plan",
          "Ongoing support (3 months)",
        ],
        popular: true,
      },
      {
        name: "Transformation Partner",
        price: "$50,000+",
        description: "End-to-end transformation support",
        features: [
          "Complete strategy development",
          "Implementation oversight",
          "Vendor management",
          "Team training",
          "Performance monitoring",
          "12-month support",
        ],
      },
    ],
    deliverables: [
      "Current state assessment report",
      "Digital strategy document",
      "Implementation roadmap",
      "Technology recommendations",
      "Change management plan",
      "Training materials",
      "Performance metrics framework",
    ],
    timeline: "8-16 weeks",
    category: "Consulting" as const,
    featuredImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center",
    testimonial: {
      quote:
        "Their digital strategy helped us increase efficiency by 40% and reduce costs by 25%. The roadmap was clear and actionable.",
      author: "David Park",
      company: "Manufacturing Plus",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    faq: [
      {
        question: "How do you approach digital transformation?",
        answer:
          "We take a holistic approach, considering people, processes, and technology. We start with understanding your business goals and work backwards to create a realistic implementation plan.",
      },
      {
        question: "What industries do you have experience with?",
        answer:
          "We've worked with various industries including healthcare, finance, manufacturing, retail, and technology startups.",
      },
      {
        question: "Do you help with vendor selection?",
        answer:
          "Yes, we can help evaluate and select technology vendors based on your specific requirements, budget, and long-term goals.",
      },
    ],
    relatedServices: [
      "web-development",
      "mobile-app-development",
      "cloud-solutions",
    ],
  },
  {
    id: "5",
    title: "Cloud Solutions",
    slug: "cloud-solutions",
    shortDescription:
      "Scalable cloud infrastructure and migration services to modernize your technology stack and improve performance.",
    fullDescription:
      "Modernize your infrastructure with our comprehensive cloud solutions. We help businesses migrate to the cloud, optimize existing cloud deployments, and implement scalable architectures using AWS, Azure, and Google Cloud Platform. Our solutions ensure security, performance, and cost-effectiveness.",
    features: [
      "Cloud Migration",
      "Infrastructure as Code",
      "Auto-scaling Solutions",
      "Disaster Recovery",
      "Security Implementation",
      "Cost Optimization",
      "DevOps Integration",
      "Monitoring & Analytics",
    ],
    benefits: [
      "Reduced infrastructure costs",
      "Improved scalability and flexibility",
      "Enhanced security and compliance",
      "Better disaster recovery capabilities",
      "Faster deployment and development cycles",
      "Global accessibility and reliability",
    ],
    process: [
      {
        step: 1,
        title: "Cloud Readiness Assessment",
        description:
          "Evaluate your current infrastructure and applications for cloud compatibility.",
        duration: "1-2 weeks",
      },
      {
        step: 2,
        title: "Migration Strategy",
        description:
          "Develop a comprehensive migration plan with minimal downtime and risk.",
        duration: "2-3 weeks",
      },
      {
        step: 3,
        title: "Infrastructure Setup",
        description:
          "Design and implement cloud infrastructure following best practices.",
        duration: "4-8 weeks",
      },
      {
        step: 4,
        title: "Migration Execution",
        description:
          "Execute the migration plan with careful monitoring and testing.",
        duration: "2-6 weeks",
      },
      {
        step: 5,
        title: "Optimization & Support",
        description:
          "Optimize performance and costs while providing ongoing support.",
        duration: "Ongoing",
      },
    ],
    pricing: [
      {
        name: "Cloud Assessment",
        price: "$3,000 - $10,000",
        description: "Evaluate cloud readiness",
        features: [
          "Infrastructure audit",
          "Application assessment",
          "Migration strategy",
          "Cost analysis",
          "Risk assessment",
        ],
      },
      {
        name: "Cloud Migration",
        price: "$15,000 - $75,000",
        description: "Complete migration service",
        features: [
          "Migration planning",
          "Infrastructure setup",
          "Application migration",
          "Testing & validation",
          "Training & documentation",
          "3 months support",
        ],
        popular: true,
      },
      {
        name: "Enterprise Cloud",
        price: "$75,000+",
        description: "Advanced cloud architecture",
        features: [
          "Multi-cloud strategy",
          "Advanced security",
          "Disaster recovery",
          "Performance optimization",
          "DevOps integration",
          "12 months support",
        ],
      },
    ],
    technologies: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Terraform",
    ],
    deliverables: [
      "Cloud architecture documentation",
      "Migration execution plan",
      "Infrastructure as Code templates",
      "Security configuration",
      "Monitoring and alerting setup",
      "Cost optimization recommendations",
      "Operations manual",
    ],
    timeline: "8-20 weeks",
    category: "Development" as const,
    featuredImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center",
    testimonial: {
      quote:
        "The cloud migration reduced our infrastructure costs by 30% while improving performance. The process was smooth and well-managed.",
      author: "Lisa Thompson",
      company: "HealthTech Corp",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
    faq: [
      {
        question: "Which cloud platform is best for my business?",
        answer:
          "The choice depends on your specific requirements, existing technology stack, and budget. We'll help you evaluate options and choose the best fit.",
      },
      {
        question: "How long does cloud migration take?",
        answer:
          "Migration timelines vary based on complexity and size of your infrastructure. Simple migrations can take 4-8 weeks, while enterprise migrations may take 3-6 months.",
      },
      {
        question: "What about data security during migration?",
        answer:
          "Security is our top priority. We implement encryption, access controls, and monitoring throughout the migration process to ensure your data remains secure.",
      },
    ],
    relatedServices: [
      "digital-consulting",
      "web-development",
      "mobile-app-development",
    ],
  },
];

/**
 * Execute services seeding operation
 */
const execute = async (): Promise<number> => {
  let totalInserted = 0;

  for (const serviceData of servicesData) {
    // Insert the main service record
    const [insertedService] = await db
      .insert(services)
      .values({
        title: serviceData.title,
        slug: serviceData.slug,
        shortDescription: serviceData.shortDescription,
        fullDescription: serviceData.fullDescription,
        timeline: serviceData.timeline,
        category: serviceData.category,
        featuredImage: serviceData.featuredImage,
      })
      .returning();

    totalInserted++;

    // Insert features
    if (serviceData.features.length > 0) {
      const featureValues: NewServiceFeature[] = serviceData.features.map(
        (feature, index) => ({
          serviceId: insertedService.id,
          feature,
          order: index + 1,
        })
      );
      await db.insert(serviceFeatures).values(featureValues);
    }

    // Insert benefits
    if (serviceData.benefits.length > 0) {
      const benefitValues: NewServiceBenefit[] = serviceData.benefits.map(
        (benefit, index) => ({
          serviceId: insertedService.id,
          benefit,
          order: index + 1,
        })
      );
      await db.insert(serviceBenefits).values(benefitValues);
    }

    // Insert process steps
    if (serviceData.process.length > 0) {
      const processValues: NewServiceProcessStep[] = serviceData.process.map(
        (step) => ({
          serviceId: insertedService.id,
          step: step.step,
          title: step.title,
          description: step.description,
          duration: step.duration,
        })
      );
      await db.insert(serviceProcessSteps).values(processValues);
    }

    // Insert pricing tiers and their features
    if (serviceData.pricing.length > 0) {
      for (const [pricingIndex, pricing] of serviceData.pricing.entries()) {
        const [insertedPricingTier] = await db
          .insert(servicePricingTiers)
          .values({
            serviceId: insertedService.id,
            name: pricing.name,
            price: pricing.price,
            description: pricing.description,
            popular: pricing.popular || false,
            order: pricingIndex + 1,
          })
          .returning();

        // Insert pricing tier features
        if (pricing.features.length > 0) {
          const pricingFeatureValues: NewServicePricingFeature[] =
            pricing.features.map((feature, index) => ({
              pricingTierId: insertedPricingTier.id,
              feature,
              order: index + 1,
            }));
          await db.insert(servicePricingFeatures).values(pricingFeatureValues);
        }
      }
    }

    // Insert technologies
    if (serviceData.technologies && serviceData.technologies.length > 0) {
      const technologyValues: NewServiceTechnology[] =
        serviceData.technologies.map((technology, index) => ({
          serviceId: insertedService.id,
          technology,
          order: index + 1,
        }));
      await db.insert(serviceTechnologies).values(technologyValues);
    }

    // Insert deliverables
    if (serviceData.deliverables.length > 0) {
      const deliverableValues: NewServiceDeliverable[] =
        serviceData.deliverables.map((deliverable, index) => ({
          serviceId: insertedService.id,
          deliverable,
          order: index + 1,
        }));
      await db.insert(serviceDeliverables).values(deliverableValues);
    }

    // Insert gallery images
    if (serviceData.gallery && serviceData.gallery.length > 0) {
      const galleryValues: NewServiceGalleryImage[] = serviceData.gallery.map(
        (imageUrl, index) => ({
          serviceId: insertedService.id,
          imageUrl,
          order: index + 1,
        })
      );
      await db.insert(serviceGalleryImages).values(galleryValues);
    }

    // Insert testimonial
    if (serviceData.testimonial) {
      const testimonialValue: NewServiceTestimonial = {
        serviceId: insertedService.id,
        quote: serviceData.testimonial.quote,
        author: serviceData.testimonial.author,
        company: serviceData.testimonial.company,
        avatar: serviceData.testimonial.avatar,
      };
      await db.insert(serviceTestimonials).values([testimonialValue]);
    }

    // Insert FAQs
    if (serviceData.faq.length > 0) {
      const faqValues: NewServiceFaq[] = serviceData.faq.map((faq, index) => ({
        serviceId: insertedService.id,
        question: faq.question,
        answer: faq.answer,
        order: index + 1,
      }));
      await db.insert(serviceFaqs).values(faqValues);
    }
  }

  // Insert related services relationships after all services are created
  const allServices = await db.select().from(services);
  const serviceMap = new Map(allServices.map((s) => [s.slug, s.id]));

  for (const serviceData of servicesData) {
    const serviceId = serviceMap.get(serviceData.slug);
    if (!serviceId) continue;

    if (serviceData.relatedServices.length > 0) {
      const relatedValues: NewServiceRelated[] = [];
      for (const relatedSlug of serviceData.relatedServices) {
        const relatedServiceId = serviceMap.get(relatedSlug);
        if (relatedServiceId) {
          relatedValues.push({
            serviceId,
            relatedServiceId,
          });
        }
      }
      if (relatedValues.length > 0) {
        await db.insert(serviceRelated).values(relatedValues);
      }
    }
  }

  return totalInserted;
};

/**
 * Clear services data and all related records
 */
const clear = async (): Promise<void> => {
  // Delete in reverse order of dependencies
  await db.delete(serviceRelated);
  await db.delete(servicePricingFeatures);
  await db.delete(servicePricingTiers);
  await db.delete(serviceFaqs);
  await db.delete(serviceTestimonials);
  await db.delete(serviceGalleryImages);
  await db.delete(serviceDeliverables);
  await db.delete(serviceTechnologies);
  await db.delete(serviceProcessSteps);
  await db.delete(serviceBenefits);
  await db.delete(serviceFeatures);
  await db.delete(services);
};

/**
 * Services seed operation configuration
 */
export const servicesSeed: SeedOperation = {
  config: {
    name: "services",
    order: 6,
    description: "Seed services and all related data",
  },
  execute,
  clear,
};
