import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    endpoint: 'https://s3.ir-thr-at1.arvanstorage.ir', // تغییر از ir-tbz-sh1 به ir-thr-at1
    accessKeyId: process.env.ARVAN_ACCESS_KEY_ID,
    secretAccessKey: process.env.ARVAN_SECRET_ACCESS_KEY,
    region: 'ir-thr-at1',  // تغییر از ir-tbz-sh1 به ir-thr-at1
    signatureVersion: 'v4',
    s3ForcePathStyle: true,
});

export default s3;