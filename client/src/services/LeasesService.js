import Api from '@/services/Api'

export default {
    index(search) {
        return Api().get('leases', {
            params: {
                search: search
            }
        })
    },

    post(lease) {
        return Api().post('lease', lease)
    },
    put(lease) {
        return Api().put('lease/' + lease.id, lease)
    },
    user(lease) {
        return Api().get('lease/'+ lease)
    }
}