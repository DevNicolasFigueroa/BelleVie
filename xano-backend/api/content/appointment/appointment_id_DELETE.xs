// Delete appointment record.
query "appointment/{appointment_id}" verb=DELETE {
  api_group = "content"
  auth = "user"

  input {
    int appointment_id? filters=min:1
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

    db.del appointment {
      field_name = "id"
      field_value = $input.appointment_id
    }
  }

  response = null
  guid = "1HKOgTvmkQWDUy2Bvvrrca07XJo"
}