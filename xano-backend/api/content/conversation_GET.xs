// Query all conversation records
query conversation verb=GET {
  api_group = "content"
  auth = "user"

  input {
  }

  stack {
    db.query conversation {
      return = {type: "list"}
    } as $conversation
  }

  response = $conversation
  guid = "3S0Js4HmzFjOVyFwhcKDQfN7kts"
}