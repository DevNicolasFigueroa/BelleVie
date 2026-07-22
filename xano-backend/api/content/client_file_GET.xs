// Query all client_file records. Solo admin.
query client_file verb=GET {
  api_group = "content"
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

    db.query client_file {
      return = {type: "list"}
    } as $client_file
  }

  response = $client_file
  guid = "Xoieqp8QNiSiPnB8dMdY4cBjrE0"
}
