/**
 * Represents a task.
 */
class Task {
  /**
   * @constructor
   * @param {string} name - The name of the task (task names must be unique).
   * @param {string} type - The type of work involved (ie: Study, Programming, Graphics, etc.).
   * @param {number} time - The estimated duration in minutes.
   */
  constructor(name, type, time) {
    this.name = name
    this.type = type
    this.time = time
  }

  /**
   * Returns the task as a vanilla js object.
   *
   * @returns {Object} The vanilla js object representation of this task.
   */
  data() {
    return {
      name: this.name,
      type: this.type,
      time: this.time,
    }
  }
}

/**
 * Represents a requirement. Requirement can be nested but the end requirement must always be a task.
 */
class Requirement {
  constructor() {
    this.list = []
  }

  /**
   * Add a requirement or a task to this requirement.
   *
   * @param {(Requirement|Task)} requirement The requirement to add.
   * @param {number} number The amount of times this requirement needs to be done.
   */
  add(requirement, number) {
    this.list.push({ req: requirement.data(), nb: number })
  }

  /**
   * Returns the requirement as a vanilla js object.
   *
   * @returns {Object} The vanilla js object representation of this requirement.
   */
  data() {
    if (this.list.length == 0) {
      console.warn('Fatal Error : This requirement is empty.')
      process.exit()
    }
    return this.list
  }
}

/**
 * Formats a number of minutes into a "XXhYYm" string.
 *
 * @param {number} minutes An amount of minutes.
 * @returns {string} A "XXhYYm" string.
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60)
  minutes -= hours * 60
  minutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  return hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`
}

/**
 * Recursive function that flattens a nested tree of requirements into a list of tasks.
 *
 * @param {(Array<Requirement>|Task)} requirements The nested tree of requirements.
 * @returns {Array} Returns the list of tasks with their appropriate amount.
 */
function flattenRequirement(requirements) {
  // if requirements is a task
  if (!Array.isArray(requirements)) {
    const task = requirements
    const taskList = [
      {
        ...task,
        nb: 1,
      },
    ]
    return taskList
  } else {
    // we have to merge the nested requirements into a flat list of tasks
    // for depth : we multiply the children's nb by the parents
    // for breadth : we make a sum of the neighbor's nb

    // depth merge

    const tasksList = requirements.map(req => {
      const childTaskList = flattenRequirement(req.req)
      const depthMergeList = childTaskList.map(task => {
        task.nb *= req.nb
        return task
      })
      return depthMergeList
    })
    // tasksList is a list of merged task lists, we need to flatten it
    const taskList = tasksList.reduce((acc, val) => acc.concat(val), [])

    // breadth merge

    // getting the list of task names without duplicates
    let nameList = [...new Set(taskList.map(task => task.name))]

    const mergedTaskList = nameList.map(name => {
      const nameOccurences = taskList.filter(task => task.name == name)
      if (nameOccurences.length == 1) {
        return nameOccurences[0]
      } else {
        const task = nameOccurences[0]
        task.nb = nameOccurences.reduce((acc, curr) => acc + curr.nb, 0)
        return task
      }
    })
    return mergedTaskList
  }
}

/**
 * Computes stats from a flattened task list.
 *
 * @param {Array} taskList A flattened task list.
 * @returns {Object} An object containing the stats.
 */
function getStatsFromTasks(taskList) {
  const totalTime = taskList.reduce((acc, curr) => acc + curr.time * curr.nb, 0)

  const getPercent = nb => Math.round((nb / totalTime) * 100)

  const taskStats = taskList.map(task => {
    const totalTime = task.time * task.nb
    return {
      ...task,
      totalTime: formatTime(totalTime),
      percent: getPercent(totalTime),
    }
  })

  // getting the list of task types without duplicates
  let typeList = [...new Set(taskList.map(task => task.type))]

  const typeStats = typeList.map(type => {
    const typeOccurences = taskList.filter(task => task.type == type)
    const time = typeOccurences.reduce(
      (acc, curr) => acc + curr.time * curr.nb,
      0,
    )
    return {
      type,
      time: formatTime(time),
      percent: getPercent(time),
    }
  })

  const sortByPercent = (a, b) => a.percent > b.percent
  taskStats.sort(sortByPercent)
  typeStats.sort(sortByPercent)

  return {
    totalTime: formatTime(totalTime),
    taskStats,
    typeStats,
  }
}

/**
 * Computes stats from a nested tree of requirements.
 *
 * @param {(Requirement|Task)} requirements A nested tree of requirements.
 * @returns {Object} An object containing the stats.
 */
function getProjectStats(requirements) {
  const taskList = flattenRequirement(requirements.data())
  return getStatsFromTasks(taskList)
}

module.exports = { Task, Requirement, getProjectStats }
