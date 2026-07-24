// Delete treatment record.
query "treatment/{treatment_id}" verb=DELETE {
  api_group = "content"
  auth = "user"

  input {
    int treatment_id? filters=min:1
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

    db.del treatment {
      field_name = "id"
      field_value = $input.treatment_id
    }
  }

  response = null
  guid = "RBRn4OHvRQ_GASXkmbdKAg5LpIs"
}