// Query appointment records. Admin: todas. Cliente: solo las suyas.
query appointment verb=GET {
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

    db.query appointment {
      where = $db.appointment.client_id ==? $scope
      return = {type: "list"}
      addon = [
        {
          name : "user"
          input: {user_id: $output.client_id}
          as   : "_user"
        }
      ]
    } as $appointment
  }

  response = $appointment
  guid = "7p44vsNLXP0L65aAJllTVTLsYec"
}
