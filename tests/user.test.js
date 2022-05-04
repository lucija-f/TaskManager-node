const request = require('supertest')
const path = require('path')
const app = require('../src/app')
const User = require('../src/models/user')
const { populateDatabase, userOne, userOneId } = require('./fixtures/db')

beforeEach(populateDatabase)

test('Shoul signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'lucija',
    email: 'luc@example.com',
    password: 'MyPass123'
  }).expect(201)

  // Assert that database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'lucija',
      email: 'luc@example.com',
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe('MyPass123')
})

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
  await request(app).post('/users/login')
                    .send({
                      email: 'iva',
                      password: 'iva@example.com'
                    }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app).get('/users/me')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200)
})

test('Should not get profile for unautheticated user', async () => {
  await request(app).get('/users/me')
                    .send()
                    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app).delete('/users/me')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200)
  
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unautheticated user', async () => {
  await request(app).delete('/users/me')
                    .send()
                    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app).post('/users/me/avatar')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .field('file', 'avatar')
                    .attach('avatar', path.resolve(__dirname, "fixtures/a.jpg"))
                    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))

})

test('Should update valid user field', async () => {
  await request(app).patch('/users/me')
              .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
              .send({
                name: 'Jess'
              })
              .expect(200)
  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields', async () => {
  await request(app).patch('/users/me')
              .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
              .send({
                location: 'NY'
              })
              .expect(400)
})

