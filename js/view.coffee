class View
  render: () ->
    "hello world"

class Controller
  constructor: () ->
    @beacon = new Beacon()

class Source
  constructor: () ->
    # pass

  update: (callback) ->
    # pass

class Item
  contructor: (@data) ->
    # already bound data.

  render: (callback) ->
    # run the callback when you are done.

