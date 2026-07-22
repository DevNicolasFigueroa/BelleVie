// Edit treatment_option record
query "treatment_option/{treatment_option_id}" verb=PATCH {
  api_group = "content"
  auth = "user"

  input {
    int treatment_option_id? filters=min:1
    dblink {
      table = "treatment_option"
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
  
    db.patch treatment_option {
      field_name = "id"
      field_value = $input.treatment_option_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $treatment_option
  }

  response = $treatment_option
  guid = "E3GfVbYKqf6BaZx5ZZoH0Q8oftI"
}