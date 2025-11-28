const { EmailClient } = require("@azure/communication-email");

// This is the classic Azure Functions export
module.exports = async function (context, req) {
    try {
        const order = req.body;

        if (!order || !order.customer) {
            context.res = {
                status: 400,
                body: { error: "Invalid order payload" }
            };
            return;
        }

        const connectionString = process.env.ACS_EMAIL_CONNECTION_STRING;
        const sender = process.env.ACS_EMAIL_SENDER;        // verified sender
        const recipient = process.env.ORDER_NOTIFY_EMAIL;   // your inbox

        const emailClient = new EmailClient(connectionString);

        const subject = `New order from ${order.customer.name}`;

        const htmlBody = `
            <h1>New Order</h1>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Preferred contact:</strong> ${order.customer.preferredContact || "N/A"}</p>
            <p><strong>Occasion:</strong> ${order.customer.occasion || "N/A"}</p>
            <p><strong>Message:</strong> ${order.customer.message || "N/A"}</p>
            <h2>Items</h2>
            <ul>
              ${
                (order.items || []).map(i =>
                  `<li>${i.quantity} × ${i.name} (${i.priceLabel})</li>`
                ).join("")
              }
            </ul>
            <p><strong>Total:</strong> $${order.total}</p>
        `;

        await emailClient.send({
            senderAddress: sender,
            recipients: {
                to: [{ address: recipient }]
            },
            content: {
                subject: subject,
                html: htmlBody
            }
        });

        context.res = {
            status: 200,
            body: { ok: true }
        };
    } catch (err) {
        context.log.error("Error in newOrder function:", err);
        context.res = {
            status: 500,
            body: { error: "Failed to process order" }
        };
    }
};
