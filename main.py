from flask import Flask, request, jsonify, render_template
import numpy as np
import logging
import sympy as sp
from sympy import symbols, sympify, pi, E, sin, cos, tan, log, exp, sqrt
from matplotlib import pyplot as plt
plt.switch_backend('agg')
import io
import base64

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Expressão fornecida pelo usuário
def torna_funcao(func_str, x):
    try:
        x_sym = symbols('x')
        func = sympify(func_str, locals={'pi': pi, 'e': E, 'sin': sin, 'cos': cos, 'tan': tan, 'log':log, 'sqrt':sqrt, 'exp':exp})
        return float(func.evalf(subs={x_sym: x}))
    except Exception as e:
        logging.error(f"Erro ao avaliar a função: {e}")
        raise ValueError("Erro ao avaliar a função. Certifique-se de que a função está no formato correto.")
    
# Derivada da função     
def get_derivada(func_str):
    try:
        x_sym = sp.Symbol('x')
        func = sp.sympify(func_str)
        deriv = sp.diff(func, x_sym)
        return str(deriv)
    except Exception as e:
        logging.error(f"Erro ao calcular a derivada: {e}")
        raise ValueError("Erro ao calcular a derivada. Certifique-se de que a função está no formato correto.")

def gerar_grafico(func_str, pontos, x0, x1):
    
    # Gerar gráfico
    eixo_x = np.linspace(x0 - 2, (x1 + 2) if x1 else (x0 + 2), 100)
    eixo_y = [torna_funcao(func_str, x) for x in eixo_x]
    plt.figure()
    plt.plot(eixo_x, eixo_y, label='Função')
    plt.scatter([p['x'] for p in pontos], [p['f_x'] for p in pontos], color='red', label='Iterações')

    #colocando legenda
    plt.title('Gráfico da função ' + func_str)
    plt.xlabel('Valores de x')
    plt.ylabel('Valores de f(x)')
    plt.legend()
    plt.grid(True)
    
    # Salvar gráfico em base64
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    grafico_url = base64.b64encode(img.getvalue()).decode('utf-8')
    plt.close()

    return f'data:image/png;base64,{grafico_url}'

# Newton-Raphson
def newton_raphson(func_str, deriv_func_str, x0, tol, max_iter):
    iteracoes = []
    func = lambda x: torna_funcao(func_str, x)
    deriv_func = lambda x: torna_funcao(deriv_func_str, x)
    try:
        h = func(x0) / deriv_func(x0)
    except ZeroDivisionError:
        raise ValueError("A derivada é zero, o que pode causar problemas na convergência.")
    
    i = 0
    while i < max_iter:
        try:
            h = func(x0) / deriv_func(x0)
        except ZeroDivisionError:
            raise ValueError("A derivada é zero, o que pode causar problemas na convergência.")
        fx = func(x0)
        if abs(h) < tol or abs(fx) < tol:
            break
        x1 = x0 - h
        fx = func(x1)
        iteracoes.append({
            "iteracao": i,
            "x": x1,
            "f_x": fx,
            "diferenca": abs(fx - tol)
        })
        if abs(x1 - x0) < tol:
            break
        x0 = x1
        i += 1

    return iteracoes, x0

# Secante
def secante(func_str, x0, x1, tol, max_iter):
    iteracoes = []
    func = lambda x: torna_funcao(func_str, x)
    i = 0
    while i < max_iter:
        fx0 = func(x0)
        fx1 = func(x1)
        if fx1 - fx0 == 0:
            raise ValueError("Divisão por zero detectada.")
        x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
        fx2 = func(x2)
        iteracoes.append({
            "iteracao": i,
            "x": x2,
            "f_x": fx2,
            "diferenca": abs(x2 - x1)
        })
        if abs(x2 - x1) < tol or abs(fx2) < tol:
            break
        x0, x1 = x1, x2
        i += 1


    return iteracoes, x2

