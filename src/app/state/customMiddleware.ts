export const customMiddleware = () => (next: any) => (action: any) => {
  return next(action);
};
