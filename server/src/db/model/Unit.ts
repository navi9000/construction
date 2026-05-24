import { Model, Sequelize, DataTypes } from "sequelize"

interface UnitAttributes {
  id: number
  name: string
}

type UnitCreationAttributes = Omit<UnitAttributes, "id">

class Unit extends Model<UnitAttributes, UnitCreationAttributes> {}

export default function initUnit(sequelize: Sequelize) {
  Unit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "unit" },
  )

  return Unit
}
