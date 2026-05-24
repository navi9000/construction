import { Model, Sequelize, DataTypes } from "sequelize"

interface JobAttributes {
  id: number
  name: string
}

type JobCreationAttributes = Omit<JobAttributes, "id">

class Job extends Model<JobAttributes, JobCreationAttributes> {}

export default function initJob(sequelize: Sequelize) {
  Job.init(
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
    { sequelize, modelName: "job" },
  )

  return Job
}
