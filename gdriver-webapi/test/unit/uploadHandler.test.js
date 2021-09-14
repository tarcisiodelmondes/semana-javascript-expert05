import fs from 'fs';

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { UploadHandler } from '../../src/uploadHandler';
import { TestUtils } from '../_util/testUtil';
import { resolve } from 'path';
import { pipeline } from 'stream/promises';
import { logger } from '../../src/logger';

describe('#UploadHandler test suit', () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => {},
  };

  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation();
  });

  describe('#registerEvents', () => {
    test('should call onFile and onFinish functions on Busboy instance', () => {
      const uploadHandle = new UploadHandler({ io: ioObj, socketId: '01' });

      jest.spyOn(uploadHandle, uploadHandle.onFile.name).mockResolvedValue();

      const headers = {
        'content-type': 'multipart/form-data; boundary=',
      };

      const onFinish = jest.fn();

      const busBoyInstance = uploadHandle.registerEvents(headers, onFinish);

      const fileStream = TestUtils.generationReadableStream([
        'chunk',
        'of',
        'data',
      ]);

      busBoyInstance.emit('file', 'fieldname', fileStream, 'filename.text');
      busBoyInstance.listeners('finish')[0].call();

      expect(uploadHandle.onFile).toHaveBeenCalled();
      expect(onFinish).toHaveBeenCalled();
    });
  });

  describe('#onFile', () => {
    test('given a stream file it should save it on disk', async () => {
      const chunks = ['hey', 'dude'];
      const downloadsFolder = '/tmp';

      const handler = new UploadHandler({
        io: ioObj,
        socketId: '01',
        downloadsFolder,
      });

      const onData = jest.fn();
      jest
        .spyOn(fs, fs.createWriteStream.name)
        .mockImplementation(() => TestUtils.generationWritableStream(onData));

      const onTransform = jest.fn();
      jest
        .spyOn(handler, handler.handleFileBytes.name)
        .mockImplementation(() =>
          TestUtils.generationTransformStream(onTransform),
        );

      const params = {
        fieldname: 'video',
        file: TestUtils.generationReadableStream(chunks),
        filename: 'mock.mov',
      };

      await handler.onFile(...Object.values(params));

      expect(onData.mock.calls.join()).toEqual(chunks.join());
      expect(onTransform.mock.calls.join()).toEqual(chunks.join());

      const expectFilename = resolve(handler.downloadsFolder, params.filename);
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectFilename);
    });
  });

  describe('#handleFileBytes', () => {
    test('should call emit function and it is a transform stream', async () => {
      jest.spyOn(ioObj, ioObj.to.name);
      jest.spyOn(ioObj, ioObj.emit.name);

      const handler = new UploadHandler({
        io: ioObj,
        socketId: '01',
      });

      jest.spyOn(handler, handler.canExecute.name).mockReturnValueOnce(true);

      const messages = ['messages'];

      const source = TestUtils.generationReadableStream(messages);
      const onWriter = jest.fn();
      const target = TestUtils.generationWritableStream(onWriter);

      await pipeline(source, handler.handleFileBytes('filename.txt'), target);

      expect(ioObj.to).toHaveBeenCalledTimes(messages.length);
      expect(ioObj.emit).toHaveBeenCalledTimes(messages.length);
      expect(onWriter).toHaveBeenCalledTimes(messages.length);
      expect(onWriter.mock.calls.join()).toEqual(messages.join());
    });

    test('given messages timerDelay as 2secs it should emit only two  message during 2 seconds period', async () => {
      jest.spyOn(ioObj, ioObj.emit.name);

      const messageTimeDelay = 0;

      const day = '2021-08-05 05:00';

      const onFirstLastMessageSent = TestUtils.getTimeFromDate(`${day}:00`);

      const onFirstCanExecute = TestUtils.getTimeFromDate(`${day}:02`);
      const onSecondUpdateLastMessageSent = onFirstCanExecute;

      const onSecondsCanExecute = TestUtils.getTimeFromDate(`${day}:03`);
      const onThreeCanExecute = TestUtils.getTimeFromDate(`${day}:05`);

      TestUtils.mockDateNow([
        onFirstLastMessageSent,
        onFirstCanExecute,
        onSecondsCanExecute,
        onSecondUpdateLastMessageSent,
        onThreeCanExecute,
        onSecondUpdateLastMessageSent,
      ]);

      const messages = ['hello', 'world', 'javascript'];
      const filename = 'filename.txt';

      const source = TestUtils.generationReadableStream(messages);

      const handle = new UploadHandler({
        io: ioObj,
        socketId: '01',
        messageTimeDelay,
      });

      await pipeline(source, handle.handleFileBytes(filename));

      const expectMessageSent = 2;

      expect(ioObj.emit).toHaveBeenCalledTimes(expectMessageSent);

      const [firstCallResult, secondCallResult] = ioObj.emit.mock.calls;

      expect(firstCallResult).toEqual([
        handle.ON_UPLOAD_EVENT,
        { processedAlready: 'hello'.length, filename },
      ]);
      expect(secondCallResult).toEqual([
        handle.ON_UPLOAD_EVENT,
        { processedAlready: messages.join('').length, filename },
      ]);
    });
  });

  describe('#canExecute', () => {
    test('should return true when time is later than specified delay', () => {
      const timerDelay = 1000;
      const uploadHandle = new UploadHandler({
        io: ioObj,
        socketId: '',
        messageTimeDelay: timerDelay,
      });

      const now = TestUtils.getTimeFromDate('2021-08-04 00:00:03');
      TestUtils.mockDateNow([now]);

      const lastExecution = TestUtils.getTimeFromDate('2021-08-04 00:00:00');

      const result = uploadHandle.canExecute(lastExecution);
      expect(result).toBeTruthy();
    });

    test('should return false when is later than specified delay', () => {
      const timerDelay = 2000;
      const uploadHandle = new UploadHandler({
        io: ioObj,
        socketId: '',
        messageTimeDelay: timerDelay,
      });

      const now = TestUtils.getTimeFromDate('2021-08-04 00:00:01');
      TestUtils.mockDateNow([now]);

      const lastExecution = TestUtils.getTimeFromDate('2021-08-04 00:00');

      const result = uploadHandle.canExecute(lastExecution);
      expect(result).toBeFalsy();
    });
  });
});
