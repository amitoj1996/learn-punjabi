const { app } = require('@azure/functions');
const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob');

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

// Generate a temporary SAS URL for viewing a credential
app.http('viewCredential', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'viewCredential',  // Simplified route - will be /api/viewCredential
    handler: async (request, context) => {
        context.log('viewCredential function triggered');

        try {
            // 1. Verify user is authenticated
            const clientPrincipal = getClientPrincipal(request);
            if (!clientPrincipal) {
                context.log('No client principal found');
                return {
                    status: 401,
                    jsonBody: { error: 'Please log in' }
                };
            }

            // 2. Get connection string
            const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
            if (!connectionString) {
                context.log.error('AZURE_STORAGE_CONNECTION_STRING not configured');
                return {
                    status: 500,
                    jsonBody: { error: 'Storage not configured' }
                };
            }

            // 3. Parse blob name from query parameter
            const url = new URL(request.url);
            const blobName = url.searchParams.get('blob');

            if (!blobName) {
                return {
                    status: 400,
                    jsonBody: { error: 'No blob name provided' }
                };
            }

            context.log(`Requested blob: ${blobName}`);

            // 4. Parse connection string
            const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
            const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);

            if (!accountNameMatch || !accountKeyMatch) {
                return {
                    status: 500,
                    jsonBody: { error: 'Storage configuration error' }
                };
            }

            const accountName = accountNameMatch[1];
            const accountKey = accountKeyMatch[1];

            // 5. Verify blob exists
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient('credentials');
            const blobClient = containerClient.getBlobClient(blobName);

            const exists = await blobClient.exists();
            if (!exists) {
                context.log.error(`Blob not found: ${blobName}`);
                return {
                    status: 404,
                    jsonBody: { error: 'Credential file not found in storage' }
                };
            }

            // 6. Generate SAS token
            const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
            const expiresOn = new Date();
            expiresOn.setMinutes(expiresOn.getMinutes() + 10);

            const sasToken = generateBlobSASQueryParameters({
                containerName: 'credentials',
                blobName: blobName,
                permissions: BlobSASPermissions.parse('r'),
                expiresOn: expiresOn,
            }, sharedKeyCredential).toString();

            const blobUrl = `https://${accountName}.blob.core.windows.net/credentials/${blobName}?${sasToken}`;

            context.log('SAS URL generated successfully');

            return {
                status: 200,
                jsonBody: {
                    url: blobUrl,
                    expiresAt: expiresOn.toISOString()
                }
            };

        } catch (error) {
            context.log.error('Error:', error.message);
            return {
                status: 500,
                jsonBody: {
                    error: 'Server error',
                    message: error.message
                }
            };
        }
    }
});
