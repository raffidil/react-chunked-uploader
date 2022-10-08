[![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/react-chunked-uploader)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)

# React Chunked Uploader

> A react hook for uploading large files that need chunking (for example for [uploading to Cloudinary](https://support.cloudinary.com/hc/en-us/articles/208263735-Guidelines-for-self-implementing-chunked-upload-to-Cloudinary)). It uses `axios` and provides loading state and progress value.

<!-- ## Getting Started -->

<!-- These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system. -->

## Installation

```sh
yarn add react-chunked-uploader
```

or

```sh
npm i react-chunked-uploader
```

## Usage

Import the hook from the package:

```ts
import useChunkedUploader from 'react-chunked-uploader';
```

Into your React component:

```ts
const { uploadFile, cancelUpload, isLoading, progress } = useChunkedUploader();

const uploadImage = async (file: File, data: FormData) => {
  try {
    const result = await uploadFile({ file, url: 'YOUR_UPLOAD_URL', data });
    return result;
  } catch (error) {
    console.error(error);
  }
};
```

## API

### uploadFile

A function to upload a file with specific form data.

```js
uploadFile({ file, url, data, chunkSize });
```

#### Options:

| Name        | Type           | Required | Default value     |
| ----------- | -------------- | -------- | ----------------- |
| `file`      | File           | yes      | -                 |
| `url`       | string         | yes      | -                 |
| `data`      | FormData       | no       | -                 |
| `chunkSize` | number (Bytes) | no       | 6 \* 1024 \* 1024 |

#### Return type:

```ts
Promise<AxiosResponse[]>;
```

### isLoading

A boolean that indicates the loading status of the uploading data.

| Name        | Type    | Default value |
| ----------- | ------- | ------------- |
| `isLoading` | boolean | false         |

### progress

A number that indicates the progress value of the uploading process.

| Name       | Type   | Default value |
| ---------- | ------ | ------------- |
| `progress` | number | 0             |

### cancelUpload

A function to cancel upload operation.

| Name           | Type       |
| -------------- | ---------- |
| `cancelUpload` | () => void |

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

- **Raffi Dilanchian** - [raffidil](https://github.com/raffidil)

## License

[MIT License](./LICENSE) © Raffi Dilanchian
