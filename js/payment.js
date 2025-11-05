// ============================= //
//   PAYMENT.JS (FRONTEND)       //
// ============================= //

const serverBase = "http://localhost:3000"; 
// 🔒 Change to your domain after deployment
// const serverBase = "https://greyhatinstitute.com";

// ✅ FORM SUBMIT HANDLER
async function handleForm(event) {
  event.preventDefault();

  const name = document.getElementById("entry.592380803").value.trim();
  const email = document.getElementById("entry.1804738912").value.trim();
  const phone = document.getElementById("entry.43387471").value.trim();

  if (!name || !email || !phone) {
    alert("⚠️ Please fill all fields.");
    return false;
  }

  // ✅ Save data to Google Sheet
  document.getElementById("buy-form").submit();

  // ✅ Start payment after short delay
  setTimeout(() => startPayment(name, email, phone), 1000);

  return false;
}

// ✅ CREATE RAZORPAY ORDER
async function startPayment(name, email, phone) {
  try {
    const response = await fetch(`${serverBase}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone })
    });

    const order = await response.json();

    if (!order.id) {
      alert("Order creation failed. Please try again.");
      return;
    }

    openRazorpay(order, name, email, phone);
  } catch (error) {
    console.error(error);
    alert("Payment error. Please try again.");
  }
}

// ✅ OPEN RAZORPAY CHECKOUT
function openRazorpay(order, name, email, phone) {
  const options = {
    key: order.key,
    amount: order.amount,
    currency: "INR",
    name: "Grey Hat Institute",
    description: "Course Purchase",
    order_id: order.id,
    prefill: { name, email, contact: phone },
    theme: { color: "#121212" },

    handler: function (response) {
      verifyPayment({ ...response, name, email, phone });
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// ✅ VERIFY PAYMENT AFTER SUCCESS
async function verifyPayment(paymentResponse) {
  try {
    const verifyRes = await fetch(`${serverBase}/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentResponse)
    });

    const data = await verifyRes.json();

    if (data.success) {
      const msg = `
✅ Payment Successful!

Tap below to join the WhatsApp group:
👉 ${data.invite}

If you face any issue joining,
contact us on WhatsApp: +91 93344 94170
      `;
      alert(msg);
      window.open(data.invite, "_blank");
    } else {
      alert("❌ Payment Failed! Please contact support.");
    }

  } catch (err) {
    console.error(err);
    alert("Verification error. Try again later.");
  }
}
