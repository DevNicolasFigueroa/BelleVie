// Query order records. Admin: todas. Cliente: solo las suyas.
query order verb=GET {
  api_group = "content"
  auth = "user"

  input {
  }

  stack {
    db.get user {
      field_name = "id"
      field_value = $auth.id
    } as $me

    var $scope {
      value = $auth.id
    }

    conditional {
      if ($me != null && $me.role == "admin") {
        var.update $scope {
          value = null
        }
      }
    }

    db.query order {
      where = $db.order.client_id ==? $scope
      return = {type: "list"}
      output = [
        "id"
        "created_at"
        "client_id"
        "type"
        "items"
        "total"
        "payment_status"
      ]
    } as $order
  }

  response = $order
  guid = "CYifZHB4YUc3OwGjKuX-9WbJcbA"
}
