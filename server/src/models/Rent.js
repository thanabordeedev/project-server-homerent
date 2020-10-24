module.exports = (sequelize, DataTypes) => {
    const Rent = sequelize.define('Rent', {
    title: DataTypes.STRING,
    rentprice: DataTypes.STRING,
    depositprice: DataTypes.STRING,
    bedroom: DataTypes.STRING,
    toiletroom: DataTypes.STRING,
    
    address:DataTypes.STRING,
    landsize:DataTypes.STRING,
    inhomesize:DataTypes.STRING,

    thumbnail: DataTypes.STRING,
    pictures: DataTypes.STRING,
    content: DataTypes.TEXT,
    category: DataTypes.STRING,
    status: DataTypes.STRING,
    })
    
    return Rent
}