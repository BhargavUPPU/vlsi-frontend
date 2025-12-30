/**
 * Image Utility Functions
 * Helper functions for converting blob/Bytes data to displayable images
 */

/**
 * Convert a Blob or ArrayBuffer to a base64 data URL
 * @param {Blob|ArrayBuffer|Uint8Array} data - The blob data
 * @param {string} mimeType - The MIME type (default: image/jpeg)
 * @returns {Promise<string>} - Base64 data URL
 */
export const blobToDataURL = (data, mimeType = "image/jpeg") => {
  return new Promise((resolve, reject) => {
    try {
      let blob;
      
      if (data instanceof Blob) {
        blob = data;
      } else if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
        blob = new Blob([data], { type: mimeType });
      } else if (typeof data === 'string') {
        // If it's already a base64 string, return it
        if (data.startsWith('data:')) {
          resolve(data);
          return;
        }
        // If it's a base64 string without prefix, add it
        resolve(`data:${mimeType};base64,${data}`);
        return;
      } else {
        reject(new Error("Unsupported data type"));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Convert Buffer data from API to base64 data URL
 * @param {Object} bufferData - Buffer data object with type: 'Buffer' and data: [numbers]
 * @param {string} mimeType - The MIME type (default: image/jpeg)
 * @returns {string} - Base64 data URL
 */
export const bufferToDataURL = (bufferData, mimeType = "image/jpeg") => {
  try {
    if (!bufferData) return null;
    
    // If it's already a string (base64), return it
    if (typeof bufferData === 'string') {
      if (bufferData.startsWith('data:')) {
        return bufferData;
      }
      return `data:${mimeType};base64,${bufferData}`;
    }

    let uint8Array;

    // Handle different buffer formats
    if (bufferData.type === 'Buffer' && Array.isArray(bufferData.data)) {
      // Standard Buffer format: {type: 'Buffer', data: [1, 2, 3, ...]}
      uint8Array = new Uint8Array(bufferData.data);
    } else if (bufferData instanceof Uint8Array) {
      // Already a Uint8Array
      uint8Array = bufferData;
    } else if (typeof bufferData === 'object' && !Array.isArray(bufferData)) {
      // Object format with numeric keys: {0: 255, 1: 216, 2: 255, ...}
      // Convert to array of values
      const keys = Object.keys(bufferData).filter(k => !isNaN(k)).sort((a, b) => Number(a) - Number(b));
      const values = keys.map(k => bufferData[k]);
      
      if (values.length > 0) {
        uint8Array = new Uint8Array(values);
      } else {
        console.error("Buffer object has no numeric keys");
        return null;
      }
    } else {
      console.error("Unsupported buffer format:", typeof bufferData, bufferData);
      return null;
    }

    // Convert to base64
    // For large arrays, use chunking to avoid call stack size exceeded error
    let base64;
    const CHUNK_SIZE = 8192;
    
    if (uint8Array.length > CHUNK_SIZE) {
      let binary = '';
      for (let i = 0; i < uint8Array.length; i += CHUNK_SIZE) {
        const chunk = uint8Array.subarray(i, i + CHUNK_SIZE);
        binary += String.fromCharCode.apply(null, chunk);
      }
      base64 = btoa(binary);
    } else {
      base64 = btoa(String.fromCharCode.apply(null, uint8Array));
    }
    
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Error converting buffer to data URL:", error, bufferData);
    return null;
  }
};

/**
 * Fetch and process images from Events API
 * @param {Array} events - Array of event objects
 * @returns {Array} - Array of processed image URLs
 */
export const processEventImages = (events) => {
  if (!Array.isArray(events)) return [];
  
  const images = [];
  
  events.forEach(event => {
    if (event.files && Array.isArray(event.files)) {
      event.files.forEach(file => {
        if (file.fileData) {
          const imageUrl = bufferToDataURL(file.fileData);
          if (imageUrl) {
            images.push({
              url: imageUrl,
              title: event.title,
              type: 'event',
              id: event.id,
            });
          }
        }
      });
    }
  });
  
  return images;
};

/**
 * Fetch and process images from Projects API
 * @param {Array} projects - Array of project objects
 * @returns {Array} - Array of processed image URLs
 */
export const processProjectImages = (projects) => {
  if (!Array.isArray(projects)) return [];
  
  const images = [];
  
  projects.forEach(project => {
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach(image => {
        if (image.fileData) {
          const imageUrl = bufferToDataURL(image.fileData);
          if (imageUrl) {
            images.push({
              url: imageUrl,
              title: project.title,
              type: 'project',
              id: project.id,
            });
          }
        }
      });
    }
  });
  
  return images;
};

/**
 * Combine and shuffle images from events and projects
 * @param {Array} events - Array of event objects
 * @param {Array} projects - Array of project objects
 * @param {number} limit - Maximum number of images to return
 * @returns {Array} - Combined and shuffled array of images
 */
export const combineHighlightImages = (events, projects, limit = 12) => {
  const eventImages = processEventImages(events);
  const projectImages = processProjectImages(projects);
  
  const allImages = [...eventImages, ...projectImages];
  
  // Shuffle array
  const shuffled = allImages.sort(() => Math.random() - 0.5);
  
  return limit ? shuffled.slice(0, limit) : shuffled;
};
