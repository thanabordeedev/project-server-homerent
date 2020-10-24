module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
    title: DataTypes.STRING,
    bookingprice: DataTypes.STRING,
    depositprice: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    pictures: DataTypes.STRING,
    content: DataTypes.TEXT,
    category: DataTypes.STRING,
    status: DataTypes.STRING,
    })
    
    return Booking
   }