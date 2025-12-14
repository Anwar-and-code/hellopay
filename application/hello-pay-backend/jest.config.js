module.exports = {
    preset: 'ts-jest',               
    testEnvironment: 'node',         
    transform: {
      '^.+\\.ts$': 'ts-jest',        
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: './',                   
    testRegex: '.*\\.spec\\.ts$',     
    collectCoverage: true,           
    coverageDirectory: 'coverage',   
    coverageProvider: 'v8',      
    coverageReporters: ['lcov', 'text', 'text-summary', 'cobertura'], 
  };