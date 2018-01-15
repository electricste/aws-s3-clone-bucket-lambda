const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    region : process.env.AWS_REGION
});


exports.handler = (event, context, callback) => {
    // TODO implement
    var srcBucket = event.sourceBucket;
    var targetBucket = event.targetBucket;
    
    if(!srcBucket || srcBucket === '' || !targetBucket || targetBucket === '') {
        callback('invalid input parameters');
    } else {
        listAndCopyObjects(srcBucket,targetBucket,null,callback);
    }
    
};


function listAndCopyObjects(sourceBucket,targetBucket,continuationToken, callback) {
    var params = {
      Bucket: sourceBucket
     };
     if(continuationToken) {
         params.ContinuationToken = continuationToken;
     }
     console.log('LISTING OBJECT from ' + sourceBucket + ' WITH ContinuationToken: ' + continuationToken);
     s3.listObjectsV2(params, function(err, data) {
       if (err) {
           console.err('ERROR');
           console.log(err, err.stack);
           callback(err);
       } else {
           console.log('retrieved ' + data.Contents.length + ' contents');
           for (var i = 0; i < data.Contents.length; i++) {
               var item = data.Contents[i];
               var originKey = item.Key;
               var copyParams = {
                  Bucket: targetBucket, 
                  CopySource: encodeURIComponent(sourceBucket + '/' + originKey),
                  Key: originKey,
                  MetadataDirective: 'COPY'
                };
                
             console.log('should start copy object with params: ');
             console.log(copyParams);
             s3.copyObject(copyParams, function(copyErr,copyData){
                 if(copyErr) {
                     console.err('RECEIVED ERROR in copyObject: ' + copyErr);
                     callback(copyErr);
                 } else {
                     console.log('Copied object: ' + copyParams.Key);
                 }
             });
           }
           if(data.NextContinuationToken && data.NextContinuationToken !== '') {
               listAndCopyObjects(sourceBucket, targetBucket, data.NextContinuationToken, callback);
           } else {
               callback(null, 'COMPLETED copy from ' + sourceBucket + ' to ' + targetBucket);
           }
       }
     });
}
