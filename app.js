const express = require('express');
const bodyParser =require('body-parser');
const date = require(__dirname + "/date.js")
const { escapeXML } = require('ejs');
const app = express();
app.set('view engine', 'ejs');
const items = ["Buy Food" , "Cook Food" , "Eat Food"];
let workitems = ["Gym"]
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/',(req,res)=>{
    var day= date.getDate();
   
    res.render("list",{day : day , listItem : items})
   
})

app.post('/',(req,res)=>{
    console.log(req.body);
    let item =req.body.item
    if(req.body.list === "Work List")
    {
       workitems.push(item);
       res.redirect('/work');
    }
    else{
        items.push(item)
        res.redirect('/');
    }
})

app.get('/work', (req,res)=>{
    res.render("list",{day : "Work List", listItem : workitems})
})
app.post('/work',(req,res)=>{
    let item = req.body.item;
    workitems.push(item);
    res.redirect('/work');
})

app.get('/about', (req,res)=>{
    res.render("about")
})
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})