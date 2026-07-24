// Lista usuarios. Solo admin.
query user verb=GET {
  api_group = "Authentication"
  auth = "user"

  input {
  }

  stack {
    db.get user {
      field_name = "id"
      field_value = $auth.id
    } as $me

    precondition ($me != null && $me.role == "admin") {
      error_type = "accessdenied"
      error = "forbidden"
    }

    db.query user {
      return = {type: "list"}
    } as $model
  }

  response = $model
  guid = "TSTI967AluhEAP66KjHO3A7qOiw"
}
