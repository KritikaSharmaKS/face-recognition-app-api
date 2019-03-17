const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'smart-brain-db'
    }
});

db.select('*').from('users').then(data => console.log(data));

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "bananas",
            entries: 0,
            joined: new Date()
        }
    ]
}

//root
app.get('/', (req, res) => {
    res.json(database.users);
});

//signin
app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    }
    else{
        res.status(400).json("error logging in");
    }
});

//register
app.post('/register', (req, res) => {
   const { email, password, name } = req.body;
   db('users')
    .returning('*')
    .insert({
       name: name,
       email: email,
       joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json("unable to register"))
});

//profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(404).json("user not found");
        }      
    }).catch(err => res.status(400).json('Error Getting User'))
});

//image
app.put('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(element => {
        if(element.id === id){
            found = true;
            element.entries++;
            return res.json(element.entries);
        }
    });
    if(!found){
        res.status(404).json("user not found");
    }
});

app.listen(3000, () => {
    console.log('app is running at port 3000');
})