import Dexie, { Table } from 'dexie';
import type {
  Job,
  Candidate,
  StageChange,
  Note,
  Assessment,
  AssessmentResponse,
} from '@/types';

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  stageChanges!: Table<StageChange>;
  notes!: Table<Note>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super('TalentFlowDB');
    
    this.version(1).stores({
      jobs: 'id, slug, status, order, createdAt',
      candidates: 'id, jobId, stage, email, name, appliedAt',
      stageChanges: 'id, candidateId, changedAt',
      notes: 'id, candidateId, createdAt',
      assessments: 'id, jobId, createdAt',
      assessmentResponses: 'id, assessmentId, candidateId, submittedAt',
    });
  }
}

export const db = new TalentFlowDB();

// Initialize with seed data
export async function initializeDatabase() {
  const jobCount = await db.jobs.count();
  
  if (jobCount === 0) {
    console.log('Seeding database with initial data...');
    await seedDatabase();
  }
}

// Reset database (useful for development)
export async function resetDatabase() {
  console.log('Resetting database...');
  await db.delete();
  await db.open();
  await seedDatabase();
  console.log('Database reset complete!');
}

async function seedDatabase() {
  // Seed jobs - 25 jobs for pagination (5 per page)
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      slug: 'senior-frontend-developer',
      description: 'We are looking for an experienced frontend developer to join our team and build amazing user interfaces.',
      status: 'active',
      tags: ['React', 'TypeScript', 'Remote'],
      order: 0,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      title: 'Backend Engineer',
      slug: 'backend-engineer',
      description: 'Join our backend team to build scalable APIs and microservices architecture.',
      status: 'active',
      tags: ['Node.js', 'PostgreSQL', 'AWS'],
      order: 1,
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05'),
    },
    {
      id: '3',
      title: 'Product Designer',
      slug: 'product-designer',
      description: 'Create beautiful and intuitive user experiences for our SaaS platform.',
      status: 'active',
      tags: ['Figma', 'UI/UX', 'Design Systems'],
      order: 2,
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10'),
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      slug: 'devops-engineer',
      description: 'Help us build and maintain our infrastructure with modern DevOps practices.',
      status: 'active',
      tags: ['Kubernetes', 'Docker', 'CI/CD'],
      order: 3,
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2025-01-15'),
    },
    {
      id: '5',
      title: 'Full Stack Developer',
      slug: 'full-stack-developer',
      description: 'Work across the entire stack to deliver end-to-end features for our customers.',
      status: 'active',
      tags: ['React', 'Node.js', 'MongoDB'],
      order: 4,
      createdAt: new Date('2025-01-12'),
      updatedAt: new Date('2025-01-12'),
    },
    {
      id: '6',
      title: 'Machine Learning Engineer',
      slug: 'machine-learning-engineer',
      description: 'Join our AI team to build and deploy machine learning models at scale.',
      status: 'active',
      tags: ['Python', 'TensorFlow', 'AI'],
      order: 5,
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2025-02-01'),
    },
    {
      id: '7',
      title: 'Data Scientist',
      slug: 'data-scientist',
      description: 'Analyze complex data to help make data-driven business decisions and insights.',
      status: 'active',
      tags: ['Python', 'SQL', 'Data Analysis'],
      order: 6,
      createdAt: new Date('2025-02-05'),
      updatedAt: new Date('2025-02-05'),
    },
    {
      id: '8',
      title: 'Marketing Manager',
      slug: 'marketing-manager',
      description: 'Lead marketing campaigns and strategies to grow our brand and customer base.',
      status: 'active',
      tags: ['Marketing', 'SEO', 'Strategy'],
      order: 7,
      createdAt: new Date('2025-02-10'),
      updatedAt: new Date('2025-02-10'),
    },
    {
      id: '9',
      title: 'UX/UI Designer',
      slug: 'ux-ui-designer',
      description: 'Design intuitive user interfaces for web and mobile applications.',
      status: 'active',
      tags: ['Figma', 'Wireframing', 'User Research'],
      order: 8,
      createdAt: new Date('2025-02-15'),
      updatedAt: new Date('2025-02-15'),
    },
    {
      id: '10',
      title: 'Sales Manager',
      slug: 'sales-manager',
      description: 'Drive sales strategies and lead our sales team to achieve revenue targets.',
      status: 'active',
      tags: ['Sales', 'CRM', 'Leadership'],
      order: 9,
      createdAt: new Date('2025-02-20'),
      updatedAt: new Date('2025-02-20'),
    },
    {
      id: '11',
      title: 'Mobile Developer (iOS)',
      slug: 'mobile-developer-ios',
      description: 'Build native iOS applications using Swift and modern iOS development practices.',
      status: 'active',
      tags: ['Swift', 'iOS', 'Mobile'],
      order: 10,
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01'),
    },
    {
      id: '12',
      title: 'Mobile Developer (Android)',
      slug: 'mobile-developer-android',
      description: 'Develop high-performance Android applications using Kotlin and Jetpack Compose.',
      status: 'active',
      tags: ['Kotlin', 'Android', 'Mobile'],
      order: 11,
      createdAt: new Date('2025-03-05'),
      updatedAt: new Date('2025-03-05'),
    },
    {
      id: '13',
      title: 'QA Engineer',
      slug: 'qa-engineer',
      description: 'Ensure product quality through comprehensive testing and automation strategies.',
      status: 'active',
      tags: ['Testing', 'Automation', 'Quality'],
      order: 12,
      createdAt: new Date('2025-03-10'),
      updatedAt: new Date('2025-03-10'),
    },
    {
      id: '14',
      title: 'Security Engineer',
      slug: 'security-engineer',
      description: 'Protect our infrastructure and applications from security threats and vulnerabilities.',
      status: 'active',
      tags: ['Security', 'Penetration Testing', 'Compliance'],
      order: 13,
      createdAt: new Date('2025-03-15'),
      updatedAt: new Date('2025-03-15'),
    },
    {
      id: '15',
      title: 'Business Analyst',
      slug: 'business-analyst',
      description: 'Bridge the gap between business needs and technical solutions through analysis.',
      status: 'active',
      tags: ['Analysis', 'Requirements', 'Agile'],
      order: 14,
      createdAt: new Date('2025-03-20'),
      updatedAt: new Date('2025-03-20'),
    },
    {
      id: '16',
      title: 'Content Writer',
      slug: 'content-writer',
      description: 'Create engaging content for our blog, marketing materials, and documentation.',
      status: 'active',
      tags: ['Writing', 'Content', 'SEO'],
      order: 15,
      createdAt: new Date('2025-03-25'),
      updatedAt: new Date('2025-03-25'),
    },
    {
      id: '17',
      title: 'Technical Writer',
      slug: 'technical-writer',
      description: 'Write clear and comprehensive technical documentation for developers and users.',
      status: 'active',
      tags: ['Documentation', 'Technical Writing', 'API'],
      order: 16,
      createdAt: new Date('2025-04-01'),
      updatedAt: new Date('2025-04-01'),
    },
    {
      id: '18',
      title: 'Product Manager',
      slug: 'product-manager',
      description: 'Define product strategy and roadmap while working closely with engineering teams.',
      status: 'active',
      tags: ['Product', 'Strategy', 'Roadmap'],
      order: 17,
      createdAt: new Date('2025-04-05'),
      updatedAt: new Date('2025-04-05'),
    },
    {
      id: '19',
      title: 'Scrum Master',
      slug: 'scrum-master',
      description: 'Facilitate agile ceremonies and help teams deliver value efficiently.',
      status: 'active',
      tags: ['Agile', 'Scrum', 'Facilitation'],
      order: 18,
      createdAt: new Date('2025-04-10'),
      updatedAt: new Date('2025-04-10'),
    },
    {
      id: '20',
      title: 'Cloud Architect',
      slug: 'cloud-architect',
      description: 'Design and implement scalable cloud infrastructure solutions on AWS/Azure.',
      status: 'active',
      tags: ['AWS', 'Azure', 'Architecture'],
      order: 19,
      createdAt: new Date('2025-04-15'),
      updatedAt: new Date('2025-04-15'),
    },
    {
      id: '21',
      title: 'Data Engineer',
      slug: 'data-engineer',
      description: 'Build and maintain data pipelines and warehouses for analytics and ML.',
      status: 'active',
      tags: ['ETL', 'Data Pipeline', 'BigQuery'],
      order: 20,
      createdAt: new Date('2025-04-20'),
      updatedAt: new Date('2025-04-20'),
    },
    {
      id: '22',
      title: 'Customer Success Manager',
      slug: 'customer-success-manager',
      description: 'Ensure customer satisfaction and retention through proactive engagement.',
      status: 'active',
      tags: ['Customer Success', 'Support', 'Retention'],
      order: 21,
      createdAt: new Date('2025-04-25'),
      updatedAt: new Date('2025-04-25'),
    },
    {
      id: '23',
      title: 'HR Manager',
      slug: 'hr-manager',
      description: 'Manage recruitment, employee relations, and HR operations for the company.',
      status: 'active',
      tags: ['HR', 'Recruitment', 'People'],
      order: 22,
      createdAt: new Date('2025-05-01'),
      updatedAt: new Date('2025-05-01'),
    },
    {
      id: '24',
      title: 'Finance Manager',
      slug: 'finance-manager',
      description: 'Oversee financial planning, analysis, and reporting for the organization.',
      status: 'active',
      tags: ['Finance', 'Accounting', 'FP&A'],
      order: 23,
      createdAt: new Date('2025-05-05'),
      updatedAt: new Date('2025-05-05'),
    },
    {
      id: '25',
      title: 'Graphic Designer',
      slug: 'graphic-designer',
      description: 'Create stunning visual designs for marketing, branding, and product materials.',
      status: 'active',
      tags: ['Design', 'Adobe', 'Branding'],
      order: 24,
      createdAt: new Date('2025-05-10'),
      updatedAt: new Date('2025-05-10'),
    },
  ];

  await db.jobs.bulkAdd(jobs);

  // Seed 1000+ candidates
  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
    'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
    'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  ];

  const stages: Candidate['stage'][] = ['applied', 'screening', 'interview', 'offer', 'rejected', 'hired'];
  const jobIds = jobs.map(j => j.id);

  const candidates: Candidate[] = [];
  const stageChanges: StageChange[] = [];

  for (let i = 0; i < 1200; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const jobId = jobIds[Math.floor(Math.random() * jobIds.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const appliedAt = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    const candidate: Candidate = {
      id: `c-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      jobId,
      stage,
      appliedAt,
      updatedAt: appliedAt,
    };

    candidates.push(candidate);

    // Add initial stage change
    stageChanges.push({
      id: `sc-${i + 1}`,
      candidateId: candidate.id,
      fromStage: null,
      toStage: 'applied',
      changedAt: appliedAt,
    });

    // Add additional stage changes for some candidates
    if (stage !== 'applied' && Math.random() > 0.3) {
      const intermediateStages = stages.slice(0, stages.indexOf(stage) + 1).slice(1);
      intermediateStages.forEach((s, idx) => {
        const changeDate = new Date(appliedAt);
        changeDate.setDate(changeDate.getDate() + (idx + 1) * 7);
        
        stageChanges.push({
          id: `sc-${i + 1}-${idx + 1}`,
          candidateId: candidate.id,
          fromStage: idx === 0 ? 'applied' : intermediateStages[idx - 1],
          toStage: s,
          changedAt: changeDate,
          note: idx === intermediateStages.length - 1 ? `Moved to ${s}` : undefined,
        });
      });
    }
  }

  await db.candidates.bulkAdd(candidates);
  await db.stageChanges.bulkAdd(stageChanges);

  // Seed assessments
  const assessments: Assessment[] = [
    {
      id: 'a-1',
      jobId: '1',
      title: 'Frontend Developer Technical Assessment',
      description: 'Test your React and TypeScript knowledge',
      sections: [
        {
          id: 's-1',
          title: 'Technical Knowledge',
          description: 'Answer questions about React and TypeScript',
          order: 0,
          questions: [
            {
              id: 'q-1',
              type: 'single-choice',
              title: 'What is your experience level with React?',
              required: true,
              options: [
                { id: 'o-1', label: 'Beginner (< 1 year)', value: 'beginner' },
                { id: 'o-2', label: 'Intermediate (1-3 years)', value: 'intermediate' },
                { id: 'o-3', label: 'Advanced (3+ years)', value: 'advanced' },
              ],
            },
            {
              id: 'q-2',
              type: 'multi-choice',
              title: 'Which React patterns are you familiar with?',
              required: true,
              options: [
                { id: 'o-4', label: 'Hooks', value: 'hooks' },
                { id: 'o-5', label: 'Context API', value: 'context' },
                { id: 'o-6', label: 'Higher-Order Components', value: 'hoc' },
                { id: 'o-7', label: 'Render Props', value: 'render-props' },
              ],
            },
            {
              id: 'q-3',
              type: 'short-text',
              title: 'What is your favorite React library and why?',
              required: false,
              validation: {
                maxLength: 200,
              },
            },
          ],
        },
        {
          id: 's-2',
          title: 'Coding Challenge',
          order: 1,
          questions: [
            {
              id: 'q-4',
              type: 'long-text',
              title: 'Write a custom React hook for debouncing',
              description: 'Provide a code example',
              required: true,
              validation: {
                minLength: 50,
              },
            },
          ],
        },
      ],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: 'a-2',
      jobId: '2',
      title: 'Backend Engineer Assessment',
      description: 'Evaluate backend development skills',
      sections: [
        {
          id: 's-3',
          title: 'Database Knowledge',
          order: 0,
          questions: [
            {
              id: 'q-5',
              type: 'single-choice',
              title: 'Do you have SQL experience?',
              required: true,
              options: [
                { id: 'o-8', label: 'Yes', value: 'yes' },
                { id: 'o-9', label: 'No', value: 'no' },
              ],
            },
            {
              id: 'q-6',
              type: 'numeric',
              title: 'How many years of database experience?',
              required: true,
              validation: {
                min: 0,
                max: 50,
              },
              conditionalLogic: {
                questionId: 'q-5',
                operator: 'equals',
                value: 'yes',
              },
            },
          ],
        },
      ],
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05'),
    },
  ];

  await db.assessments.bulkAdd(assessments);

  console.log('Database seeded successfully!');
}
