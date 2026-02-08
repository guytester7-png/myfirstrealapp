import { initializePaddle, Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | undefined;

export async function getPaddleInstance() {
  if (paddleInstance) return paddleInstance;

  paddleInstance = await initializePaddle({
    environment: "sandbox", // Switch to 'production' for live
    token: "test_ed3f692579689da6fc026dbd6e2",
  });

  return paddleInstance;
}
