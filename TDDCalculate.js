/**
 * homework1
 * 電卓実現
 * Author：Yuji Kaminaga
 * Student ID：20M38050
 * Date： 2020.10
 */
//指定部分Token类型
var number = '8';
var print = ';';

//变量存储的值（默认为0）
var save =0;

//用于检测阶乘前是否为括号
var parenFrontFac = false;

//字符类（包含类型与值2个成员）
function Token(ch,val){
    this.kind=ch;
    this.value=Number(val);
}

//错误抛出
function error(s) {
    throw new Error(s);
}

//字符操作
function Token_stream(){

    var full = false;
    var buffer = 0;

    this.putBack = function(t){
        if(full){
            error("put back full！");
        }
        buffer = t;
        full = true;

    };

    this.get = function (){
        if (full) {	//若有buffer则取出
            full = false;
            return buffer;
        }
        var ch=expr.substr(0,1);
        switch (ch) {
            case print:
            case'(':
            case')':
            case'+':
            case'-':
            case'*':
            case'/':
            case'%':
            case'!':
            case'^': {
                expr=expr.substr(1);
                return new Token(ch);
            }
            case'.':
            case'0':case'1':case'2':case'3':case'4':
            case'5':case'6':case'7':case'8':case'9': {
                expr=expr.substr(1);
                while(!isNaN(Number(expr.substr(0,1))) || expr.substr(0,1) === '.') {
                    ch += expr.substr(0,1);
                    expr=expr.substr(1);
                }
                //检测所得数字是否正确
                if(ifIsADot(ch)) {
                    return new Token(number, 0);
                }
                else {
                    checkNum(ch);
                    return new Token(number, Number(ch));
                }
            }
            default:
                error("Bad token");
                return 1;
        }
    }

    this.ignore = function() {//用于删去buffer，以免对下次操作造成影响
        full = false;
    }
}

//处理浮点数不精确问题（令浮点数变整数（放大）后运算，再变回去）
function getLen(n){ //用于得到小数点后位数
    if(n.toString().indexOf('.') !== -1)
        return (n.toString().split(".")[1]).length;
    else
        return 0;
}
function accPlus(n1,n2){ //处理js中浮点数加法
    var len1 = getLen(n1);
    var len2 = getLen(n2);
    var mul = Math.pow(10,Math.max(len1,len2)); //得到令浮点数变整数的10的倍数
    return (n1 * mul - n2 * mul) / mul;
}
function accMinus(n1,n2){ //处理js中浮点数加法
    var len1 = getLen(n1);
    var len2 = getLen(n2);
    var mul = Math.pow(10,Math.max(len1,len2)); //得到令浮点数变整数的10的倍数
    var n = (len1 > len2) ? len1:len2; //决定相减之后小数点后留几位（与小数点后尾数多的那个数一致）
    return Number(((n1 * mul + n2 * mul) / mul).toFixed(n));
}
function accTimes(n1,n2){ //处理js中浮点数加法
    var mul = getLen(n1) + getLen(n2); //乘法所得结果小数点后位数为2乘数小数点后位数之和
    //2乘数去小数点相乘之后再除相应10的倍数
    return Number(n1.toString().replace(".",""))*Number(n2.toString().replace(".",""))/Math.pow(10,mul);
}
function accDivide(n1,n2){ //处理js中浮点数加法
    var len1 = getLen(n1); //除法所得结果小数点后位数为被除数位数减去除数位数之差
    var len2 = getLen(n2);
    if(len1 === 0 && len2 === 0) //2数皆为整数则无需变化
        return Number(n1.toString())/Number(n2.toString());
    else { //有浮点数
        var n = (len1 > len2) ? len1 : len2; //决定相除之后小数点后留几位（与小数点后尾数多的那个数一致）
        //除数被除数先都乘至整数，得结果后再除去相应10的倍数
        var answer = Number(n1.toString().replace(".", "")) / Number(n2.toString().replace(".", "")) * Math.pow(10, len2 - len1);
        return Number(answer.toFixed(n));
    }
}

//用于检测数字
function ifIsADot(num){ //检测该值是否只为一个小数点
    return num === ".";
}
function checkNum(num) { //检测数字是否正确（主要检查小数点个数问题）
    var dotNum=0;
    for(i=0;i<num.length;i++){
        if(dotNum>=2)
            error("number error!");
        if(num.charAt(i) === '.')
            dotNum += 1;
    }
}

