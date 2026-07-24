// Delete treatment_option record.
query "treatment_option/{treatment_option_id}" verb=DELETE {
  api_group = "content"
  auth = "user"

  input {
    int treatment_option_id? filters=min:1
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

    db.del treatment_option {
      field_name = "id"
      field_value = $input.treatment_option_id
    }
  }

  response = null
  guid = "FRhJWgdN_Q6egsgZ0oqXG3sCVXs"
}