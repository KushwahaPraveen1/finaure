    const express = require('express');
    const dotenv = require('dotenv');
    const morgan = require('morgan');
    const rateLimit = require('express-rate-limit');
    const errorHandler = require('./middlewares/errorMiddleware');
    const connectDB = require('./config/db');
    const redisClient = require('./utils/redisClient'); 
    const asyncHandler = require('./utils/asyncHandler');
    const swaggerJsDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');
    const app = express();
   
    // Middleware to parse incoming requests
    app.use(express.json());

    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Finaure 5 Backend API',
                version: '1.0.0',
                description: 'API documentation for Finaure 5 assignment',
                contact: {
                    name: 'Your Name',
                },
                servers: ['http://localhost:5000'],
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [{ bearerAuth: [] }],
        },
        apis: ['./routes/*.js'], // Path to your route files
    };
    
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    // Load environment variables
    dotenv.config();

    // Initialize Express app
    
    // Dev logging middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Rate limiting
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per window
        message: 'Too many requests, please try again later.'
    });
    app.use('/api/', apiLimiter);

    // Routes
    const authRoutes = require('./routes/authRoutes');
    const planRoutes = require('./routes/planRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/plans', planRoutes);

    // Global error handling middleware
    app.use(errorHandler);

    // Connect to MongoDB
    connectDB();

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
