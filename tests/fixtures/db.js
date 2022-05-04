const jwt =require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'userOne',
  email: 'userOne@example.com',
  password: 'MyPass123',
  tokens: [{
    token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
  }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'userTwo',
  email: 'userTwo@example.com',
  password: 'Pass!!123',
  tokens: [{
    token: jwt.sign({ _id: userTwoId}, process.env.JWT_SECRET)
  }]
}

const taskOne = {
  _id: new mongoose.Types.ObjectId,
  description: 'First Task',
  sompleted: false,
  owner: userOne._id
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId,
  description: 'Second Task',
  sompleted: true,
  owner: userOne._id
}

const taskThree = {
  _id: new mongoose.Types.ObjectId,
  description: 'Third Task',
  sompleted: true,
  owner: userTwo._id
}

const populateDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

module.exports = {
  populateDatabase,
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree
}