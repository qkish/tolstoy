import config from 'config';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  signatureVersion: 'v4'
});

const s3 = new AWS.S3();

export const deleteFromS3 = key => {
    return s3.deleteObject({
        Bucket: 'bm-platform',
        Key
    }).promise()
}
