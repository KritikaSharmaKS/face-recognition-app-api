const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require('bcryptjs');

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

//root
app.get('/', (req, res) => {
    res.json(database.users);
});

//signin
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email','=',req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
              .where('email','=',req.body.email)
              .then(user => {
                  res.json(user[0])
              })
              .catch(err => err.status(400).json('unable to get user'))
        }
        else{
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
});

//register
app.post('/register', (req, res) => {
   const { email, password, name } = req.body;
   const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
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
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries')) 
});

app.listen(3000, () => {
    console.log('app is running at port 3000');
})