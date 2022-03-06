// This is where get and post requests to/from the database will be made.
/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/

const axios = require('axios');
const bcrypt = require('bcrypt');


var express = require('express'); //Ensure our express framework has been added
const session = require('express-session');
const path = require('path');
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());



//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'scoin_db',
	user: 'postgres',
	password: 'pwd'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));   //This line is necessary for us to use relative paths and access our resources directory

//  Get and post requests for postgres here //
//-------------------------------------------//

// Home Page
//show this file when the "/" is requested
app.get("/", function (request, response){
  if (request.session.loggedin) {
    console.log("logged in");
  }
  else {
    console.log("not logged in");
  }
    response.render('index', {
        my_title: "Home Page",
        items: '',
        error: false,
        message: ''
    });
});

app.get("/index", function (request, response){
  if (request.session.loggedin) {
    console.log("logged in");
  }
  else {
    console.log("not logged in");
  }
    response.render('index', {
        my_title: "Home Page",
        items: '',
        error: false,
        message: ''
    });
    
});



// Resources Page
app.get("/news", function (request, response){
  response.render('news', {
    my_title: "Home Page",
    items: '',
    error: false,
    message: ''
});
});

app.get("/resources", function (request, response){
  response.render("resources");
});
app.get("/login", function (request, response){
  response.render("login");
});

app.get("/signup", function (request, response){
  response.render("signup");
});

app.get("/about-us", function (request, response){
  response.render("about-us");
});

app.get("/general-info", function (request, response){
  response.render("general-info");
});
app.get("/profile", function (request, response){
  let username = request.session.username;
  let password = request.session.password;
  if (username && password) {
    let select_TEST = "SELECT * FROM refugees WHERE username = '" + username + "' AND userPassword = '" + password + "';";
    console.log(select_TEST);
    db.task('get-login', task => {
      return task.batch([
        task.any(select_TEST),
        //task.any (select_user)
      ]);
    })
    .then(data => {
      console.log("here");
      console.log(data);
      console.log(data[0][0].house_description);
      response.render("profile",{
        data: data[0][0],
        username1: request.session.username,
        my_title: 'profile page error', 
        user: ''
      })
    })
    .catch(err => {
      console.log('error',err);
      response.render("profile",{
        my_title: 'profile page error', 
        user: '',
        data: ''
      })

    });
  }
  else {
    response.render("profile", {
      data: ''
    });
  }
});


app.post('/get_news_feed', function(req, res) {
  var title = req.body.title; //TODO: Remove null and fetch the param (e.g, req.body.param_name); Check the NYTimes_home.ejs file or console.log("request parameters: ", req) to determine the parameter names
  console.log("aqui");
  console.log(title);

  if(title) {
    axios({
      url: `https://newsapi.org/v2/everything?q=${title}&apiKey=${NEWS_KEY}`,
        method: 'GET',
        dataType:'json',
      })
        .then(items => {
          console.log(items.data.articles);
          // TODO: Return the reviews to the front-end (e.g., res.render(...);); Try printing 'items' to the console to see what the GET request to the Twitter API returned.
          // Did console.log(items) return anything useful? How about console.log(items.data.results)?
          // Stuck? Look at the '/' route above
          res.render('news',{
            my_title: "NYTimes search",
            items: items.data.articles,
            error: false,
            message: 'nice'
          })
          
        })
        .catch(error => {
          console.log(error);
          res.render('news',{
            my_title: "NYTimes Movie Reviews",
            items: '',
            error: true,
            message: error
          })
        });


  }
  else {
    // TODO: Render the home page and include an error message (e.g., res.render(...);); Why was there an error? When does this code get executed? Look at the if statement above
    // Stuck? On the web page, try submitting a search query without a search term
    res.render('news', {
      my_title: "NYTimes search",
      items: '',
      error: true,
      message: 'No title given!'
    });
  }
});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
  let login_type = request.body.radiobutton;
  let database_login_type = "";
  if (login_type == "refugee") {
    database_login_type = 'refugees';
  }
  else {
    database_login_type = 'hosts';
  }
  let select_TEST = "SELECT * FROM " + database_login_type + " WHERE username = '" + username + "' AND userPassword = '" + password + "';";
  console.log(select_TEST);
  db.task('get-login', task => {
    return task.batch([
      task.any(select_TEST),
      //task.any (select_user)
    ]);
  })
  .then(data => {
    if (data.length > 0) {
      request.session.loggedin = true;
      request.session.username = username;
      request.session.password = password;
      request.session.data = data;
      response.redirect('/index');
    }
    else {
      console.log("Nothing with this username + password combo");
    }
  })
  .catch(err => {
    console.log('error',err);
    response.render("refugee-housing",{
      my_title: 'profile page error', 
      user: ''
    })

  });
});

