export default {
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  testMatch: ['**/__tests__/**/*.test.(ts|js|tsx)'],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironmentOptions: {
    customExportConditions: [''],
  }
};