//检测括号
function checkRParen(){
    //检测括号，若含有')'，
    // 则使得parenFrontFac为true（用于处理阶乘时阶乘的数为带括号负数的问题），并消除；
    // 若无，则报错
    var t = ts.get();
    if(t.kind === ')'){
        full = false;
        parenFrontFac = true;
    }
    else
        error(" ')' expected");
}
function checkLParen() {// 判断左括号是否存在，若有则报错
    var t =ts.get();
    if (t.kind === ')') {
        error("'(' expected!");
    }
}

//输入流
ts = new Token_stream();

//语法
function expression() {//处理加法与减法
    var left = term();
    var t = ts.get();
    while (true) {
        switch (t.kind) {
            case '+':
                left = accPlus(left,term());
                t = ts.get();
                break;
            case '-':
                left = accMinus(left,term());
                t = ts.get();
                break;
            default:
                ts.putBack(t);
                return left;
        }
    }
}
function term() {//处理乘法，除法与取余
    var left = power();
    var t = ts.get();
    while (true) {
        switch (t.kind) {
            case '*':
                left = accTimes(left,power());
                t = ts.get();
                break;
            case '/': {
                var d = power();
                if (d === 0)
                    error("divide by zero");
                left = accDivide(left,d);
                t = ts.get();
                break;
            }
            case '%': {
                var d = power();
                var i1 = parseInt(left);
                if (i1 !== left)
                    error("left-hand operand of % not int");
                var i2 = parseInt(d);
                if (i2 !== d)
                    error("right-hand operand of % not int");
                if (i2 === 0)
                    error("%:divide by zero");
                left = i1%i2;
                t = ts.get();
                break;
            }
            default:
                ts.putBack(t);
                return left;
        }

    }
}
function power() {//处理乘方
    var left = fac();
    var t = ts.get();
    while (true) {
        switch (t.kind) {
            case '^': {
                left = Math.pow(left,power());
                t = ts.get();
                break;
            }
            default:
                ts.putBack(t);
                return left;
        }
    }
}
function fac() {
    /*用于处理阶乘 有2种情况：（整数前提下）
     1.正数与负数（不带括号），则计算阶乘再加符号
     2.正数与负数（带括号），正数照常，负数则报错*/
    var left = primary(expr);
    var t = ts.get();
    while (true) {
        switch (t.kind) {
            case '!': {//检查是否为整数
                var d = parseInt(left);
                if (d !== left) {
                    error("factorial not int");
                }
                if (d < 0) {//检查是否为负，若前项为')'，即带括号且为负数，
                    //则由于括号优先级最高，负数不能阶乘，因此报错，
                    //否则先阶乘再与负号结合，不报错
                    if (parenFrontFac === true)
                        error("factorial can't be minus");
                    else {
                        left = -factorial(-d);
                        t = ts.get();
                        break;
                    }
                }
                else { //大于0时照常计算即可
                    left = factorial(d);
                    t = ts.get();
                    parenFrontFac = false;  //为了不影响下次计算把该检测值初始化
                    break;
                }
            }
            case number:
                error("number after factorial!");
            default:
                parenFrontFac = false;  //为了不影响下次计算把该检测值初始化
                ts.putBack(t);
                return left;
        }
    }
}
function primary() { //处理括号，正负与数字
    var t = ts.get();
    switch (t.kind) {
        case '(': {
            var d = expression();
            checkRParen();                   //判断‘）’是否存在，是则吃掉，否则报错
            return d;
        }
        case number: {
            return t.value;
        }
        case '-':
            return -primary();
        case '+':
            return primary();
        default:
            error("syntax error");
    }
}

function calculate(exp) {
    try {
        expr = exp;
        var answer = expression(expr);
        checkLParen();  		//检测是否缺少'('
        cleanUpMess();          //清空buffer
        return answer;
    }
    catch (err) {
        cleanUpMess();
        return err.message;
    }
}

function cleanUpMess() {//清buffer
    ts.ignore();
}

function factorial(s) {//阶乘
    if (s === 1 || s === 0)
        return 1;
    return s*factorial(s - 1);
}

module.exports=calculate