class DependencyInjector {
    private services: Map<string, any> = new Map();
  
    register<T>(key: string, service: T): void {
      this.services.set(key, service);
    }
  
    resolve<T>(key: string): T {
      const service = this.services.get(key);
      if (!service) {
        throw new Error(`Service '${key}' is not registered.`);
      }
      return service;
    }

    exists(key: string): boolean {
        return this.services.has(key);
    }
  }
  
  export const injector = new DependencyInjector();