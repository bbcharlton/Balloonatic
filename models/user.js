module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		username: DataTypes.STRING,
		password: DataTypes.STRING,
	});
    return User;
};