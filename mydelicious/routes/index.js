const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

const { catchErrors } = require('../handlers/errorHandlers');
// Do work here
// router.get('/', (req, res) => {
//   console.log('Test');
//   //console.log(req);
//   const wes = {name:'WES',age: 100,cool: true};
//  // res.send('Hey! It works!');
//  // res.json(wes);
//   res.render('hello',{
//     name: 'Wes',
//     dog:req.query.dog,
//     title: 'I Love Foo'
//   });
// });
router.get('/' ,catchErrors(storeController.getStores));
router.get('/add',storeController.addStore);
router.get('/stores',catchErrors(storeController.getStores));
router.get('/stores/:id/edit',catchErrors(storeController.editStore));
router.post('/add',catchErrors(storeController.createStore));
router.post('/add/:id',catchErrors(storeController.updateStore));
// router.get('/reverse/:name',(req,res)=> {
//     const reverse = [... req.params.name].reverse().join('');
//     res.send('it works'+reverse);
// });

module.exports = router;
