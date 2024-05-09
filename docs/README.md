
# @yemreak/aws-s3

## Features
- **Upload Files:** Upload files directly to AWS S3.
- **Buffer Uploads:** Supports uploading from memory buffers.
- **MIME Type Detection:** Automatically determines the MIME type of files.
- **Access Control:** Configure files as public or private.
- **URL Construction:** Generates accessible URLs for stored files.

## Installation
```bash
npm install @yemreak/aws-s3
```

## Usage
### Initialize Client
```javascript
import { S3Client } from "@yemreak/aws-s3";

const s3Client = new S3Client({
  bucketName: "your-bucket-name",
  region: "your-region",
  credentials: {
    accessKeyId: "your-access-key-id",
    secretAccessKey: "your-secret-access-key"
  }
});
```

### Upload a File
```javascript
const filepath = "/path/to/your/file.txt";
s3Client.uploadFile({ filepath, isPublic: true });
```

### Upload a Buffer
```javascript
const buffer = Buffer.from("your file content");
const filename = "file.txt";
s3Client.uploadBuffer({ buffer, filename, isPublic: false });
```

### Construct a URL
```javascript
const url = s3Client.constructUrl("file.txt");
console.log(url);
```

## Contributing
Contributions are welcome. Please open an issue or submit a pull request with your changes.

## License
Licensed under the Apache License.
