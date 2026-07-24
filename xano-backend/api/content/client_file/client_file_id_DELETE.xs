// Delete client_file record.
query "client_file/{client_file_id}" verb=DELETE {
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

    db.del client_file {
      field_name = "id"
      field_value = $input.client_file_id
    }
  }

  response = null
  guid = "3nqe89ZnoUpMFYhnA9uYSY3ehsw"
}