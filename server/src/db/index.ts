import sequelize from "./sequelize"
import initUnit from "./model/Unit"
import initJob from "./model/Job"
import initEntry from "./model/Entry"

const Unit = initUnit(sequelize)
const Job = initJob(sequelize)
const Entry = initEntry(sequelize)

Job.belongsToMany(Unit, { through: "Job_Unit" })
Unit.belongsToMany(Job, { through: "Job_Unit" })

Job.hasMany(Entry, { foreignKey: "job_id" })
Entry.belongsTo(Job, { foreignKey: "id" })

Unit.hasMany(Entry, { foreignKey: "unit_id" })
Entry.belongsTo(Unit, { foreignKey: "id" })

export { sequelize, Unit, Job, Entry }
