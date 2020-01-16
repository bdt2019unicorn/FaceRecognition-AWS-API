const path = require('path');
const fs = require("fs"); 


const AWS = require('aws-sdk');
AWS.config.update
(
    {
        accessKeyId: "AKIAJ7PBRM7OMSJLC2XA",
        secretAccessKey: "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",
        region: "us-west-2"
    }
);


class upload_pictures_controller
{
    static index(request, response, next)
    {
        var file = path.join(__dirname,"../","upload",request.file.filename);

        var upload = upload_s3(file, request.file); 
        upload.then
        (
            function(result)
            {
                try 
                {
                    var s3object = params_modify(result); 
                    
                    var params = 
                    {
                        Image: 
                        { 
                          S3Object: s3object
                        }
                    };
                    var rekonigtion = new AWS.Rekognition(); 

                    rekonigtion.detectFaces
                    (
                        params, 
                        function(error,data)
                        {
                            if(error)
                            {
                                console.log(error); 
                            }
                            else 
                            {
                                response.send(JSON.stringify(data));  
                            }
                        }
                    );
                }
                catch
                {
                    response.send(null); 
                }

            }
        );
    }
}

async function upload_s3(file, file_properties) 
{
    const s3 = new AWS.S3();

    var params = 
    {
        Bucket: "mission-ready-facial-rekonigtion",
        Key: file_properties.originalname,
        Body: fs.readFileSync(file) 
    }

    let result = new Promise
    (
        (resolve, reject)=>
        {
            s3.upload
            (
                params,
                function (error) 
                {
                    if(error)
                    {
                        console.log(error); 
                        return resolve(false); 
                    }
                    else 
                    {
                        return resolve(params); 
                    }
                }
            );
        }
    ); 
    
    return result; 
}

function params_modify(params)
{
    params.Name = params.Key; 
    delete params.Key; 
    delete params.Body; 
    return params; 
}



module.exports = upload_pictures_controller; 