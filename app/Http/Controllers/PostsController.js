'use strict'

const Post = use('App/Model/Post')
const Validator = use('Validator')
const Antl = use('Antl')

class PostsController {
  * index (request, response) {
    const posts = yield Post.query().orderBy('id', 'desc').fetch()
    const isLoggedIn = yield request.auth.check()
    const langs = yield request.session.get('lang')

    yield response.sendView('home', { posts: posts.toJSON(),isLoggedIn: isLoggedIn,Antl: Antl ,langs: langs})
  }

  * create (request, response) {
    const isLoggedIn = yield request.auth.check()
    const langs = yield request.session.get('lang')
    yield response.sendView('posts/create',{isLoggedIn: isLoggedIn,langs: langs})
  }

  * store (request, response) {
    const postData = request.only('title', 'content') 
    const isLoggedIn = yield request.auth.check()
    const langs = yield request.session.get('lang')

    const rules = {
      title: 'required',
      content: 'required'
    }

    const validation = yield Validator.validate(postData, rules) 

    if (validation.fails()) {
      yield request
        .withOnly('title', 'content')
        .andWith({ errors: validation.messages() })
        .flash() 

      response.redirect('back',{isLoggedIn: isLoggedIn,langs: langs})
      return
    }

    yield Post.create(postData) 
    response.redirect('/',{isLoggedIn: isLoggedIn,langs: langs})
  }

  * show (request, response) {
    const isLoggedIn = yield request.auth.check()
    const post = yield Post.find(request.param('id'))
    const langs = yield request.session.get('lang')

    yield response.sendView('posts.show', { post: post.toJSON() ,isLoggedIn: isLoggedIn,langs: langs})
  }
}

module.exports = PostsController
