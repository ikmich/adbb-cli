const config = {
    environment: process.env.NODE_ENV || 'production',
    isDev: function () {
        return this.environment === 'development';
    },
    isProduction: function () {
        return this.environment === 'production';
    },
    cmd_exec_delay: 200
};

export default config;