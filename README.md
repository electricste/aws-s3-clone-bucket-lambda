# aws-s3-clone-bucket-lambda
A small lambda function (in node.js) that clones a sourcebucket to a targetbucket

## Info ##
This Lambda will copy an entire SOURCE BUCKET to a TARGET BUCKET.
The expected event with input parameters should be as follows:

```
{
  "sourceBucket": "mySourceBucket",
  "targetBucket": "myTargetBucket",
}
```
