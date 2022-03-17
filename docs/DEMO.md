Demo Playbook
===

This page is for those who want to do a code demonstration, using this app.

Before Demo
---

1. Update the _Origin Custom Header_ value in the Cloudfront distribution via AWS Console
1. Verify the app still functions
1. If re-using a demo session name, clear out DynamoDB if needed

Have the following pages open:

* https://pets.soe.dpe-au.io/
* https://github.com/sohrab-/pets/blob/master/docs/DESIGN.md
* https://github.com/sohrab-/pets/blob/master/api/api.yaml
* https://editor.swagger.io/
* https://ap-southeast-2.console.aws.amazon.com/cloudformation
* https://docs.aws.amazon.com/rekognition/latest/dg/API_DetectLabels.html
* https://docs.aws.amazon.com/rekognition/latest/dg/procedure-moderate-images.html

During Demo
---

Below is what to show during the demo, while providing commentary.

Please note:

* Depending on how much time you have for the demo, you can go as far as you like.
* Since this is focused on Platform Engineering, the UI part is not really demo'ed here intentionally.

### App functionality

1. Use the app to submit a pet
1. Show the Results page

### Architecture

1. Show the AWS architecture in [DESIGN.md]()
1. Show the Cloudformation template in [../lambda/template.yaml]
1. Show the Cloudformation stack in AWS Console
1. Optionally, go to each AWS service in the stack

### REST API

1. Show the REST API specification in [../api/api.yaml]
1. Load up the API specification into [Swagger Editor](editor.swagger.io)
1. Open Inspector in the browser and show the REST interaction when submitting a pet
1. Optionally, do the same in the Results page

### Lambda implementation

1. Show the sequence diagram in [DESIGN.md]()
1. Walk through the Lambda implementation in [../lambda/src]()

### Developer workflow

1. Make a code change to the Lambda and submit a pull request
1. Get approval and merge the pull request
1. Show the GitHub Action triggering
1. Show the change in behaviour
