module.exports = (sequelize, DataTypes) => {
    const Lease = sequelize.define('Lease', {
        rentid: DataTypes.STRING,
        userid: DataTypes.STRING,
        email: DataTypes.STRING,
        qty: DataTypes.STRING,
        prices: DataTypes.STRING,
        clientstatus: DataTypes.STRING,
        homeowner_status: DataTypes.STRING,
        renttitle: DataTypes.STRING,
        username: DataTypes.STRING,
        userlastname: DataTypes.STRING,
    })
    return Lease
}