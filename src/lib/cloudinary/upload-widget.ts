/**
 * Cloudinary Upload Widget configuration.
 */

import { CLOUDINARY_CONFIG, type ServiceCategory } from './config';

export function getUploadWidgetConfig(category: ServiceCategory) {
  return {
    cloudName: CLOUDINARY_CONFIG.cloudName,
    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
    folder: `${CLOUDINARY_CONFIG.baseFolder}/${category}`,
    tags: [category],
    sources: ['local', 'url', 'camera'],
    multiple: true,
    maxFiles: 50,
    maxImageFileSize: 10000000,
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    cropping: false,
    showAdvancedOptions: false,
    showPoweredBy: false,
    styles: {
      palette: {
        window: '#FFFFFF',
        windowBorder: '#0F2A44',
        tabIcon: '#C9A24D',
        menuIcons: '#0F2A44',
        textDark: '#0F2A44',
        textLight: '#FFFFFF',
        link: '#C9A24D',
        action: '#C9A24D',
        inactiveTabIcon: '#0F2A44',
        error: '#FF4444',
        inProgress: '#C9A24D',
        complete: '#20B832',
        sourceBg: '#F2F2F2',
      },
      fonts: {
        default: null,
        "'Inter', sans-serif": {
          url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
          active: true,
        },
      },
    },
  };
}
