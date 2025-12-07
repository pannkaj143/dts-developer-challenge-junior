import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Task Service API',
    version: '1.0.0',
    description:
      'API for creating tasks so HMCTS caseworkers can manage their workload.'
  },
  servers: [{url: 'http://localhost:4000'}],
  components: {
    schemas: {
      CreateTaskRequest: {
        type: 'object',
        required: ['title', 'status', 'dueDateTime'],
        properties: {
          title: {type: 'string', example: 'Review case outline'},
          description: {type: 'string', example: 'Ensure the outline is updated for the hearing'},
          status: {
            type: 'string',
            enum: ['NEW', 'IN_PROGRESS', 'DONE'],
            example: 'NEW'
          },
          dueDateTime: {
            type: 'string',
            format: 'date-time',
            description: 'Must be a future date/time in ISO-8601 format',
            example: '2025-12-01T09:00:00.000Z'
          }
        }
      },
      CreateTaskResponse: {
        type: 'object',
        properties: {
          message: {type: 'string'},
          data: {
            type: 'object',
            properties: {
              id: {type: 'integer'},
              title: {type: 'string'},
              description: {type: 'string', nullable: true},
              status: {type: 'string'},
              dueDateTime: {type: 'string', format: 'date-time'},
              createdAt: {type: 'string', format: 'date-time'},
              updatedAt: {type: 'string', format: 'date-time'}
            }
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.ts', 'dist/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
