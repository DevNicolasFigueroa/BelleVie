// Query all treatment_option records
query treatment_option verb=GET {
  api_group = "content"

  input {
  }

  stack {
    db.query treatment_option {
      return = {type: "list"}
    } as $treatment_option
  }

  response = $treatment_option
  guid = "MrleeIqpTM6xRke7utQpO42JlJ8"
}