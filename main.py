from flask import Flask, request, jsonify, render_template
import numpy as np
import logging
import sympy as sp
from sympy import symbols, sympify
from matplotlib import pyplot as plt

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Expressão fornecida pelo usuário
def torna_funcao(func_str, x):
    try:
        x_sym = symbols('x')
        e_val = np.e
        pi_val = np.pi
        func_str = func_str.replace('e', str(e_val))  
        func_str = func_str.replace('pi', str(pi_val))  
        func = sympify(func_str)
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
    while abs(h) >= tol and i < max_iter:
        try:
            h = func(x0) / deriv_func(x0)
        except ZeroDivisionError:
            raise ValueError("A derivada é zero, o que pode causar problemas na convergência.")
        
        x1 = x0 - h
        fx = func(x1)
        iteracoes.append({
            "iteracao": i,
            "x": x1,
            "f_x": fx,
            "diferenca": abs(fx - tol)
        })
        
        x0 = x1
        i += 1
    return iteracoes

# secantee
def secante(func_str, x1, x2, tol, max_iter):
    iteracoes = []
    func = lambda x: torna_funcao(func_str, x)
    for i in range(max_iter):
        if abs(func(x2) - func(x1)) < tol:
            break
        x0 = x2 - func(x2) * (x2 - x1) / (func(x2) - func(x1))
        fx = func(x0)
        iteracoes.append({
            "iteracao": i,
            "x": x0,
            "f_x": fx,
            "diferenca": abs(fx - tol)
        })
        if abs(x0 - x2) < tol:
            break
        x1, x2 = x2, x0
    return iteracoes

# Bissecção
def bisseccao(func_str, a, b, tol, max_iter):
    iteracoes = []
    func = lambda x: torna_funcao(func_str, x)
    if func(a) * func(b) >= 0:
        logging.error("Os valores iniciais a e b devem ter sinais opostos.")
        return "Você não assumiu os valores corretos de a e b.", []
    
    for i in range(max_iter):
        c = (a + b) / 2.0
        fx = func(c)
        iteracoes.append({
            "iteracao": i,
            "x": c,
            "f_x": fx,
            "diferenca": abs(fx - tol)
        })
        if abs(fx) < tol or abs(b - a) < tol:
            break
        if func(c) * func(a) < 0:
            b = c
        else:
            a = c
    return c, iteracoes

# Falsa Posição
def falsa_pos(func_str, a, b, tol, max_iter):
    iteracoes = []
    func = lambda x: torna_funcao(func_str, x)
    if func(a) * func(b) >= 0:
        return "Você não assumiu os valores corretos de a e b.", []
    
    c = a
    for i in range(max_iter):
        c = (a * func(b) - b * func(a)) / (func(b) - func(a))
        fx = func(c)
        iteracoes.append({
            "iteracao": i,
            "x": c,
            "f_x": fx,
            "diferenca": abs(fx - tol)
        })
        if abs(fx) < tol:
            break
        if func(c) * func(a) < 0:
            b = c
        else:
            a = c
    return c, iteracoes

# Página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Cálculo
@app.route('/calcular', methods=['POST'])
def calcular():
    try:
        data = request.json
        metodo = data.get('metodo')
        func_str = data.get('funcao')
        x0 = data.get('x0')
        x1 = data.get('x1')
        use_resultado_antigo = data.get('use_resultado_antigo', False)
        resultado_anterior = data.get('resultado_anterior', None)
        
        if not func_str:
            raise ValueError("A função deve ser fornecida.")
        
        if use_resultado_antigo and resultado_anterior:
            x0 = float(resultado_anterior)
        else:
            if not x0:
                raise ValueError("O valor de x0 deve ser fornecido.")
            x0 = float(x0)
        
        x1 = float(x1) if x1 else None
        tol = float(data.get('tol'))
        max_iter = int(data.get('max_iter'))

        resultados = []
        resultado = None

        if metodo == "newton":
            deriv_func_str = get_derivada(func_str)
            resultados = newton_raphson(func_str, deriv_func_str, x0, tol, max_iter)
        elif metodo == "secante":
            resultados = secante(func_str, x0, x1, tol, max_iter)
        elif metodo == "bisseccao":
            resultado, resultados = bisseccao(func_str, x0, x1, tol, max_iter)
        elif metodo == "falsa_posicao":
            resultado, resultados = falsa_pos(func_str, x0, x1, tol, max_iter)
        else:
            raise ValueError(f"Método desconhecido: {metodo}")

        eixo_x= [x0,(x0+2)]
        eixo_y= [torna_funcao(func_str, x0), torna_funcao(func_str, (x0+2))]

        #colocando legenda
        plt.title('Grafico da função' + func_str)
        plt.xlabel('Eixo x')
        plt.ylabel('Eixo y')

        #gerando grafico
        plt.plot(eixo_x, eixo_y)
        plt.grid(True) #coloca linha de grade

        #salvando imagem 
        plt.savefig('templates/grafico.png')

        return jsonify({
            "iteracoes": resultados,
            "resultado": resultado or resultados[-1]['x']
            "templates/grafico.png": data.grafico 
        })
    except Exception as e:
        logging.error(f"Erro durante o cálculo: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
