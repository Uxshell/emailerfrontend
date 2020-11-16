require('dotenv').config();


const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000,
    cors: process.env.CORS,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    cnn: process.env.DB_CNN,
    seedAuth: process.env.SEED_AUTENTICACION,
    expiration: process.env.EXPIRATION_TOKEN,
    lambdaEmail: process.env.AWS_LAMBDA_EMAIL,
    lambdaMassiveEmail: process.env.AWS_LAMBDA_MASSIVE_EMAIL,
    lambdaStadistics: process.env.AWS_LAMBDA_STADISTICS,
    lambdaAllStatistics: process.env.AWS_LAMBDA_ALL_STATISTICS
};

module.exports = { config };