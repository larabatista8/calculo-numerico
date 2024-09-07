<script>

// JavaScript program for implementation of 
// Newton Raphson Method for solving 
// equations

	let EPSILON = 0.001;
	
	// An example function whose solution
	// is determined using Bisection Method.
	// The function is x^3 - x^2 + 2
	function func(x)
	{
		return x * x * x - x * x + 2;
	}
	
	// Derivative of the above function 
	// which is 3*x^x - 2*x
	function derivFunc(x)
	{
		return 3 * x * x - 2 * x;
	}
	
	// Function to find the root
	function newtonRaphson(x)
	{
		let h = func(x) / derivFunc(x);
		while (Math.abs(h) >= EPSILON)
		{
			h = func(x) / derivFunc(x);
	
			// x(i+1) = x(i) - f(x) / f'(x) 
			x = x - h;
		}
	
		document.write("The value of the"
				+ " root is : "
				+ Math.round(x * 100.0) / 100.0);
	}


// Driver program

		// Initial values assumed
		let x0 = -20; 
		newtonRaphson(x0);

// This code is contributed by susmitakundugoaldanga.
</script>
