const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tale = mongoose.model('tales');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', (req,res)=>{
    Tale.find({status:'public'})
    .populate('user')
    .sort({date:'desc'})
    .then(tales =>{
        res.render('tales/index',{
            tales: tales
        });

    });
     //rendering into index views-> dashboard
});

router.get('/add', ensureAuthenticated, (req,res)=>{
    res.render('tales/add');

});


//show single story
router.get('/show/:id', (req,res)=>{
    Tale.findOne({
        _id : req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(tale => {
        if(tale.status == 'public'){
            res.render('tales/show', {
                tale: tale
            });
        }else{
            if(req.user){
                if(req.user.id == tale.user._id){
                    res.render('tales/show', {
                        tale: tale
                    });

                }else{
                    res.redirect('/tales');
                }
            }else{
                    res.redirect('/tales');
                }
            }
         });
});
//list storisa form auser
router.get('/user/:userId', (req,res)=>{
    Tale.find({user: req.params.userId,
    status:'public'})
    .populate('user')
    .then(tales=>{
        res.render('tales/index',{
            tales: tales
        });
    });
});

//my tales

router.get('/my', ensureAuthenticated, (req,res)=>{
    Tale.find({user: req.user.id})
    .populate('user')
    .then(tales=>{
        res.render('tales/index',{
            tales: tales
        });
    });
});




//edit form router

router.get('/edit/:id', ensureAuthenticated, (req,res)=>{
    Tale.findOne({
        _id: req.params.id
    })
    .then(tale=>{
        if(tale.user !== req.user.id){
            res.redirect('/tales');

        }else{
            res.render('tales/edit', {
                tale: tale
            });
        }

      });
});

//process
router.post('/', (req,res)=>{
    let allowComments;
    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments= false
    }
    const newTale = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }
    //create story
    new Tale(newTale)
    .save()
    .then(tale=>{
        res.redirect(`/tales/show/${tale.id}`);
    });
});

//Edit form process

router.put('/:id', (req,res)=>{
    Tale.findOne({
        _id: req.params.id
    })
    .then(tale=>{
        
        let allowComments;
        if(req.body.allowComments){
            allowComments = true;
        }else{
            allowComments = false;
        }
       //New Values
       tale.title= req.body.title,
       tale.body= req.body.body,
       tale.status= req.body.status,
       tale.allowComments= allowComments
       tale.save()
       .then(tale=>{ //once saved we will be getting a promise
           res.redirect('/dashboard');
       });



    });
});


//Delete Forms
router.delete('/:id', (req,res)=>{
    Tale.remove({_id: req.params.id
}).then(()=>{
    res.redirect('/dashboard');
});
});
//router post

router.post('/comment/:id', ()=>{
    Tale.findOne({
        _id: req.params.id
    })
    .then(tale =>{
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }
        //push to comments array
        tale.comments.unshift(newComment);

        tale.save()
        .then(tale =>{
            res.redirect(`/tales/show/${tale.id}`);
        });
    });
});

module.exports=router;