'use strict';
module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define('Event', {
        id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		location: DataTypes.STRING,
		date: DataTypes.STRING,
		status: DataTypes.INTEGER,
	});
    return Event;
};