import { Model, Sequelize, DataTypes } from "sequelize"

interface EntryAttributes {
  id: number
  date: string
  amount: number
  unit_id: number
  job_id: number
  worker_name: string
}

type EntryCreationAttributes = Omit<EntryAttributes, "id">

class Entry extends Model<EntryAttributes, EntryCreationAttributes> {}

export default function initEntry(sequelize: Sequelize) {
  Entry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      worker_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "entry" },
  )

  return Entry
}
