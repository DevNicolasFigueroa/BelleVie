// Get treatment record
query "treatment/{treatment_id}" verb=GET {
  api_group = "content"

  input {
    int treatment_id? filters=min:1
  }

  stack {
    db.get treatment {
      field_name = "id"
      field_value = $input.treatment_id
    } as $treatment
  
    precondition ($treatment != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $treatment
  guid = "8RfXvpzFFZ6tAE4zPZwteGO6UVM"
}