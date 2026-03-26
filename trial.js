const canvas = document.getElementById("signaturePad");
const clearBtn = document.getElementById("clearSignature");
const form = document.getElementById("trialForm");
const signatureData = document.getElementById("signatureData");

function resizeCanvas() {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = 220 * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
  signaturePad.clear();
}

const signaturePad = new SignaturePad(canvas, {
  minWidth: 1,
  maxWidth: 2.5
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

clearBtn.addEventListener("click", () => {
  signaturePad.clear();
  signatureData.value = "";
});

form.addEventListener("submit", (e) => {
  if (signaturePad.isEmpty()) {
    e.preventDefault();
    alert("Please add your signature before submitting.");
    return;
  }

  signatureData.value = signaturePad.toDataURL("image/png");
});