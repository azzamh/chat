/**
 * Formats API error responses into a readable bulleted list
 * @param errorObj - The error object returned from the API
 * @returns A formatted string with bullet points for each error message
 */
export const formatErrorMessages = (errorObj: any): string => {
  if (!errorObj) return "Operation failed";

  // Handle single error object with message property
  if (errorObj.message) {
    return "• " + errorObj.message;
  }

  // If errors is an array
  if (Array.isArray(errorObj)) {
    const messages = errorObj.map((err) => {
      // If array element is an object with a message property
      if (typeof err === "object" && err !== null) {
        if (err.message) {
          return err.message;
        }
        // Try to extract useful information
        return Object.entries(err)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      }
      return String(err);
    });

    return "• " + messages.join("\n• ");
  }

  // If errors is an object with field-specific errors
  if (typeof errorObj === "object") {
    const messages: string[] = [];

    for (const [field, fieldErrors] of Object.entries(errorObj)) {
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((err) => {
          if (typeof err === "object" && err !== null && err.message) {
            messages.push(`${field}: ${err.message}`);
          } else {
            messages.push(`${field}: ${String(err)}`);
          }
        });
      } else if (typeof fieldErrors === "string") {
        messages.push(`${field}: ${fieldErrors}`);
      } else if (fieldErrors && typeof fieldErrors === "object") {
        if ("message" in fieldErrors) {
          messages.push(`${field}: ${fieldErrors.message}`);
        } else {
          // Try to extract meaningful data from object
          const objStr = Object.entries(fieldErrors)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
          messages.push(`${field}: ${objStr}`);
        }
      }
    }

    if (messages.length > 0) {
      return "• " + messages.join("\n• ");
    }
  }

  return "Operation failed";
};
