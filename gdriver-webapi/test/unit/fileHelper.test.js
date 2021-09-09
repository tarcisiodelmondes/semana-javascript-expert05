import { describe, test, expect, jest } from '@jest/globals';
import fs from 'fs';
import { FileHelper } from '../../src/fileHelper';

describe('#FileHelper', () => {
  describe('#getFileStatus', () => {
    test('it should return files statuses in correct format', async () => {
      const statMock = {
        dev: 45831,
        mode: 33188,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 1727440,
        size: 99835,
        blocks: 200,
        atimeMs: 1631153398678.029,
        mtimeMs: 1631153398688.0305,
        ctimeMs: 1631153398698.0322,
        birthtimeMs: 1631153398678.029,
        atime: '2021-09-09T02:09:58.678Z',
        mtime: '2021-09-09T02:09:58.688Z',
        ctime: '2021-09-09T02:09:58.698Z',
        birthtime: '2021-09-09T02:09:58.678Z',
      };

      const mockUser = 'pi';
      process.env.USER = mockUser;

      const filename = 'file.png';

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename]);
      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFilesStatus('/tmp');

      const expectResult = [
        {
          size: '99.8 kB',
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
      expect(result).toMatchObject(expectResult);
    });
  });
});
