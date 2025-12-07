import request from 'supertest';
import app from '../src/app';
import {prisma} from '../src/lib/prisma';

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

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.$disconnect();
  });

  it('creates a task when payload is valid', async () => {
    const payload = {
      title: 'Prepare hearing bundle',
      description: 'Collate documents for the 10am hearing',
      status: 'NEW',
      dueDateTime: '2030-01-01T09:00:00.000Z'
    };

    const response = await request(app).post('/api/tasks').send(payload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Task created successfully');
    expect(response.body.data).toMatchObject({
      title: payload.title,
      description: payload.description,
      status: payload.status,
      dueDateTime: payload.dueDateTime
    });

    const storedTask = await prisma.task.findFirst({
      where: {title: payload.title}
    });

    expect(storedTask).not.toBeNull();
    expect(storedTask?.status).toBe('NEW');
  });

  it('rejects invalid payloads with validation errors', async () => {
    const response = await request(app).post('/api/tasks').send({
      title: 'Due date in past',
      status: 'NEW',
      dueDateTime: new Date(Date.now() - 3_600_000).toISOString()
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(Array.isArray(response.body.details)).toBe(true);
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
