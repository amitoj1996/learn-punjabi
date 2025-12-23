const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');

// Helper to get client principal from Azure Static Web Apps
function getClientPrincipal(request) {
    const header = request.headers.get('x-ms-client-principal');
    if (!header) return null;

    try {
        const encoded = Buffer.from(header, 'base64');
        return JSON.parse(encoded.toString('ascii'));
    } catch {
        return null;
    }
}

// Upload photo to Azure Blob Storage
app.http('uploadPhoto', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'upload/photo',
    handler: async (request, context) => {
        context.log('Processing photo upload request');

        try {
            // 1. Verify user is authenticated
            const clientPrincipal = getClientPrincipal(request);
            if (!clientPrincipal) {
                return {
                    status: 401,
                    jsonBody: { error: 'Please log in to upload a photo' }
                };
            }

            // 2. Check for connection string
            const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
            if (!connectionString) {
                context.log.error('AZURE_STORAGE_CONNECTION_STRING not configured');
                return {
                    status: 500,
                    jsonBody: { error: 'Storage not configured' }
                };
            }

            // 3. Get file from form data
            const formData = await request.formData();
            const file = formData.get('photo');

            if (!file) {
                return {
                    status: 400,
                    jsonBody: { error: 'No photo file provided' }
                };
            }

            // 4. Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return {
                    status: 400,
                    jsonBody: { error: 'Invalid file type. Please upload JPG, PNG, or WebP' }
                };
            }

            // 5. Validate file size (max 5MB - though client compresses to ~300KB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return {
                    status: 400,
                    jsonBody: { error: 'File too large. Maximum size is 5MB' }
                };
            }

            // 6. Upload to Azure Blob Storage
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient('photos');

            // Ensure container exists (create if not)
            await containerClient.createIfNotExists({
                access: 'blob' // Public read access for blobs
            });

            // Generate unique blob name using userId and timestamp
            const extension = file.type === 'image/png' ? 'png' : 'jpg';
            const blobName = `teacher-${clientPrincipal.userId}-${Date.now()}.${extension}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Upload the file
            const buffer = Buffer.from(await file.arrayBuffer());
            await blockBlobClient.upload(buffer, buffer.length, {
                blobHTTPHeaders: {
                    blobContentType: file.type,
                    blobCacheControl: 'public, max-age=31536000' // Cache for 1 year
                }
            });

            context.log(`Photo uploaded successfully: ${blobName}`);

            // 7. Return the public URL
            return {
                status: 200,
                jsonBody: {
                    url: blockBlobClient.url,
                    blobName: blobName,
                    message: 'Photo uploaded successfully'
                }
            };

        } catch (error) {
            context.log.error('Error uploading photo:', error);
            return {
                status: 500,
                jsonBody: {
                    error: 'Failed to upload photo',
                    message: error.message
                }
            };
        }
    }
});
