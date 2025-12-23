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

// Generate a temporary SAS URL for viewing a credential (admin only)
app.http('viewCredential', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'admin/credential/{blobName}',
    handler: async (request, context) => {
        context.log('Processing credential view request');

        try {
            // 1. Verify user is authenticated
            const clientPrincipal = getClientPrincipal(request);
            if (!clientPrincipal) {
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

            // 3. Parse blob name from URL
            const blobName = request.params.blobName;
            if (!blobName) {
                return {
                    status: 400,
                    jsonBody: { error: 'No blob name provided' }
                };
            }

            // 4. Parse connection string to get account name and key
            const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
            const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);

            if (!accountNameMatch || !accountKeyMatch) {
                context.log.error('Invalid connection string format');
                return {
                    status: 500,
                    jsonBody: { error: 'Storage configuration error' }
                };
            }

            const accountName = accountNameMatch[1];
            const accountKey = accountKeyMatch[1];

            // 5. Create shared key credential and generate SAS token
            const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

            // SAS token expires in 10 minutes (short-lived for security)
            const expiresOn = new Date();
            expiresOn.setMinutes(expiresOn.getMinutes() + 10);

            const sasToken = generateBlobSASQueryParameters({
                containerName: 'credentials',
                blobName: blobName,
                permissions: BlobSASPermissions.parse('r'), // Read only
                expiresOn: expiresOn,
            }, sharedKeyCredential).toString();

            // 6. Build the full URL
            const blobUrl = `https://${accountName}.blob.core.windows.net/credentials/${blobName}?${sasToken}`;

            context.log(`Generated SAS URL for credential: ${blobName}`);

            return {
                status: 200,
                jsonBody: {
                    url: blobUrl,
                    expiresAt: expiresOn.toISOString()
                }
            };

        } catch (error) {
            context.log.error('Error generating credential URL:', error);
            return {
                status: 500,
                jsonBody: {
                    error: 'Failed to generate credential URL',
                    message: error.message
                }
            };
        }
    }
});
