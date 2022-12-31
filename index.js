const chefList = []
var chefNum = 1;
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
    chef.append(img);

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
    const cookingBar = document.createElement("div");
    cookingBar.classList.add("cookingBar");
    const shade = document.createElement("div")
    shade.classList.add("shade")
    const dish = document.createElement("p")
    dish.append("UI炖UI")
    dish.classList.add("dish")
    cookingBar.appendChild(shade)
    cookingBar.appendChild(dish)

    const plateImg = document.createElement("img");
    plateImg.src='asset/food.png'
    plateImg.classList.add("plateImg");


    const delChef = document.createElement("p");
    delChef.append("×")
    delChef.classList.add("del-chef");

    const saveChef = document.createElement("div");
    saveChef.append("＋")
    saveChef.classList.add("save-chef");


    chef.appendChild(cookingBar)
    chef.appendChild(plateImg)
    chef.appendChild(delChef)
    chef.appendChild(saveChef)

    //放入厨师的那块区域
    //目前采用的这种方法还没考虑到后面的属性变化(比如进度条如果要改变的话该怎么处理),不知是否可行
    chefBoxPlace.appendChild(chef);
  }
}


chefList.push
//初始化
function init() {
  setUpChef();
  buyChef();
  addListener();
  return true;
}

//找厨师
function buyChef() {
  if (chefNum >= 6) {
    return false
  }
  new Chef()
  chefNum++
  if (chefNum > 3) {
    chefPlace.style.height='38%'
  }
  return true;
}

//初始化厨师
function setUpChef() {
  let i = 0;
  for (; i < 6; i++) {
    everyChef.push(new Chef());
  }
}
