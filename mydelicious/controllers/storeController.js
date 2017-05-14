const mongoose = require("mongoose");
const Store = mongoose.model("Store");  

exports.homePage = (req,res) => {
    console.log("the req is ",req.name)
    res.render('index');
};

exports.addStore = (req,res) => {
//res.send('It works');
    res.render('editStore',{title: 'Add Store'});
};

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