app.post('/signup', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
  let signup_type = request.body.radiobutton;
  let database_signup_type = "";
  if (signup_type == "refugee") {
    database_signup_type = 'refugees';
  }
  else {
    database_signup_type = 'hosts';
  }
  let email = request.body.email;
  let image = request.body.image;
  let house_description = request.body.housedescription;
  let dates_available = request.body.datesavailable;
  let address = request.body.address;
  let select_TEST = "INSERT INTO " + database_signup_type + " (username, email, userPassword, house_image, house_description, dates_available, home_address) VALUES ('" + username + "', '" + email + "', '" + password + "', '" + image + "', '" + house_description + "', '" + dates_available + "', '" + address + "');";
  console.log(select_TEST);
	db.task('insert-statement', task => {
    return task.batch([
        task.any(select_TEST)
    ]);
})
.then(info => {
  response.redirect('/profile');
})
.catch(err => {
        console.log('error', err);
        response.render('index', {
            my_title: 'Home Page',
            data: '',
            color: '',
            color_msg: ''
        })
});
});

app.post('/housing_form', function(request, response) {
	// Capture the input fields
	let house_description = request.body.house_desc;
	let password = request.session.password;
  let username = request.session.username;

  // let email = request.body.email;
  // let image = request.body.image;
  // let dates_available = request.body.datesavailable;
  let address = request.body.house_addr;
  let img_house = request.body.house_img;
  let dates_available = request.body.dates_available;
  let update_statement = "UPDATE refugees SET house_description = '" + house_description + "', home_address = '" + address + "', house_image = '" + img_house + "', dates_available = '" + dates_available + "' WHERE username = '" + username + "' AND userPassword = '" + password + "';";
  console.log(update_statement);
	db.task('insert-statement', task => {
    return task.batch([
        task.any(update_statement)
    ]);
})
.then(info => {
  response.render('index',{
    my_title: "Home Page",
    color: '',
    color_msg: ''
  })
})
.catch(err => {
        console.log('error', err);
        response.render('index', {
            my_title: 'Home Page',
            data: '',
            color: '',
            color_msg: ''
        })
});
});

app.get("/refugee-housing", function (request, response){
  // response.render("refugee-housing");
  var select_TEST = 'SELECT * FROM hosts';
  // var select_user = 'SELECT * FROM scoin_users WHERE username = ' + username + ';';

  db.task('get-houses', task => {
    return task.batch([
      task.any(select_TEST),
      //task.any (select_user)
    ]);
  })
  .then(data => {
    response.render("refugee-housing",{
      my_title: 'Profile Page',
      houses: data[0]
    })
  })
  .catch(err => {
    console.log('error',err);
    response.render("refugee-housing",{
      my_title: 'profile page error', 
      user: ''
    })

  });
});

// app.get("/forgot", function (request, response){
//     response.render("forgot");
// });

// app.get("/registration", function (request, response){
//     response.render("registration");
// });


// app.post('/registration', async (req, res) => {  //This function checks if username is already in the database, and if so returns message and redirects to registration page
//   try{                                            // If the username is not in the database, then it posts the user data and redirects to the login page
//     var username = req.body.username;
//     console.log(username);
//     var email = req.body.email;
//     var hashedPassword = await bcrypt.hash(req.body.password, 10);
//     let date_ob = new Date();
//     let date = ("0" + date_ob.getDate()).slice(-2);
//     let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//     let year = date_ob.getFullYear();
//     var currDate = year + "-" + month + "-" + date;
//     var insert_statement = 'INSERT INTO scoin_users(username,email,passwordHash,regDate) VALUES (\'' + username + '\', \'' + email  + '\',\'' + hashedPassword + '\',\'' + currDate  + '\');'; 
//     var isUser = 'SELECT * FROM scoin_users WHERE username=\''+ username + '\';'; //variable holds the query of the database
    
//     db.task('user-exist', task => {
//       return task.batch([
//         task.any(isUser),
//       ]);
//     })
//     .then(data => {
//       var userExist = data[0].length;
//       console.log (userExist);
//       if(userExist != 0){
//         return console.log('username taken'), 
//         res.render('registration', {
//           added: false
//         });
//       }else{
//         db.query(insert_statement),(err)=>{
//           if(err) {
//             cosole.log('Error: ', err);
//             return res.render('registration', {
//               added: false
//             });
//           }else{
//             console.log('user Added::');
//             res.render('login', {
//               added: true
//             })
//           }
//         }
//       }
//       res.redirect('/login');
//     })

//     .catch(err => {
//       console.log('error',err);
//       response.render("registration",{
//         my_title: 'registration page error', 
//         message: false
//       })

