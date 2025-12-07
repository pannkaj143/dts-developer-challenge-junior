import request from 'supertest';
import {prisma} from '../src/lib/prisma';
import app from '../src/app';

describe('POST /api/tasks', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Task";');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Task" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'NEW' CHECK ("status" IN ('NEW', 'IN_PROGRESS', 'DONE')),
        "dueDateTime" DATETIME NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates a task when the payload is valid', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Draft tribunal summary',
        description: 'Summarise the claimant statements for review',
        status: 'NEW',
        dueDateTime: '2030-01-01T09:30:00.000Z'
      })
      .expect(201);

    expect(response.body.message).toBe('Task created successfully');
    expect(response.body.data).toMatchObject({
      title: 'Draft tribunal summary',
      description: 'Summarise the claimant statements for review',
      status: 'NEW'
    });

    const allTasks = await prisma.task.findMany();
    expect(allTasks).toHaveLength(1);
  });

  it('rejects due dates set in the past', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Past due task',
        status: 'NEW',
        dueDateTime: new Date(Date.now() - 3_600_000).toISOString()
      })
      .expect(400);

    expect(response.body.message).toBe('Validation failed');
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'dueDateTime',
          message: 'Due date/time must be in the future'
        })
      ])
    );
  });
});
