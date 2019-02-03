const Post = require('../models/post')
const errorFunc = require('../util/errorFunc')
exports.getMyPage = async (req, res, next) => {
        try{
            const posts  =   await Post.find({ userId: req.user._id })
            console.log(posts)
            res.render('user/my-page', {
                path: '/my-page',
                title:'My Page',
                posts:posts.reverse()
              }); 
        }
        catch(err){
                errorFunc(err,next)
        }
  };