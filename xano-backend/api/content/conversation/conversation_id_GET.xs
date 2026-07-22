// Get conversation record
query "conversation/{conversation_id}" verb=GET {
  api_group = "content"

  input {
    int conversation_id? filters=min:1
  }

  stack {
    db.get conversation {
      field_name = "id"
      field_value = $input.conversation_id
    } as $conversation
  
    precondition ($conversation != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $conversation
  guid = "twjiaFEBhVQRnKj36DLKpS135CY"
}