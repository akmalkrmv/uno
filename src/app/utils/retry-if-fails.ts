export function retryWithDelay(action: Function, delay: number, retry: number) {
  return withRetry(withDelay(action, delay), retry);
}

export function withDelay(action: Function, delay: number) {
  return () => setTimeout(action, delay);
}

export function withRetry(action: Function, retry: number) {
  return () => {
    try {
      action();
    } catch (error) {
      console.log(error);
      if (retry > 0) {
        withRetry(action, --retry)();
      }
    }
  };
}