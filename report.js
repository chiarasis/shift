document.addEventListener("DOMContentLoaded", function () {
  // Seleziona il form e il checkbox della privacy policy
  const form = document.getElementById("myform");
  const privacyPolicyCheckbox = document.querySelector('input[name="privacy_policy"]');

  // Aggiungi evento per il submit del form
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Controlla se il checkbox della privacy policy è selezionato
    if (!privacyPolicyCheckbox.checked) {
      alert("You must accept the privacy policy to submit the form.");
      return;
    }

    // Mostra il messaggio "Thank you" e resetta il form
    document.getElementById("thank-you-message").style.display = "block";
    form.reset();
  });
});
