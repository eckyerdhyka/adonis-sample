'use strict'

class SessionController {
  * index (request, response) {
    const langs = request.input('lang')

    yield request.session.put('lang', langs)

    response.json({
      status:true
    })
  }
}

module.exports = SessionController