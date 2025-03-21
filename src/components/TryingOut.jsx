const getPosts = async (req, res){

    const query = {};

    const cat = req.query.cat;
    const creator = req.query.creator;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    if(cat){
        query.category = cat;
    }
    if(creator){
        const creatorId = await User.findOne({username: creator}).select("_id")
        if(!creatorId){
            return res.status(404).json({message: "Post not found"});
        }

        query.creator = creatorId._id;
       }

       let sortObj = {createdAt : -1}

      if(sortQuery){
        switch(sortQuery){
            case "newest":
                sortObj = {createdAt: -1}
             break;
             case "oldest":
                sortObj = {createdAt: 1}
             break;
             case "popular":
                sortObj = {visit : -1}
             break;
             case "trending":
                sortObj = {visit : -1}
                query.createdAt = {
                    $gte: new Date(new Date().getTime() 
                - 7 * 24 * 60 * 60 * 1000),
                }
                break;
             default:
                 break;

        }
      }


    if(searchQuery){
        post.title = {$regex: searchQuery, $options: "i"};
    }

    
}

const posts = await Post.find(query)
.sort(sortObj)

