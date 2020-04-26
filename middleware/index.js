var Campground=require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err, foundCampground)
        {
            if(err)
                res.redirect("back");
            else
            {
                if(req.user._id.equals(foundCampground.author.id))   //we cant use === because campground author is a mongoose object while user id is a string
                next();
                else
                {
                    req.flash("error", "You don't own the Campground!")
                    res.redirect("back");
                }
            }
        })
    }
    else
    {
        req.flash("error", "Please Login First");
        res.redirect("back");
    }
    
}

middlewareObj.checkCommentOwnership=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err, foundComment)
        {
            if(err)
            {
                req.flash("error", "Comment Not Found!")
                res.redirect("back");
            }
            else
            {
                if(req.user._id.equals(foundComment.author.id))   //we cant use === because campground author is a mongoose object while user id is a string
                   next();
                else
                {
                    req.flash("error", "You have not written this comment!")
                    res.redirect("back");
                }
            }
        })
    }
    else
    {
        req.flash("error", "Please Login First")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","Please Login First!")
    res.redirect("/login")
}

module.exports = middlewareObj