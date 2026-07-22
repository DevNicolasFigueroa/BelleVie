// Get appointment record. Dueño o admin.
query "appointment/{appointment_id}" verb=GET {
  api_group = "content"
  auth = "user"

  input {
    int appointment_id? filters=min:1
  }

  stack {
    db.get appointment {
      field_name = "id"
      field_value = $input.appointment_id
      addon = [
        {
          name : "_treatment"
          input: {treatment_id: $output.treatment_id}
          as   : "_treatment"
        }
      ]
    } as $appointment

    precondition ($appointment != null) {
      error_type = "notfound"
      error = "Not Found."
    }

    db.get user {
      field_name = "id"
      field_value = $auth.id
    } as $me

    precondition ($appointment.client_id == $auth.id || ($me != null && $me.role == "admin")) {
      error_type = "accessdenied"
      error = "forbidden"
    }
  }

  response = $appointment
  guid = "bglg4rNCTAig8QuSOclfFNJrNr4"
}
