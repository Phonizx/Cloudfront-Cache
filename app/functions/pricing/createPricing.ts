
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createPrice } from './dynamoDbService';
import { Pricing } from './type';
import {validate} from './type';


export const handleEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const pricingInput: Pricing = JSON.parse(event.body || '{}');
    
    if (!validate(pricingInput)) { 
        console.log(validate.errors);
        return {statusCode: 400, body : ""}
    }
    
    await createPrice(pricingInput);

    return {
        statusCode: 201,
        body: JSON.stringify({"status": ""}),
        headers: {
            'Content-Type': 'application/json',
        },
    };
};