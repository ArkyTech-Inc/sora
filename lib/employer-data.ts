/**
 * Sample verified PWD talent pool for the employer dashboard prototype.
 *
 * Privacy model: everything in `public` is what an employer sees while
 * browsing. The `private` block (name, email, phone, exact address) is only
 * revealed after the employer formally expresses interest in a candidate.
 */

export const SKILL_CATEGORIES = [
  'Software Development',
  'Data & Analytics',
  'Design',
  'Customer Support',
  'Digital Marketing',
  'Administration',
  'Finance',
  'Skilled Trade',
] as const

export const DISABILITY_TYPES = [
  'Visual Impairment',
  'Hearing Impairment',
  'Physical / Mobility',
  'Speech Impairment',
  'Albinism',
  'Neurodivergence',
] as const

export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'] as const

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]
export type DisabilityType = (typeof DISABILITY_TYPES)[number]
export type WorkMode = (typeof WORK_MODES)[number]

export type Candidate = {
  id: string
  /** Anonymous reference code shown before interest is expressed. */
  code: string
  public: {
    initials: string
    headline: string
    category: SkillCategory
    skills: string[]
    disability: DisabilityType
    /** Assistive tech / workplace adjustments the candidate uses. */
    accommodations: string[]
    workMode: WorkMode
    state: string
    experienceYears: number
    /** Verification source for the N-PWDID check. */
    verifiedBy: string
    verifiedOn: string
    availability: string
    summary: string
  }
  private: {
    name: string
    email: string
    phone: string
    location: string
    portfolio?: string
  }
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    code: 'SORA-4A81',
    public: {
      initials: 'A.O.',
      headline: 'Frontend Developer',
      category: 'Software Development',
      skills: ['React', 'TypeScript', 'Accessibility (WCAG)', 'Tailwind CSS'],
      disability: 'Visual Impairment',
      accommodations: ['Screen reader (NVDA)', 'High-contrast display', 'Keyboard-only navigation'],
      workMode: 'Remote',
      state: 'Lagos',
      experienceYears: 4,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Mar 2026',
      availability: 'Immediately available',
      summary:
        'Builds accessible web interfaces and audits products against WCAG 2.2. Has shipped design systems used by two fintech teams.',
    },
    private: {
      name: 'Adaeze Okonkwo',
      email: 'adaeze.okonkwo@example.com',
      phone: '+234 803 114 2298',
      location: 'Yaba, Lagos State',
      portfolio: 'adaeze.dev',
    },
  },
  {
    id: 'c2',
    code: 'SORA-7C13',
    public: {
      initials: 'I.M.',
      headline: 'Data Analyst',
      category: 'Data & Analytics',
      skills: ['SQL', 'Power BI', 'Python (pandas)', 'Excel modelling'],
      disability: 'Hearing Impairment',
      accommodations: ['Live captioning for meetings', 'Written meeting summaries', 'NSL interpreter on request'],
      workMode: 'Hybrid',
      state: 'Abuja (FCT)',
      experienceYears: 3,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Feb 2026',
      availability: 'Available in 2 weeks',
      summary:
        'Turns operational data into dashboards for logistics and retail teams. Comfortable owning reporting pipelines end to end.',
    },
    private: {
      name: 'Ibrahim Musa',
      email: 'ibrahim.musa@example.com',
      phone: '+234 706 552 8810',
      location: 'Wuse II, Abuja',
    },
  },
  {
    id: 'c3',
    code: 'SORA-2F55',
    public: {
      initials: 'C.E.',
      headline: 'Product Designer',
      category: 'Design',
      skills: ['Figma', 'Design systems', 'User research', 'Prototyping'],
      disability: 'Physical / Mobility',
      accommodations: ['Step-free access', 'Adjustable desk', 'Flexible start time'],
      workMode: 'Remote',
      state: 'Enugu',
      experienceYears: 6,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Jan 2026',
      availability: 'Open to offers',
      summary:
        'Six years designing mobile-first products for Nigerian consumers, with a focus on inclusive and low-bandwidth experiences.',
    },
    private: {
      name: 'Chidinma Eze',
      email: 'chidinma.eze@example.com',
      phone: '+234 812 447 3067',
      location: 'Independence Layout, Enugu',
      portfolio: 'chidinma.design',
    },
  },
  {
    id: 'c4',
    code: 'SORA-9B20',
    public: {
      initials: 'S.A.',
      headline: 'Customer Support Specialist',
      category: 'Customer Support',
      skills: ['Zendesk', 'Live chat', 'CRM management', 'Conflict resolution'],
      disability: 'Speech Impairment',
      accommodations: ['Chat and email channels preferred', 'No voice-call requirement'],
      workMode: 'Remote',
      state: 'Kano',
      experienceYears: 2,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Apr 2026',
      availability: 'Immediately available',
      summary:
        'Handles high-volume written support queues with a 94% satisfaction rating. Strong at documenting recurring customer issues.',
    },
    private: {
      name: 'Sadiq Abubakar',
      email: 'sadiq.abubakar@example.com',
      phone: '+234 809 330 7745',
      location: 'Nassarawa GRA, Kano',
    },
  },
  {
    id: 'c5',
    code: 'SORA-6D74',
    public: {
      initials: 'T.A.',
      headline: 'Digital Marketing Associate',
      category: 'Digital Marketing',
      skills: ['SEO', 'Meta Ads', 'Copywriting', 'Email campaigns'],
      disability: 'Albinism',
      accommodations: ['Reduced screen glare', 'Indoor workspace away from direct sun'],
      workMode: 'Hybrid',
      state: 'Ibadan',
      experienceYears: 3,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Mar 2026',
      availability: 'Available in 1 month',
      summary:
        'Grew organic traffic 3x for a consumer brand through content and search. Runs paid social campaigns on modest budgets.',
    },
    private: {
      name: 'Temitope Adewale',
      email: 'temitope.adewale@example.com',
      phone: '+234 705 918 2234',
      location: 'Bodija, Ibadan',
    },
  },
  {
    id: 'c6',
    code: 'SORA-1E37',
    public: {
      initials: 'N.J.',
      headline: 'Backend Developer',
      category: 'Software Development',
      skills: ['Node.js', 'PostgreSQL', 'REST APIs', 'Docker'],
      disability: 'Neurodivergence',
      accommodations: ['Quiet workspace', 'Written briefs over ad-hoc calls', 'Predictable schedule'],
      workMode: 'Remote',
      state: 'Port Harcourt',
      experienceYears: 5,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Feb 2026',
      availability: 'Open to offers',
      summary:
        'Deep-focus engineer maintaining payment and inventory services. Known for thorough documentation and test coverage.',
    },
    private: {
      name: 'Nnamdi Johnson',
      email: 'nnamdi.johnson@example.com',
      phone: '+234 814 662 1190',
      location: 'GRA Phase 2, Port Harcourt',
      portfolio: 'github.com/nnamdi-dev',
    },
  },
  {
    id: 'c7',
    code: 'SORA-8A02',
    public: {
      initials: 'F.B.',
      headline: 'Administrative Officer',
      category: 'Administration',
      skills: ['Scheduling', 'Records management', 'Microsoft 365', 'Minute-taking'],
      disability: 'Physical / Mobility',
      accommodations: ['Wheelchair-accessible office', 'Accessible restroom', 'Parking near entrance'],
      workMode: 'On-site',
      state: 'Abuja (FCT)',
      experienceYears: 7,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Dec 2025',
      availability: 'Available in 2 weeks',
      summary:
        'Seven years coordinating front-office operations for a public agency, managing records for a 60-person department.',
    },
    private: {
      name: 'Fatima Bello',
      email: 'fatima.bello@example.com',
      phone: '+234 803 771 5528',
      location: 'Garki, Abuja',
    },
  },
  {
    id: 'c8',
    code: 'SORA-3C68',
    public: {
      initials: 'E.U.',
      headline: 'Junior Accountant',
      category: 'Finance',
      skills: ['QuickBooks', 'Bank reconciliation', 'Payroll', 'Tax filing'],
      disability: 'Hearing Impairment',
      accommodations: ['Captioned video calls', 'Instant messaging preferred'],
      workMode: 'Hybrid',
      state: 'Lagos',
      experienceYears: 3,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Mar 2026',
      availability: 'Immediately available',
      summary:
        'Manages monthly close and reconciliations for two SMEs. ICAN student member with strong spreadsheet discipline.',
    },
    private: {
      name: 'Emeka Uche',
      email: 'emeka.uche@example.com',
      phone: '+234 802 449 6613',
      location: 'Surulere, Lagos State',
    },
  },
  {
    id: 'c9',
    code: 'SORA-5F91',
    public: {
      initials: 'H.S.',
      headline: 'Electrical Technician',
      category: 'Skilled Trade',
      skills: ['Solar installation', 'Wiring & fittings', 'Inverter maintenance', 'Safety compliance'],
      disability: 'Speech Impairment',
      accommodations: ['Written work orders', 'Team lead relays verbal briefings'],
      workMode: 'On-site',
      state: 'Kaduna',
      experienceYears: 8,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Jan 2026',
      availability: 'Open to offers',
      summary:
        'Certified technician with eight years installing and servicing solar and inverter systems for homes and small businesses.',
    },
    private: {
      name: 'Hauwa Suleiman',
      email: 'hauwa.suleiman@example.com',
      phone: '+234 706 220 9954',
      location: 'Barnawa, Kaduna',
    },
  },
  {
    id: 'c10',
    code: 'SORA-0D46',
    public: {
      initials: 'O.A.',
      headline: 'Data Entry & Research Assistant',
      category: 'Data & Analytics',
      skills: ['Data cleaning', 'Survey tooling', 'Excel', 'Transcription'],
      disability: 'Visual Impairment',
      accommodations: ['Screen magnification', 'Large-print documents', 'Braille display'],
      workMode: 'Remote',
      state: 'Benin City',
      experienceYears: 2,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Apr 2026',
      availability: 'Immediately available',
      summary:
        'Supports research teams with accurate data capture and cleaning. Works fluently with assistive screen magnification.',
    },
    private: {
      name: 'Osaze Aigbe',
      email: 'osaze.aigbe@example.com',
      phone: '+234 813 507 2288',
      location: 'Ugbowo, Benin City',
    },
  },
  {
    id: 'c11',
    code: 'SORA-7E29',
    public: {
      initials: 'Z.M.',
      headline: 'QA Engineer',
      category: 'Software Development',
      skills: ['Manual testing', 'Cypress', 'Accessibility testing', 'Bug triage'],
      disability: 'Neurodivergence',
      accommodations: ['Structured task lists', 'Noise-cancelling headphones', 'Async stand-ups'],
      workMode: 'Remote',
      state: 'Lagos',
      experienceYears: 4,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Feb 2026',
      availability: 'Available in 2 weeks',
      summary:
        'Detail-driven tester who catches edge cases others miss. Runs accessibility regression suites alongside functional QA.',
    },
    private: {
      name: 'Zainab Mohammed',
      email: 'zainab.mohammed@example.com',
      phone: '+234 807 664 3312',
      location: 'Ikeja, Lagos State',
    },
  },
  {
    id: 'c12',
    code: 'SORA-4B85',
    public: {
      initials: 'D.O.',
      headline: 'Graphic Designer',
      category: 'Design',
      skills: ['Adobe Illustrator', 'Brand identity', 'Social media assets', 'Print design'],
      disability: 'Hearing Impairment',
      accommodations: ['Written feedback on designs', 'Captioned reviews'],
      workMode: 'Hybrid',
      state: 'Jos',
      experienceYears: 5,
      verifiedBy: 'N-PWDID verified',
      verifiedOn: 'Mar 2026',
      availability: 'Open to offers',
      summary:
        'Creates brand and campaign assets for NGOs and SMEs, with a portfolio spanning print and digital-first work.',
    },
    private: {
      name: 'Daniel Ochieng',
      email: 'daniel.ochieng@example.com',
      phone: '+234 809 118 7742',
      location: 'Rayfield, Jos',
      portfolio: 'behance.net/danielo',
    },
  },
]
