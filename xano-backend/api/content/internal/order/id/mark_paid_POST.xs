query "internal/order/{id}/mark-paid" verb=POST {
  api_group = "content"

  input {
    int id
    decimal amount
    text buy_order
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
  
    // Obtener la orden
    db.get order {
      field_name = "id"
      field_value = $input.id
    } as $order
  
    precondition ($order != null) {
      error_type = "notfound"
      error = "order not found"
    }
  
    // Idempotencia: Verificar si ya está pagada
    conditional {
      if ($order.payment_status == "paid") {
        return {
          value = {ok: true, already_paid: true}
        }
      }
    }
  
    // Validar monto
    conditional {
      if ($input.amount != $order.total) {
        db.edit order {
          field_name = "id"
          field_value = $input.id
          data = {payment_status: "failed"}
        }
      
        return {
          value = {
            error   : "amount mismatch"
            expected: $order.total
            received: $input.amount
          }
        }
      }
    }
  
    // Marcar como pagada
    db.edit order {
      field_name = "id"
      field_value = $input.id
      data = {payment_status: "paid"}
    }

    // Procesar cada item: descontar stock para productos, confirmar la cita
    // y su abono para depósitos de tratamiento
    foreach ($order.items) {
      each as $item {
        conditional {
          if ($item.item_type == "product") {
            db.get product {
              field_name = "id"
              field_value = $item.product_id
            } as $product

            conditional {
              if ($product != null) {
                db.edit product {
                  field_name = "id"
                  field_value = $product.id
                  data = {stock: $product.stock - $item.quantity}
                }

                db.add inventory_movement {
                  data = {
                    product_id: $product.id
                    type      : "out"
                    quantity  : $item.quantity
                    date      : now
                    reason    : "venta " ~ $input.buy_order
                  }
                }
              }
            }
          }
          elseif ($item.item_type == "appointment_deposit") {
            db.get appointment {
              field_name = "id"
              field_value = $item.appointment_id
            } as $appointment

            conditional {
              if ($appointment != null) {
                db.edit appointment {
                  field_name = "id"
                  field_value = $appointment.id
                  data = {status: "confirmed", deposit_status: "paid"}
                }
              }
            }
          }
        }
      }
    }

    // Vaciar el carrito completo del cliente: esta orden cubre todo lo que
    // tenía adentro (productos y depósitos de citas)
    db.bulk.delete cart {
      where = $db.cart.client_id == $order.client_id
    }
  }

  response = {ok: true}
  guid = "3sQNBBa06XSCQkmugJx_zid39KA"
}