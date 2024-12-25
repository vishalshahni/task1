const http = require("http");
const fs = require("fs");

const server = http.createServer((req,res)=>{
    let url = req.url;
    let method = req.method;

    if(req.url==='/'){
        res.setHeader('content-type','text/html');
        res.end(
            `
            <form action="/message" method = "POST">
            <label>Name:</label>
            <input type="text" name="username"></input>
           <button type="submit">Add</button>
            </form>
            `);

    }else{
        if(req.url=='/message'){
            res.setHeader('content-type','text/html');
            let chunks = [];
            req.on('data',(chunk)=>{
                chunks.push(chunk);
            });
            req.on('end',()=>{
                let combine = Buffer.concat(chunks).toString();
                console.log(combine);
                const formValue = combine.split('=')[1];
                fs.writeFile('formValues.txt',formValue,(err)=>{
                    if (err) {
                        res.statusCode = 500; //error
                        res.end('Server Error');
                        return;
                      }
              
                    res.statusCode = 302 ; //redirected
                    res.setHeader('location','/');
                    res.end();
                });
            })
            
        }
    }
})

server.listen(3000,()=>{
    console.log("Server Started")
});