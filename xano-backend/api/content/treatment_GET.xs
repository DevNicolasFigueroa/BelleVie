// Query all treatment records
query treatment verb=GET {
  api_group = "content"

  input {
  }

  stack {
    db.query treatment {
      return = {type: "list"}
    } as $treatment
  }

  response = $treatment
  guid = "aZDNgqbI7VkBA_TaEzZZMiOX54k"
}