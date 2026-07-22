// Get treatment_option record
query "treatment_option/{treatment_option_id}" verb=GET {
  api_group = "content"

  input {
    int treatment_option_id? filters=min:1
  }

  stack {
    db.get treatment_option {
      field_name = "id"
      field_value = $input.treatment_option_id
    } as $treatment_option
  
    precondition ($treatment_option != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $treatment_option
  guid = "4pVLL2oToP3uBiAtZY6Qiek8g7k"
}