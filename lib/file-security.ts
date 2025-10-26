/**
 * File upload security validation
 * Ensures uploaded files meet security requirements
 */

// Allowed file types for different upload categories
export const ALLOWED_FILE_TYPES = {
  images: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif'
  ],
  documents: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  all: [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
} as const;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  default: 5 * 1024 * 1024, // 5MB
} as const;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate a file upload for security
 */
export function validateFileUpload(
  file: File,
  category: 'images' | 'documents' | 'all' = 'all'
): FileValidationResult {
  // Check file type
  const allowedTypes = ALLOWED_FILE_TYPES[category];
  if (!includesString(allowedTypes, file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size
  const maxSize = category === 'documents' ? FILE_SIZE_LIMITS.document : FILE_SIZE_LIMITS.image;
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`
    };
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /[<>:"|?*]/, // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        isValid: false,
        error: 'Invalid file name'
      };
    }
  }

  return { isValid: true };
}

/**
 * Sanitize file name for safe storage
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
}

// derive literal unions from the const arrays
type ImageMime = typeof ALLOWED_FILE_TYPES.images[number];
type DocumentMime = typeof ALLOWED_FILE_TYPES.documents[number];

// narrow a string to ImageMime if included in the images list
function isImageMime(m: string): m is ImageMime {
  return (ALLOWED_FILE_TYPES.images as readonly string[]).includes(m);
}

// narrow a string to DocumentMime if included in the documents list
function isDocumentMime(m: string): m is DocumentMime {
  return (ALLOWED_FILE_TYPES.documents as readonly string[]).includes(m);
}

// utility to check if a string is included in a readonly string array
const includesString = (arr: readonly string[], v: string) => arr.includes(v);

/**
 * Get file category based on MIME type
 */
export function getFileCategory(
  mimeType: string
): 'images' | 'documents' | 'unknown' {
  if (isImageMime(mimeType)) return 'images';
  if (isDocumentMime(mimeType)) return 'documents';
  return 'unknown';
}
