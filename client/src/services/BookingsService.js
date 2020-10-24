import Api from '@/services/Api'

export default {
    
    index(search) {
        return Api().get('bookings', {
            params: {
                search: search
            }
        })
    },
    frontIndex(search) {
        return Api().get('bookings/front', {
            params: {
                search: search
            }
        })
    },
    show (bookingId) {
        return Api().get('booking/'+bookingId)
    },
    post (booking) {
        return Api().post('booking',booking)
    },
    put (booking) {
        return Api().put('booking/'+booking.id, booking)
    },
    delete (booking) {
        return Api().delete('booking/'+booking.id, booking)
    },
    
}