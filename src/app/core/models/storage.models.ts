export interface PresignedUrlResponse {
  uploadUrl: string; // The long URL with signature (for PUT)
  viewUrl: string; // The short public URL (for DB)
  filename: string; // The storage filename (UUID)
}
