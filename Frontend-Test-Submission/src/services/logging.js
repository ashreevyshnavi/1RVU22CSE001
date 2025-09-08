class LoggingService {
  
  static async Log(stack, level, packageName, message) {
    try {
      console.log(`[${level.toUpperCase()}] ${stack}/${packageName}: ${message}`);
      return { success: true };
    } catch (error) {
      console.error('Logging failed:', error);
      return { error: error.message };
    }
  }

  static async info(stack, packageName, message) {
    return this.Log(stack, 'info', packageName, message);
  }

  static async error(stack, packageName, message) {
    return this.Log(stack, 'error', packageName, message);
  }

  static async warn(stack, packageName, message) {
    return this.Log(stack, 'warn', packageName, message);
  }

  static async debug(stack, packageName, message) {
    return this.Log(stack, 'debug', packageName, message);
  }
}

export default LoggingService;