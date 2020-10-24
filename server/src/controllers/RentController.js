const {Rent} = require('../models')
//page 203
module.exports = {
    // get all booking
    async index(req, res) {
        try {
            let rents = null
            const search = req.query.search
            // console.log('search key: ' + search)
            if (search) {
                rents = await Rent.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category','rentprice','depositprice'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                rents = await Rent.findAll({
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(rents)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the rents'
            })
        }
    },

    // create booking
    async create(req, res) {
        // res.send(JSON.stringify(req.body))
        try {
            const rent = await Rent.create(req.body)
            res.send(rent.toJSON())
        } catch (err) {
            res.status(500).send({
                error: 'Create rent incorrect'
            })
        }
    },

    // edit booking, suspend, active
    async put(req, res) {
        try {
            await Rent.update(req.body, {
                where: {
                    id: req.params.rentId
                }
            })
            res.send(req.body)
        } catch (err) {
            req.status(500).send({
                error: 'Update rent incorrect'
            })
        }
    },

    // delete booking
    async remove(req, res) {
        try {
            const rent = await Rent.findOne({
                where: {
                    id: req.params.rentId
                }
            })
            if (!rent) {
                return res.status(403).send({
                    error: 'The rent information was incorrect'
                })
            }
            await rent.destroy()
            res.send(rent)
        } catch (err) {
            req.status(500).send({
                error: 'The rent information was incorrect'
            })
        }
    },

    // get booking by id
    async show(req, res) {
        try {
            const rent = await Rent.findById(req.params.rentId)
            res.send(rent)
        } catch (err) {
            req.status(500).send({
                error: 'The rent information was incorrect'
            })
        }
    },

    async frontIndex(req, res) {
        try {
            let rents = null
            const search = req.query.search
            console.log('----------> search key: ' + search)
            if (search) {
                rents = await Rent.findAll({
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
                rents = await Rent.findAll({
                    where: {
                        'status': 'published'
                    },
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(rents)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the rents'
            })
        }
    }

}