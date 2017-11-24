var router = require('express').Router();
var fs = require("fs");
var mongodb = require("mongodb").MongoClient;
var urlencodedParser = require("body-parser").urlencoded({extended: true});
var expressSession = require("express-session");
var expressValidator = require("express-validator");

var url = "mongodb://127.0.0.1:27017/koiHai";

/* GET home page. */
router.get('/', function(req, res) {
    res.end(fs.readFileSync("views/index.html","utf8"));
});

router.get('/index',function (req,res) {
    res.redirect("/");
});

//done
router.get('/home',function (req,res) {
    if(!req.session.profileId){
        res.redirect('/');
    }
    var profileId = req.session.profileId;
    mongodb.connect(url, function (err, db) {
        var oid = new require("mongodb").ObjectId(profileId);
        db.collection("profile").find({_id : oid}).toArray(function (err,arr) {
            //console.log({data: arr});
            if(arr.length==1){
                res.render('home',{data: arr});
            }
        });
    });
});






router.get('/profile/:id',function (req,res) {
    if(!req.session.profileId){
        res.redirect('/');
    }
    var viewProfileId = req.params.id;
    var oid = new require("mongodb").ObjectId(viewProfileId);
    mongodb.connect(url,function (err, db) {
      db.collection("profile").find({_id : oid}).toArray(function (err, arr) {
          if(arr.length==1){
              //send arr
              res.send({data:arr});
          }
      });
  });
});

router.post('/editProfile',urlencodedParser, function(req, res){
    if(!req.session.profileId){
        res.redirect('/');
    }
    var profileId = req.session.profileId;
    var newInfo = req.body;
    var oid = new require("mongodb").ObjectId(profileId);
    mongodb.connect(url, function (err, db) {
        db.collection("profile").updateOne({_id: oid},{$set:newInfo}, function (err, result) {
            if(!err){
                res.redirect('/home');
            }
        });
    });
});




//change the function working coz this function is not needed
router.get('/acceptedJobs',function (req, res) {
    if(!req.session.profileId){
        res.redirect('/');
    }
    var jobId = req.query.jobId;
    var byProfileId = req.session.profileId;
    var oid = new require("mongodb").ObjectID(jobId);
    mongodb.connect(url,function (err, db) {
        db.collection("jobs").find({_id: oid, byProfileId: byProfileId}).toArray(function (err, arr) {
            if(!err){
                if(arr.length === 1){
                    db.collection("jobs").updateOne({_id: oid},{$set:{taken:true}},function (err, result) {
                        res.end("success");
                    });
                }
            }
        });
    });
});


router.get('/requestJobs', function (req, res) {
    if(!req.session.profileId){
        res.redirect('/');
    }
    var jobId = req.query.jobId;
    var cost = req.query.cost;
    var oid = new require("mongodb").ObjectId(jobId);
    mongodb.connect(url, function (err, db) {
        db.collection("jobs").find({_id: oid}).toArray(function (err, arr) {
            if(!err){
                    if((arr[0].cost!=-1 && arr[0].cost>cost)||(arr[0].cost==-1)){
                        db.collection("jobs").updateOne({_id:oid},{$set:{cost:cost, koiHai: true, toProfileId:req.session.profileId}},function (err, result) {
                            if(!err){
                                res.send("Success");
                                res.end();
                            }
                        }) ;
                    }
                    else{
                        res.send("Bidding amount more than current bid");
                        res.end();
                    }
            }
        });
    });
});








//done
router.get('/getJobs',function (req, res) {
    if(!req.session.profileId){
        res.redirect('/');
    }
    var profession = req.query.profession;
    var city = req.query.city;
    var data ={};
    if(!profession)data = {
        city: city,
        byProfileId: {$ne : req.session.profileId},
        taken: false
    }
    else data = {
        profession: profession,
        byProfileId: {$ne : req.session.profileId},
        taken: false
    };
    mongodb.connect(url, function (err, db) {
        db.collection("jobs").find(data).toArray(function (err, arr) {
            if(!err){
                res.send({data: arr});
            }
        });
    });
});


//done
router.get('/deleteJobs',function (req, res) {
    if(!req.session.profileId){
        res.redirect('/');
    }
    var jobId = req.query.jobId;
    var byProfileId = req.session.profileId;
    var oid = new require("mongodb").ObjectId(jobId);
    mongodb.connect(url, function (err, db) {
        db.collection("jobs").find({_id: oid, byProfileId: byProfileId}).toArray(function (err, arr) {
            if(!err){
                if(arr.length === 1){
                    db.collection("jobs").deleteOne({_id : oid},function (err, result) {
                        if(!err){
                            res.end("success");
                        }
                    });
                }
            }

        });
    });
});

//done
router.get('/myJobs', function (req, res) {
    if(!req.session.profileId){
        res.redirect('/');
    }
    var byProfileId = req.session.profileId;
    mongodb.connect(url, function (err, db) {
        db.collection("jobs").find({byProfileId: byProfileId}).toArray(function (err, arr) {
            //send arr
            if(!err){
                var ob = {data: arr};
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(ob));
                //format this arr as json and send response
            }
        });
    });
});


//done
router.post('/postJobs',urlencodedParser,function (req, res) {
    if(!req.session.profileId){
        res.redirect('/');
    }
    var d = new Date();
    var date = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
    var profileId = req.session.profileId;
    mongodb.connect(url,function (err, db) {
        db.collection("jobs").insert({
            byProfileId: profileId,
            date : date,
            toProfileId: "NA",
            cost: -1,
            profession: req.body.profession,
            koiHai: false,
            description: req.body.description,
            city: req.body.city,
            taken: false
        }, function (err, result) {
            if(!err){
                //do something with result
                res.redirect("/home");
            }

        });
    });
});

//done
router.post('/validateLogin', urlencodedParser, function (req,res) {
    mongodb.connect(url, function (err, db) {
        db.collection("credentials").find(req.body).toArray(function (err, arr) {
            if(!err)
                if(arr.length==1){
                    req.session.profileId = arr[0].profileId;
                    res.redirect('/home');
                }
        });
    });
});

//done
router.get('/logout',function (req,res) {
    req.session.destroy();
    res.redirect('/');
});

//done
router.get('/login',function (req, res) {
    req.session.destroy();
    res.end(fs.readFileSync("views/login.html","utf8"));
});

//done
router.post('/createAccount',urlencodedParser, function (req, res) {
    mongodb.connect(url,function (err, db) {
        db.collection("credentials").find({username: req.body.username}).toArray(function (err, arr) {
            if(arr.length==0){
                db.collection("profile").insert({
                    name: req.body.name,
                    mobNo: req.body.mobNo,
                    aadhaarNo: req.body.aadhaarNo,
                    address: req.body.address,
                    city: req.body.city,
                    profession: req.body.profession
                },function (err, result) {
                    if(!err){
                        db.collection("credentials").insert({
                            username: req.body.username,
                            password: req.body.password1,
                            profileId: ""+result.ops[0]._id
                        }, function (err, result) {
                            if(!err){
                                req.session.profileId = result.ops[0].profileId;
                                res.redirect('/home');
                            }
                        });
                    }

                });

            }
            else {
                res.send("username exists.. please choose another username");
            }

        });
    });
});

module.exports = router;
