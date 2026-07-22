// Query all inventory_movement records
query inventory_movement verb=GET {
  api_group = "content"
  auth = "user"

  input {
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

    db.query inventory_movement {
      return = {type: "list"}
    } as $inventory_movement
  }

  response = $inventory_movement
  guid = "6oTw6EotJ4LvfjkqjqQ7o9r3Ii4"
}