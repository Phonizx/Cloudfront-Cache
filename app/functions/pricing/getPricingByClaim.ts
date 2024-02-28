import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { queryPriceByClaimId } from './dynamoDbService';

export const handleEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Extract the claim_id query parameter from the event; otherwise, return a Bad Request response
    const claimId = event.queryStringParameters?.claim_id;

    if (!claimId) {
        console.log("No claim id"); 
        return {
            statusCode: 400,
            body: JSON.stringify({"status": "Missing claimId." }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
    // Check if the if-none-match header exists in the request
    const ifNoneMatchHeader = event.headers?.['if-none-match'];
    // Fetch the last claim in the database based on the claim ID
    const lastClaim = await queryPriceByClaimId(claimId);
    if (!lastClaim) {
        return {
            statusCode: 404,
            body: JSON.stringify({"status": "claim not found."}),
            headers: {},
        };
    }
    
    const mostRecentCreatedAt = lastClaim?.timestamp || null;

    // If the most recent item in the database has the same value as If-None-Match, 
    // it means that there is no change in the database; return 304 to indicate no modifications
    if (mostRecentCreatedAt && Number(mostRecentCreatedAt) === Number(ifNoneMatchHeader)) {
        console.log("304: Not Modified: No changes");
        return {
            statusCode: 304,
            body: "",
            headers: {},
        };
    }
    /* 
        if the code reaches this point, it indicates an update in the database. 
        perform any expensive operations or queries here.
        
        after the expensive operation, return a standard response (status 200) with the latest claim details,
        along with ETag and Cache-Control headers for caching purposes
    */
    return {
        statusCode: 200,
        body: JSON.stringify(lastClaim),
        headers: {
            'Cache-Control': 'public, max-age=100',
            'ETag': mostRecentCreatedAt || String(new Date().getTime()),
            'Content-Type': 'application/json',
        },
    };
};