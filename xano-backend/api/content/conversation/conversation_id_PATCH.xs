// Edit conversation record
query "conversation/{conversation_id}" verb=PATCH {
  api_group = "content"

  input {
    int conversation_id? filters=min:1
    dblink {
      table = "conversation"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch conversation {
      field_name = "id"
      field_value = $input.conversation_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $conversation
  }

  response = $conversation
  guid = "tNM8RUMG2ikk5IGKBYJyifaXZqs"
}