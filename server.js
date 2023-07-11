const express = require('express');
const bodyParser =require('body-parser');
const date = require(__dirname + "/date.js")
const { escapeXML } = require('ejs');
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://nareshmahesh910:Naresh%402001@cluster0.8atztpy.mongodb.net/todoList');
}
const itemSchema = {
   name : String
}

const Item = mongoose.model('Item' , itemSchema)

const item1 = new Item({
    name : "Welcome to Todo List"
})

const item2 = new Item({
    name : "Hit + to add an item"
})

const item3 = new Item({
    name : "Click the checkbox to delete an item"
})
const defaultItems = [item1,item2,item3]

const listSchema ={
    name : String,
    items : [itemSchema]
}

const List = mongoose.model("List" , listSchema)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/',(req,res)=>{

    Item.find().then((items) =>{
        if(items.length ===0)
        {   
            Item.insertMany(defaultItems)
            .then(() => {
              console.log("Inserted successfully into default database");
            })
            .catch(err => {
              console.error(err);
            });
            res.redirect('/')
        }
        else{
        var day= date.getDate();
         res.render("list",{day : "Today" , listItem : items})
        }
    }).catch(err => {console.log(err)})

    
   
})

app.post('/',(req,res)=>{
    let newitem =req.body.item
    const listName = req.body.list
    console.log(listName)
    const item = new Item({
        name : newitem
    })
    // item.save()
    //     res.redirect("/")
    // var day= date.getDate();
    if(listName === "Today" )
    {
        item.save()
        res.redirect("/")
    }
    else{
        List.findOne({name : listName}).then((foundList)=>{
            console.log(foundList.name)
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName)
        })
    }
    
})

// app.get('/work', (req,res)=>{
//     res.render("list",{day : "Work List", listItem : workitems})
// })

app.get("/:CustomList", (req, res) => {
    const name = req.params.CustomList;
    
    List.findOne({ name: name })
      .then((list) => {
        if (list) {
          // If the list already exists, do something
          res.render("list",{day : name , listItem : list.items})
        } else {
          // If the list does not exist, create a new one with defaultItems
          const newList = new List({
            name: name,
            items: defaultItems,
          });
          newList.save()
            .then(() => {
              console.log("List created successfully");
              res.redirect("/"+ name)
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
  

app.post('/work',(req,res)=>{
    let item = req.body.item;
    workitems.push(item);
    res.redirect('/work');
})

app.post("/delete" , (req,res) =>{
   const id= req.body.checkbox
   const listName = req.body.listName
   console.log(listName)
   if(listName === "Today")
   {
   Item.findByIdAndRemove(id).then(()=>{console.log("Successfully Deleted")}).catch(err =>{console.log(err)})
   res.redirect("/");
   }
   else
   {
    List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: id } } }
      )
        .then(updatedList => {
           res.redirect("/"+ listName)
          // Handle the updated list object
        })
        .catch(err => {
          console.error(err);
          // Handle the error as needed
        });
      
      
   }
})

app.get('/about', (req,res)=>{
    res.render("about")
})
app.listen( process.env.PORT || 5000,()=>{
    console.log("server is running on port 3000")
})