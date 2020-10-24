import Api from '@/services/Api'

export default {
    index(search) {
        return Api().get('rents', {
            params: {
                search: search
            }
        })
    },
    frontIndex(search) {
        return Api().get('rents/front', {
            params: {
                search: search
            }
        })
    },
    show(rentId) {
        return Api().get('rent/' + rentId)
    },
    post(rent) {
        return Api().post('rent', rent)
    },
    put(rent) {
        return Api().put('rent/' + rent.id, rent)
    },
    delete(rent) {
        return Api().delete('rent/' + rent.id, rent)
    },
}