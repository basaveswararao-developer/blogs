const express = require('express');
const router = express.Router();
const Post  = require('../models/Post');

// Get Home

router.get('', async (req, res) => {
    try {
        const locals = {
            title: 'NodeJS Blog',
            description: 'Simple Blog created with NodeJS Express & MongoDB'
        };

        let perPage = 13;
        let page = req.query.page || 1;

        const data = await Post.aggregate([
            { $sort: { createdAT: -1 } },
            { $project: { title: 1, createdAT: 1 } }
        ]).skip(perPage * page - perPage).limit(perPage).exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
            // currentRoute: '/'
        });
        
    } catch (error) {
        console.log(error);
    }
});



// Get Post :id

router.get('/post/:id',async (req,res)=>{
    try {

        let slug = req.params.id;

        const data = await Post.findById({_id: slug});

        const locals ={
            title: data.title,
            description:'Simple Blog created with NodeJS Express & MongoDB',
            // currentRoute: `/post/${slug}`

        }

        res.render('post',{locals,data});

    } catch (error) {
        console.log(error);
    }

});


// Post / Post - searchTerm

router.post('/search',async (req,res)=>{
    try {

        const locals ={
            title:'Search',
            description:'Simple Blog created with NodeJS Express & MongoDB'
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");


        const data = await Post.find({
            $or:[
                { title: {$regex: new RegExp(searchNoSpecialChar,'i')}},
                { body: {$regex: new RegExp(searchNoSpecialChar,'i')}}

            ]
        });
        res.render("search",{
            data,
            locals
        });

    } catch (error) {
        console.log(error);
    }

});



router.get('/about',(req,res)=>{
    // res.render('about',{
    //     currentRoute:'/about'
    // });
    res.render('about');
});

module.exports = router;


// router.get('',async (req,res)=>{

//     try {
//         const locals ={
//             title:'NodeJS Blog',
//             description:'Simple Blog created with NodeJS Express & MongoDB'
//         }
//         let perPage = 10;
//         let page = req.query.page || 1;

//         const data = await Post.aggregate([ { $sort: {createdAT: -1 } } ])
//         .skip(perPage * page - perPage)
//         .limit(perPage)
//         .exec();

//         const count = await Post.count();
//         // const count = await Post.countDocuments();
//         const nextPage = parseInt(page) + 1;
//         const hasNextPage = nextPage <= Math.ceil(count / perPage);

//         res.render('index',{
//             locals,
//             data,
//             current: page,
//             nextPage: hasNextPage ? nextPage : null
//         })

//     } catch (error) {
//         console.log(error);
//     }

// });


// router.get('',async (req,res)=>{

//     const locals ={
//         title:'NodeJS Blog',
//         description:'Simple Blog created with NodeJS Express & MongoDB'
//     }
//     try {
//         const data = await Post.find();
//         res.render('index',{locals,data});

//     } catch (error) {
//         console.log(error);
//     }

// });




// function insertPostData(){
//     Post.insertMany([
//         {
//           title:'Building a blog',
//           body:'This is the body text'  
//         },
//         {
//             title: 'Building a blog',
//             body: 'This is the body text for the first example.',
//         },
//         {
//             title: 'Exploring Node.js',
//             body: 'This is the body text for the second example.',
//         },
//         {
//             title: 'Web Development Tips',
//             body: 'This is the body text for the third example.',
//         },
//         {
//             title: 'JavaScript Best Practices',
//             body: 'This is the body text for the fourth example.',
//         },
//         {
//             title: 'CSS Styling Techniques',
//             body: 'This is the body text for the fifth example.',
//         },
//         {
//             title: 'Responsive Design Strategies',
//             body: 'This is the body text for the sixth example.',
//         },
//         {
//             title: 'Database Management',
//             body: 'This is the body text for the seventh example.',
//         },
//     ])
// }
// insertPostData();
