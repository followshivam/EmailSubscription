const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/failure",function(req, res){
  res.redirect("/");
});

app.post("/", function(req,res){
  const firstName= req.body.fName;
  const lastName= req.body.lName;
  const email= req.body.email;

  const data={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData= JSON.stringify(data);
  const url="https://us19.api.mailchimp.com/3.0/lists/0a03ae642c";
  const options={
    method: "POST",
    auth:"shivamtyagi:be0db6b9dabfe5fe3b346a7e23e790ee-us19"
  }
  const request= https.request(url, options, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT||3000,function(){
  console.log("server is running on port 3000");
});

//api key be0db6b9dabfe5fe3b346a7e23e790ee-us19
// id 0a03ae642c
