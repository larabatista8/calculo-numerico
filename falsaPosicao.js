<script>

// JavaScript program for implementation of Bisection Method for
// solving equations
let MAX_ITER = 1000000

// An example function whose solution is determined using
// Regular Falsi Method. The function is x^3 - x^2 + 2
function func(x){
	return x*x*x - x*x + 2;
}

// Prints root of func(x) in interval [a, b]
function regulaFalsi( a, b){
	if (func(a) * func(b) >= 0){
		document.write("You have not assumed right a and b\n");
		return;
	}
// Initialize result
	let c = a; 

	for (let i=0; i < MAX_ITER; i++)
	{
		// Find the point that touches x axis
		c = Math.floor((a*func(b) - b*func(a))/ (func(b) - func(a)));

		// Check if the above found point is root
		if (func(c)==0){
			break;
		}
		// Decide the side to repeat the steps
		else if (func(c)*func(a) < 0){
			b = c;
		}
		else{
			a = c;
		}
	}
	document.write("The value of root is : " + c);
}

// Driver program to test above function

// Initial values assumed
let a =-200;
let b = 300;
regulaFalsi(a, b);

</script>
