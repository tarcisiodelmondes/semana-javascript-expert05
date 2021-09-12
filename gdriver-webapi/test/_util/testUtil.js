import { jest } from '@jest/globals';
import { Readable, Transform, Writable } from 'stream';

export class TestUtils {
  static mockDateNow(mockImplementationPeriods) {
    const now = jest.spyOn(global.Date, global.Date.now.name);

    mockImplementationPeriods.forEach((time) => {
      now.mockReturnValueOnce(time);
    });
  }

  static getTimeFromDate(dateString) {
    return new Date(dateString).getTime();
  }

  static generationReadableStream(data) {
    return new Readable({
      objectMode: true,

      read() {
        for (const items of data) {
          this.push(items);
        }

        this.push(null);
      },
    });
  }

  static generationWritableStream(onData) {
    return new Writable({
      objectMode: true,

      write(chunk, encoding, cb) {
        onData(chunk);
        cb(null, chunk);
      },
    });
  }

  static generationTransformStream(onData) {
    return new Transform({
      objectMode: true,

      transform(chunk, encoding, cb) {
        onData(chunk);
        cb(null, chunk);
      },
    });
  }
}
