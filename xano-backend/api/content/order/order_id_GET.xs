// Get order record. Dueño o admin.
query "order/{order_id}" verb=GET {
  api_group = "content"
  auth = "user"

  input {
    int order_id? filters=min:1
  }

  stack {
    db.get order {
      field_name = "id"
      field_value = $input.order_id
    } as $order

    precondition ($order != null) {
      error_type = "notfound"
      error = "Not Found."
    }

    db.get user {
      field_name = "id"
      field_value = $auth.id
    } as $me

    precondition ($order.client_id == $auth.id || ($me != null && $me.role == "admin")) {
      error_type = "accessdenied"
      error = "forbidden"
    }
  }

  response = $order
  guid = "Z97DtDaOGhi-74F6Gms1X6tgkF4"
}
