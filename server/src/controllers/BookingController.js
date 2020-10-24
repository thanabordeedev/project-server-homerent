const {Booking} = require('../models')
//page 203
module.exports = {
    // get all booking
    async index(req, res) {
        try {
            let bookings = null
            const search = req.query.search
            // console.log('search key: ' + search)
            if (search) {
                bookings = await Booking.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category','bookingprice','depositprice'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                bookings = await Booking.findAll({
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(bookings)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the bookings'
            })
        }
    },

    // create booking
    async create(req, res) {
        // res.send(JSON.stringify(req.body))
        try {
            const booking = await Booking.create(req.body)
            res.send(booking.toJSON())
        } catch (err) {
            res.status(500).send({
                error: 'Create booking incorrect'
            })
        }
    },

    // edit booking, suspend, active
    async put(req, res) {
        try {
            await Booking.update(req.body, {
                where: {
                    id: req.params.bookingId
                }
            })
            res.send(req.body)
        } catch (err) {
            req.status(500).send({
                error: 'Update booking incorrect'
            })
        }
    },

    // delete booking
    async remove(req, res) {
        try {
            const booking = await Booking.findOne({
                where: {
                    id: req.params.bookingId
                }
            })
            if (!booking) {
                return res.status(403).send({
                    error: 'The booking information was incorrect'
                })
            }
            await booking.destroy()
            res.send(booking)
        } catch (err) {
            req.status(500).send({
                error: 'The booking information was incorrect'
            })
        }
    },

    // get booking by id
    async show(req, res) {
        try {
            const booking = await Booking.findById(req.params.bookingId)
            res.send(booking)
        } catch (err) {
            req.status(500).send({
                error: 'The booking information was incorrect'
            })
        }
    },

    async frontIndex(req, res) {
        try {
            let bookings = null
            const search = req.query.search
            console.log('----------> search key: ' + search)
            if (search) {
                bookings = await Booking.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category','bookingprice','depositprice'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                        $and: [
                            {
                                status:
                                {
                                    $eq: "published"
                                }
                            },
                        ]
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                bookings = await Booking.findAll({
                    where: {
                        'status': 'published'
                    },
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(bookings)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the bookings'
            })
        }
    }

}