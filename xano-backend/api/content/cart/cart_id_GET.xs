// Get cart record. Solo el dueño del ítem.
query "cart/{cart_id}" verb=GET {
  api_group = "content"
  auth = "user"

  input {
    int cart_id? filters=min:1
  }

  stack {
    db.get cart {
      field_name = "id"
      field_value = $input.cart_id
    } as $cart

    precondition ($cart != null) {
      error_type = "notfound"
      error = "Not Found."
    }

    precondition ($cart.client_id == $auth.id) {
      error_type = "accessdenied"
      error = "forbidden"
    }
  }

  response = $cart
  guid = "SGyPd9Vg4tb0aNRATAGD-enKyr4"
}
