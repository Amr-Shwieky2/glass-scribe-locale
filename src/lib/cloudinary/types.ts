/**
 * Cloudinary image and response type definitions.
 */

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  tags: string[];
  context?: {
    custom?: {
      alt?: string;
      caption?: string;
    };
  };
}

export interface CloudinaryResponse {
  resources: CloudinaryImage[];
  next_cursor?: string;
  total_count?: number;
}
