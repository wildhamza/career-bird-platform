// src/lib/data.ts
// 🦅 THE CAREER BIRD: MASTER DATASET (High-Fidelity Synthetic)
// Designed for UI/UX Development & Stress Testing

export interface Grant {
    id: string;
    title: string;
    professor: string;
    university: string;
    country: string;
    funding: string;
    type: string; // 'Full Funding', 'Partial', 'Research Assistantship', 'Self-Funded'
    skills: string[];
    link: string;
    logo: string;
    tryout: boolean; // Triggers the 'Lightning Bolt' badge
    degree: 'MS' | 'PhD'; // Degree level
    field: string; // Field of study (e.g., 'Computer Science', 'Biology', 'Engineering')
  }
  
  export const grants: Grant[] = [
    // --- GERMANY (The 'Free Tuition' Model) ---
    {
      id: "de-001",
      title: "Deep Learning for Medical Imaging",
      professor: "Dr. Daniel Cremers",
      university: "TUM Munich",
      country: "Germany",
      funding: "€50k/yr Salary (TV-L 13)",
      type: "Full Funding",
      skills: ["Python", "Computer Vision", "PyTorch"],
      link: "#",
      logo: "/assets/logo_germany_tum.png",
      tryout: true,
      degree: "PhD",
      field: "Computer Science"
    },
    {
      id: "de-002",
      title: "Privacy-Preserving Machine Learning",
      professor: "Dr. Franziska Boenisch",
      university: "Max Planck Institute",
      country: "Germany",
      funding: "Max Planck Fellowship",
      type: "Full Funding",
      skills: ["Cryptography", "Federated Learning"],
      link: "#",
      logo: "/assets/logo_germany_maxplanck.png",
      tryout: false,
      degree: "PhD",
      field: "Computer Science"
    },
  
    // --- SAUDI ARABIA (The 'High Pay' Model) ---
    {
      id: "sa-001",
      title: "6G Wireless Communication Systems",
      professor: "Dr. Mohamed-Slim Alouini",
      university: "KAUST",
      country: "Saudi Arabia",
      funding: "$30k/yr Tax-Free + Housing",
      type: "Full Funding",
      skills: ["Signal Processing", "Matlab", "Information Theory"],
      link: "#",
      logo: "/assets/logo_saudi_kaust.png",
      tryout: false,
      degree: "PhD",
      field: "Engineering"
    },
    {
      id: "sa-002",
      title: "Generative AI for Visual Computing",
      professor: "Dr. Bernard Ghanem",
      university: "KAUST",
      country: "Saudi Arabia",
      funding: "VCC Center Grant",
      type: "Full Funding",
      skills: ["Computer Vision", "Generative Models", "C++"],
      link: "#",
      logo: "/assets/logo_saudi_kaust.png",
      tryout: true,
      degree: "PhD",
      field: "Computer Science"
    },
  
    // --- USA (The 'Prestige' Model) ---
    {
      id: "us-001",
      title: "Trustworthy ML Systems (CAREER Award)",
      professor: "Dr. Han Zhao",
      university: "UIUC",
      country: "USA",
      funding: "$600k NSF Grant",
      type: "Research Assistantship",
      skills: ["Machine Learning", "Robustness", "Python"],
      link: "#",
      logo: "/assets/logo_usa_gatech.png", // Placeholder
      tryout: true,
      degree: "PhD",
      field: "Computer Science"
    },
    {
      id: "us-002",
      title: "CRISPR-Cas9 for Crop Disease Resistance",
      professor: "Dr. Jennifer Doudna (Lab)",
      university: "UC Berkeley",
      country: "USA",
      funding: "NIH Grant",
      type: "Full Funding",
      skills: ["Genetics", "CRISPR", "Biology"],
      link: "#",
      logo: "/assets/logo_usa_asu.png", // Placeholder
      tryout: false,
      degree: "PhD",
      field: "Biology"
    },
  
    // --- ASIA (The 'Tech Giant' Model) ---
    {
      id: "sg-001",
      title: "AI for Scientific Discovery",
      professor: "Dr. Yatao Bian",
      university: "NUS Singapore",
      country: "Singapore",
      funding: "President's Fellowship",
      type: "Full Funding",
      skills: ["Graph Neural Networks", "Reasoning"],
      link: "#",
      logo: "/assets/logo_asia_nus.png",
      tryout: true,
      degree: "PhD",
      field: "Computer Science"
    },
    {
      id: "kr-001",
      title: "Human-Robot Interaction (NLP)",
      professor: "Dr. Alice Oh",
      university: "KAIST",
      country: "South Korea",
      funding: "BK21 Program",
      type: "Full Funding",
      skills: ["NLP", "HCI", "Korean/English"],
      link: "#",
      logo: "/assets/logo_asia_kaist.png",
      tryout: false,
      degree: "PhD",
      field: "Computer Science"
    },
  
    // --- CANADA (The 'AI Hub' Model) ---
    {
      id: "ca-001",
      title: "Reinforcement Learning Architectures",
      professor: "Dr. Yoshua Bengio",
      university: "Mila / U of Montreal",
      country: "Canada",
      funding: "$40k CAD/yr",
      type: "Lab Track",
      skills: ["Deep Learning", "Math"],
      link: "#",
      logo: "/assets/logo_can_toronto.png", // Placeholder
      tryout: true,
      degree: "PhD",
      field: "Computer Science"
    },

    // --- UK (The 'Research Excellence' Model) ---
    {
      id: "uk-001",
      title: "Quantum Computing Algorithms",
      professor: "Dr. Andrew Childs",
      university: "Oxford University",
      country: "UK",
      funding: "£25k/yr Stipend",
      type: "Full Funding",
      skills: ["Quantum Computing", "Algorithms", "Physics"],
      link: "#",
      logo: "/assets/logo_uk_oxford.png",
      tryout: true,
      degree: "PhD",
      field: "Computer Science"
    },
    {
      id: "uk-002",
      title: "Machine Learning for Drug Discovery",
      professor: "Dr. Charlotte Deane",
      university: "Cambridge University",
      country: "UK",
      funding: "EPSRC Scholarship",
      type: "Full Funding",
      skills: ["Machine Learning", "Chemistry", "Python"],
      link: "#",
      logo: "/assets/logo_uk_cambridge.png",
      tryout: false,
      degree: "MS",
      field: "Biology"
    },

    // --- CHINA (The 'CSC Scholarships' Model) ---
    {
      id: "cn-001",
      title: "Advanced AI Systems",
      professor: "Dr. Jie Tang",
      university: "Tsinghua University",
      country: "China",
      funding: "CSC Scholarship",
      type: "Full Funding",
      skills: ["AI", "Deep Learning", "Python"],
      link: "#",
      logo: "/assets/logo_china_tsinghua.png",
      tryout: true,
      degree: "PhD",
      field: "Computer Science"
    },
    {
      id: "cn-002",
      title: "Biomedical Engineering",
      professor: "Dr. Wei Chen",
      university: "Peking University",
      country: "China",
      funding: "CSC Scholarship",
      type: "Full Funding",
      skills: ["Biomedical", "Engineering", "Matlab"],
      link: "#",
      logo: "/assets/logo_china_peking.png",
      tryout: false,
      degree: "MS",
      field: "Engineering"
    },

    // --- MS DEGREE OPPORTUNITIES ---
    {
      id: "de-003",
      title: "Data Science Master's Program",
      professor: "Dr. Stefan Kramer",
      university: "TU Darmstadt",
      country: "Germany",
      funding: "Tuition Free",
      type: "Self-Funded",
      skills: ["Data Science", "Statistics", "Python"],
      link: "#",
      logo: "/assets/logo_germany_tum.png",
      tryout: false,
      degree: "MS",
      field: "Computer Science"
    },
    {
      id: "us-003",
      title: "Master's in Computational Biology",
      professor: "Dr. Aviv Regev",
      university: "MIT",
      country: "USA",
      funding: "Partial Funding",
      type: "Partial",
      skills: ["Biology", "Computational", "R"],
      link: "#",
      logo: "/assets/logo_usa_gatech.png",
      tryout: true,
      degree: "MS",
      field: "Biology"
    },
    {
      id: "uk-003",
      title: "MSc in Advanced Computer Science",
      professor: "Dr. Michael Wooldridge",
      university: "Imperial College London",
      country: "UK",
      funding: "£15k Partial",
      type: "Partial",
      skills: ["Computer Science", "AI", "Java"],
      link: "#",
      logo: "/assets/logo_uk_oxford.png",
      tryout: false,
      degree: "MS",
      field: "Computer Science"
    }
  ];