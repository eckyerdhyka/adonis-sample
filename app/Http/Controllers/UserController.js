'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')

class UserController {

  * login (request, response) {
    yield response.sendView('auth/login')
  }

  * signup (request, response) {
    yield response.sendView('auth/signup')
  }

  * login_proses (request, response) {
    const email = request.input('email')
    const password = request.input('password')

    const postData = request.only('email', 'password')
    const rules = {
      email: 'required',
      password: 'required'
    }

    const validation = yield Validator.validate(postData, rules) 

    if (validation.fails()) {
      yield request
        .withOnly('email', 'password')
        .andWith({ errors: validation.messages() })
        .flash() 

      response.redirect('back')
      return
    }

    try {
      yield request.auth.attempt(email, password)
      response.redirect('/')
    } catch (e) {
      yield request.with({error: e.message}).flash()
      response.redirect('back')
    }

  }

  * signup_proses (request, response) {
    const email = request.input('email')
    const password = request.input('password')
    const username = request.input('username')

    const postData = request.only('email', 'password','username')
    const rules = {
      email: 'required|unique:users',
      password: 'required',
      username: 'required|unique:users'
    }

    const validation = yield Validator.validate(postData, rules) 

    if (validation.fails()) {
      yield request
        .withOnly('email', 'password','username')
        .andWith({ errors: validation.messages() })
        .flash() 

      response.redirect('back')
      return
    }

    try {
      yield User.create(postData)
      yield request.auth.attempt(email, password)
      response.redirect('/')
    } catch (e) {
      yield request.with({error: e.message}).flash()
      response.redirect('back')
    }

  }

  * profile (request, response) {
    const user = yield request.auth.getUser()
    if (user) {
      response.ok(user)
      return
    }
    response.unauthorized('You must login to view your profile')
  }

  * logout (request, response) {
    yield request.auth.logout()
    response.redirect('/')
  }

  * _generateToken(request, user) {
    return yield request.auth.generate(user);
  }
}

module.exports = UserController