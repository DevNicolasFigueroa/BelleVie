// Endpoint interno para marcar una cita como pagada.
// Se utiliza después de procesar un pago exitoso en el proveedor externo.
// Respuesta exitosa genérica
query "internal/appointment/{id}/mark-paid" verb=POST {
  api_group = "content"

  input {
    // ID de la cita a marcar como pagada (desde la URL)
    int id
  
    // Monto pagado para validación
    decimal amount
  
    // ID de la orden de compra externa
    text buy_order
  
    // Código de autorización externo
    text authorization_code
  }

  stack {
    var $secret_entry {
      value = ($env.$http_headers|entries)|find:($$.key|to_lower) == "x-internal-secret"
    }
  
    precondition ($secret_entry != null && $secret_entry.value == $env.INTERNAL_SECRET) {
      error_type = "accessdenied"
      error = "forbidden"
    }
  
    // Obtener los detalles actuales de la cita
    db.get appointment {
      field_name = "id"
      field_value = $input.id
    } as $appointment
  
    // Validar que la cita existe
    precondition ($appointment != null) {
      error_type = "notfound"
      error = "appointment not found"
    }
  
    // Idempotencia: Si la cita ya está marcada como pagada, respondemos con éxito pero indicamos que ya estaba procesada
    conditional {
      if ($appointment.deposit_status == "paid") {
        return {
          value = {ok: true, already_paid: true}
        }
      }
    }
  
    // Validar que el monto pagado coincida con el abono esperado en la cita
    conditional {
      if ($input.amount != $appointment.deposit_amount) {
        return {
          value = {
            error   : "amount mismatch"
            expected: $appointment.deposit_amount
            received: $input.amount
          }
        }
      }
    }
  
    // Actualizar la cita: confirmar el estado y marcar el abono como pagado
    db.edit appointment {
      field_name = "id"
      field_value = $input.id
      data = {status: "confirmed", deposit_status: "paid"}
    } as $updated_appointment
  }

  response = {ok: true}
  guid = "F-KqhuY7txkDHu3PRhiUBRxjSTA"
}