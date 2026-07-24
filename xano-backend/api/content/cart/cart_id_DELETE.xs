// Delete cart record. Solo el dueño del ítem.
query "cart/{cart_id}" verb=DELETE {
  api_group = "content"
  auth = "user"

  input {
    int cart_id? filters=min:1
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

    db.del cart {
      field_name = "id"
      field_value = $input.cart_id
    }
  }

  response = null
  guid = "6JGPVg-5iXmo2VhzbZNQ_Vo4gtw"
}
