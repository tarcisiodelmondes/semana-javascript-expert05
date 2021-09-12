import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { logger } from '../../src/logger';
import { UploadHandler } from '../../src/uploadHandler';
import { TestUtils } from '../_util/testUtil';
import Routes from './../../src/routes';

describe('#Routes test suite', () => {
  const request = TestUtils.generationReadableStream(['some file bytes']);
  const response = TestUtils.generationWritableStream(() => {});

  const defaultParams = {
    request: Object.assign(request, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: '',
      body: {},
      url: '?socketId=10',
    }),

    response: Object.assign(response, {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    }),
    values: () => Object.values(defaultParams),
  };

  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation();
  });

  describe('#setSocketInstance', () => {
    test('setSocket should store io instance ', () => {
      const routes = new Routes();
      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {},
      };

      routes.setSocketInstance(ioObj);
      expect(routes.io).toStrictEqual(ioObj);
    });
  });

  describe('#handle', () => {
    test('given an inexistent route it should choose default route', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = 'inexistent';

      await routes.handler(...params.values());
      expect(params.response.end).toHaveBeenCalledWith('hello world');
    });

    test('it should set any request with CORS enabled', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = 'inexistent';

      await routes.handler(...params.values());
      expect(params.response.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        '*',
      );
    });

    test('given method OPTIONS it should choose options route', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = 'OPTIONS';

      await routes.handler(...params.values());
      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });
    test('given method POST it should choose post route', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = 'POST';

      jest.spyOn(routes, routes.post.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.post).toHaveBeenCalled();
    });
    test('given method GET it should choose get route', async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = 'GET';

      jest.spyOn(routes, routes.get.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe('#get', () => {
    test('given method GET is should list all files downloads', async () => {
      const routes = new Routes();

      const params = {
        ...defaultParams,
      };

      const filesStatusesMock = [
        {
          size: '99.8 kB',
          lastModified: '2021-09-09T02:09:58.678Z',
          owner: 'pi',
          file: 'file.png',
        },
      ];

      jest
        .spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name)
        .mockResolvedValue(filesStatusesMock);

      params.request.method = 'GET';

      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(
        JSON.stringify(filesStatusesMock),
      );
    });
  });

  describe('#post', () => {
    test('it should validate post route workflow', async () => {
      const routes = new Routes('/tmp');
      const options = {
        ...defaultParams,
      };

      options.request.method = 'POST';
      options.request.url = '?socketId=30';

      jest
        .spyOn(
          UploadHandler.prototype,
          UploadHandler.prototype.registerEvents.name,
        )
        .mockImplementation((headers, onFinish) => {
          const writable = TestUtils.generationWritableStream(() => {});
          writable.on('finish', onFinish);

          return writable;
        });

      await routes.handler(...options.values());

      expect(UploadHandler.prototype.registerEvents).toHaveBeenCalled();
      expect(options.response.writeHead).toHaveBeenLastCalledWith(200);

      const expectedResult = JSON.stringify({
        result: 'Files uploaded with success!',
      });
      expect(options.response.end).toHaveBeenCalledWith(expectedResult);
    });
  });
});
