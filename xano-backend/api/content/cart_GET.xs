// Query all cart records
query cart verb=GET {
  api_group = "content"
  auth = "user"

  input {
  }

  stack {
    db.query cart {
      where = $db.cart.client_id == $auth.id
      return = {type: "list"}
      join = {
        appointment: {
          table: "appointment"
          type : "left"
          where: $db.cart.appointment_id == $db.appointment.id
        }
        treatment: {
          table: "treatment"
          type : "left"
          where: $db.appointment.treatment_id == $db.treatment.id
        }
      }
      eval = {
        appointment_treatment_name: $db.treatment.name
        appointment_date          : $db.appointment.date
        appointment_time          : $db.appointment.time
      }
      addon = [
        {
          name : "_product"
          input: {product_id: $output.product_id}
          as   : "_product"
        }
      ]
    } as $cart
  }

  response = $cart
  guid = "AWNUF5NCng0zsBqtkFzasQoaOYA"
}