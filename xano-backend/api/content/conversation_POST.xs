// Add conversation record
query conversation verb=POST {
  api_group = "content"

  input {
    dblink {
      table = "conversation"
    }
  }

  stack {
    db.add conversation {
      enforce_hidden_fields = false
      data = {created_at: "now"}
    } as $conversation
  }

  response = $conversation
  guid = "KeKLijdm72wHxDKGKnIbNnbKKWY"
}