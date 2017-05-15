const mongoose = require("mongoose");
const Store = mongoose.model("Store");  
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: function(req, file, next ){
        const isPhoto = file.mimetype.startsWith('image/jpeg');
        if(isPhoto) {
          next(null, true);
        }else {
          next({message:'That filetype isn\'t allowed'}, false)
        }
    }
}

exports.homePage = (req,res) => {
    console.log("the req is ",req.name)
    res.render('index');
};

exports.addStore = (req,res) => {
    res.render('editStore',{title: 'Add Store'});
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  //check if there is no new file to resize
  if(!req.file){
    next(); //skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  //now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
//once we have written the photo to our file system
  next();
}

exports.createStore = async (req,res) => {
    const store =   await( new Store(req.body)).save();
    //await store.save();
    req.flash("success",`Successfully created ${store.name} .Care to leave a review`);
    res.redirect(`/store/${store.slug
    }`);
    store.save();
};

exports.getStores = async (req,res) => {
    //Queries the database for a list of all stores
    const stores = await Store.find();
    res.render('stores',{ title: 'My title', stores})
}

exports.editStore = async(req,res) => {
  //Find the store given the id
  const store = await Store.findOne({ _id: req.params.id });
  res.render('editStore',{title:`Edit Store ${store.name} `,store })
  //Confirm they are the owner of the store
  //Render out the edit form so that the user can update the store
} 



exports.updateStore = async(req,res) => {
    req.body.location.type = 'Point';
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
    }).exec();
    req.flash('success',`Successfully updated <strong>${store.name}</strong><a href="/stores/${store.slug}"> View store </a>`)
    res.redirect(`/stores/${store._id}/edit`);
    //find and update the store
    //redirect them the store and tell them it worked
}