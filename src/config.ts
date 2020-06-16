const config = {
    environment: process.env.NODE_ENV || 'production',
    isDev: function () {
        return this.environment === 'development';
    },
    isProduction: function () {
        return this.environment === 'production';
    }
};

export default config;