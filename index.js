// [img.addCookerImg, div.cookingBar, img.plateImg, p.del-chef, div.save-chef]
const chefList=[]
const chefBoxPlace = document.querySelector(".small-inline-Box")
const button = document.querySelector("button")
const chefPlace = document.querySelector(".chefPlace")

button.addEventListener("click", (e) => {
  buyChef()
})


class Chef {
  constructor(){
    this.#init();
  }

  #init = () => {//每new一个Chef 就会做这件事,动态创建好一个这玩意
    // 定义一个厨师的dom元素其实一个厨师,然后往里面加属性,像是盘子,X等,动态创建
    const chef = document.createElement('div');

    chef.classList.add("chefBox")//等同于 chef.setAttribute('class',chefBox); 都是将创造的div赋予class="chefBox"

    //给他脸,给脸附上class(为了样式)
    const img = document.createElement('img');
    img.src = "asset/chef.png";
    img.classList.add("addCookerImg")
    // img.style='filter:drop-shadow( 0px 0 0px white);' 可以显示阴影但是盖不住

    //别删注释
    // <div class='chefBox' id='chefBox1'>
    //       <img class='addCookerImg' src='asset/chef.png' alt='cooker'>
    //       <!-- 做菜进度条 -->
    //       <div class='cookingBar'>
    //           <div class='shade'></div>
    //           <p class='dish'>UI炖UI</p>
    //       </div>
    //       <!-- 递盘子 -->
    //       <img class='plateImg' src='asset/food.png' alt='plate'>
    //       <!-- 删除厨师 -->
    //       <p class="del-chef">×</p>
    //       <!-- 添加厨师 -->
    //       <p class="save-chef">＋</p>
    //     </div>

    //都是创建元素,添加class属性名字,然后动态添加

    //进度条
    const cookingBar = document.createElement("div");
    cookingBar.classList.add("cookingBar");
    const shade = document.createElement("div")
    shade.classList.add("shade")
    const dish = document.createElement("p")
    dish.append("UI炖UI")
    dish.classList.add("dish")
    cookingBar.appendChild(shade)
    cookingBar.appendChild(dish)
    cookingBar.style.display ="none"


    //托盘
    const plateImg = document.createElement("img");
    plateImg.src='asset/food.png'
    plateImg.classList.add("plateImg");
    plateImg.style.display ="none"

    //删除x
    const delChef = document.createElement("p");
    delChef.append("×")
    delChef.classList.add("del-chef");
    delChef.style.display ="none"

    // 添加
    const saveChef = document.createElement("div");
    saveChef.append("＋")
    saveChef.classList.add("save-chef");



    // 这个顺序很重要,之后每次进行新增都会加入到chefList中,可以在chefList中使用[]来根据下标取值
    // 然后如果还要细细的进行某个子节点的操作(比如进度条,比如托盘显示),就要用到如chefList[4].children[0](表示取第4位厨师的头像);
    // 其中的children是他的所有子元素,顺序如下
    // [img.addCookerImg, div.cookingBar, img.plateImg, p.del-chef, div.save-chef]

    chef.appendChild(img);
    chef.appendChild(cookingBar)
    chef.appendChild(plateImg)
    chef.appendChild(delChef)
    chef.appendChild(saveChef)

    //放入厨师的那块区域
    //目前采用的这种方法还没考虑到后面的属性变化(比如进度条如果要改变的话该怎么处理),不知是否可行
    chefBoxPlace.appendChild(chef);

    chefList.push(chef)
  }
}


//初始化
function init() {
  buyChef();
  return true;
}

init()//全局初始化


//找厨师
function buyChef() {
  //开局自动买一个,除了满员的情况,chefList的个数总是厨师个数加一,加出来的一是占位的'+'的厨师位置
  //大于6位厨师不给创建
  if(chefList.length==6){
    //已经不能再加了,就把占位厨师的+去掉,给他加上x(删除符号)
    chefList[5].children[4].style.display="none"
    chefList[chefList.length-1].children[3].style.display="initial"
  }else if(chefList.length==0){
    //开局加一个
    new Chef()
  }else{
    //先把占位厨师的+去掉,给他加上x(删除符号),然后创建一个占位厨师
    chefList[chefList.length-1].children[4].style.display="none"
    chefList[chefList.length-1].children[3].style.display="initial"
    new Chef()
  }
  //大于三位厨师框框变大
  if (chefList.length > 3) {
    chefPlace.style.height='38%'
  }
  return true;
}
