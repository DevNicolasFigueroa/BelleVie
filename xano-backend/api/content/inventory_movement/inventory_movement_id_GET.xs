// Get inventory_movement record
query "inventory_movement/{inventory_movement_id}" verb=GET {
  api_group = "content"
  auth = "user"

  input {
    int inventory_movement_id? filters=min:1
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

    db.get inventory_movement {
      field_name = "id"
      field_value = $input.inventory_movement_id
    } as $inventory_movement
  
    precondition ($inventory_movement != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $inventory_movement
  guid = "ZMR2t3CdJxeyBYbnP5mFEGRnpSs"
}