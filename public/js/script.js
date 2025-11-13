const paymentId = document.getElementById('paymentId').value;

document.getElementById('paymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const marchentName = document.getElementById('marchentName').value;
  const amount = document.getElementById('amount').value;
  const email = document.getElementById('email').value;
  const pin = document.getElementById('pin').value;

  // ✅ নতুন hidden ফিল্ডগুলো নিচে নেওয়া হচ্ছে
  const webhookURL = document.getElementById('webhookURL').value;
  const successURL = document.getElementById('successURL').value;
  const faildURL = document.getElementById('faildURL').value;

  const messageBox = document.getElementById('messageBox');

  // ✅ PIN validation
  if (!/^[0-9]{4,6}$/.test(pin)) {
    showMessage('PIN must be 4 to 6 digits.', 'error');
    return;
  }

  try {
    const res = await fetch('/api/payment/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId,
        marchentName,
        amount,
        email,
        pin,
        webhookURL,
        successURL,
        faildURL,
      }),
    });

    const result = await res.json();

    // ✅ success handle
    if (res.ok && result?.status === 200) {
      showMessage('✅ Payment successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = result?.item?.redirectURL || successURL;
      }, 3000);
    } else {
      showMessage(`❌ ${result.message || 'Payment failed.'}`, 'error');
      setTimeout(() => {
        window.location.href = faildURL;
      }, 2000);
    }
  } catch (err) {
    showMessage('❌ Network error. Please try again.', 'error');
  }

  function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = type;
    messageBox.style.display = 'block';
  }
});

// ✅ Cancel বাটন চাপলে faildURL এ redirect হবে
document.getElementById('cancel').addEventListener('click', () => {
  const faildURL = document.getElementById('faildURL').value;
  window.location.href = faildURL;
});
