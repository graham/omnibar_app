#! /usr/bin/env babel-node

let AWS = require('aws-sdk')
let process = require('process')
AWS.config.update({Region:'us-west-1'})

let bucket_prefix = process.env.BUCKET || 'baz'
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

function list() {
    return new Promise((resolve, reject) => {
        let s3 = new AWS.S3({params: {Bucket: BUCKET}})
        s3.listObjects({}, function(err, data) {
            if (data) {
                data.Contents.forEach((item) => {
                    console.log(item.Key)
                })
            }
            resolve()
        })
    })
}

function completer(line, callback) {
    var completions = ['help', 'one']
    let s3 = new AWS.S3({params: {Bucket: BUCKET}})
    s3.listObjects({}, function(err, data) {
        if (data) {
            data.Contents.forEach((item) => {
                completions.push(item.Key)
            })
        }
        var hits = completions.filter(function(c) { return c.indexOf(line) == 0 })
        // show all completions if none found
        
        callback(null, [hits.length ? hits : completions, line])
    })

}
function handle_command(line) {
    return new Promise((resolve, reject) => {
        switch(line.trim()) {
        case '':
            break;
        case 'list':
            resolve(list())
            break
        default:
            console.log('Say what? I might have heard `' + line.trim() + '`');
            break;
        }
    })
}

function run_repl() {
    var readline = require('readline'),
        rl = readline.createInterface({
            input:process.stdin,
            output:process.stdout,
            completer:completer
        });

    rl.setPrompt('OHAI> ');
    rl.prompt();
    
    rl.on('line', function(line) {
        handle_command(line).then(() => {
            rl.prompt()
        })
    }).on('close', function() {
        console.log('Have a great day!');
        process.exit(0);
    });
}

var hit = false
process.argv.forEach(function (val, index, array) {
    if (val == 'shell' && index == 2) {
        run_repl()
        hit = true
    }
});

if (hit == false) {
    handle_command(process.argv.slice(2).join(' '))
}
