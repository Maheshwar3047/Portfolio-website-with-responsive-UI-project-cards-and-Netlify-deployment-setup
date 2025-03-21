type CleanupFunction = () => void;

class CleanupManagerClass {
  private cleanupTasks: Map<string, CleanupFunction>;
  private isInitialized: boolean;

  constructor() {
    this.cleanupTasks = new Map();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    // Register window unload handler
    window.addEventListener('unload', () => this.clearAll());

    // Register visibility change handler for tab switching
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.executeInactiveCleanup();
      }
    });

    this.isInitialized = true;
  }

  registerCleanup(id: string, cleanup: CleanupFunction) {
    this.cleanupTasks.set(id, cleanup);
  }

  executeCleanup(id: string) {
    const cleanup = this.cleanupTasks.get(id);
    if (cleanup) {
      cleanup();
      this.cleanupTasks.delete(id);
    }
  }

  executeInactiveCleanup() {
    // Execute cleanup for non-visible resources
    this.cleanupTasks.forEach((cleanup, id) => {
      if (id.startsWith('inactive:')) {
        cleanup();
        this.cleanupTasks.delete(id);
      }
    });
  }

  clearAll() {
    this.cleanupTasks.forEach(cleanup => cleanup());
    this.cleanupTasks.clear();
  }

  // Memory management utilities
  disposeImage(imageElement: HTMLImageElement) {
    if (imageElement) {
      // Clear src to allow garbage collection
      imageElement.src = '';
      // Remove from DOM if possible
      imageElement.parentNode?.removeChild(imageElement);
    }
  }

  disposeCanvas(canvas: HTMLCanvasElement) {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      // Release object URLs if any were created
      if (canvas.toDataURL().startsWith('blob:')) {
        URL.revokeObjectURL(canvas.toDataURL());
      }
    }
  }

  disposeWebGLContext(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    if (gl) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
    }
  }

  // Resource cleanup utilities
  clearObjectURL(url: string) {
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      URL.revokeObjectURL(url);
    }
  }

  disposeWorker(worker: Worker) {
    worker.terminate();
  }

  clearCacheStorage(cacheName: string) {
    if ('caches' in window) {
      caches.delete(cacheName);
    }
  }

  async clearIndexedDB(dbName: string) {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onerror = () => reject(new Error(`Failed to delete IndexedDB: ${dbName}`));
      request.onsuccess = () => resolve();
    });
  }

  disconnectWebSocket(socket: WebSocket) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  }
}

export const CleanupManager = new CleanupManagerClass();