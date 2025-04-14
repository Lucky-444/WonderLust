
const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedInUser = (req, res, next) => {
    console.log(req.path, ".." , req.originalUrl );
    if(!req.isAuthenticated()){
       req.session.redirectUrl = req.originalUrl;  
        req.flash("error" , "You Must Be Logged In Before Creating A New Listings");
       return res.redirect("/login");
     }
    next();
}


module.exports.savedredirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;  
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let currUser = req.user;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(currUser._id)){ 
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){ 
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

