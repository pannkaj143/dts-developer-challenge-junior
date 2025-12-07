import {Router} from 'express';
import {createTask} from '../controllers/taskController.js';

const router = Router();

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateTaskResponse'
 *       400:
 *         description: Validation failed
 */
router.post('/', createTask);

export default router;