# Bissecção
def bisseccao(func_str, x0, x1, tol, max_iter):
    iteracoes = []
    func = lambda x: torna_funcao(func_str, x)
    if func(x0) * func(x1) > 0:
        raise ValueError("Os valores iniciais devem estar em intervalos que contêm a raiz.")
    i = 0
    while i < max_iter:
        xm = (x0 + x1) / 2
        fxm = func(xm)
        iteracoes.append({
            "iteracao": i,
            "x": xm,
            "f_x": fxm,
            "diferenca": abs((fxm - tol))
        })
        if abs(fxm) < tol or abs(x1 - x0) < tol:
            break
        if func(x0) * fxm < 0:
            x1 = xm
        else:
            x0 = xm
        i += 1

    return iteracoes, xm

# Falsa Posição
def falsa_posicao(func_str, x0, x1, tol, max_iter):
    iteracoes = []
    func = lambda x: torna_funcao(func_str, x)
    if func(x0) * func(x1) > 0:
        raise ValueError("Os valores iniciais devem estar em intervalos que contêm a raiz.")
    i = 0
    while i < max_iter:
        fx0 = func(x0)
        fx1 = func(x1)
        xm = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
        fxm = func(xm)
        iteracoes.append({
            "iteracao": i,
            "x": xm,
            "f_x": fxm,
            "diferenca": abs(fxm - tol)
        })
        if abs(fxm) < tol or abs(x1 - x0) < tol:
            break
        if func(x0) * fxm < 0:
            x1 = xm
        else:
            x0 = xm
        i += 1

    return iteracoes, xm

# Página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Cálculo
@app.route('/calcular', methods=['POST'])
def calcular():
    data = request.get_json()
    metodo = data.get('metodo')
    func_str = data.get('funcao')
    x0 = data.get('x0')
    x1 = data.get('x1')
    tol = data.get('tol')
    max_iter = data.get('max_iter')

    results = {}

    try:
    #Metodos individuais
        if metodo == 'newton':
            deriv_func_str = get_derivada(func_str)
            iteracoes, resultado = newton_raphson(func_str, deriv_func_str, x0, tol, max_iter)
            results['newton'] = {
                "resultado": resultado,
                "iteracoes": iteracoes,
                "grafico_url": gerar_grafico(func_str, iteracoes, x0, x0)  # x1 é o mesmo que x0 para o gráfico
            }
        elif metodo == 'secante':
            iteracoes, resultado = secante(func_str, x0, x1, tol, max_iter)
            results['secante'] = {
                "resultado": resultado,
                "iteracoes": iteracoes,
                "grafico_url": gerar_grafico(func_str, iteracoes, x0, x1)
            }
        elif metodo == 'bisseccao':
            iteracoes, resultado = bisseccao(func_str, x0, x1, tol, max_iter)
            results['bisseccao'] = {
                "resultado": resultado,
                "iteracoes": iteracoes,
                "grafico_url": gerar_grafico(func_str, iteracoes, x0, x1)
            }
        elif metodo == 'falsa_posicao':
            iteracoes, resultado = falsa_posicao(func_str, x0, x1, tol, max_iter)
            results['falsa_posicao'] = {
                "resultado": resultado,
                "iteracoes": iteracoes,
                "grafico_url": gerar_grafico(func_str, iteracoes, x0, x1)
            }

    #Todos os métodos    
        elif metodo == 'todos':
            for m in ['newton', 'secante', 'bisseccao', 'falsa_posicao']:
                if m == 'newton':
                    deriv_func_str = get_derivada(func_str)
                    iteracoes, resultado = newton_raphson(func_str, deriv_func_str, x0, tol, max_iter)
                elif m == 'secante':
                    iteracoes, resultado = secante(func_str, x0, x1, tol, max_iter)
                elif m == 'bisseccao':
                    iteracoes, resultado = bisseccao(func_str, x0, x1, tol, max_iter)
                elif m == 'falsa_posicao':
                    iteracoes, resultado = falsa_posicao(func_str, x0, x1, tol, max_iter)
                results[m] = {
                    "resultado": resultado,
                    "iteracoes": iteracoes,
                    "grafico_url": gerar_grafico(func_str, iteracoes, x0, x1)
                }
        else:
            raise ValueError("Método desconhecido.")

        return jsonify(results)
    
    except ValueError as e:
        logging.error(f"Erro no cálculo: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
