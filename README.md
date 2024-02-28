# Problem 


# Solution Demo

<video src="/docs/videos/demo.mov" controls="controls" style="max-width: 730px;">
</video>

## Basic Architecture

![basic](./docs/imgs/starter-arch.png)


### Security 

To grant security we can add lambda auth + cognito

![basic-security](./docs/imgs/with-lambda-auth.png)

## Data Modelling

![data-model](./docs/imgs/data-model.png)


## CloudFront Edge Caching Flow
```mermaid
sequenceDiagram
    User ->>CloudFront: GET /claims?claim_id=c_123
    CloudFront ->>Cache: GET cached claims_id=c_123
    Cache ->> APIGateway: Call Endpoint
    APIGateway ->>Cache: Data + Cache-Control: max-age=100 + Etag: TS
    Cache ->> User: Data Request + (Cache populated)

    User ->> CloudFront: GET /claims?claim_id=c_123, AGE=10
    CloudFront ->> User: Cached Data

    User ->> CloudFront: GET /claims?claim_id=c_123, AGE=110 
    CloudFront ->> APIGateway: if None-Match: TS
    APIGateway ->> CloudFront: 303 Not modified
    Note over CloudFront,Cache: Data are not changed, cache re-populated

    CloudFront ->>User: Data Request
```



              