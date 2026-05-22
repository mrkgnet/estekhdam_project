import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    endpoint: 'https://s3.ir-tbz-sh1.arvanstorage.ir', // حتما https:// اضافه شود
    accessKeyId: process.env.ARVAN_ACCESS_KEY_ID,
    secretAccessKey: process.env.ARVAN_SECRET_ACCESS_KEY,
    region: 'ir-tbz-sh1',  // باید با endpoint همخوانی داشته باشد
    signatureVersion: 'v4',
    s3ForcePathStyle: true,
});

export default s3;
