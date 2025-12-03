const API_URL = 'http://localhost:3000';
const LOGIN_EMAIL = 'admin@example.com';
const LOGIN_PASSWORD = 'admin123';

// Project and User IDs from database
const PROJECTS = {
  oreSort: '69308bb1a7a2acc1d40170e4',
  copperFacility: '69308bb2a7a2acc1d40170e5',
  safetySoftware: '69308bb2a7a2acc1d40170e6',
  geoSurvey: '69308bb2a7a2acc1d40170e7',
  iotSystem: '69308bb3a7a2acc1d40170e8'
};

const USERS = {
  admin: '69305860e5e303cdde7aba6a',
  saurabh: '69306a5d7f0a0ea48cd24c63'
};

const sampleTasks = [
  // Ore Sorting System tasks
  {
    project: PROJECTS.oreSort,
    title: 'Design AI sorting algorithm',
    description: 'Design and prototype the AI algorithm for ore classification and sorting',
    status: 'in_progress',
    priority: 'high',
    assignedTo: USERS.admin,
    dueDate: '2025-12-15',
    estimatedHours: 40,
    tags: ['AI', 'algorithm', 'design']
  },
  {
    project: PROJECTS.oreSort,
    title: 'Install sensor hardware',
    description: 'Install optical sensors and cameras for ore detection system',
    status: 'todo',
    priority: 'high',
    assignedTo: USERS.saurabh,
    dueDate: '2025-12-20',
    estimatedHours: 60,
    tags: ['hardware', 'installation']
  },
  {
    project: PROJECTS.oreSort,
    title: 'Test automation system',
    description: 'Conduct comprehensive testing of the automated ore sorting system',
    status: 'blocked',
    priority: 'critical',
    assignedTo: USERS.admin,
    dueDate: '2025-12-25',
    estimatedHours: 30,
    tags: ['testing', 'QA']
  },
  {
    project: PROJECTS.oreSort,
    title: 'Train staff on new system',
    description: 'Conduct training sessions for plant staff on operating the automated sorting system',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-12-30',
    estimatedHours: 20,
    tags: ['training', 'documentation']
  },

  // Copper Facility tasks
  {
    project: PROJECTS.copperFacility,
    title: 'Review equipment specifications',
    description: 'Review and approve technical specifications for new copper extraction equipment',
    status: 'in_review',
    priority: 'high',
    assignedTo: USERS.saurabh,
    dueDate: '2025-12-10',
    estimatedHours: 20,
    tags: ['review', 'specifications']
  },
  {
    project: PROJECTS.copperFacility,
    title: 'Environmental impact assessment',
    description: 'Complete environmental impact study for facility upgrade project',
    status: 'todo',
    priority: 'critical',
    dueDate: '2025-12-18',
    estimatedHours: 80,
    tags: ['environmental', 'compliance']
  },
  {
    project: PROJECTS.copperFacility,
    title: 'Safety system design',
    description: 'Design new safety protocols and emergency shutdown systems',
    status: 'in_progress',
    priority: 'critical',
    assignedTo: USERS.admin,
    dueDate: '2025-12-22',
    estimatedHours: 50,
    tags: ['safety', 'design']
  },
  {
    project: PROJECTS.copperFacility,
    title: 'Procurement planning',
    description: 'Plan equipment procurement schedule and vendor selection',
    status: 'todo',
    priority: 'high',
    assignedTo: USERS.saurabh,
    dueDate: '2026-01-05',
    estimatedHours: 30,
    tags: ['procurement', 'planning']
  },

  // Safety Software tasks
  {
    project: PROJECTS.safetySoftware,
    title: 'Deploy to production',
    description: 'Final deployment of safety management software to production environment',
    status: 'completed',
    priority: 'high',
    assignedTo: USERS.admin,
    dueDate: '2025-11-15',
    estimatedHours: 15,
    actualHours: 18,
    tags: ['deployment', 'production']
  },
  {
    project: PROJECTS.safetySoftware,
    title: 'Post-deployment monitoring',
    description: 'Monitor system performance and user feedback after deployment',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: USERS.admin,
    dueDate: '2025-12-15',
    estimatedHours: 25,
    tags: ['monitoring', 'support']
  },
  {
    project: PROJECTS.safetySoftware,
    title: 'User training documentation',
    description: 'Create comprehensive user guides and training materials',
    status: 'completed',
    priority: 'medium',
    assignedTo: USERS.saurabh,
    dueDate: '2025-11-10',
    estimatedHours: 30,
    actualHours: 28,
    tags: ['documentation', 'training']
  },

  // Geological Survey tasks
  {
    project: PROJECTS.geoSurvey,
    title: 'Prepare bid presentation',
    description: 'Prepare technical presentation for bid meeting with client',
    status: 'in_progress',
    priority: 'high',
    assignedTo: USERS.saurabh,
    dueDate: '2025-12-08',
    estimatedHours: 15,
    tags: ['presentation', 'bid']
  },
  {
    project: PROJECTS.geoSurvey,
    title: 'Drone equipment assessment',
    description: 'Assess and select appropriate drone equipment for survey project',
    status: 'in_review',
    priority: 'medium',
    assignedTo: USERS.admin,
    dueDate: '2025-12-12',
    estimatedHours: 20,
    tags: ['equipment', 'assessment']
  },
  {
    project: PROJECTS.geoSurvey,
    title: 'AI model selection',
    description: 'Research and select AI models for geological data analysis',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-12-20',
    estimatedHours: 35,
    tags: ['AI', 'research']
  },

  // IoT System tasks
  {
    project: PROJECTS.iotSystem,
    title: 'Sensor network deployment',
    description: 'Deploy IoT sensors across all mining equipment',
    status: 'in_progress',
    priority: 'high',
    assignedTo: USERS.admin,
    dueDate: '2025-12-12',
    estimatedHours: 50,
    actualHours: 35,
    tags: ['IoT', 'deployment', 'sensors']
  },
  {
    project: PROJECTS.iotSystem,
    title: 'Predictive analytics dashboard',
    description: 'Build dashboard for real-time equipment health monitoring',
    status: 'in_progress',
    priority: 'high',
    assignedTo: USERS.saurabh,
    dueDate: '2025-12-18',
    estimatedHours: 45,
    actualHours: 30,
    tags: ['dashboard', 'analytics', 'UI']
  },
  {
    project: PROJECTS.iotSystem,
    title: 'Alert system configuration',
    description: 'Configure automated alerts for equipment maintenance needs',
    status: 'todo',
    priority: 'medium',
    assignedTo: USERS.admin,
    dueDate: '2025-12-20',
    estimatedHours: 25,
    tags: ['alerts', 'configuration']
  },
  {
    project: PROJECTS.iotSystem,
    title: 'Integration testing',
    description: 'Test integration between IoT sensors and monitoring platform',
    status: 'in_review',
    priority: 'high',
    dueDate: '2025-12-14',
    estimatedHours: 30,
    tags: ['testing', 'integration']
  },
  {
    project: PROJECTS.iotSystem,
    title: 'Performance optimization',
    description: 'Optimize data processing pipeline for real-time performance',
    status: 'blocked',
    priority: 'medium',
    assignedTo: USERS.saurabh,
    dueDate: '2025-12-22',
    estimatedHours: 40,
    tags: ['optimization', 'performance']
  },
  {
    project: PROJECTS.iotSystem,
    title: 'Security audit',
    description: 'Conduct security audit of IoT infrastructure and data transmission',
    status: 'todo',
    priority: 'critical',
    dueDate: '2025-12-25',
    estimatedHours: 35,
    tags: ['security', 'audit']
  }
];

async function login() {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: LOGIN_EMAIL, password: LOGIN_PASSWORD })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error('Login failed: ' + data.error);
  }

  return data.token;
}

async function createTask(token, taskData) {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to create task "${taskData.title}": ${data.error}`);
  }

  return data.data;
}

async function main() {
  try {
    console.log('Logging in...');
    const token = await login();
    console.log('Login successful!\n');

    console.log(`Creating ${sampleTasks.length} sample tasks...\n`);

    for (let i = 0; i < sampleTasks.length; i++) {
      const task = sampleTasks[i];
      try {
        const created = await createTask(token, task);
        console.log(`✓ [${i + 1}/${sampleTasks.length}] Created: ${created.taskNumber} - ${created.title}`);
      } catch (error) {
        console.error(`✗ [${i + 1}/${sampleTasks.length}] Error: ${error.message}`);
      }
    }

    console.log('\nAll tasks created successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
