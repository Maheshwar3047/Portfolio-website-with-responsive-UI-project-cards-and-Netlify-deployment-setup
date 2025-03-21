interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class Logger {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 1000;

  info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
  }

  error(message: string, error: any) {
    console.error(`[ERROR] ${message}`, {
      message: error?.message,
      stack: error?.stack,
      details: error
    });
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
  }

  // Performance monitoring methods
  startTimer(name: string, metadata?: Record<string, any>): () => number {
    const start = performance.now();
    return () => this.endTimer(name, start, metadata);
  }

  private endTimer(name: string, startTime: number, metadata?: Record<string, any>): number {
    const duration = performance.now() - startTime;
    this.addMetric({
      name,
      duration,
      timestamp: Date.now(),
      metadata
    });
    return duration;
  }

  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift(); // Remove oldest metric
    }

    // Log slow operations
    if (metric.duration > 1000) { // Over 1 second
      this.warn(`Slow operation detected: ${metric.name}`, {
        duration: `${metric.duration.toFixed(2)}ms`,
        ...metric.metadata
      });
    }
  }

  getMetrics(options: { 
    name?: string;
    minDuration?: number;
    limit?: number;
  } = {}): PerformanceMetric[] {
    let filtered = [...this.metrics];
    
    if (options.name) {
      filtered = filtered.filter(m => m.name === options.name);
    }
    
    if (typeof options.minDuration === 'number') {
      filtered = filtered.filter(m => m.duration >= options.minDuration!);
    }
    
    return filtered
      .slice(-1 * (options.limit || this.MAX_METRICS))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.metrics.filter(m => m.name === name);
    if (metrics.length === 0) return null;
    
    const sum = metrics.reduce((acc, curr) => acc + curr.duration, 0);
    return sum / metrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const logger = new Logger();