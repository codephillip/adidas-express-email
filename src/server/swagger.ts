const swaggerDocument = {
  swagger: '2.0',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    
    '/email/': {
      get: {
        summary: 'Lists all the emails',
        tags: ['email'],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'Returns a list',
            schema: {
              $ref: '#/definitions/Email',
            },
          },
        },
      },
      post: {
        summary: 'Creates a email',
        tags: ['email'],
        parameters: [
          {
            name: 'email',
            in: 'body',
            required: true,
            schema: {
              $ref: '#/createUpdateDef/CreateUpdateEmail',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Returns a new email',
            schema: {
              $ref: '#/createUpdateDef/CreateUpdateEmail',
            },
          },
        },
      },
    },
    '/email/{id}': {
      get: {
        summary: 'Gets a email by its primary key',
        tags: ['email'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'Returns a email with primary key',
            schema: {
              $ref: '#/definitions/Email',
            },
          },
        },
      },
      delete: {
        summary: 'Deletes a email by its primary key',
        tags: ['email'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'OK',
          },
        },
      },
      put: {
        summary: 'Overrides the values of a email',
        tags: ['email'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              $ref: '#/definitions/Email',
            },
          },
          {
            name: 'email',
            in: 'body',
            required: true,
            schema: {
              $ref: '#/createUpdateDef/CreateUpdateEmail',
            },
          },
        ],
        responses: {
          200: {
            description: 'Returns a email',
            schema: {
              $ref: '#/definitions/Email',
            },
          },
        },
      },
      patch: {
        tags: ['email'],
        summary: 'patch a email',
        parameters: [
          {
            name: 'id',
            in: 'path',
            schema: {
              $ref: '#/definitions/Email',
            },
          },
          {
            name: 'email',
            in: 'body',
            schema: {
              $ref: '#/createUpdateDef/CreateUpdateEmail',
            },
          },
        ],
        responses: {
          200: {
            description: 'Returns a email and its partially overwritten values',
            schema: {
              $ref: '#/definitions/Email',
            },
          },
        },
      },
    },

  },
  definitions: {
    Email: {
      required: ['email','message','subject',],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          uniqueItems: true,
          readOnly: true,
        },
        email: {
          type: 'string',
          maxLength: 255,
        },
        emailType: {
          type: 'string',
          maxLength: 255,
          enum: ['General', 'Newsletter', 'Promotions', 'Reminder'],
        },
        message: {
          type: 'string',
          maxLength: 2000,
        },
        subject: {
          type: 'string',
          maxLength: 255,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },

  },
  createUpdateDef: {
    CreateUpdateEmail: {
      required: ['email','message','subject',],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          uniqueItems: true,
          readOnly: true,
        },
        email: {
          type: 'string',
          maxLength: 255,
        },
        emailType: {
          type: 'string',
          maxLength: 255,
          enum: ['General', 'Newsletter', 'Promotions', 'Reminder'],
        },
        message: {
          type: 'string',
          maxLength: 2000,
        },
        subject: {
          type: 'string',
          maxLength: 255,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },

  },
};

export default swaggerDocument;
