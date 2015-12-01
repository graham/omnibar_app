#! /usr/bin/env babel-node

let AWS = require('aws-sdk')
let process = require('process')

AWS.config.update({Region:'us-west-1'})

let bucket_prefix = process.env.BUCKET
let BUCKET = bucket_prefix + ".active"

function init() {
    let s3 = new AWS.S3({params: {Bucket: BUCKET, Key: 'myKey'}})
    s3.createBucket(function(err) {
        if (err) { console.log("Error:", err); }
        else {
            s3.upload({Body: 'Hello!'}, function() {
                console.log("Successfully uploaded data to myBucket/myKey")
            });
        }
    });
}

function create(key, data) {
    let s3 = new AWS.S3({params: {Bucket: BUCKET}})
    s3.putObject({Bucket: BUCKET, Key:key, Body:data}, function(err, data) {
        console.log(err)
        console.log(data)
    })
}

function archive() {

}

function list() {
    let s3 = new AWS.S3({params: {Bucket: BUCKET}})
    s3.listObjects({}, function(err, data) {
        data.Contents.forEach((item) => {
            console.log(item.Key)
        })
    })
}

list()
