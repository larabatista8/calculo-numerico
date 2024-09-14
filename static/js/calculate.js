$(document).ready(function () {
    $('#calcular-btn').click(function (event) {
        event.preventDefault();

        // Limpar mensagens anteriores
        $('#resultados').html('');
        $('#erros').html('');

        // Coleta dos dados
        let x0 = $('#x0').val();
        let x1 = $('#x1').val();
        let tol = $('#tol').val();
        let max_iter = $('#max_iter').val();
        let metodo = $('#metodo').val();
        let funcao = $('#funcao').val();

        // Validação
        if (!funcao) {
            $('#erros').html('Por favor, insira uma função.');
            return;
        }
        if (!x0) {
            $('#erros').html('Por favor, insira um valor inicial (x0).');
            return;
        }
        if ((metodo === 'secante' || metodo === 'bisseccao' || metodo === 'falsa_posicao') && !x1) {
            $('#erros').html('Por favor, insira o valor inicial 2 (x1) para os métodos secante, bissecção ou falsa posição.');
            return;
        }
        if (!tol) {
            $('#erros').html('Por favor, insira a tolerância.');
            return;
        }
        if (!max_iter) {
            $('#erros').html('Por favor, insira a quantidade máxima de iterações.');
            return;
        }

        // Objeto com os dados
        let data = {
            x0: parseFloat(x0),
            x1: x1 ? parseFloat(x1) : null,
            tol: parseFloat(tol),
            max_iter: parseInt(max_iter),
            metodo: metodo,
            funcao: funcao
        };

        // Envio dos dados via AJAX para que o navegador não recarregue
        $.ajax({
            url: '/calcular',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.error) {
                    $('#erros').html('Erro: ' + response.error);
                } else {
                    // Exibe o resultado
                    let resultado = response.resultado;
                    $('#resultados').html('<h3>Resultado: ' + resultado + '</h3>');


                }
            },
            error: function (xhr, status, error) {
                $('#erros').html('Erro no cálculo: ' + error);
            }
        });
    });
});
