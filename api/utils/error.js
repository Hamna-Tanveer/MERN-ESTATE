export const errorHandler = (statusCode, message) => {
  const error = new Error(message); // JS error constructor
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
