
import AWS from 'aws-sdk';
import { PricingDB, Pricing } from './type';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new AWS.DynamoDB.DocumentClient();


export async function queryPriceByClaimId(claimId : string): Promise<PricingDB | null>  {
    const params = {
        TableName: "Pricing",
        IndexName: 'ClaimIdTimestampIndex',
        KeyConditionExpression: 'claim_id = :id',
        ScanIndexForward : false,
        ExpressionAttributeValues: {
            ':id': claimId
        },
        Limit : 1
    };
    try {
        const data = await dynamoDB.query(params).promise();
        return data.Items ? data.Items[0] as PricingDB : null
    } catch (error) {
        return null;
    }
}


export async function createPrice(priceData: Pricing): Promise<void> {

    if (!priceData.pricing_id) {
        priceData.pricing_id = uuidv4();
    }

    priceData.timestamp = String(new Date().getTime());
    const params = {
        TableName: "Pricing",
        Item: {
            ...priceData,
        }
    };
    try {
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error creating price in DynamoDB:', error);
        throw error;
    }
}