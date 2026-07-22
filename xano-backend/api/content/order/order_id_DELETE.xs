// Delete order record.
query "order/{order_id}" verb=DELETE {
  api_group = "content"
  auth = "user"

  input {
    int order_id? filters=min:1
  }

  stack {
    db.get user {
      field_name = "id"
      field_value = $auth.id
    } as $me

    precondition ($me != null && $me.role == "admin") {
      error_type = "accessdenied"
      error = "forbidden"
    }

    db.del order {
      field_name = "id"
      field_value = $input.order_id
    }
  }

  response = null
  guid = "4kSy9JX1zdJ1dPWUlKi7hy9DKG0"
}