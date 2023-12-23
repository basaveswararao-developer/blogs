const express = require('express');
const router = express.Router();
const Post  = require('../models/Post');
const User  = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

// check Login page

const authMiddileware = (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized' });  
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message:'Unauthorized'})
    }
}

// Get Admin - Login page

router.get('/admin',async (req,res)=>{
    try {
        const locals ={
            title:'Admin',
            description:'Simple Blog created with NodeJS Express & MongoDB'
        }

        res.render('admin/index',{locals, layout: adminLayout});

    } catch (error) {
        console.log(error);
    }

});

// Post Admin - Checl Login

router.post('/admin',async (req,res)=>{
    try {
        const {username, password} = req.body;
       
        const user = await User.findOne( { username});
        // console.log('User:', user);
        // console.log('Stored Hashed Password:', user.password);
        if(!user){
            return res.status(401).json( { message:'Invalid credentials'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
        // console.log('isPasswordValid:', isPasswordValid);

        if(!isPasswordValid){
            return res.status(401).json( { message: 'Invalid credentials' })
        }
        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token',token, {httpOnly: true});
        // console.log('Token:', token);
        // console.log('Redirecting to /dashboard');

        res.redirect('/dashboard');
        // res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'})
    }
});


//GET Admin Dashboard

router.get('/dashboard' ,authMiddileware ,async (req,res)=>{

    try {
        const locals ={
            title:'Admin',
            description:'Simple Blog created with NodeJS Express & MongoDB'
        }
        const data = await Post.find();
        res.render('admin/dashboard',{
            locals,
            data,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error)
    }
})


//GET Admin -Created New Post

router.get('/add-post' ,authMiddileware ,async (req,res)=>{

    try {
        const locals ={
            title:'Add Post',
            description:'Simple Blog created with NodeJS Express & MongoDB'
        }
        const data = await Post.find();
        res.render('admin/add-post',{
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error)
    }
})


//POST Admin -Created New Post

router.post('/add-post' ,authMiddileware ,async (req,res)=>{
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error)
    }
})


// Post Admin - Register

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            // Respond with a JSON message
            // Redirect the user to the admin page
            res.redirect('/dashboard');
            res.status(201).json({ message: 'User Created' });

        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already in use' });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } catch (error) {
        console.log(error);
    }
});

// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Hash the password before storing it
//         const hashedPassword = await bcrypt.hash(password, 10);

//         try {
//             const user = await User.create({ username, password: hashedPassword });
//             res.status(201).json({ message: 'User Created' });
//             res.redirect('/admin')
//         } catch (error) {
//             if (error.code === 11000) {
//                 res.status(409).json({ message: 'User already in use' });
//             } else {
//                 res.status(500).json({ message: 'Internal server error' });
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// });

//GET Admin -Created New Post

router.get('/edit-post/:id' ,authMiddileware ,async (req,res)=>{

    try {
        
        const locals ={
            title: 'Edit Post',
            description:'Free NodeJS User Management Sysytem',
        };

        const data = await Post.findOne({_id: req.params.id})
        
        res.render('admin/edit-post',{
            locals,
            data,
            layout: adminLayout
        })
        
    } catch (error) {
        console.log(error)
    }
})

//PUT Admin -Created New Post

router.put('/edit-post/:id' ,authMiddileware ,async (req,res)=>{

    try {
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        
        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error)
    }
})

//DELETE Admin - Delete Post

router.delete('/delete-post/:id' ,authMiddileware ,async (req,res)=>{

    try {
        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);  
    }
})

//GET Admin - Logout

router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    // res.json({message: 'Logout Successful.'});
    res.redirect('/')
})


module.exports = router;


















































































































// // Middleware to check if the user is authenticated
// const authenticateUser = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.redirect('/admin'); // Redirect to login if no token is present
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, jwtSecret);
//         req.userId = decoded.userId; // Store the user ID in the request object
//         next();
//     } catch (error) {
//         console.log(error);
//         res.redirect('/admin'); // Redirect to login if the token is invalid
//     }
// };

// // Dashboard route using the middleware
// router.get('/dashboard', authenticateUser, (req, res) => {
//     res.render('admin/dashboard');
// });




// const authenticateUser = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.redirect('/admin'); // Redirect to login if no token is present
//     }

//     try {
//         const decoded = jwt.verify(token, jwtSecret);
//         req.userId = decoded.userId; // Store the user ID in the request object
//         next();
//     } catch (error) {
//         console.log(error);
//         res.redirect('/admin'); // Redirect to login if the token is invalid
//     }
// };

// // Apply middleware to the /dashboard route
// router.get('/dashboard', authenticateUser, (req, res) => {
//     res.render('admin/dashboard');
// });



// router.post('/admin',async (req,res)=>{
//     try {
//         const {username, password} = req.body;
//         if(req.body.username === 'admin' && req.body.password === 'password'){
//             res.send('You are logged in.');
//         }else{
//             res.send('Wrong username or password');
//         }
//     } catch (error) {
//         console.log(error);
//     }

// });


// Post Admin - register

// router.post('/register',async (req,res)=>{
//     try {
//         const {username, password} = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         console.log('Entered Password:', password);
//         console.log('Generated Hash:', await bcrypt.hash(password, 10));

//         try {
//             const user = await User.create({username, password});
//             res.status(201).json({message: 'User Created',})
//         } catch (error) {
//             if(error.code === 11000){
//                 res.status(409).json({message:'User already in use'})
//             }
//             res.status(500).json({message:'Internal server error'});
//         }
//     } catch (error) {
//         console.log(error);
//     }

// });
