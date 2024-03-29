

export default (sequelize, Sequelize, DataTypes) => {
  const UserObject = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.STRING,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return UserObject;
};
