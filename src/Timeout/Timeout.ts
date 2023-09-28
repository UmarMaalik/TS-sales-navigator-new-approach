export async function randomTimeout(
    minSeconds: number,
    maxSeconds: number
  ): Promise<void> {
    const randomDelaySeconds: number = Math.floor(
      Math.random() * (maxSeconds - minSeconds + 1) + minSeconds
    );
    const randomDelayMilliseconds: number = randomDelaySeconds * 1000;
    await new Promise((resolve) => setTimeout(resolve, randomDelayMilliseconds));
  }