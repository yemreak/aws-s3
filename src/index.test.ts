import { readFileSync } from "fs"
import yaml from "js-yaml"
import { S3Client } from "./index.js"

describe("S3Client", () => {
	let s3Client: S3Client
	const content = readFileSync("credentials.yml", "utf8")
	const init = yaml.load(content) as {
		bucketName: string
		region: string
		credentials: { accessKeyId: string; secretAccessKey: string }
	}

	beforeEach(() => {
		s3Client = new S3Client(init)
	})

	describe("put", () => {
		it("should upload a file to S3", async () => {
			const response = await s3Client.uploadFile({
				filepath: "tsconfig.json",
				isPublic: true,
			})

			expect(response).toContain(init.bucketName)
			expect(response).toContain(init.region)
		})
	})

	describe("constructUrl", () => {
		it("should construct a valid S3 URL", () => {
			const url = s3Client.constructUrl("testFile")

			expect(url).toBe(
				`https://${init.bucketName}.s3.${init.region}.amazonaws.com/testFile`
			)
		})
	})
})
