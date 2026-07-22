// Delete inventory_movement record.
query "inventory_movement/{inventory_movement_id}" verb=DELETE {
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

    db.del inventory_movement {
      field_name = "id"
      field_value = $input.inventory_movement_id
    }
  }

  response = null
  guid = "zhptZxEmF486Q1kL_Gg5bFPDW8E"
}