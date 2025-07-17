document.getElementById('paymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const paymentId = document.getElementById('paymentId').value;
  const marchentName = document.getElementById('marchentName').value;
  const amount = document.getElementById('amount').value;
  const email = document.getElementById('email').value;
  const pin = document.getElementById('pin').value;
  const messageBox = document.getElementById('messageBox');
  if (!/^[0-9]{4,6}$/.test(pin)) {
    showMessage('PIN must be 4 to 6 digits.', 'error');
    return;
  }

  try {
    const res = await fetch('/api/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, marchentName, amount, email, pin }),
    });

    const result = await res.json();
    if (res.ok && result?.status==200) {
      showMessage(
        '✅ Payment successful! Wait 3 seconds then redirect',
        'success '
      )
        window.location.href=result?.item.redirectURL
    } else {
      showMessage(`❌ ${result.message || 'Payment failed.'}`, 'error');
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

document.getElementById('cancel').addEventListener('click', () => {
  window.location.href = 'http://localhost:7070';
});
