module.exports = {
    apps: [
      {
        name: 'peptalk_backend_dev',
        script: 'npm',
        args: 'run dev',
        exp_backoff_restart_delay: 100,
        env: {
          NODE_ENV: "development",
        },
      },
      {
        name: 'peptalk_backend_prod',
        script: 'npm',
        args: 'run start',
        exp_backoff_restart_delay: 100,
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };