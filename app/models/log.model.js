export default (sequelize, Sequelize, DataTypes) => {
  const LogObject = sequelize.define(
    "Log",
    {
      id: {
        type: DataTypes.STRING,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      quality: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return LogObject;
};
