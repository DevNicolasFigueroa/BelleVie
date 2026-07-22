// Add treatment record
query treatment verb=POST {
  api_group = "content"
  auth = "user"

  input {
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

    db.add treatment {
      enforce_hidden_fields = false
      data = {created_at: "now"}
    } as $treatment
  }

  response = $treatment
  guid = "emyOKqUcqe8CBYE0KJMWb0fVAg0"
}