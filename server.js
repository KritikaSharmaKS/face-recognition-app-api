const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

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
        res.json("success");
    }
    else{
        res.status(400).json("error logging in");
    }
});

//register
app.post('/register', (req, res) => {
   const { email, password, name } = req.body;
    database.users.push({
        id: "125",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

//profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(element => {
        if(element.id === id){
            found = true;
            return res.json(element);
        }
    });
    if(!found){
        res.status(404).json("user not found");
    }
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