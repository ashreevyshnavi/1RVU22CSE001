module.exports = {
  ACCESS_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaHJlZXZ5c2huYXZpYS5idGVjaDIyQHJ2dS5lZHUuaW4iLCJleHAiOjE3NTczMTY0MjMsImlhdCI6MTc1NzMxNTUyMywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjhjZWQwMjVhLWRmMGMtNDYxNi1hYTI1LTBmNjU5MWU5YmZmNyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImEgc2hyZWUgdnlzaG5hdmkiLCJzdWIiOiIwYWQxYTFmMC1hZDljLTRlZjctYjU1ZC0zODU5NjU2OWRiZmEifSwiZW1haWwiOiJzaHJlZXZ5c2huYXZpYS5idGVjaDIyQHJ2dS5lZHUuaW4iLCJuYW1lIjoiYSBzaHJlZSB2eXNobmF2aSIsInJvbGxObyI6IjFydnUyMmNzZTAwMSIsImFjY2Vzc0NvZGUiOiJXUFZxa3ciLCJjbGllbnRJRCI6IjBhZDFhMWYwLWFkOWMtNGVmNy1iNTVkLTM4NTk2NTY5ZGJmYSIsImNsaWVudFNlY3JldCI6InprQ2NLSlVDR3Z2UXNSbmsifQ.8c6fNBnz_0TOQKrYkiUSN_FjVYljgKy3dfQXBlh3pyA',
  
  API_URL: 'http://20.244.56.144/evaluation-service/logs',
  
  VALID_STACKS: ['backend', 'frontend'],
  VALID_LEVELS: ['debug', 'info', 'warn', 'error', 'fatal'],
  
  BACKEND_PACKAGES: [
    'cache', 'controller', 'cron_job', 'db', 'domain', 
    'handler', 'repository', 'route', 'service'
  ],
  FRONTEND_PACKAGES: ['api'],
  COMMON_PACKAGES: ['auth', 'config', 'middleware', 'utils']
};