AWS Setup
===

Currently, only a portion of the AWS setup is done using Cloudformation, as part of AWS SAM. These assets can be found in [../lambda/template.yaml]().

The following have been set up manually, via the AWS Console.

Static Site S3 Bucket
---

* Bucket name: `pets.soe.dpe-au.io`
* Region: Asia Pacific (Sydney)
* Properties
  * Static website hosting: Use this bucket to host a website
    * Index document: `index.html`
* Permissions
  * Block public access: All off
  * Bucket Policy:
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::pets.soe.dpe-au.io/*"
            }
        ]
    }
    ```

ACM Certificate
---

**Certificate for Cloudfront should be configured in US East (N. Virginia) region. Otherwise it will not show up as an option when creating the distribution.**

Request a certificate for `pets.soe.dpe-au.io`.

Route 53 Record
---

In hosted zone, `soe.dpe-au.io`, create a record:

* Record name: `pets.soe.dpe-au.io`
* Record type: A
* Value/Route traffic to: Alias to Cloudfront distribution > US East (N. Virginia) > _Cloudfront distribution URL_

Cloudfront Distribution
---

### Cache Policies

1. Name: Pets-LowCache
  * Minimum TTL: 1
  * Maximum TTL: 30
  * Default TTL: 30
  * Headers: Whitelist
    * Demo-Session
  * Cookies: None
  * Query strings: All

### Distribution

* Alternate Domain Names (CNames): `pets.soe.dpe-au.io`
* SSL Certificate: Custom SSL Certificate: `pets.soe.dpe-au.io`

### Origins

1. Origin Domain Name: `pets.soe.dpe-au.io.s3-website-ap-southeast-2.amazonaws.com`
1. Origin Domain Name: _API Gateway URL_
  * Origin Path: `/Prod`
  * Origin Protocol Policy: HTTPS Only
  * Original Custom Headers
    1. Demo-Session: _Per [DEMO.md]()_

### Behaviors

1. Precedence: 0
  * Path Pattern: `/pets`
  * Origin or Origin Group: _API Gateway Origin_
  * Viewer Protocol Policy: Redirect HTTP to HTTPS
  * Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
  * Cached HTTP Methods: OPTIONS
  * Cache and origin request settings: Use a cache policy and origin request policy
  * Cache Policy: Pets-LowCache
  * Origin Request Policy: Managed-CROS-CustomOrigin
1. Precedence: 1
  * Path Pattern: `/petStats`
  * _The rest of properties the same as above_
1. Precedence: 2
  * Origin or Origin Group: _S3 Origin_
  * Viewer Protocol Policy: Redirect HTTP to HTTPS
  * Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
  * Cache Policy: Managed-CachingOptimized
  * Origin Request Policy: Managed-CROS-S3Origin

### Error Pages

1. HTTP Error Code: 404: Not Found
  * Customize Error Response: Yes
  * Response Page Path: `/index.html`
  * HTTP Response Code: 200: OK