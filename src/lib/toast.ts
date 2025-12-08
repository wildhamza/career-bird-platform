// Simple toast utility for error messages
// This is a basic implementation that can be extended later

let toastCallback: ((message: string) => void) | null = null;

export const toast = {
  error: (message: string) => {
    if (toastCallback) {
      toastCallback(message);
    } else {
      // Fallback to alert if toast system not initialized
      alert(message);
    }
  },
  success: (message: string) => {
    // Can be implemented later if needed
    console.log("Success:", message);
  },
};

export const setToastCallback = (callback: (message: string) => void) => {
  toastCallback = callback;
};

