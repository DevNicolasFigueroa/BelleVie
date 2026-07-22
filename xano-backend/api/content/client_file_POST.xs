// Add client_file record
query client_file verb=POST {
  api_group = "content"
  auth = "user"

  input {
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

    db.add client_file {
      enforce_hidden_fields = false
      data = {created_at: "now"}
    } as $client_file
  }

  response = $client_file
  guid = "scLTEOnA7IM1nfCfQd4dYXbKKWc"
}