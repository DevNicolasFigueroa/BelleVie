// Cliente de Webpay Plus (Transbank).
// Solo se importa desde Route Handlers — las credenciales no llevan prefijo
// NEXT_PUBLIC_ y nunca deben llegar al navegador.

import { WebpayPlus, IntegrationApiKeys, IntegrationCommerceCodes } from "transbank-sdk";

const isProduction = process.env.WEBPAY_ENV === "production";

const commerceCode = process.env.WEBPAY_COMMERCE_CODE || "";
const apiKey = process.env.WEBPAY_API_KEY || "";

if (isProduction && (!commerceCode || !apiKey)) {
    throw new Error(
        "WEBPAY_ENV=production requiere WEBPAY_COMMERCE_CODE y WEBPAY_API_KEY. " +
        "No se puede caer a las credenciales de integración en producción."
    );
}

// En integración, si no hay credenciales propias usamos las públicas del SDK.
export const webpayTransaction = isProduction
    ? WebpayPlus.Transaction.buildForProduction(commerceCode, apiKey)
    : WebpayPlus.Transaction.buildForIntegration(
        commerceCode || IntegrationCommerceCodes.WEBPAY_PLUS,
        apiKey || IntegrationApiKeys.WEBPAY
    );
