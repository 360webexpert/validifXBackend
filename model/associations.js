const defineAssociations = (db) => {
    const {user,document} = db
    user.hasMany(document,{foreignKey:"userId"})
    document.belongsTo(user,{foreignKey:"userId"})
}
module.exports = defineAssociations;