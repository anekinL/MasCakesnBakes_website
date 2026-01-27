const { EmailClient } = require("@azure/communication-email");

module.exports = async function (context, req) {
    try {
        const order = req.body || {};

        // ---- sanity check on payload ----
        if (!order.customer) {
            context.res = {
                status: 400,
                body: { error: "Invalid order payload: missing customer" }
            };
            return;
        }

        // ---- environment variables ----
        const connectionString = process.env.ACS_EMAIL_CONNECTION_STRING;
        const sender = process.env.ACS_EMAIL_SENDER;
        const recipient = process.env.ORDER_NOTIFY_EMAIL;

        const missing = [];
        if (!connectionString) missing.push("ACS_EMAIL_CONNECTION_STRING");
        if (!sender) missing.push("ACS_EMAIL_SENDER");
        if (!recipient) missing.push("ORDER_NOTIFY_EMAIL");

        if (missing.length > 0) {
            context.log.error("Missing env vars:", missing.join(", "));
            context.res = {
                status: 500,
                body: {
                    error: "Email not configured",
                    missing
                }
            };
            return;
        }

        // ---- build email client ----
        const emailClient = new EmailClient(connectionString);

        // ---- build email content ----
        const customer = order.customer;
        const items = Array.isArray(order.items) ? order.items : [];

        const subject = `New order from ${customer.name || "Unknown customer"}`;

        const itemsHtml = items.map(i =>
            `<li>${i.quantity} × ${i.name || ""} (${i.priceLabel || ""})</li>`
        ).join("");

        const htmlBody = `
            <h1>New Order</h1>
            <p><strong>Name:</strong> ${customer.name || ""}</p>
            <p><strong>Email:</strong> ${customer.email || ""}</p>
            <p><strong>Phone:</strong> ${customer.phone || ""}</p>
            <p><strong>Preferred contact:</strong> ${customer.preferredContact || "N/A"}</p>
            <p><strong>Preferred payment:</strong> ${customer.preferredPayment || "N/A"}</p>
            <p><strong>Occasion:</strong> ${customer.occasion || "N/A"}</p>
            <p><strong>Message:</strong> ${customer.message || "N/A"}</p>
            <h2>Items</h2>
            <ul>${itemsHtml}</ul>
            <p><strong>Total:</strong> $${order.total}</p>
        `;

        const message = {
            senderAddress: sender,
            content: {
                subject,
                html: htmlBody
            },
            recipients: {
                to: [{ address: recipient }]
            }
        };

        // ---- send email via ACS (correct pattern) ----
        const poller = await emailClient.beginSend(message);
        const result = await poller.pollUntilDone();
        context.log("Email send status:", result.status);
        if (result.error) {
            context.log("Email send error details:", result.error);
        }

        context.res = {
            status: 200,
            body: { ok: true, status: result.status }
        };
    } catch (err) {
        context.log.error("Error in newOrder function:", err);
        context.res = {
            status: 500,
            body: {
                error: "Failed to process order",
                message: err.message || null,
                code: err.code || null
            }
        };
    }
};
