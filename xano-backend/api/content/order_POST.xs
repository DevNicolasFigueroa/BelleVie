// Add order record. Fuerza client_id server-side y calcula el total desde
// los precios reales de producto (evita fraude de monto).
query order verb=POST {
  api_group = "content"
  auth = "user"

  input {
    json items
  }

  stack {
    var $total { value = 0 }

    // Si el carrito trae al menos un producto, la orden queda tipeada "product";
    // si es solo depósitos de citas, "appointment_deposit". Es metadata para
    // listados admin, no condiciona la lógica de pago.
    var $order_type { value = "appointment_deposit" }

    foreach ($input.items) {
      each as $item {
        conditional {
          if ($item.item_type == "product") {
            db.get product {
              field_name = "id"
              field_value = $item.product_id
            } as $product

            precondition ($product != null) {
              error_type = "notfound"
              error = "product not found"
            }

            var.update $total {
              value = $total + ($product.price * $item.quantity)
            }
            var.update $order_type { value = "product" }
          }
          elseif ($item.item_type == "appointment_deposit") {
            db.get appointment {
              field_name = "id"
              field_value = $item.appointment_id
            } as $appointment

            precondition ($appointment != null) {
              error_type = "notfound"
              error = "appointment not found"
            }

            var.update $total {
              value = $total + ($appointment.deposit_amount * $item.quantity)
            }
          }
        }
      }
    }

    db.add order {
      data = {
        created_at    : "now"
        client_id     : $auth.id
        type          : $order_type
        items         : $input.items
        total         : $total
        payment_status: "pending"
      }
    } as $order
  }

  response = $order
  guid = "aO8J_MTrBOD4lnuGAPQkEpxvoNU"
}
