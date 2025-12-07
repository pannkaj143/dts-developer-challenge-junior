import type {Request, Response, NextFunction} from 'express';
import {createTaskSchema, type CreateTaskInput} from '../schemas/taskSchema.js';
import {prisma} from '../lib/prisma.js';

/**
 * Validates task payload and persists the record.
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createTaskSchema.parse(req.body) as CreateTaskInput;

    const trimmedDescription = parsed.description?.trim();

    const task = await prisma.task.create({
      data: {
        title: parsed.title.trim(),
        description: trimmedDescription ? trimmedDescription : null,
        status: parsed.status,
        dueDateTime: new Date(parsed.dueDateTime)
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};
