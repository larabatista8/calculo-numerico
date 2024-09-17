<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculo Numérico</title>
</head>
<body>
    <h1>Calculadora Numérica</h1>

    <label for="metodo">Escolha o método:</label>
    <select id="metodo">
        <option value="newton">Newton-Raphson</option>
        <option value="secante">Secante</option>
        <option value="bisseccao">Bissecção</option>
        <option value="falsa_posicao">Falsa Posição</option>
    </select><br>

    <label for="funcao">Digite a função:</label>
    <input type="text" id="funcao" placeholder="x**3 - 2*x - 5"><br>

    <label for="x0">Valor inicial (x0):</label>
    <input type="number" id="x0" step="any"><br>

    <label for="x1" id="x1-label">Valor inicial (x1) (para secante/bissecção/falsa posição):</label>
    <input type="number" id="x1" step="any"><br>

    <label for="tol">Digite a tolerância:</label>
    <input type="number" id="tol" step="any" value="0.001"><br>

    <label for="max_iter">Digite a quantidade máxima de interações:</label>
    <input type="number" id="max_iter" value="100"><br>

    <label>
        <input type="checkbox" id="use-resultado-antigo">Usar resultado anterior
    </label>
    <input type="hidden" id="resultado-anterior">
    <br>  

    <button onclick="calcular()">Calcular</button>

    <div id="resultados"></div>
    <img id="grafico" src="" alt="Gráfico da função" />
    <div id="erros" style="color: red;"></div>

    <script>
        function calcular() {
            const metodo = document.getElementById("metodo").value;
            const funcao = document.getElementById("funcao").value;
            const x0 = document.getElementById("x0").value;
            const x1 = document.getElementById("x1").value;
            const tol = document.getElementById("tol").value;
            const max_iter = document.getElementById("max_iter").value;
            const useResultadoAntigo = document.getElementById("use-resultado-antigo").checked;
            const resultadoAnterior = document.getElementById("resultado-anterior").value;

            const bodyData = { 
                metodo, 
                funcao, 
                x0, 
                tol, 
                max_iter, 
                useResultadoAntigo,
                resultadoAnterior
            };

            if (metodo !== "newton") {
                bodyData.x1 = x1; // Enviar x1 para secante, bissecção e falsa posição
            }

            fetch('/calcular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById("erros").innerHTML = 'Erro: ' + data.error;
                } else {
                    document.getElementById("resultado-anterior").value = data.resultado;
                    document.getElementById("resultados").innerHTML = 'Resultado: ' + data.resultado;
                    document.getElementById('grafico').src = data.grafico_url;
                }
            })
            .catch(error => {
                document.getElementById("erros").innerHTML = 'Erro no cálculo: ' + error.message;
            });
        }
    </script>   

</body>
</html>
