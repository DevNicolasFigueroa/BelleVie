// Edit cart record. Solo el dueño del ítem.
query "cart/{cart_id}" verb=PATCH {
  api_group = "content"
  auth = "user"

  input {
    int cart_id? filters=min:1
    dblink {
      table = "cart"
    }
  }

  stack {
    db.get cart {
      field_name = "id"
      field_value = $input.cart_id
    } as $existing

    precondition ($existing != null) {
      error_type = "notfound"
      error = "Not Found."
    }

    precondition ($existing.client_id == $auth.id) {
      error_type = "accessdenied"
      error = "forbidden"
    }

    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input

    db.patch cart {
      field_name = "id"
      field_value = $input.cart_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $cart
  }

  response = $cart
  guid = "VIhpW49d4ZiI1yvaqT-WROr5PHA"
}
