// Add treatment_option record
query treatment_option verb=POST {
  api_group = "content"
  auth = "user"

  input {
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

    db.add treatment_option {
      enforce_hidden_fields = false
      data = {created_at: "now"}
    } as $treatment_option
  }

  response = $treatment_option
  guid = "NInY48FF_52gYW5TZY3TpoKUlbw"
}