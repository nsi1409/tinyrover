`timescale 1ns/1ps

module tb(i);
	output reg [7:0] i;
	input p_val;
	pwm p (.inpt(i), .outp(p_val));
/*
	initial begin
		#1280
		#1280
		//$finish();
	end
*/
	initial begin
		$dumpfile("pwm_tb.vcd");
		$dumpvars(0, tb);
		i <= 0;
		#1280
		i <= 1;
		#1280
		i <= 30;
		#1280
		i <= 90;
		#1280
		i <= 150;
		#1280
		i <= 200;
		#1280
		i <= 254;
		#1280
		i <= 255;
		#1280
		$finish();
/*
		forever begin
			#5
			i <= i + 1;
		end
*/
	end
endmodule
