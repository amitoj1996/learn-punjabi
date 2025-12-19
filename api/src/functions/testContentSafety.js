const { app } = require('@azure/functions');

// Test endpoint to check Content Safety configuration
app.http('testContentSafety', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'test/content-safety',
    handler: async (request, context) => {
        const CONTENT_SAFETY_ENDPOINT = process.env.CONTENT_SAFETY_ENDPOINT;
        const CONTENT_SAFETY_KEY = process.env.CONTENT_SAFETY_KEY;

        const result = {
            timestamp: new Date().toISOString(),
            endpointConfigured: !!CONTENT_SAFETY_ENDPOINT,
            keyConfigured: !!CONTENT_SAFETY_KEY,
            endpoint: CONTENT_SAFETY_ENDPOINT ? `${CONTENT_SAFETY_ENDPOINT.substring(0, 30)}...` : 'NOT SET',
            testResult: null,
            error: null
        };

        // If POST, test with provided text
        if (request.method === 'POST' && CONTENT_SAFETY_ENDPOINT && CONTENT_SAFETY_KEY) {
            try {
                const body = await request.json();
                const testText = body.text || 'This is a test message';

                context.log('Testing Content Safety with text:', testText);

                const response = await fetch(`${CONTENT_SAFETY_ENDPOINT}/contentsafety/text:analyze?api-version=2023-10-01`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': CONTENT_SAFETY_KEY
                    },
                    body: JSON.stringify({
                        text: testText,
                        categories: ['Hate', 'Sexual', 'Violence', 'SelfHarm'],
                        blocklistNames: [],
                        haltOnBlocklistHit: false
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    result.testResult = {
                        success: true,
                        textAnalyzed: testText,
                        categories: data.categoriesAnalysis,
                        wouldBlock: data.categoriesAnalysis?.some(cat => cat.severity >= 2)
                    };
                } else {
                    const errorText = await response.text();
                    result.error = `API Error ${response.status}: ${errorText}`;
                }
            } catch (error) {
                result.error = error.message;
            }
        }

        return { jsonBody: result };
    }
});
