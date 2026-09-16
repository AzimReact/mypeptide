import "server-only";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Local filesystem storage is used only for the MVP/demo. Production
// deployment should use persistent object storage (e.g. S3-compatible).

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const DOCUMENT_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024; // 15MB

export class UploadError extends Error {}

export async function saveProductImage(file: File): Promise<string> {
  return saveFile(file, "products", IMAGE_TYPES, MAX_IMAGE_BYTES);
}

export async function saveProductDocument(file: File): Promise<string> {
  return saveFile(file, "documents", DOCUMENT_TYPES, MAX_DOCUMENT_BYTES);
}

async function saveFile(
  file: File,
  kind: "products" | "documents",
  allowedTypes: Record<string, string>,
  maxBytes: number
): Promise<string> {
  if (file.size === 0) {
    throw new UploadError("File is empty");
  }
  if (file.size > maxBytes) {
    throw new UploadError(
      `File exceeds maximum size of ${Math.round(maxBytes / (1024 * 1024))}MB`
    );
  }

  const extension = allowedTypes[file.type];
  if (!extension) {
    throw new UploadError(`Unsupported file type: ${file.type || "unknown"}`);
  }

  const filename = `${randomUUID()}.${extension}`;
  const destination = path.join(UPLOAD_ROOT, kind, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, buffer);

  return `/uploads/${kind}/${filename}`;
}

export async function deleteUploadedFile(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", publicUrl);
  try {
    await unlink(filePath);
  } catch {
    // Ignore missing files — nothing more to clean up.
  }
}
