import {
  describe,
  test,
  expect,
  jest,
  beforeAll,
  afterAll,
} from '@jest/globals';
import fs from 'fs';
import { tmpdir } from 'os';
import { logger } from '../../src/logger';
import Routes from '../../src/routes';
import { TestUtils } from '../_util/testUtil';
import FormData from 'form-data';
import { join } from 'path';

describe('#Routes integration test', () => {
  let defaultDownloadsFolder = '';

  beforeAll(async () => {
    defaultDownloadsFolder = await fs.promises.mkdtemp(
      join(tmpdir(), 'downloads-'),
    );
  });

  afterAll(async () => {
    await fs.promises.rm(defaultDownloadsFolder, { recursive: true });
  });

  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation();
  });

  describe('#getFileStatus', () => {
    const ioObj = {
      to: (id) => ioObj,
      emit: (event, message) => {},
    };

    test('should upload file to the folder', async () => {
      const filename = 'demo.gif';
      const fileStream = fs.createReadStream(
        `./test/integration/mocks/${filename}`,
      );

      const response = TestUtils.generationWritableStream(() => {});

      const form = new FormData();
      form.append('photo', fileStream);

      const defaultParams = {
        request: Object.assign(form, {
          headers: form.getHeaders(),
          method: 'POST',
          url: '?socketId=10',
        }),

        response: Object.assign(response, {
          setHeader: jest.fn(),
          writeHead: jest.fn(),
          end: jest.fn(),
        }),
        values: () => Object.values(defaultParams),
      };

      const routes = new Routes(defaultDownloadsFolder);
      routes.setSocketInstance(ioObj);

      const dirBefore = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dirBefore).toEqual([]);

      await routes.handler(...defaultParams.values());

      const dirAfter = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dirAfter).toEqual([filename]);

      expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200);

      const expectedResult = JSON.stringify({
        result: 'Files uploaded with success!',
      });
      expect(defaultParams.response.end).toHaveBeenCalledWith(expectedResult);
    });
  });
});
