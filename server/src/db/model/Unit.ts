import { Model, Sequelize, DataTypes } from "sequelize"

interface UnitAttributes {
  id: number
  name: string
}

type UnitCreationAttributes = Omit<UnitAttributes, "id">

class Unit extends Model<UnitAttributes, UnitCreationAttributes> {
  declare id: number
  declare name: string
}

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
        unique: true,
      },
    },
    { sequelize, modelName: "unit" },
  )

  return Unit
}
