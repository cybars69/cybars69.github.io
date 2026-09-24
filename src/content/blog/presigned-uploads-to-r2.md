---
title: "Direct-to-R2 uploads with presigned PUTs: presign, PUT, confirm"
description: "Files go from the browser straight to object storage. The server issues a URL, then trusts nothing until the client confirms."
date: 2026-09-24
tags: [Cloudflare R2, S3, Uploads, Cloudflare Workers]
---

A work-order system needs to attach large design files to jobs: PDFs, images, `.ai`, `.cdr`, `.eps`, `.svg`, videos. Proxying those through a Worker means paying CPU and memory for bytes that the application doesn't care about. The pattern I used instead has been standard on S3 for years and works unchanged on R2, because R2 speaks the S3 API.

## Three steps

```text
1. Presign    POST /api/orders/:id/files/presign  { filename, contentType, target }
              -> { uploadUrl, fileId, key }         (URL expires in 15 minutes)

2. PUT        browser  PUT  uploadUrl  <file bytes>
              (no auth header: the credentials are inside the signed URL)

3. Confirm    POST /api/orders/:id/files/confirm  { fileId, key, filename, contentType, target }
              -> the saved file record
```

The server never sees the file. It authorises the request, signs a short-lived URL for one key, and later records what was stored.

## Why the confirm step exists

The presign call only *permits* an upload, and the browser could abort halfway, or never send the bytes at all. The database therefore records nothing at presign time. Only the **confirm** call writes the row (into an attachments or design-files table, depending on `target`), so the database describes files the client says it finished uploading.

My reading, not stated in the docs: this leaves a small class of orphans, objects that were uploaded but never confirmed. That is an acceptable trade for keeping the database honest, provided a lifecycle rule on the bucket eventually removes unreferenced objects.

## Permission checks belong to the presign

Permissions are enforced in the service layer: the order must exist, and the user must hold the relevant permission. The check is module-based (does this role's permission set include the module?) rather than comparing role strings, which is the reason a role rename doesn't silently break upload access.

## CORS is the part everyone forgets

A browser PUT to a different origin is a cross-origin request with a preflight, so the bucket must allow `PUT` from the frontend's origin. Doing that by hand in a dashboard means every new environment breaks until someone remembers. So the server ensures the rule at startup, using the Cloudflare API:

```text
PUT /accounts/:accountId/r2/buckets/:bucketName/cors    (allow PUT for the configured origins)
```

It logs that the rule was applied, or skips with a note if the credentials aren't configured, which means local development still boots. Making environment setup part of application startup, and idempotent, removes an entire category of "works on my machine".

## The storage seam

Storage sits behind a tiny `ObjectStorage` interface with a `presignPutUrl` method. The S3-compatible R2 implementation is one class, so the controller and service code never mention a vendor.

## Gotchas worth writing down

- **Load env before anything else.** A missing `import 'dotenv/config'` at the very top of the entry file means every storage variable is undefined in development, and the error shows up far away from the cause.
- **Signed-URL credentials are the auth.** The PUT needs no header, so anyone holding the URL can upload to that one key until it expires. Keep the lifetime short (15 minutes here) and scope it to a single object key.
- **Accept lists are UX, not security.** The file input accepts a list of extensions, but that only filters the file picker. My advice for a setup like this: also bind the content type and size into what you sign, and treat every upload as untrusted when it is downloaded.

## Takeaways

- Sign, don't proxy.
- Only record what the client confirms.
- Configure CORS from code.
- Hide the vendor behind a two-method interface.
