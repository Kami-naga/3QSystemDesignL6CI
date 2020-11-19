var calculate = require('../calculate.js');
var expect = require('chai').expect;

describe('Add', function() {
    it('Integer', function() {
        expect(calculate("1+1;")).to.be.equal(2);
    });
    it('Float', function() {
        expect(calculate("101.28+2.67;")).to.be.equal(103.95);
    });
    it('Signed', function() {
        expect(calculate("-3+2;")).to.be.equal(-1);
    });
});

describe('Minus', function() {
    it('Integer', function() {
        expect(calculate("10-4;")).to.be.equal(6);
    });
    it('Float', function() {
        expect(calculate("1.2-0.1;")).to.be.equal(1.1);
    });
    it('Become minus', function() {
        expect(calculate("12-20;")).to.be.equal(-8);
    });
    it('Signed', function() {
        expect(calculate("-5--12;")).to.be.equal(7);
    });
    it('Signed', function() {
        expect(calculate("-5-12;")).to.be.equal(-17);
    });
});

describe('Multiply', function() {
    it('Integer', function() {
        expect(calculate("3*9;")).to.be.equal(27);
    });
    it('Float', function() {
        expect(calculate("1.44*3.6;")).to.be.equal(5.184);
    });
    it('Signed', function() {
        expect(calculate("-5*-12;")).to.be.equal(60);
    });
});

describe('Divide', function() {
    it('Integer', function() {
        expect(calculate("15/3;")).to.be.equal(5);
    });
    it('Float', function() {
        expect(calculate("1.44/0.6;")).to.be.equal(2.4);
    });
    it('Signed', function() {
        expect(calculate("-6/-3;")).to.be.equal(2);
    });
    it('Divisor0', function() {
        expect(calculate("9/0;")).to.be.equal("divide by zero");
    });
});

describe('Mod', function() {
    it('Both side is integer', function() {
        expect(calculate("15%4;")).to.be.equal(3);
    });
    it('Left side not integer', function() {
        expect(calculate("5.44%2;")).to.be.equal("left-hand operand of % not int");
    });
    it('Right side not integer', function() {
        expect(calculate("7%2.8;")).to.be.equal("right-hand operand of % not int");
    });
    it('Mod divisor0', function() {
        expect(calculate("15%0;")).to.be.equal("%:divide by zero");
    });
});

describe('Power', function() {
    it('Both side is integer', function() {
        expect(calculate("2^3;")).to.be.equal(8);
    });
    it('Base is float', function() {
        expect(calculate("1.2^2;")).to.be.equal(1.44);
    });
    it('Signed', function() {
        expect(calculate("-12^2;")).to.be.equal(144);
    });
    it('Power multiple times', function() {
        expect(calculate("4^3^2;")).to.be.equal(262144);
    });
});

describe('Factorial', function() {
    it('Integer', function() {
        expect(calculate("5!;")).to.be.equal(120);
    });
    it('Float', function() {
        expect(calculate("1.2!;")).to.be.equal("factorial not int");
    });
    it('Signed minus', function() {
        expect(calculate("-5!;")).to.be.equal(-120);
    });
    it('Signed minus & brackets', function() {
        expect(calculate("(-5)!;")).to.be.equal("factorial can't be minus");
    });
    it('Have number after factorial', function() {
        expect(calculate("5!3;")).to.be.equal("number after factorial!");
    });
});

describe('Brackets', function() {
    it('Ordinary case', function() {
        expect(calculate("(2+3)*5;")).to.be.equal(25);
    });
    it('Missing left bracket', function() {
        expect(calculate("2+5)*4;")).to.be.equal("'(' expected!");
    });
    it('Missing right bracket', function() {
        expect(calculate("(2+(3*5)+4;")).to.be.equal(" ')' expected");
    });
});

describe('Mixed computing', function() {
    it('Mixed computing1', function() {
        expect(calculate("11*12/(1+(1/2))+5*(6-4)*31;")).to.be.equal(398);
    });
    it('Mixed computing2', function() {
        expect(calculate("-2*-9++4*-2;")).to.be.equal(10);
    });
    it('Mixed computing3', function() {
        expect(calculate("9+222%77*7*8-3*3*33%23;")).to.be.equal(3796);
    });
    it('Mixed computing4', function() {
        expect(calculate("3^2*3!-(10-8)*4;")).to.be.equal(46);
    });
});

describe('Fault', function() {
    it('Not number or operation', function() {
        expect(calculate("hello")).to.be.equal("Bad token");
    });
    it('Not complete', function() {
        expect(calculate("78+;")).to.be.equal("syntax error");
    });
    it('Continuous operation', function() {
        expect(calculate("1+*3;")).to.be.equal("syntax error");
    });
    it('many decimal points', function() {
        expect(calculate("3.2.5+2;")).to.be.equal("number error!");
    });
    it('Only a decimal point', function() {
        expect(calculate(".;")).to.be.equal(0);
    });
});