const UserController = require('./controllers/UserController')
const UserAuthenController = require('./controllers/UserAuthenController')
const BookingController = require('./controllers/BookingController')
const RentController = require('./controllers/RentController')
const isAuthenController = require('./authen/isAuthenController')
const CommentController = require('./controllers/CommentController')
const LeaseController = require('./controllers/LeaseController')

let multer = require("multer")

module.exports = (app) => {

// upload section
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/uploads");
    },
    filename: function (req, file, callback) {
        // callback(null, file.fieldname + '-' + Date.now());
        console.log(file);
        callback(null, file.originalname);
    }
})
let upload = multer({ storage: storage }).array("userPhoto", 10)

//upload
app.post("/upload", function (req, res) {
    isAuthenController,
    upload(req, res, function (err) {
        if (err) {
             return res.end("Error uploading file.");
         }
        res.end("File is uploaded");
    })
 })

//delete file uploaded function
app.post('/upload/delete', async function (req, res) {
    isAuthenController;
    try {
        const fs = require('fs');
        console.log(req.body.filename)
        fs.unlink(process.cwd() + '/public/uploads/' + req.body.filename,
            (err) => {
                if (err) throw err;
                res.send("Delete sucessful")
                // console.log('successfully deleted material file');
            });
    } catch (err) {
        res.status(500).send({
            error: 'An error has occured trying to delete file the material'
        })
    }
})

 /* RESFUL Api for users management */
 // create user
 app.post('/user',
 UserController.create
 )
 // edit user, suspend, active
 app.put('/user/:userId',
 UserController.put
 )
 // delete user
 app.delete('/user/:userId',
 isAuthenController,
 UserController.remove
 )
 // get user by id
 app.get('/user/:userId',
 UserController.show
 )
 // get all user
 app.get('/users',
 isAuthenController,
 UserController.index
 )

 // users
 // get front
 app.get('/users/front',
 UserController.getFront
 )

 app.post('/login',
 UserAuthenController.login
 )

 //booking route
 // create booking
app.post('/booking',
isAuthenController,
BookingController.create
)
// edit booking, suspend, active
app.put('/booking/:bookingId',
isAuthenController,
BookingController.put
)
// delete booking
app.delete('/booking/:bookingId',
BookingController.remove
)
// get blog by id
app.get('/booking/:bookingId',
isAuthenController,
BookingController.show
)


// get all booking
app.get('/bookings',
isAuthenController,
BookingController.index
)

// comment route
// create comment
app.post('/comment',
 CommentController.create
)
// edit comment, suspend, active
app.put('/comment/:commentId',
 CommentController.put
)
// delete comment
app.delete('/comment/:commentId',
 CommentController.remove
)
// get comment by id
app.get('/comment/:commentId',
isAuthenController,
 CommentController.show
)
// get all comment
app.get('/comments',
 isAuthenController,
 CommentController.index
)

// get comment by id
app.get('/comment/booking/:bookingId',
    CommentController.booking
)
// get comment by id
app.get('/comment/user/:userId',
    CommentController.user
)

app.post('/front/login',
 UserAuthenController.clientLogin
 )

 // get blog by id
app.get('/front/read/:bookingId',
isAuthenController,
BookingController.show
)

app.get('/bookings/front',
isAuthenController,
 BookingController.frontIndex
 )

 //-------------------- Rent --------------------
 // create book
 app.post('/rent',
 isAuthenController,
 RentController.create
 )
 // edit book, suspend, active
 app.put('/rent/:rentId',
 isAuthenController,
 RentController.put
 )
 // delete book
 app.delete('/rent/:rentId',
 isAuthenController,
 RentController.remove
 )
 
 // get book by id
 app.get('/rent/:rentId',
 RentController.show
 )
 // get all book
 app.get('/rents',
 isAuthenController,
 RentController.index
 )
 app.get('/rents/front',
 RentController.frontIndex
 )

 //------------------Lease-----------------

 // buy route
 // create buy
 app.post('/lease',
 isAuthenController,
LeaseController.create
 )
 // edit buy, suspend, active
 app.put('/lease/:leaseId',
 isAuthenController,
 LeaseController.put
 )
 // get all buy
 app.get('/leases',
 isAuthenController,
 LeaseController.index
 )

 app.get('/lease/:userId',
isAuthenController,
LeaseController.user
)

}