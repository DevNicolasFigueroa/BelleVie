// Edit appointment record
query "appointment/{appointment_id}" verb=PATCH {
  api_group = "content"
  auth = "user"

  input {
    int appointment_id? filters=min:1
    dblink {
      table = "appointment"
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
  
    db.patch appointment {
      field_name = "id"
      field_value = $input.appointment_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $appointment
  }

  response = $appointment
  guid = "EquM8Ib2aWFkqogocAn8SVHgkdg"
}