import { PutObjectCommand, S3Client as _S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import mime from "mime-types"

export type S3ClientConfig = {
	bucketName: string
	region: string
	credentials: { accessKeyId: string; secretAccessKey: string }
}
export class S3Client {
	private readonly client: _S3Client

	constructor(readonly config: S3ClientConfig) {
		this.client = new _S3Client({ ...config })
	}

	async uploadBuffer(params: {
		buffer: Buffer
		isPublic: boolean
		filename: string
	}) {
		const { buffer, isPublic, filename } = params
		const mimeType = mime.lookup(filename) || "application/octet-stream"
		const key = `${Date.now()}_${filename}`
		const command = new PutObjectCommand({
			Bucket: this.config.bucketName,
			Key: key,
			Body: buffer,
			ContentType: mimeType,
			ACL: isPublic ? "public-read" : "private",
		})

		const response = await this.client.send(command)
		if (!response.$metadata.httpStatusCode) {
			throw new Error("Failed to upload file to S3.")
		}

		return this.constructUrl(key)
	}

	async uploadFile(params: { filepath: string; isPublic: boolean }) {
		const { filepath, isPublic } = params
		const buffer = fs.readFileSync(filepath)
		const filename = filepath.split("/").pop()!
		return this.uploadBuffer({ buffer, isPublic, filename })
	}

	/**
	 * Constructs a URL for the given filename, ensuring proper encoding.
	 * @param {string} filename - The filename to encode in the URL.
	 * @returns {string} - The fully constructed and encoded URL.
	 */
	constructUrl(filename: string): string {
		const encodedFilename = encodeURIComponent(filename)
		return `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${encodedFilename}`
	}
}
