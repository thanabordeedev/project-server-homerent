const { Lease } = require('../models')
module.exports = {
    // index with serach buy
    async index(req, res) {
        try {
            let leases = null
            const search = req.query.search
            console.log('----------> search key: ' + search)
            if (search) {
                leases = await Lease.findAll({
                    where: {
                        $or: [
                            'renttitle', 'username', 'userlastname'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                leases = await Lease.findAll({
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(leases)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the leases'
            })
        }
    },
    // create buy
    async create(req, res) {
        // res.send(JSON.stringify(req.body))
        try {
            const lease = await Lease.create(req.body)
            res.send(lease.toJSON())
        } catch (err) {
            res.status(500).send({
                error: 'Create lease incorrect'
            })
        }
    },
    // edit buy, suspend, active
    async put(req, res) {
        try {
            await Lease.update(req.body, {
                where: {
                    id: req.params.leaseId
                }
            })
            res.send(req.body)
        } catch (err) {
            req.status(500).send({
                error: 'Update lease incorrect'
            })
        }
    },

    async user (req, res) {
        try {
            let leases = null
            const userId = req.params.userId
            if (userId) {
                leases = await Lease.findAll({
                    where: {
                        $or: [
                            'userid'
                        ].map(key => ({
                            [key]: {
                                $like: `%${userId}%`,
                            }
                        })),
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                leases = await Lease.findAll({
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(leases)
        } catch (err) {
            req.status(500).send({
                error: 'The rent information was incorrect'
            })
        }
    },
}