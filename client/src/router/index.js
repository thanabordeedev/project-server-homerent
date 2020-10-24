import Vue from 'vue'
import Router from 'vue-router'
// Users
import UserIndex from '@/components/Users/Index'
import UserCreate from '@/components/Users/CreateUser'

import UserEdit from '@/components/Users/EditUser'
import UserShow from '@/components/Users/ShowUser'

// Authen
import Login from '@/components/Login'

//Booking
import BookingIndex from '@/components/Booking/Index'
import BookingCreate from '@/components/Booking/CreateBooking'
import BookingEdit from '@/components/Booking/EditBooking'
import BookingShow from '@/components/Booking/ShowBooking'

// Rents
import RentIndex from '@/components/Rent/Index'
import RentCreate from '@/components/Rent/CreateRent'
import RentEdit from '@/components/Rent/EditRent'
import RentShow from '@/components/Rent/ShowRent'

//comment
import CommentIndex from '@/components/Comments/Index'
import CommentShow from '@/components/Comments/ShowComment'
import CommentCreate from '@/components/Comments/CreateComment'

//front booking show
import BookingRead from '@/components/Fronts/ReadBooking'


// Upload Testing
import Upload from '@/components/Utils/Upload'

// Front
import FrontIndex from '@/components/Fronts/Index'
import FrontRent from '@/components/Fronts/Rent'
import FrontRentShow from '@/components/Fronts/ShowRent'

//cartlist
import FrontCartList from '@/components/Fronts/CartList'
import BackCartList from '@/components/Rent/CartList'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/users',
      name: 'users',
      component: UserIndex
    },
    {
      path: '/user/create',
      name: 'users-create',
      component: UserCreate
    },
    {
      path: '/user/edit/:userId',
      name: 'user-edit',
      component: UserEdit
    },
    {
      path: '/user/:userId',
      name: 'user',
      component: UserShow
    },
    // authen
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    //booking
    {
      path: '/bookings',
      name: 'bookings',
      component: BookingIndex
    },
    {
      path: '/booking/create',
      name: 'bookings-edit',
      component: BookingCreate
    },
    {
      path: '/booking/edit/:bookingId',
      name: 'booking-edit',
      component: BookingEdit
    },
    {
      path: '/booking/:bookingId',
      name: 'booking',
      component: BookingShow
    },
    //bookingshow front
    {
      path: '/front/booking/:bookingId',
      name: 'front-booking',
      component: BookingShow
    },
    {
      path: '/front/read/:bookingId',
      name: 'front-read',
      component: BookingRead
    },
    //comment
    {
      path: '/comments',
      name: 'comments',
      component: CommentIndex
    },
    {
      path: '/comment/create',
      name: 'comments-edit',
      component: CommentCreate
    },
    {
      path: '/comment/:commentId',
      name: 'comment',
      component: CommentShow
    },
    // upload testing
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    // Front
    {
      path: '/front',
      name: 'front',
      component: FrontIndex
    },

    // Front rent
    {
      path: '/front-rents',
      name: 'front-rents',
      component: FrontRent
    },
    //FrontCartList
    //cartlist
    {
      path: '/front-cartlist',
      name: 'cartlist',
      component: FrontCartList
    },

    //back cartlist
    {
      path: '/cartlist',
      name: 'Cartlist',
      component: BackCartList
    },

    
    // rent
    {
      path: '/rents',
      name: 'rents',
      component: RentIndex
    },
    {
      path: '/rent/create',
      name: 'rents-edit',
      component: RentCreate
    },
    {
      path: '/rent/edit/:rentId',
      name: 'rent-edit',
      component: RentEdit
    },
    {
      path: '/rent/:rentId',
      name: 'rent',
      component: RentShow
    },
    //front rent show
    {
      path: '/front/rent/:rentId',
      name: 'front-rent',
      component: FrontRentShow
    },

  ]
})