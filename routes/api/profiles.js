var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('../auth');

router.param('username', function(req, res, next, username){
  User.findOne({username: username}).then(function(user){
    if (!user) { return res.sendStatus(404); }
    req.profile = user;
   return next();
  }).catch(next);
});


router.get('/:username',auth.optional,function(req,res,next){
    return res.json({profile: req.profile.toProfileJSONFor()})
})

router.post('/:username/follow',auth.required, function(req,res,next){
  var profileId = req.profile._id

  User.findById(req.payload.id).then(function(user){
    console.log(user,"kdfdkjfkdjkfjdjfkdjfkdkfj")
    if(!user){ return res.sendStatus(401)}

    return user.follow(profileId).then(function(){
      console.log(user)
      return res.json({profile: req.profile.toProfileJSONFor(user)})
    })
  }).catch(next)
})

router.delete('/:username/follow',auth.required,function(req,res,next){
  var profileId = req.profile._id

  User.findById(req.payload.id).then(function(user){

    if(!user) { return res.sendStatus(401)}

   return user.unfollow(profileId).then(function(){
      return res.json({profile: req.profile.toProfileJSONFor(user)})
    })
  }).catch(next)
})

module.exports = router;
