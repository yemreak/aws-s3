import {
	PutObjectCommand,
	S3Client as _S3Client,
	type S3ClientConfig,
} from "@aws-sdk/client-s3"
import fs from "fs"
import mime from "mime-types"
export { type S3ClientConfig }

export class S3Client {
	private readonly client: _S3Client
	readonly bucketName: string
	readonly region: string

	constructor(init: {
		bucketName: string
		region: string
		credentials: S3ClientConfig["credentials"]
	}) {
		this.bucketName = init.bucketName
		this.region = init.region

		this.client = new _S3Client({ ...init })
	}

	async put(params: { filepath: string; isPublic: boolean }) {
		const { filepath, isPublic = false } = params

		const file = fs.readFileSync(filepath)
		const filename = filepath.split("/").pop()!
		const mimeType = mime.lookup(filepath) || "application/octet-stream"
		const key = `${Date.now()}_${filename}`
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			Body: file,
			ContentType: mimeType,
			ACL: isPublic ? "public-read" : "private",
		})

		const response = await this.client.send(command)
		if (!response.$metadata.httpStatusCode) {
			throw new Error("Failed to upload file to S3.")
		}

		return this.constructUrl(key)
	}

	constructUrl(filename: string): string {
		return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${filename}`
	}
}
