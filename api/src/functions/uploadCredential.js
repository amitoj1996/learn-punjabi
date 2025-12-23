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

// Allowed file types for credentials
const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
];

// Upload credential document to Azure Blob Storage
app.http('uploadCredential', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'upload/credential',
    handler: async (request, context) => {
        context.log('Processing credential upload request');

        try {
            // 1. Verify user is authenticated
            const clientPrincipal = getClientPrincipal(request);
            if (!clientPrincipal) {
                return {
                    status: 401,
                    jsonBody: { error: 'Please log in to upload credentials' }
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

            // 3. Get file and document type from form data
            const formData = await request.formData();
            const file = formData.get('file');
            const docType = formData.get('docType') || 'certificate';

            if (!file) {
                return {
                    status: 400,
                    jsonBody: { error: 'No file provided' }
                };
            }

            // 4. Validate file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                return {
                    status: 400,
                    jsonBody: { error: 'Invalid file type. Please upload PDF, JPG, PNG, or WebP' }
                };
            }

            // 5. Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return {
                    status: 400,
                    jsonBody: { error: 'File too large. Maximum size is 5MB' }
                };
            }

            // 6. Upload to Azure Blob Storage (credentials container - private)
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient('credentials');

            // Ensure container exists (private access for admin-only viewing)
            await containerClient.createIfNotExists({
                access: undefined // Private access - no public access
            });

            // Generate unique blob name
            const extension = file.type === 'application/pdf' ? 'pdf' :
                file.type === 'image/png' ? 'png' : 'jpg';
            const blobName = `teacher-${clientPrincipal.userId}-${docType}-${Date.now()}.${extension}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Upload the file
            const buffer = Buffer.from(await file.arrayBuffer());
            await blockBlobClient.upload(buffer, buffer.length, {
                blobHTTPHeaders: {
                    blobContentType: file.type
                }
            });

            context.log(`Credential uploaded successfully: ${blobName}`);

            // 7. Return the blob info (URL requires SAS token for private container)
            return {
                status: 200,
                jsonBody: {
                    blobName: blobName,
                    docType: docType,
                    fileName: file.name,
                    message: 'Credential uploaded successfully'
                }
            };

        } catch (error) {
            context.log.error('Error uploading credential:', error);
            return {
                status: 500,
                jsonBody: {
                    error: 'Failed to upload credential',
                    message: error.message
                }
            };
        }
    }
});
