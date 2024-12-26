const fs = require("fs");

const requestHandler = (req,res)=>{
    const url = req.url;
    const method = req.method;

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

    }
    else{
        if(req.url=='/message' || method == 'POST'){
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
                    res.setHeader('location','/read');
                    res.end();
                });
                
                  
            })
            
        }else{
            if(req.url=='/read'){
                fs.readFile('formValues.txt',(err, data) => {
                    if (err) {
                      console.error('Error reading file:', err);
                      return;
                    }
                    
                    res.end(`
                        <h1>${data.toString()}</h1>
                        `)
                  });
            }
        }
    }
}
module.exports = requestHandler;