'user strict';

var api = require('./db.js');

const getUsers = (request, response) => {
  api.queryNoValues('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      response.status(501).json({"error": error.message})
      return
    }
    var users = results.rows.map(u => ({"Id": u.id, "UserName" : u.username, "Age": u.age, "Gender": u.gender, "Job": u.job }))
    response.status(200).json(users)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  api.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(501).json({"error": error.message})
      return
    }
    var user = {}
    var users = results.rows.map(u => ({"Id": u.id, "UserName" : u.username, "Age": u.age, "Gender": u.gender, "Job": u.job }))
    if (users.length > 0) {
      user = users[0]
    }
    response.status(200).json(user)
  })
}

const createUser = (request, response) => {
  const { UserName, Job, Age, Gender } = request.body

  api.query('INSERT INTO users (username, job, age, gender) VALUES ($1, $2, $3, $4)', [UserName, Job, Age, Gender], (error, results) => {
    if (error) {
      response.status(501).json({"error": error.message})
      return
    }
    response.status(201).send(`User added`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { UserName, Job, Age, Gender } = request.body

  api.query(
    'UPDATE users SET username = $1, job = $2, age = $3, gender = $4 WHERE id = $5',
    [UserName, Job, Age, Gender, id],
    (error, results) => {
      if (error) {
        response.status(501).json({"error": error.message})
        return
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  api.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(501).json({"error": error.message})
      return
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
