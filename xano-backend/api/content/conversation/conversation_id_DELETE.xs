// Delete conversation record.
query "conversation/{conversation_id}" verb=DELETE {
  api_group = "content"

  input {
    int conversation_id? filters=min:1
  }

  stack {
    db.del conversation {
      field_name = "id"
      field_value = $input.conversation_id
    }
  }

  response = null
  guid = "UnYpGhfEcbkdqqP96mCTku8A1ik"
}