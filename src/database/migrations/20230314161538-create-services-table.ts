import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("services", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      serviceNumber: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      ipAddress: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      addressId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "servicesaddresses",
          key: "id",
        },
      },
      statusId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "statuses",
          key: "id",
        },
      },
      establishmentId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "establishments",
          key: "id",
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable("services"),
};
