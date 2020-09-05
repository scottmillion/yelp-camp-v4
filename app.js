// APP IMPORTS
const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  seedDB = require('./seeds'),
  Campground = require('./models/campground');
// Comment = require("./models/comment"),
// User = require("./models/user");

// DELETE DATABASE AND LOAD SEED DATA
seedDB();

// APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// MONGOOSE MONGO CONFIG
mongoose.connect('mongodb://localhost:27017/yelp-camp-v4', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

// --------ROUTES--------

// HOME
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE 
app.post("/campgrounds", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const newCampground = { name, image, description }

  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW 
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

// SHOW 
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { campground: foundCampground });
    }
  });
});


// --------SERVER--------
app.listen(3000, (req, res) => {
  console.log("Server running on 3000, sir!");
});