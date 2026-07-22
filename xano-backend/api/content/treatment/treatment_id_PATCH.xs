// Edit treatment record
query "treatment/{treatment_id}" verb=PATCH {
  api_group = "content"
  auth = "user"

  input {
    int treatment_id? filters=min:1
    dblink {
      table = "treatment"
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
  
    db.patch treatment {
      field_name = "id"
      field_value = $input.treatment_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $treatment
  }

  response = $treatment
  guid = "XPDCZa-Ub5a3LQcXFQhYJ2I1NMw"
}