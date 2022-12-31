// [img.addCookerImg, div.cookingBar, img.plateImg, p.del-chef, div.save-chef]
const chefNodeList = []//厨师的dom节点list
const chefList = []//厨师的对象list
const chefBoxPlace = document.querySelector(".small-inline-Box")
const button = document.querySelectorAll("button")
const chefPlace = document.querySelector(".chefPlace")

//测试
button[0].addEventListener("click", (e) => {
  buyChef()
})

button[1].addEventListener("click", (e) => {
  var ok =0
  chefList.some((v,i)=>{
    if(!v.isBusy&&v.workable){
      v.cooking()
      ok=i
      return true
    }
  })
  console.log(ok);
})

class Chef {
  constructor(isBusy,workable) {
    this.isBusy = isBusy //忙吗
    this.workable = workable //能不能干活
    this.#init();
  }



  //私有属性
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
    //   <div class='chefBox' id='chefBox1'>
    //   <img class='addCookerImg' src='asset/chef.png' alt='cooker'>
    //   <!-- 做菜进度条 -->
    //   <div class='cookingBar'>
    //     <div class='shade'>
    //       <p class='dish'>UI炖UI</p>
    //     </div>
    //   </div>
    //   <!-- 递盘子 -->
    //   <img class='plateImg' src='asset/food.png' alt='plate'>
    //   <!-- 删除厨师 -->
    //   <p class="del-chef">×</p>
    //   <!-- 添加厨师 -->
    //   <p class="save-chef">＋</p>
    // </div>

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
    shade.appendChild(dish)
    cookingBar.style.display = "none"


    //托盘
    const plateImg = document.createElement("img");
    plateImg.src = 'asset/food.png'
    plateImg.classList.add("plateImg");
    plateImg.style.display = "none"

    //删除x
    const delChef = document.createElement("p");
    delChef.append("×")
    delChef.classList.add("del-chef");
    delChef.style.display = "none"

    // 添加
    const saveChef = document.createElement("div");
    saveChef.append("＋")
    saveChef.classList.add("save-chef");



    // 这个顺序很重要,之后每次进行新增都会加入到chefNodeList中,可以在chefNodeList中使用[]来根据下标取值
    // 然后如果还要细细的进行某个子节点的操作(比如进度条,比如托盘显示),就要用到如chefNodeList[4].children[0](表示取第4位厨师的头像);
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

    chefNodeList.push(chef)
  }

  cooking = () => {
    //设置这个厨师忙着呢
    this.isBusy=true
    //获取这个对象在抽象数组中的位置
    var index = chefList.indexOf(this)
    //获取进度条对象
    var cookingBar = chefNodeList[index].children[1]
    //解禁display
    cookingBar.style.display = 'block'
    //这里后面要根据菜品修改,把咸鱼改成传入的参数
    cookingBar.children[0].children[0].innerText = "咸鱼"
    // cookingBar.children[0].style.background = 'red'
    // cookingBar.children[0].style.width='70%'
    // 设置timer == null 是为了保证按钮只能点击一次
    cookingBar.children[0].style.width = '0px'
    cookingBar.children[0].style.background = 'red'
    var num = 0
    var timer = setInterval(function () {
      num += 1
      //给宽进行递增
      cookingBar.children[0].style.width = num + 'px'
      if (num >= 92) {
        chefNodeList[index].children[2].style.display = 'block';
        clearInterval(timer)
      }
    }, 100)
    //每0.1s加1,到92结束
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
  //开局自动买一个,除了满员的情况,chefNodeList的个数总是厨师个数加一,加出来的一是占位的'+'的厨师位置
  //大于6位厨师不给创建
  if (chefNodeList.length == 6) {
    //已经不能再加了,就把占位厨师的+去掉,给他加上x(删除符号)
    chefNodeList[5].children[4].style.display = "none"
    chefNodeList[5].children[3].style.display = "initial"
    //设置为空闲 和 可工作
    chefList[5].workable=true
    chefList[5].isBusy=false

  } else if (chefNodeList.length == 0) {
    //开局加一个
    chefList.push(new Chef(isBusy=false,workable=true))//也可以写成Chef(false,true)只是比较好看
  } else {
    //先把占位厨师的+去掉,给他加上x(删除符号),然后创建一个占位厨师
    chefNodeList[chefNodeList.length - 1].children[4].style.display = "none"
    chefNodeList[chefNodeList.length - 1].children[3].style.display = "initial"
    chefList.push(new Chef(isBusy=false,workable=true))
  }
  //大于三位厨师框框变大
  if (chefNodeList.length > 3) {
    chefPlace.style.height = '38%'
  }
  return true;
}
