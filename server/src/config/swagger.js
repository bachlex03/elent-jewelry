const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cấu hình Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API for My Application',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', // Đổi URL theo môi trường của bạn
      },
    ],
    
  },
  apis: ['./src/routes/**/*.js'], // Đường dẫn tới các file chứa route API
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };
                                                            