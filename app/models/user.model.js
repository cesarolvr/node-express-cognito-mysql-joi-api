import bcrypt from "bcrypt";

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
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
          const hash = bcrypt.hashSync(value, 8);
          this.setDataValue("password", hash);
        },
        // get() {
        //   const storedPassword = this.getDataValue("password");
        //   return bcrypt.compareSync(storedPassword, this.password);
        // },
      },
    },
    {
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
      instanceMethods: {
        validPassword: function (password) {
          return bcrypt.compareSync(password, this.password);
        },
      },
    }
  );

  return UserObject;
};
