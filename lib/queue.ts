import { log } from './logger';

type QueueTask<T> = () => Promise<T>;

type Pending<T> = {
  run: QueueTask<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

export class BackgroundQueue {
  private concurrency: number;
  private active = 0;
  private waiting: Pending<unknown>[] = [];

  constructor(concurrency: number) {
    this.concurrency = Math.max(1, concurrency);
  }

  async enqueue<T>(task: QueueTask<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const pending: Pending<T> = {
        run: task,
        resolve,
        reject,
      };

      this.waiting.push(pending as Pending<unknown>);
      this.processNext();
    });
  }

  private processNext() {
    if (this.active >= this.concurrency) {
      return;
    }

    const next = this.waiting.shift();
    if (!next) {
      return;
    }

    this.active += 1;
    void next
      .run()
      .then((result) => next.resolve(result))
      .catch((err) => next.reject(err))
      .finally(() => {
        this.active -= 1;
        this.processNext();
      });

    log('QUEUE', 'Processing queued extraction task', {
      active: this.active,
      pending: this.waiting.length,
    });
  }
}

export const storyExtractionQueue = new BackgroundQueue(Number(process.env.STORY_QUEUE_CONCURRENCY || '2'));
