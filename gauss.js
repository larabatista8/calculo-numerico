
 

// salvando espaço para mostrar resultado
let mensagemErroGauss = document.getElementById("mensagem-erro-gauss");
let resultadoGauss = document.getElementById("resultado-gauss");

let N = 3;

// função para obter conteúdo da matriz
function gaussianElimination(mat)
{
	/* verifica se a matriz é singular */
	let singular_flag = forwardElim(mat);

	/* executa se a matriz for singular */
	if (singular_flag != -1)
	{
		mensagemErroGauss.textContent="Matriz singular:";

		/* se o RHS da equação correspondente a
		linha zero for 0, * o sistema tem infinitas
		 soluções, caso contrário inconsistente*/
		if (mat[singular_flag][N])
			mensagemErroGauss.textContent+= "\nSistema inconsitente";
		else
			mensagemErroGauss.textContent+= "\nSistema pode ter infinitas soluções";

		return;
	}

	/* obtem solução para o sistema e imprimi-la usando
	substituição reversa */
	backSub(mat);
}

// função para troca de linhas
function swap_row(mat, i, j)
{
	//printf("Swapped rows %d and %d\n", i, j);

	for (var k=0; k<=N; k++)
	{
		let temp = mat[i][k];
		mat[i][k] = mat[j][k];
		mat[j][k] = temp;
	}
}

// função para imprimir conteudo da matriz
function print(mat)
{
	for (var i=0; i<N; i++, console.log(""))
		for (var j=0; j<=N; j++)
			process.stdout.write("" + mat[i][j]);
	
	console.log("");
}

// função para reduzir a matriz aumentada para a forma escalonada por linha.
function forwardElim(mat)
{
	for (var k=0; k<N; k++)
	{
		// Inicializa o valor máximo e i índice para pivô
		var i_max = k;
		var v_max = mat[i_max][k];

		// encontra a maior amplitude para o pivô se houver
		for (var i = k+1; i < N; i++)
			if (Math.abs(mat[i][k]) > v_max)
				v_max = mat[i][k], i_max = i;

		/* se um elemento diagonal principal for zero,
        * denota que a matriz é singular, e
        * levará a uma divisão por zero mais tarde. */
		if (!mat[k][i_max])
			return k; // Matriz é singular

		/* Trocar a linha de maior valor pela linha atual */
		if (i_max != k)
			swap_row(mat, k, i_max);


		for (var i=k+1; i<N; i++)
		{
			/* fator f para definir a linha atual k-ésimo elemento para 0,
            * e subsequentemente a coluna k-ésimo restante para 0*/
			let f = mat[i][k]/mat[k][k];

			/* subtrair o quinto múltiplo do k-ésimo elemento da linha correspondente*/
			for (var j=k+1; j<=N; j++)
				mat[i][j] -= mat[k][j]*f;

			/* preenchendo matriz triangular inferior com zeros*/
			mat[i][k] = 0;
		}

		//print(mat);	 //for matrix state
	}
	//print(mat);		 //for matrix state
	return -1;
}

// função para calcular os valores das incógnitas
function backSub(mat)
{
	let x = new Array(N); // Um array para armazenar soluções

	/*Comece a calcular da última equação até a
 	primeira */
	for (var i = N-1; i >= 0; i--)
	{
		/* start with the RHS of the equation */
		x[i] = mat[i][N];

		/* Inicialize j para i+1, pois a matriz é triangular
		superior*/
		for (var j=i+1; j<N; j++)
		{
			/* subtrair todos os valores lhs
			* exceto o coeficiente da variável
			* cujo valor está sendo calculado */
			x[i] -= mat[i][j]*x[j];
		}

		/*dividir o RHS pelo coeficiente do
		desconhecido sendo calculado*/
		//x[i] = Math.round(x[i]/mat[i][i]);
		x[i] = (x[i]/mat[i][i]);
	}

	mensagemErroGauss.textContent="\nSolução do sistema:";
	//for (var i=0; i<N; i++)
		
	resultadoGauss.textContent = "x = "+ parseFloat(x[0]) +"    "+ "    y = "+ parseFloat(x[1])+"    " +"    z = "+ parseFloat(x[2]);
}




		function executaGauss(){
				
				// salvando entradas do usuario
				let a11 = document.getElementById("a11").value;
				let a12 = document.getElementById("a12").value;
				let a13 = document.getElementById("a13").value;
				let a14 = document.getElementById("a14").value;
				let a21 = document.getElementById("a21").value;
				let a22 = document.getElementById("a22").value;
				let a23 = document.getElementById("a23").value;
				let a24 = document.getElementById("a24").value;
				let a31 = document.getElementById("a31").value;
				let a32 = document.getElementById("a32").value;
				let a33 = document.getElementById("a33").value;
				let a34 = document.getElementById("a34").value;
				// convertendo numeros para float
				a11= parseFloat(a11);
				a12= parseFloat(a12);  
				a13= parseFloat(a13);
				a14= parseFloat(a14);     
				a21= parseFloat(a21); 
				a22= parseFloat(a22);
				a23= parseFloat(a23);
				a24= parseFloat(a24);
				a31= parseFloat(a31);
				a32= parseFloat(a32);
				a33= parseFloat(a33);
				a34= parseFloat(a34);
			/* matriz aumentada */
				let mat = [[a11, a12,a13, a14],
						[a21, a22, a23,a24],
						[a31, a32,a33,a34]];

			gaussianElimination(mat);

			}

	function limparGuass(){

		document.getElementById("a11").value = '';
		document.getElementById("a12").value = '';
		document.getElementById("a13").value = '';
		document.getElementById("a14").value = '';
		document.getElementById("a21").value = '';
		document.getElementById("a22").value = '';
		document.getElementById("a23").value = '';
		document.getElementById("a24").value = '';
		document.getElementById("a31").value = '';
		document.getElementById("a32").value = '';
		document.getElementById("a33").value = '';
		document.getElementById("a34").value = '';
		document.getElementById("mensagem-erro-gauss").textContent ='';
		document.getElementById("resultado-gauss").textContent = '';
	}


