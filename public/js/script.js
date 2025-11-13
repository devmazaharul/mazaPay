document.getElementById('paymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const paymentId = document.getElementById('paymentId').value;
  const marchentName = document.getElementById('marchentName').value;
  const amount = document.getElementById('amount').value;
  const email = document.getElementById('email').value.trim();
  const pin = document.getElementById('pin').value.trim();

  const webhookURL = document.getElementById('webhookURL').value;
  const successURL = document.getElementById('successURL').value;
  const faildURL = document.getElementById('faildURL').value;

  const messageBox = document.getElementById('messageBox');

  // ✅ PIN validation
  if (!/^\d{4,6}$/.test(pin)) {
    return showMessage('PIN must be 4 to 6 digits.', 'error');
  }

  // ✅ Disable confirm button during processing
  const confirmBtn = document.getElementById('confirm');
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Processing...';

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

    if (res.ok && result?.status === 200) {
      showMessage('✅ Payment successful! Redirecting...', 'success');

      // success redirect URL তে paymentId পাঠানো হচ্ছে
      const redirectTo = `${successURL}?id=${encodeURIComponent(paymentId)}`;

      setTimeout(() => {
        window.location.href = redirectTo;
      }, 3000);
    } else {
      showMessage(`❌ ${result.message || 'Payment failed.'}`, 'error');

      setTimeout(() => {
        window.location.href = faildURL;
      }, 2000);
    }
  } catch (err) {
    showMessage('❌ Network error. Please try again.', 'error');
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Confirm Payment';
  }

  function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = type;
    messageBox.style.display = 'block';
  }
});

// ✅ Cancel বাটন চাপলে ব্যর্থ পেজে রিডাইরেক্ট করবে
document.getElementById('cancel').addEventListener('click', () => {
  const faildURL = document.getElementById('faildURL').value;
  window.location.href = faildURL;
});
