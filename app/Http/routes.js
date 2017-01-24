'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')
const Antl = use('Antl')

Route.get('/', 'PostsController.index')
Route.get('/about', function * (request, response) {
  const isLoggedIn = yield request.auth.check()
  const langs = yield request.session.get('lang')

  yield response.sendView('about',{isLoggedIn: isLoggedIn,Antl: Antl ,langs: langs})
})
Route.get('/contact', function * (request, response) {
  const isLoggedIn = yield request.auth.check()
  const langs = yield request.session.get('lang')
  yield response.sendView('contact',{isLoggedIn: isLoggedIn,Antl: Antl ,langs: langs})
})

// blog
Route.get('posts/create', 'PostsController.create').middleware('auth')
Route.post('posts', 'PostsController.store')
Route.get('posts/:id', 'PostsController.show')

// user
Route.get('/profile', 'UserController.profile')
Route.get('/login', 'UserController.login')
Route.get('/logout', 'UserController.logout')
Route.get('/signup', 'UserController.signup')
Route.post('/login-proses', 'UserController.login_proses')
Route.post('/signup-proses', 'UserController.signup_proses')

// Session
Route.get('/session', 'SessionController.index')