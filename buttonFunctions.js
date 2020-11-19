/**
 * homework1
 * 電卓実現
 * Author：Yuji Kaminaga
 * Student ID：20M38050
 * Date： 2020.10
 */
function getExp(what){
    if(document.getElementById("output").value ===　"") //output无数字则直接添加
        document.getElementById("input").value +=　what;
    else {//output有数字说明进行了一次计算，把原式及结果删除重新开始
        document.getElementById("input").value = what;
        document.getElementById("output").value =　"";
    }
}
function get1(){
    getExp("1");
}
function get2(){
    getExp("2");
}
function get3(){
    getExp("3");
}
function get4(){
    getExp("4");
}
function get5(){
    getExp("5");
}
function get6(){
    getExp("6");
}
function get7(){
    getExp("7");
}
function get8(){
    getExp("8");
}
function get9(){
    getExp("9");
}
function get0(){
    getExp("0");
}
function getPoint(){
    getExp(".");
}
function getLParentheses(){
    getExp("(");
}
function getRParentheses(){
    getExp(")");
}

function getOp(what){
    if(document.getElementById("output").value ===　"") //output无数字则直接添加
        document.getElementById("input").value +=　what;
    else {//output有数字说明进行了一次计算
        if(isNaN(document.getElementById("output").value)){ //结果不为数字(即报错),则把原式及结果删除重新开始
            document.getElementById("input").value = what;
            document.getElementById("output").value =　"";
        }
        else{ //结果为运算结果则把结果放入输入位继续添加
            document.getElementById("input").value = document.getElementById("output").value　+　what;
            document.getElementById("output").value =　"";
        }
    }
}
function getPlus(){
    getOp("+");
}
function getMinus(){
    getOp("-");
}
function getTimes(){
    getOp("*");
}
function getDivide(){
    getOp("/");
}
function getMod(){
    getOp("%");
}
function getPower(){
    getOp("^");
}
function getFactorial(){
    getOp("!");
}
//--------------------------------------------------
function getMemory(){ //得到记忆值
    if(document.getElementById("output").value　!==　""){ //有输出结果时
        if(!isNaN(document.getElementById("output").value)) { //且结果为数字结果（非报错）时
            document.getElementById("memory").innerHTML　=　document.getElementById("memory").innerHTML.substr(0,8)　+　document.getElementById("output").value;
            save = document.getElementById("memory").innerHTML.substr(8);    //传入保存值
        }
    }
}

function getRead(){ //输入保存值
    getExp(save.toString());
}

function clearAll(){ //清除全部
    document.getElementById("input").value =　"";
    document.getElementById("output").value =　"";
}

function deletion(){ //清除一个字符
    var x　=　document.getElementById("input").value;
    document.getElementById("input").value　=　x.substr(0,x.length-1);
}

function equal(){ //计算
    exp　=　document.getElementById("input").value　+　';';
    document.getElementById("output").value =　calculate(exp);
}