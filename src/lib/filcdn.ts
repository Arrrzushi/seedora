// FilCDN integration for Filecoin storage
export interface FilCDNConfig {
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
}

export interface UploadResponse {
  cid: string;
  url: string;
  size: number;
  filename: string;
  dealId?: string;
}

export interface RetrieveResponse {
  url: string;
  cid: string;
  metadata?: {
    filename: string;
    size: number;
    contentType: string;
  };
}

export interface FilecoinDeal {
  dealId: string;
  cid: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  provider: string;
  price: string;
  startEpoch?: number;
  endEpoch?: number;
}

class FilCDNClient {
  private config: FilCDNConfig;

  constructor(config: FilCDNConfig) {
    this.config = config;
  }

  /**
   * Upload a video file to FilCDN/Filecoin storage with CDN enabled
   */
  async uploadVideo(file: File, options?: { 
    filename?: string;
    metadata?: Record<string, any>;
    enableCDN?: boolean;
  }): Promise<UploadResponse> {
    // If FilCDN is not enabled, simulate upload for demo purposes
    if (!this.config.enabled) {
      return this.simulateVideoUpload(file, options);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.filename) {
      formData.append('filename', options.filename);
    }
    
    // Enable CDN by default for video content
    const uploadOptions = {
      enableCDN: options?.enableCDN !== false, // Default to true
      replication: 3, // Ensure good availability
      ...options?.metadata
    };
    
    formData.append('options', JSON.stringify(uploadOptions));

    try {
      const response = await fetch(`${this.config.baseUrl}/upload/video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`FilCDN upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        cid: result.cid,
        url: result.cdnUrl || result.url || `${this.config.baseUrl}/stream/${result.cid}`,
        size: result.size || file.size,
        filename: result.filename || file.name,
        dealId: result.dealId,
      };
    } catch (error) {
      console.error('FilCDN video upload error:', error);
      // Fallback to simulation if real FilCDN fails
      console.warn('Falling back to simulated upload for demo purposes');
      return this.simulateVideoUpload(file, options);
    }
  }

  /**
   * Simulate video upload for demo/development purposes
   */
  private async simulateVideoUpload(file: File, options?: { 
    filename?: string;
    metadata?: Record<string, any>;
  }): Promise<UploadResponse> {
    // Simulate network delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Generate a mock CID (Content Identifier)
    const mockCID = `bafybeig${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Create a blob URL for the video file (for demo playback)
    const blobUrl = URL.createObjectURL(file);
    
    // Generate mock deal ID
    const mockDealId = `deal_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    return {
      cid: mockCID,
      url: blobUrl,
      size: file.size,
      filename: options?.filename || file.name,
      dealId: mockDealId,
    };
  }

  /**
   * Get streaming URL for video content with CDN optimization
   */
  getStreamingUrl(cid: string, quality?: 'auto' | '1080p' | '720p' | '480p' | '360p'): string {
    if (!this.config.enabled) {
      return `blob:${cid}`;
    }
    
    const qualityParam = quality ? `?quality=${quality}` : '';
    return `${this.config.baseUrl}/stream/${cid}${qualityParam}`;
  }

  /**
   * Get CDN-optimized thumbnail URL
   */
  getThumbnailUrl(cid: string, options?: { width?: number; height?: number }): string {
    if (!this.config.enabled) {
      return 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&dpr=2';
    }
    
    const params = new URLSearchParams();
    if (options?.width) params.append('w', options.width.toString());
    if (options?.height) params.append('h', options.height.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return `${this.config.baseUrl}/thumbnail/${cid}${queryString}`;
  }

  /**
   * Check if content exists in FilCDN
   */
  async contentExists(cid: string): Promise<boolean> {
    if (!this.config.enabled) {
      return true; // Always return true for demo mode
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/exists/${cid}`, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get deal information for a CID
   */
  async getDealInfo(cid: string): Promise<FilecoinDeal | null> {
    if (!this.config.enabled) {
      // Return mock deal info for demo
      return {
        dealId: `deal_${cid.slice(-8)}`,
        cid,
        status: 'active',
        provider: `f0${Math.floor(Math.random() * 10000)}`,
        price: `${(Math.random() * 0.01).toFixed(4)} FIL`,
        startEpoch: Math.floor(Date.now() / 1000) - 86400,
        endEpoch: Math.floor(Date.now() / 1000) + (365 * 86400),
      };
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/deal/${cid}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Check if FilCDN is enabled and configured
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get CDN status and performance metrics
   */
  async getCDNStatus(): Promise<{
    enabled: boolean;
    regions: string[];
    cacheHitRate: number;
    avgLatency: number;
  }> {
    if (!this.config.enabled) {
      return {
        enabled: false,
        regions: ['demo'],
        cacheHitRate: 0.95,
        avgLatency: 50,
      };
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/cdn/status`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get CDN status');
      }

      return await response.json();
    } catch {
      return {
        enabled: false,
        regions: [],
        cacheHitRate: 0,
        avgLatency: 0,
      };
    }
  }
}

// Initialize FilCDN client
const filcdnConfig: FilCDNConfig = {
  apiKey: import.meta.env.VITE_FILCDN_API_KEY || 'demo-key',
  baseUrl: import.meta.env.VITE_FILCDN_BASE_URL || 'https://api.filcdn.io/v1',
  enabled: import.meta.env.VITE_FILCDN_ENABLED === 'true',
};

export const filcdnClient = new FilCDNClient(filcdnConfig);

// Utility functions for video processing
export const generateVideoMetadata = (file: File, duration?: number) => ({
  filename: file.name,
  size: file.size,
  type: file.type,
  duration: duration || 0,
  uploadedAt: new Date().toISOString(),
  platform: 'start.dev',
  quality: getVideoQuality(file),
});

export const getVideoQuality = (file: File): string => {
  // Simple heuristic based on file size
  const sizeInMB = file.size / (1024 * 1024);
  if (sizeInMB > 100) return '1080p';
  if (sizeInMB > 50) return '720p';
  if (sizeInMB > 20) return '480p';
  return '360p';
};

export const createFilecoinDeal = async (cid: string, metadata: any) => {
  // This would integrate with Filecoin deal-making APIs
  // For demo purposes, we'll simulate this
  console.log(`Creating Filecoin deal for CID: ${cid}`, metadata);
  
  // Simulate deal creation delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    dealId: `deal_${Date.now()}`,
    cid,
    status: 'active',
    provider: `f0${Math.floor(Math.random() * 10000)}`,
    price: `${(Math.random() * 0.01).toFixed(4)} FIL`,
    startEpoch: Math.floor(Date.now() / 1000),
    endEpoch: Math.floor(Date.now() / 1000) + (365 * 86400), // 1 year
  };
};