import Ajv, {JSONSchemaType} from "ajv"

// Enum for currency types
export enum CurrencyType {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
}


export interface Pricing {
    pricing_id?: string | null;
    claim_id : string;

    price: number;
    currency : CurrencyType; 
    timestamp : string,

}


export interface PricingDB extends Pricing {
    pricing_id: string;
}


export interface PricingOutput {
    price: number;
    currency: CurrencyType;
}


const schema: JSONSchemaType<Pricing> = {
    type: "object",
    properties: {
        pricing_id: { type: "string", nullable: true }, // Adjusted type definition
        timestamp: { type: "string", nullable: true },
        claim_id: { type: "string" },
        price: { type: "number" },
        currency: { type: "string" }
    },
    required: ["claim_id", "price", "currency"],
    additionalProperties: false
};

const ajv = new Ajv()
export const validate = ajv.compile(schema)