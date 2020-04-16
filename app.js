const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname,)));
app.use(express.static(path.join(__dirname, "image")))



app.set('view engine', 'ejs');
app.set('views', 'views');


// ======== Connected NodeJS via MySQL========
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'brief'
});

conn.connect(function(error){
    if(!!error) console.log(error);
    else  console.log('Connected! :)')
}); 


// ======== Display all AUTHORS===========

app.get('/', (req, res, next) => {
    const sql = "SELECT * FROM citation";
    const query = conn.query(sql, (err, rows) => {
        if(err)throw err;
            res.render('home', {
                authors : rows
            });
                
    })
})

// ========== ADD NEW QUOTE==========
app.get('/add',(req, res) => {
    res.render('addPage');
});
   
app.post('/save',(req, res) => { 
    const data = {
        name: req.body.name, 
        description: req.body.description,
        img : req.body.img,
        category : req.body.category
    };
    const sql = "INSERT INTO citation SET ?";
    const query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//======= EDIT QUOTE =========
app.get('/edit/:userId',(req, res) => {
    const authorId = req.params.userId;
    let sql = `Select * from citation where id = ${authorId}`;
    let query = conn.query(sql,(err, result) => {
        if(err) throw err;
        res.render('editPage', {
            author : result[0]
        });
    });
});

app.post('/update',(req, res) => {
  
    let userId = req.body.id

    let sql = "Update citation SET name='"+req.body.name+"', description='"+req.body.description+"', img='"+req.body.img+"', category='"+req.body.category+"' where id ="+userId;
    let query = conn.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//======= DELETE QUOTE =========
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from citation where id = ${userId}`;
    let query = conn.query(sql,(err, result) => {
        if(err)
         throw err;
        res.redirect('/');
    });
});

//  Listing Server 
app.listen(300, () => {
    console.log('server is rinning')
});