// Edit client_file record
query "client_file/{client_file_id}" verb=PATCH {
  api_group = "content"
  auth = "user"

  input {
    int client_file_id? filters=min:1
    dblink {
      table = "client_file"
    }
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

    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch client_file {
      field_name = "id"
      field_value = $input.client_file_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $client_file
  }

  response = $client_file
  guid = "ma6MM8V83u6ifJAmEb4Cms7aJIg"
}