//     });
    

    
//   } catch (err) {
//     console.log("error",err)
//     res.render("registration",{
//       added: false
//     })
//   }
  
// });


// //--  ||   --//

// app.post('/get_recommendations', function(req, res) {
//   var size_por = req.body.portfolio_size; 
//   var query = 'SELECT * FROM crypto_accounts WHERE crypto_percent_change < 0;';
//   db.any(query)
//         .then(function (data) {
//           data.sort((a,b) => Math.abs(b['crypto_percent_change']) - Math.abs(a['crypto_percent_change']));
//           let total_percent_cnt = -10.1427;
//           for (let i = 0; i < data.length; i++) {
//             let current_total_chng = data[i]['crypto_percent_change']/total_percent_cnt;
//             data[i]['shares'] = current_total_chng*parseInt(size_por, 10)/data[i]['crypto_price'];
//           }
          
//           res.render('index',{
//             my_title: "Home Page",
//             items: data,
//             error: false,
//             message: ''
//         })

//         })
//         .catch(function (err) {
//             console.log('error', err);
//             res.render('/index', {
//               my_title: "Home Page",
//               items: '',
//               error: true,
//               message: ''
//             })
//         })
// });


// app.post('/login', async (req, res) => {  //This function checks if username and the corresponding password are in the database
//   try{                                            // If the username and password correspond then the user is taken to the homepage, if not they are taken to login
//     var username = req.body.username;
//     console.log(username);

//     var password = req.body.password; 
//     var hashedPassword = await bcrypt.hash(password, 10);

//     //(username,email,passwordHash,regDate) 
//     var email = req.body.email;
//     let date_ob = new Date();
//     let date = ("0" + date_ob.getDate()).slice(-2);
//     let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//     let year = date_ob.getFullYear();
//     var currDate = year + "-" + month + "-" + date;
    
//     var insert_statement = 'INSERT INTO scoin_users(username,email,passwordHash,regDate) VALUES (\'' + username + '\', \'' + email  + '\',\'' + hashedPassword + '\',\'' + currDate  + '\');'; 
//     var isUser = 'SELECT * FROM scoin_users WHERE username=\''+ username + '\';'; //variable holds the query of the database
//     var isPassword = 'SELECT * FROM scoin_users WHERE passwordHash=\''+ hashedPassword + '\';'; 
    
//     db.task('login-exist', task => {
//       return task.batch([
//         task.any(isUser),
//         task.any(isPassword),
//       ]);
//     })
//     .then(data => {
//       var userExist = data[0].length;
//       var passwordExist = data[2].length; 
//       console.log (userExist);
//       console.log (passwordExist); 

//       if(userExist != 0 && passwordExist != 0 ){
//         return console.log('login validated'), 
//         res.render('login', {
//           login: true
//         });
//       }else{
//         db.query(insert_statement),(err)=>{
//           if(err) {
//             cosole.log('Error: ', err);
//             return res.render('login', {
//               login: false
//             });
//           }else{
//             console.log('invalid credentials');
//             res.render('login', { 
//               login: false
//             })
//           }
//         }
//       }
//       res.redirect('/profile');
//     })

    

//     .catch(err => {
//       console.log('error',err);
//       response.render("login",{
//         my_title: 'login page error', 
//         message: false
//       })

//     });
    
//   } catch (err) {
//     console.log("error",err)
//     res.render("login",{
//       added: false
//     })
//   }
  
// });

// app.get("/settings", function (request, response){
//   response.render("settings");
// });


// //-- Login Pages --//
// app.get("/login", function (request, response){
//   response.render("login");
// });




// app.get("/confirm", function (request, response){
//   response.render("confirm");
// });


// app.get("/profile", function (request, response){ 
//   console.log("Database Req TEST :: ");
  
//   //var LocalStorage = require('node-local-storage').LocalStorage, localStorage = new LocalStorage('./scratch') //Defines the localStorage varianble
//   // var username = localStorage.getItem('username');
//   var select_TEST = 'SELECT * FROM scoin_users WHERE ID=1;';
//   // var select_user = 'SELECT * FROM scoin_users WHERE username = ' + username + ';';

//   db.task('get-everything', task => {
//     return task.batch([
//       task.any(select_TEST),
//       //task.any (select_user)
//     ]);
//   })
//   .then(data => {
//     console.log(data[0]);
//     // console.log("Data Req User :: ");
//     // console.log(data[1]);
//     response.render("profile",{
//       my_title: 'Profile Page',
//       user: data[0]
//     })
//   })
//   .catch(err => {
//     console.log('error',err);
//     response.render("profile",{
//       my_title: 'profile page error', 
//       user: ''
//     })

//   });
  
// });




app.listen(3000);
console.log('3000 is the magic port');