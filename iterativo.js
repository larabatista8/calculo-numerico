window.iterativo = {
  calcularGaussSeidel: function() {
    const E = parseFloat(document.getElementById("E").value);
    const R1 = parseFloat(document.getElementById("R1").value);
    const R2 = parseFloat(document.getElementById("R2").value);
    const R3 = parseFloat(document.getElementById("R3").value);
    const R4 = parseFloat(document.getElementById("R4").value);
    const R5 = parseFloat(document.getElementById("R5").value);

    let I1 = 0, I2 = 0, I3 = 0, I4 = 0, I5 = 0;
    const maxIter = 5000;
    const tol = 1e-8;
    const omega = 0.7;
    const limite = 1e6;
    let convergiu = false;

    for (let iter = 0; iter < maxIter; iter++) {
      let I1_old = I1, I2_old = I2, I3_old = I3, I4_old = I4, I5_old = I5;

      I1 = (1 - omega) * I1 + omega * (E - R2 * I2 - R5 * I5) / R1;
      I2 = (1 - omega) * I2 + omega * (E - R1 * I1 - R3 * I5) / R2;
      I3 = (1 - omega) * I3 + omega * (-R4 * I4 + R5 * I5) / R3;
      I4 = (1 - omega) * I4 + omega * (-R3 * I3 + R5 * I5) / R4;
      I5 = (1 - omega) * I5 + omega * (R1 * I1 + R2 * I2) / R5;

      if (Math.abs(I1) > limite || Math.abs(I2) > limite || Math.abs(I3) > limite || Math.abs(I4) > limite || Math.abs(I5) > limite) {
        console.error("Valores das correntes atingiram o limite de estabilidade.");
        return { erro: "O método divergiu devido à instabilidade numérica." };
      }

      if (
        Math.abs(I1 - I1_old) < tol &&
        Math.abs(I2 - I2_old) < tol &&
        Math.abs(I3 - I3_old) < tol &&
        Math.abs(I4 - I4_old) < tol &&
        Math.abs(I5 - I5_old) < tol
      ) {
        convergiu = true;
        break;
      }
    }

    if (convergiu) {
      return {
        I1: I1.toFixed(6),
        I2: I2.toFixed(6),
        I3: I3.toFixed(6),
        I4: I4.toFixed(6),
        I5: I5.toFixed(6)
      };
    } else {
      return {
        erro: "O método não convergiu."
      };
    }
  },

  limparGaussSeidel: function() {
    document.getElementById("E").value = '';
    document.getElementById("R1").value = '';
    document.getElementById("R2").value = '';
    document.getElementById("R3").value = '';
    document.getElementById("R4").value = '';
    document.getElementById("R5").value = '';
    document.getElementById("resultado-iterativo").textContent = '';
  }
};
