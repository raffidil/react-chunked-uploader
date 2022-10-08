import axios, { AxiosRequestHeaders } from 'axios';
import { useState } from 'react';

const useChunkedUploader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressData, setProgressData] = useState<Array<number>>([]);
  const [abortControllers, setAbortControllers] = useState<
    Array<AbortController>
  >([]);

  const createChunks = (file: File, chunkSize: number): Blob[] => {
    let startPointer = 0;
    let endPointer = file.size;
    let chunks: any[] = [];
    while (startPointer < endPointer) {
      let newStartPointer = startPointer + chunkSize;
      chunks.push(file.slice(startPointer, newStartPointer));
      startPointer = newStartPointer;
    }
    return chunks;
  };

  const uploadWithAxios = ({
    url,
    file,
    data,
    onUploadProgress,
    signal,
    options,
  }: {
    url: string;
    file: Blob;
    data?: FormData;
    onUploadProgress?: (value: number) => void;
    signal: AbortSignal | undefined;
    options?: {
      method?: 'get' | 'post' | 'delete';
      params?: URLSearchParams;
      headers?: AxiosRequestHeaders;
    };
  }) => {
    const formData = data ?? new FormData();
    formData.append('file', file);

    return axios({
      method: options?.method || 'post',
      url: `${url}${options?.params ? '?' : ''}${new URLSearchParams(
        options?.params
      )}`,
      data: formData,
      headers: options?.headers,
      signal,
      onUploadProgress: (progressEvent: any) => {
        onUploadProgress?.(
          Math.round((100 * progressEvent?.loaded) / progressEvent?.total)
        );
      },
    });
  };

  const uploadChunk = ({
    chunk,
    chunkIndex,
    url,
    chunksCount,
    chunkSize,
    fileSize,
    data,
    uniqueId,
    onUploadProgress,
  }: {
    chunk: Blob;
    chunkIndex: number;
    url: string;
    chunksCount: number;
    chunkSize: number;
    fileSize: number;
    data?: FormData;
    uniqueId: string;
    onUploadProgress?: (value: number) => void;
  }) => {
    const isLast = chunkIndex + 1 === chunksCount;
    const start = chunkIndex * chunkSize;
    const end = isLast ? fileSize : start + chunk.size;
    const controller = new AbortController();

    setAbortControllers((value) => value.concat(controller));

    const contentRange =
      'bytes ' + start + '-' + (end - 1) + '/' + (isLast ? end : -1);

    return uploadWithAxios({
      url,
      file: chunk,
      data,
      signal: controller.signal,
      onUploadProgress: (progress) => {
        setProgressData((value) => {
          const newValue = [...value];
          newValue[chunkIndex] = progress;
          return newValue;
        });
        onUploadProgress?.(progress);
      },
      options: {
        headers: {
          'Content-Range': contentRange,
          'X-Unique-Upload-Id': uniqueId,
        } as any,
      },
    });
  };

  const uploadFile = async ({
    file,
    url,
    data,
    chunkSize = 6 * 1024 * 1024,
  }: {
    file: File;
    url: string;
    data?: FormData;
    chunkSize?: number;
  }) => {
    const fileSize = file.size;
    const uniqueId = (Math.random() * 10000000000).toString(16);
    const fileChunks = createChunks(file, chunkSize);

    setProgressData([]);
    setAbortControllers([]);

    const promises = fileChunks.map((chunk, chunkIndex) =>
      uploadChunk({
        chunk,
        chunkIndex,
        url,
        chunksCount: fileChunks.length,
        chunkSize: chunkSize,
        fileSize,
        data,
        uniqueId,
      })
    );

    try {
      setIsLoading(true);
      const result = await Promise.all(promises);
      setIsLoading(false);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelUpload = () => {
    abortControllers.forEach((item) => item.abort());
  };

  const progress = progressData?.length
    ? Math.round(
        progressData?.reduce((item1, item2) => item1 + item2) /
          (progressData.length || 1)
      )
    : 0;

  return { uploadFile, isLoading, cancelUpload, progress };
};

export default useChunkedUploader;
