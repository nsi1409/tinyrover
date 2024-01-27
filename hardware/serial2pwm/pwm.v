`timescale 1ns/1ps

module pwm (inpt, outp);
input [7:0] inpt;
output reg outp;
integer i;
initial begin
	outp = 0;
	forever begin
		for(i = 0; i < 255; i = i + 1) begin
			if(i < inpt)
				outp = 1;
			else
				outp = 0;
			#1;
		end
	end
end

endmodule
