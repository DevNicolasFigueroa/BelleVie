// Get client_file record. Solo admin.
query "client_file/{client_file_id}" verb=GET {
  api_group = "content"
  auth = "user"

  input {
    int client_file_id? filters=min:1
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

    db.get client_file {
      field_name = "id"
      field_value = $input.client_file_id
    } as $client_file

    precondition ($client_file != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $client_file
  guid = "z28vojuyLgntcg6ZsY1o6BOWtWk"
}
