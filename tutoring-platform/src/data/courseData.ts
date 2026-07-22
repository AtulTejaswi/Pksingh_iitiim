export interface StaticCourse {
  id: string; // e.g. 'phy-jee-adv-mechanics'
  title: string;
  subject: 'PHYSICS' | 'CHEMISTRY' | 'MATH';
  description: string; // 2-3 compelling sentences
  level: string; // 'JEE Mains' | 'JEE Advanced' | 'NEET' | 'SAT' | 'CAT' | 'GMAT'
  duration: string; // '12 weeks', '48 hours' etc.
  format: 'Live Cohort' | 'Recorded' | '1:1 Mentorship';
  price: number; // 0 for free, INR for paid
  priceLabel: string; // 'Free' | '₹2,999/mo' etc.
  examTags: string[];
  lessonCount: number;
  enrollmentCount: number;
  isFree: boolean;
  status: 'PUBLISHED';
  thumbnailUrl: null;
  syllabusTopics: string[]; // 8-12 topics per course
  highlights: string[]; // 3-4 bullet points like '40+ hours of content'
  _count?: { lessons: number; enrollments: number };
}

export const staticCourses: StaticCourse[] = [
  {
    id: 'phy-jee-adv-mechanics',
    title: 'JEE Advanced Mechanics Masterclass',
    subject: 'PHYSICS',
    description: 'Master the core concepts of mechanics required to conquer the toughest JEE Advanced problems. From Newton\'s laws to complex rotational dynamics, this course builds an unshakeable foundation.',
    level: 'JEE Advanced',
    duration: '16 weeks',
    format: 'Live Cohort',
    price: 3499,
    priceLabel: '₹3,499/mo',
    examTags: ['JEE_ADVANCED', 'JEE_MAINS'],
    lessonCount: 64,
    enrollmentCount: 1250,
    isFree: false,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'Kinematics in 1D and 2D',
      'Newton\'s Laws of Motion',
      'Friction & Dynamics of Circular Motion',
      'Work, Energy and Power',
      'Center of Mass and Collision',
      'Rotational Kinematics & Dynamics',
      'Gravitation',
      'Simple Harmonic Motion (SHM)',
      'Fluid Mechanics',
      'Waves and Sound'
    ],
    highlights: [
      '64+ hours of interactive live sessions',
      'Daily Practice Problems (DPPs) with video solutions',
      'Weekly JEE Advanced pattern mock tests',
      '1-on-1 doubt resolution sessions'
    ],
    _count: { lessons: 64, enrollments: 1250 }
  },
  {
    id: 'phy-neet-complete',
    title: 'NEET Physics Complete',
    subject: 'PHYSICS',
    description: 'A comprehensive journey through the entire NEET Physics syllabus. Carefully paced to help you grasp both classical mechanics and modern physics concepts with ease.',
    level: 'NEET',
    duration: '12 weeks',
    format: 'Recorded',
    price: 1999,
    priceLabel: '₹1,999/mo',
    examTags: ['NEET'],
    lessonCount: 48,
    enrollmentCount: 3400,
    isFree: false,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'Physical World and Measurement',
      'Kinematics & Laws of Motion',
      'Work, Energy, and Power',
      'Motion of System of Particles',
      'Thermodynamics & Kinetic Theory',
      'Oscillations and Waves',
      'Electrostatics & Current Electricity',
      'Magnetic Effects of Current',
      'Electromagnetic Induction & AC',
      'Optics and Modern Physics'
    ],
    highlights: [
      '48 expertly crafted recorded lectures',
      'Comprehensive study material & mind maps',
      'Previous 10 Years NEET question analysis',
      '24/7 community doubt forum access'
    ],
    _count: { lessons: 48, enrollments: 3400 }
  },
  {
    id: 'phy-sat-prep',
    title: 'SAT Physics Prep',
    subject: 'PHYSICS',
    description: 'Target a perfect score on your SAT Physics Subject Test. This high-yield course focuses purely on the concepts and problem-solving strategies tested on the exam.',
    level: 'SAT',
    duration: '8 weeks',
    format: 'Live Cohort',
    price: 0,
    priceLabel: 'Free',
    examTags: ['SAT'],
    lessonCount: 24,
    enrollmentCount: 890,
    isFree: true,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'Kinematics and Dynamics',
      'Work, Energy, and Power',
      'Momentum and Collisions',
      'Circular Motion and Gravity',
      'Electric Forces and Fields',
      'DC Circuits',
      'Magnetism',
      'Simple Harmonic Motion',
      'Waves and Optics',
      'Thermal Physics'
    ],
    highlights: [
      '24 intensive live strategy sessions',
      '5 full-length SAT Physics practice tests',
      'Formula cheat sheets and quick revision guides',
      'Time management techniques for the exam'
    ],
    _count: { lessons: 24, enrollments: 890 }
  },
  {
    id: 'chem-jee-organic',
    title: 'JEE Organic Chemistry',
    subject: 'CHEMISTRY',
    description: 'Demystify Organic Chemistry with logical reaction mechanisms instead of rote memorization. Master named reactions and stereochemistry for JEE.',
    level: 'JEE Advanced',
    duration: '14 weeks',
    format: 'Live Cohort',
    price: 2999,
    priceLabel: '₹2,999/mo',
    examTags: ['JEE_ADVANCED', 'JEE_MAINS'],
    lessonCount: 56,
    enrollmentCount: 2100,
    isFree: false,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'IUPAC Nomenclature & Isomerism',
      'General Organic Chemistry (GOC)',
      'Reaction Intermediates & Mechanisms',
      'Hydrocarbons (Alkanes, Alkenes, Alkynes)',
      'Haloalkanes and Haloarenes',
      'Alcohols, Phenols, and Ethers',
      'Aldehydes, Ketones and Carboxylic Acids',
      'Amines and Diazonium Salts',
      'Biomolecules and Polymers',
      'Chemistry in Everyday Life'
    ],
    highlights: [
      '56+ hours of live masterclasses',
      'Exhaustive named reactions compendium',
      'Mechanistic approach to organic synthesis',
      'Advanced level problem-solving sessions'
    ],
    _count: { lessons: 56, enrollments: 2100 }
  },
  {
    id: 'chem-neet-complete',
    title: 'NEET Chemistry Complete',
    subject: 'CHEMISTRY',
    description: 'A well-balanced curriculum covering Physical, Organic, and Inorganic Chemistry tailored specifically for NEET UG aspirants. High yield topics covered in depth.',
    level: 'NEET',
    duration: '12 weeks',
    format: 'Recorded',
    price: 1999,
    priceLabel: '₹1,999/mo',
    examTags: ['NEET'],
    lessonCount: 52,
    enrollmentCount: 4200,
    isFree: false,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'Some Basic Concepts of Chemistry',
      'Structure of Atom & Periodic Table',
      'Chemical Bonding & Molecular Structure',
      'States of Matter & Thermodynamics',
      'Equilibrium (Chemical & Ionic)',
      'Redox Reactions & Electrochemistry',
      'Chemical Kinetics & Surface Chemistry',
      'p, d and f Block Elements',
      'Coordination Compounds',
      'Organic Chemistry Basics to Advanced'
    ],
    highlights: [
      '52 high-quality recorded lectures',
      'NCERT line-by-line decoding modules',
      'Interactive flashcards for inorganic chemistry',
      'Chapter-wise NEET mock tests'
    ],
    _count: { lessons: 52, enrollments: 4200 }
  },
  {
    id: 'chem-ap-accelerator',
    title: 'AP Chemistry Accelerator',
    subject: 'CHEMISTRY',
    description: 'Personalized 1-on-1 mentorship to guarantee a 5 on your AP Chemistry exam. Focus purely on your weak areas with customized practice.',
    level: 'AP Chemistry',
    duration: '10 weeks',
    format: '1:1 Mentorship',
    price: 9999,
    priceLabel: '₹9,999/mo',
    examTags: ['AP_CHEMISTRY'],
    lessonCount: 30,
    enrollmentCount: 150,
    isFree: false,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'Atomic Structure and Properties',
      'Molecular and Ionic Compound Structure',
      'Intermolecular Forces and Properties',
      'Chemical Reactions',
      'Kinetics',
      'Thermodynamics',
      'Equilibrium',
      'Acids and Bases',
      'Applications of Thermodynamics',
      'AP Exam FRQ Strategies'
    ],
    highlights: [
      '30 hours of exclusive 1-on-1 tutoring',
      'Customized study plan tailored to your pace',
      'In-depth review of Free Response Questions (FRQs)',
      'Premium access to all AP practice materials'
    ],
    _count: { lessons: 30, enrollments: 150 }
  },
  {
    id: 'math-jee-adv-calculus',
    title: 'JEE Advanced Calculus & Algebra',
    subject: 'MATH',
    description: 'Develop a formidable intuition for Calculus and Algebra. Learn advanced techniques and shortcuts required to solve the most challenging JEE math problems.',
    level: 'JEE Advanced',
    duration: '16 weeks',
    format: 'Live Cohort',
    price: 3499,
    priceLabel: '₹3,499/mo',
    examTags: ['JEE_ADVANCED', 'JEE_MAINS'],
    lessonCount: 64,
    enrollmentCount: 1800,
    isFree: false,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'Functions, Limits and Continuity',
      'Differentiability and Methods of Differentiation',
      'Applications of Derivatives (AOD)',
      'Indefinite and Definite Integration',
      'Area Under Curves & Differential Equations',
      'Complex Numbers',
      'Quadratic Equations & Progressions',
      'Permutations and Combinations',
      'Binomial Theorem',
      'Matrices and Determinants'
    ],
    highlights: [
      '64+ hours of intense live problem solving',
      'Exclusive JEE Advanced level assignment booklets',
      'Weekly doubt clearing live streams',
      'Peer-to-peer competitive mock tests'
    ],
    _count: { lessons: 64, enrollments: 1800 }
  },
  {
    id: 'math-cat-gmat-quant',
    title: 'CAT/GMAT Quantitative Aptitude',
    subject: 'MATH',
    description: 'Ace the quantitative section of top management entrance exams. Master number theory, arithmetic, and advanced data interpretation with speed-solving strategies.',
    level: 'CAT/GMAT',
    duration: '10 weeks',
    format: 'Recorded',
    price: 2499,
    priceLabel: '₹2,499/mo',
    examTags: ['CAT', 'GMAT'],
    lessonCount: 40,
    enrollmentCount: 2800,
    isFree: false,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'Number Systems and Theory',
      'Percentages, Profit & Loss',
      'Ratio, Proportion and Variation',
      'Time, Speed and Distance',
      'Time and Work',
      'Algebra (Linear & Quadratic Equations)',
      'Geometry and Mensuration',
      'Permutations, Combinations & Probability',
      'Set Theory and Venn Diagrams',
      'Data Interpretation and Sufficiency'
    ],
    highlights: [
      '40 strategy-packed recorded sessions',
      'Speed math and mental calculation techniques',
      'Topic-wise sectional adaptive tests',
      'Detailed video solutions for previous year questions'
    ],
    _count: { lessons: 40, enrollments: 2800 }
  },
  {
    id: 'math-ap-calculus',
    title: 'AP Calculus AB & BC',
    subject: 'MATH',
    description: 'Achieve top scores in AP Calculus with dedicated 1-on-1 guidance. We cover the entire AB & BC syllabus, ensuring you are fully prepared for the toughest integrations and series.',
    level: 'AP Calculus',
    duration: '8 weeks',
    format: '1:1 Mentorship',
    price: 0,
    priceLabel: 'Free',
    examTags: ['AP_CALCULUS'],
    lessonCount: 24,
    enrollmentCount: 450,
    isFree: true,
    status: 'PUBLISHED',
    thumbnailUrl: null,
    syllabusTopics: [
      'Limits and Continuity',
      'Differentiation: Definition and Basic Rules',
      'Differentiation: Composite, Implicit, and Inverse Functions',
      'Contextual Applications of Differentiation',
      'Analytical Applications of Differentiation',
      'Integration and Accumulation of Change',
      'Differential Equations',
      'Applications of Integration',
      'Parametric Equations, Polar Coordinates, and Vector-Valued Functions (BC)',
      'Infinite Sequences and Series (BC)'
    ],
    highlights: [
      '24 personalized 1-on-1 sessions',
      'Full coverage of both AB and BC topics',
      'Practice with real AP exam Free Response Questions',
      'Free comprehensive formula and theorem sheet'
    ],
    _count: { lessons: 24, enrollments: 450 }
  }
];

export function getStaticFeaturedCourses(): StaticCourse[] {
  return staticCourses.slice(0, 4);
}

export function mergeWithApiCourses(apiCourses: any[], staticCoursesList: StaticCourse[]): any[] {
  const apiCourseIds = new Set(apiCourses.map((c) => c.id));
  const uniqueStaticCourses = staticCoursesList.filter((c) => !apiCourseIds.has(c.id));
  return [...apiCourses, ...uniqueStaticCourses];
}
