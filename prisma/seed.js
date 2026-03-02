const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Gotham Project Dashboard - Complete Seed Data
// 149 Tasks across 5 Phases and 22 Modules

const projectData = {
  name: 'Gotham Platform',
  githubRepo: 'gotham-platform',
  stage: 'mvp',
  lastEvent: 'Initialized dashboard',
}

const phasesData = [
  {
    name: 'Phase 1: Foundation & Architecture',
    description: 'Core infrastructure, architecture decisions, and foundation systems',
    orderIndex: 1,
    targetMonths: 'Month 1-2',
    weightPercent: 20,
    modules: [
      {
        name: '1.1 Project Setup & Infrastructure',
        description: 'Initial project setup, CI/CD, development environment',
        orderIndex: 1,
        weightPercent: 25,
        tasks: [
          { taskId: '1.1.1', description: 'Initialize Next.js project with TypeScript', priority: 'High', estimatedHours: 4 },
          { taskId: '1.1.2', description: 'Configure Tailwind CSS and shadcn/ui components', priority: 'High', estimatedHours: 3 },
          { taskId: '1.1.3', description: 'Set up Prisma with SQLite database', priority: 'High', estimatedHours: 4 },
          { taskId: '1.1.4', description: 'Configure ESLint and Prettier', priority: 'Medium', estimatedHours: 2 },
          { taskId: '1.1.5', description: 'Set up GitHub Actions CI/CD pipeline', priority: 'High', estimatedHours: 6 },
          { taskId: '1.1.6', description: 'Configure environment variables and secrets', priority: 'High', estimatedHours: 2 },
          { taskId: '1.1.7', description: 'Create Docker configuration for production', priority: 'Medium', estimatedHours: 4 },
        ]
      },
      {
        name: '1.2 Authentication & Authorization',
        description: 'User authentication, role-based access control',
        orderIndex: 2,
        weightPercent: 30,
        tasks: [
          { taskId: '1.2.1', description: 'Integrate NextAuth.js for authentication', priority: 'High', estimatedHours: 8 },
          { taskId: '1.2.2', description: 'Implement OAuth providers (GitHub, Google)', priority: 'Medium', estimatedHours: 6 },
          { taskId: '1.2.3', description: 'Create user role management system', priority: 'High', estimatedHours: 6 },
          { taskId: '1.2.4', description: 'Build protected route middleware', priority: 'High', estimatedHours: 4 },
          { taskId: '1.2.5', description: 'Implement session management', priority: 'Medium', estimatedHours: 4 },
          { taskId: '1.2.6', description: 'Create user profile management UI', priority: 'Medium', estimatedHours: 5 },
        ]
      },
      {
        name: '1.3 Core Architecture',
        description: 'System architecture, design patterns, and core modules',
        orderIndex: 3,
        weightPercent: 25,
        tasks: [
          { taskId: '1.3.1', description: 'Design system architecture documentation', priority: 'High', estimatedHours: 8 },
          { taskId: '1.3.2', description: 'Implement repository pattern for data access', priority: 'High', estimatedHours: 6 },
          { taskId: '1.3.3', description: 'Create base API response wrapper', priority: 'Medium', estimatedHours: 3 },
          { taskId: '1.3.4', description: 'Set up global error handling', priority: 'High', estimatedHours: 4 },
          { taskId: '1.3.5', description: 'Implement logging system', priority: 'Medium', estimatedHours: 4 },
        ]
      },
      {
        name: '1.4 Database Design',
        description: 'Database schema, migrations, and optimization',
        orderIndex: 4,
        weightPercent: 20,
        tasks: [
          { taskId: '1.4.1', description: 'Design complete database schema', priority: 'High', estimatedHours: 8 },
          { taskId: '1.4.2', description: 'Create Prisma migrations', priority: 'High', estimatedHours: 4 },
          { taskId: '1.4.3', description: 'Implement database seeding', priority: 'Medium', estimatedHours: 3 },
          { taskId: '1.4.4', description: 'Add database indexes for performance', priority: 'Medium', estimatedHours: 3 },
          { taskId: '1.4.5', description: 'Create backup and restore procedures', priority: 'Low', estimatedHours: 4 },
        ]
      }
    ]
  },
  {
    name: 'Phase 2: Project Management',
    description: 'Task tracking, project organization, and team collaboration',
    orderIndex: 2,
    targetMonths: 'Month 3-4',
    weightPercent: 25,
    modules: [
      {
        name: '2.1 Task Management',
        description: 'Task CRUD, assignments, and tracking',
        orderIndex: 1,
        weightPercent: 35,
        tasks: [
          { taskId: '2.1.1', description: 'Create Task model and API endpoints', priority: 'High', estimatedHours: 6 },
          { taskId: '2.1.2', description: 'Build task list component with virtualization', priority: 'High', estimatedHours: 8 },
          { taskId: '2.1.3', description: 'Implement task filtering and search', priority: 'High', estimatedHours: 5 },
          { taskId: '2.1.4', description: 'Create task detail view with editing', priority: 'High', estimatedHours: 6 },
          { taskId: '2.1.5', description: 'Add task assignment functionality', priority: 'Medium', estimatedHours: 4 },
          { taskId: '2.1.6', description: 'Implement task status transitions', priority: 'Medium', estimatedHours: 4 },
          { taskId: '2.1.7', description: 'Create task priority management', priority: 'Medium', estimatedHours: 3 },
          { taskId: '2.1.8', description: 'Add estimated hours tracking', priority: 'Low', estimatedHours: 3 },
        ]
      },
      {
        name: '2.2 Phase & Module Organization',
        description: 'Hierarchical project structure',
        orderIndex: 2,
        weightPercent: 25,
        tasks: [
          { taskId: '2.2.1', description: 'Create Phase model and relationships', priority: 'High', estimatedHours: 4 },
          { taskId: '2.2.2', description: 'Build Module model with tasks', priority: 'High', estimatedHours: 4 },
          { taskId: '2.2.3', description: 'Implement phase progress calculation', priority: 'High', estimatedHours: 5 },
          { taskId: '2.2.4', description: 'Create module completion tracking', priority: 'Medium', estimatedHours: 4 },
          { taskId: '2.2.5', description: 'Build phase card component', priority: 'Medium', estimatedHours: 5 },
          { taskId: '2.2.6', description: 'Create module card component', priority: 'Medium', estimatedHours: 4 },
        ]
      },
      {
        name: '2.3 GitHub Integration',
        description: 'GitHub webhook, issue sync, and PR tracking',
        orderIndex: 3,
        weightPercent: 40,
        tasks: [
          { taskId: '2.3.1', description: 'Set up GitHub webhook endpoint', priority: 'High', estimatedHours: 6 },
          { taskId: '2.3.2', description: 'Implement webhook signature verification', priority: 'High', estimatedHours: 4 },
          { taskId: '2.3.3', description: 'Create GitHub issue sync service', priority: 'High', estimatedHours: 8 },
          { taskId: '2.3.4', description: 'Build PR merge detection and task completion', priority: 'High', estimatedHours: 6 },
          { taskId: '2.3.5', description: 'Implement GitHub issue creation from tasks', priority: 'High', estimatedHours: 6 },
          { taskId: '2.3.6', description: 'Create GitHub credentials management', priority: 'Medium', estimatedHours: 4 },
          { taskId: '2.3.7', description: 'Build issue status synchronization', priority: 'Medium', estimatedHours: 5 },
          { taskId: '2.3.8', description: 'Add GitHub event logging', priority: 'Medium', estimatedHours: 4 },
          { taskId: '2.3.9', description: 'Create manual sync trigger', priority: 'Low', estimatedHours: 3 },
        ]
      }
    ]
  },
  {
    name: 'Phase 3: Dashboard & Visualization',
    description: 'Interactive dashboard, charts, and real-time updates',
    orderIndex: 3,
    targetMonths: 'Month 5-6',
    weightPercent: 25,
    modules: [
      {
        name: '3.1 Pipeline Visualization',
        description: 'SVG-based pipeline tracking with animations',
        orderIndex: 1,
        weightPercent: 30,
        tasks: [
          { taskId: '3.1.1', description: 'Design pipeline stage visualization', priority: 'High', estimatedHours: 8 },
          { taskId: '3.1.2', description: 'Create SVG pipeline track component', priority: 'High', estimatedHours: 10 },
          { taskId: '3.1.3', description: 'Implement stage transition animations', priority: 'Medium', estimatedHours: 6 },
          { taskId: '3.1.4', description: 'Add progress indicators per stage', priority: 'Medium', estimatedHours: 4 },
          { taskId: '3.1.5', description: 'Create milestone markers', priority: 'Low', estimatedHours: 3 },
        ]
      },
      {
        name: '3.2 Statistics & Charts',
        description: 'Progress charts, metrics, and analytics',
        orderIndex: 2,
        weightPercent: 25,
        tasks: [
          { taskId: '3.2.1', description: 'Create completion percentage calculation', priority: 'High', estimatedHours: 4 },
          { taskId: '3.2.2', description: 'Build progress bar components', priority: 'High', estimatedHours: 4 },
          { taskId: '3.2.3', description: 'Implement pie chart for task status', priority: 'Medium', estimatedHours: 5 },
          { taskId: '3.2.4', description: 'Create timeline chart component', priority: 'Medium', estimatedHours: 6 },
          { taskId: '3.2.5', description: 'Add hours tracking visualization', priority: 'Low', estimatedHours: 4 },
        ]
      },
      {
        name: '3.3 Real-time Updates',
        description: 'SSE, WebSocket, and live dashboard updates',
        orderIndex: 3,
        weightPercent: 25,
        tasks: [
          { taskId: '3.3.1', description: 'Set up SSE endpoint for updates', priority: 'High', estimatedHours: 6 },
          { taskId: '3.3.2', description: 'Implement client-side SSE connection', priority: 'High', estimatedHours: 4 },
          { taskId: '3.3.3', description: 'Create event broadcast system', priority: 'Medium', estimatedHours: 5 },
          { taskId: '3.3.4', description: 'Add reconnection logic', priority: 'Medium', estimatedHours: 3 },
          { taskId: '3.3.5', description: 'Implement optimistic UI updates', priority: 'Medium', estimatedHours: 4 },
        ]
      },
      {
        name: '3.4 Responsive Design',
        description: 'Mobile-friendly dashboard and accessibility',
        orderIndex: 4,
        weightPercent: 20,
        tasks: [
          { taskId: '3.4.1', description: 'Create responsive grid layout', priority: 'High', estimatedHours: 5 },
          { taskId: '3.4.2', description: 'Implement mobile navigation', priority: 'Medium', estimatedHours: 6 },
          { taskId: '3.4.3', description: 'Add touch-friendly interactions', priority: 'Medium', estimatedHours: 4 },
          { taskId: '3.4.4', description: 'Implement dark mode support', priority: 'Medium', estimatedHours: 4 },
          { taskId: '3.4.5', description: 'Add ARIA labels and accessibility', priority: 'High', estimatedHours: 5 },
        ]
      }
    ]
  },
  {
    name: 'Phase 4: Advanced Features',
    description: 'AI integration, automation, and advanced functionality',
    orderIndex: 4,
    targetMonths: 'Month 7-8',
    weightPercent: 20,
    modules: [
      {
        name: '4.1 AI Assistant Integration',
        description: 'LLM-powered task suggestions and automation',
        orderIndex: 1,
        weightPercent: 35,
        tasks: [
          { taskId: '4.1.1', description: 'Integrate z-ai-web-dev-sdk for LLM', priority: 'High', estimatedHours: 6 },
          { taskId: '4.1.2', description: 'Create AI task suggestion endpoint', priority: 'High', estimatedHours: 6 },
          { taskId: '4.1.3', description: 'Build chat interface for AI assistant', priority: 'Medium', estimatedHours: 8 },
          { taskId: '4.1.4', description: 'Implement context-aware responses', priority: 'Medium', estimatedHours: 6 },
          { taskId: '4.1.5', description: 'Add task description generation', priority: 'Low', estimatedHours: 4 },
          { taskId: '4.1.6', description: 'Create AI-powered search', priority: 'Low', estimatedHours: 5 },
        ]
      },
      {
        name: '4.2 Automation & Workflows',
        description: 'Automated task management and workflows',
        orderIndex: 2,
        weightPercent: 30,
        tasks: [
          { taskId: '4.2.1', description: 'Create workflow trigger system', priority: 'High', estimatedHours: 8 },
          { taskId: '4.2.2', description: 'Implement auto-assignment rules', priority: 'Medium', estimatedHours: 5 },
          { taskId: '4.2.3', description: 'Build notification system', priority: 'High', estimatedHours: 6 },
          { taskId: '4.2.4', description: 'Create scheduled task reports', priority: 'Medium', estimatedHours: 5 },
          { taskId: '4.2.5', description: 'Add email notifications', priority: 'Low', estimatedHours: 6 },
        ]
      },
      {
        name: '4.3 Export & Reporting',
        description: 'PDF, CSV exports and stakeholder reports',
        orderIndex: 3,
        weightPercent: 35,
        tasks: [
          { taskId: '4.3.1', description: 'Create CSV export for tasks', priority: 'High', estimatedHours: 4 },
          { taskId: '4.3.2', description: 'Implement PDF report generation', priority: 'High', estimatedHours: 8 },
          { taskId: '4.3.3', description: 'Build progress report template', priority: 'Medium', estimatedHours: 5 },
          { taskId: '4.3.4', description: 'Create stakeholder dashboard view', priority: 'Medium', estimatedHours: 6 },
          { taskId: '4.3.5', description: 'Add scheduled report delivery', priority: 'Low', estimatedHours: 4 },
          { taskId: '4.3.6', description: 'Implement data backup export', priority: 'Low', estimatedHours: 3 },
        ]
      }
    ]
  },
  {
    name: 'Phase 5: Production & Deployment',
    description: 'Testing, optimization, and production deployment',
    orderIndex: 5,
    targetMonths: 'Month 9-10',
    weightPercent: 10,
    modules: [
      {
        name: '5.1 Testing & Quality',
        description: 'Unit tests, integration tests, and E2E testing',
        orderIndex: 1,
        weightPercent: 40,
        tasks: [
          { taskId: '5.1.1', description: 'Set up Jest and testing framework', priority: 'High', estimatedHours: 4 },
          { taskId: '5.1.2', description: 'Write unit tests for API routes', priority: 'High', estimatedHours: 8 },
          { taskId: '5.1.3', description: 'Create integration tests for database', priority: 'High', estimatedHours: 6 },
          { taskId: '5.1.4', description: 'Implement E2E tests with Playwright', priority: 'Medium', estimatedHours: 10 },
          { taskId: '5.1.5', description: 'Add test coverage reporting', priority: 'Medium', estimatedHours: 3 },
          { taskId: '5.1.6', description: 'Create mock data generators', priority: 'Low', estimatedHours: 4 },
        ]
      },
      {
        name: '5.2 Performance Optimization',
        description: 'Code splitting, caching, and performance tuning',
        orderIndex: 2,
        weightPercent: 30,
        tasks: [
          { taskId: '5.2.1', description: 'Implement code splitting', priority: 'High', estimatedHours: 6 },
          { taskId: '5.2.2', description: 'Add response caching', priority: 'High', estimatedHours: 5 },
          { taskId: '5.2.3', description: 'Optimize database queries', priority: 'High', estimatedHours: 6 },
          { taskId: '5.2.4', description: 'Implement image optimization', priority: 'Medium', estimatedHours: 4 },
          { taskId: '5.2.5', description: 'Add bundle size monitoring', priority: 'Low', estimatedHours: 3 },
        ]
      },
      {
        name: '5.3 Deployment & Monitoring',
        description: 'Production deployment, monitoring, and alerts',
        orderIndex: 3,
        weightPercent: 30,
        tasks: [
          { taskId: '5.3.1', description: 'Configure production environment', priority: 'High', estimatedHours: 4 },
          { taskId: '5.3.2', description: 'Set up error tracking (Sentry)', priority: 'High', estimatedHours: 4 },
          { taskId: '5.3.3', description: 'Implement health check endpoints', priority: 'High', estimatedHours: 3 },
          { taskId: '5.3.4', description: 'Create monitoring dashboard', priority: 'Medium', estimatedHours: 6 },
          { taskId: '5.3.5', description: 'Set up automated backups', priority: 'Medium', estimatedHours: 4 },
          { taskId: '5.3.6', description: 'Document deployment procedures', priority: 'Low', estimatedHours: 3 },
        ]
      }
    ]
  }
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data
  await prisma.issueCreationQueue.deleteMany()
  await prisma.gitHubIssueSync.deleteMany()
  await prisma.gitHubEvent.deleteMany()
  await prisma.task.deleteMany()
  await prisma.module.deleteMany()
  await prisma.phase.deleteMany()
  await prisma.gitHubCredentials.deleteMany()
  await prisma.project.deleteMany()

  // Create project
  const project = await prisma.project.create({
    data: projectData
  })
  console.log(`✅ Created project: ${project.name}`)

  // Create GitHub credentials
  await prisma.gitHubCredentials.create({
    data: {
      repoName: 'gotham-platform',
      accessToken: 'ghp_demo_token_replace_with_real_token',
      webhookSecret: 'webhook_secret_demo'
    }
  })
  console.log(`✅ Created GitHub credentials`)

  // Create phases, modules, and tasks
  let totalTasks = 0
  for (const phaseData of phasesData) {
    const phase = await prisma.phase.create({
      data: {
        projectId: project.id,
        name: phaseData.name,
        description: phaseData.description,
        orderIndex: phaseData.orderIndex,
        targetMonths: phaseData.targetMonths,
        weightPercent: phaseData.weightPercent,
        completionPercent: 0
      }
    })
    console.log(`✅ Created phase: ${phase.name}`)

    for (const moduleData of phaseData.modules) {
      const module_ = await prisma.module.create({
        data: {
          phaseId: phase.id,
          name: moduleData.name,
          description: moduleData.description,
          orderIndex: moduleData.orderIndex,
          weightPercent: moduleData.weightPercent,
          completionPercent: 0
        }
      })

      // Create tasks
      for (const taskData of moduleData.tasks) {
        await prisma.task.create({
          data: {
            moduleId: module_.id,
            taskId: taskData.taskId,
            description: taskData.description,
            priority: taskData.priority,
            estimatedHours: taskData.estimatedHours,
            status: 'not_started'
          }
        })
        totalTasks++
      }
    }
  }

  console.log(`\n✅ Seed completed!`)
  console.log(`📊 Summary:`)
  console.log(`   - 1 Project`)
  console.log(`   - ${phasesData.length} Phases`)
  console.log(`   - ${phasesData.reduce((acc, p) => acc + p.modules.length, 0)} Modules`)
  console.log(`   - ${totalTasks} Tasks`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
