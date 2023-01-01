// [img.addCookerImg, div.cookingBar, img.plateImg, p.del-chef, div.save-chef]
var interval //全局定时器,在末尾赋值
const chefNodeList = []//厨师的dom节点list
const chefList = []//厨师的对象list
const chefWorking = []//储存正在工作的厨师的序号

const customerWaitToSeat = []
const customerAttheSeat = []

const chefBoxPlace = document.querySelector(".small-inline-Box")
const button = document.querySelectorAll("button")
const chefPlace = document.querySelector(".chefPlace")
const buyChef1 = document.querySelector(".buyChef")//招聘厨师部分
const fryChef1 = document.querySelector(".fryChef")//解雇厨师部分 
const main = document.querySelector("#main");
const body = document.querySelector("body");
const blackShadow = document.querySelector(".blackShadow");//添加阴影效果
const confirmRecruitment = document.querySelector(".confirmRecruitment");//确认招聘
const noRecruitment = document.querySelector(".noRecruitment");//先不招聘
const confirmFry = document.querySelector(".confirmFry");//确认解雇
const noFry = document.querySelector(".noFry");//先不解雇
//测试
button[0].addEventListener("click", (e) => {
    buyChef()
})

button[1].addEventListener("click", (e) => {
  chefList.some((v, i) => {
    //类似map ,但当他return和return false时会结束当前循环,return true会完全结束循环
    if (!v.isBusy && v.workable) {
      chefWorking.push(i)
      return true
    }
  })
})

button[2].addEventListener("click", (e) => {
  stopTime()
})

button[3].addEventListener("click", (e) => {
  continueTime()
})


class Chef {
    constructor(isBusy,  workable) {
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
        delChef.addEventListener("click", (e) => {
            fryChef1.style.display="block";
            blackShadow.style.display="block";
        })


        // 添加
        const saveChef = document.createElement("div");
        saveChef.append("＋")
        saveChef.classList.add("save-chef");
        saveChef.addEventListener("click", (e) => {
            buyChef1.style.display="block";
            blackShadow.style.display="block";
        })


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

 //这个函数的工作逻辑是每一次调用进度条都会涨一点,需要外部调用实现增长不会自增
 cooking = () => {
  //获取这个对象在抽象数组中的位置
  var index = chefList.indexOf(this)
  //获取进度条对象
  var cookingBar = chefNodeList[index].children[1]

  //判断是不是第一次进来,
  if (!this.isBusy) {
    //设置这个厨师忙着呢
    this.isBusy = true
    //解禁display
    cookingBar.style.display = 'block'
    //这里后面要根据菜品修改,把咸鱼改成传入的参数
    cookingBar.children[0].children[0].innerText = "咸鱼"
    cookingBar.children[0].style.width = '0%'
    cookingBar.children[0].style.background = 'red'
  }
  //给宽进行递增
  var width = parseInt(cookingBar.children[0].style.width.match(/\d+/)[0]) + 1
  cookingBar.children[0].style.width = width + '%'
  if (width >= 100) {
    chefNodeList[index].children[2].style.display = 'block';
    this.isBusy = false//忙完了,不忙了
    this.workable = false//但是手里端着菜盘子,不能干活
    chefWorking.splice(index, 1)
  }
  //每0.1s加1,到92结束
}
}


//初始化
function init() {
    buyChef();
    buyChef();
    return true;
}

//找厨师
buyChef = () => {
  //开局自动买一个,除了满员的情况,chefNodeList的个数总是厨师个数加一,加出来的一是占位的'+'的厨师位置
  //大于6位厨师不给创建
  if (chefNodeList.length == 6) {
    //已经不能再加了,就把占位厨师的+去掉,给他加上x(删除符号)
    chefNodeList[5].children[4].style.display = "none"
    chefNodeList[5].children[3].style.display = "initial"
    //设置为空闲 和 可工作
    chefList[5].workable = true
    chefList[5].isBusy = false
  } else if (chefNodeList.length == 0) {
    //开局加一个
    chefList.push(new Chef(isBusy = false, workable = false))//也可以写成Chef(false,true)只是比较好看
  } else {
    //先把占位厨师的+去掉,给他加上x(删除符号),然后创建一个占位厨师
    chefNodeList[chefNodeList.length - 1].children[4].style.display = "none"
    chefNodeList[chefNodeList.length - 1].children[3].style.display = "initial"
    chefList[chefList.length - 1].workable = true
    chefList.push(new Chef(isBusy = false, workable = false))
  }
  //大于三位厨师框框变大
  if (chefNodeList.length > 3) {
    chefPlace.style.height = '38%'
  }
  return true;
}

//解雇厨师
function fryChef() {
    if (chefNodeList.length == 2) {
        //如果只剩下一位厨师就不能解雇了
        chefNodeList[1].children[4].style.display = "none"
        chefNodeList[1].children[3].style.display = "none"
        chefNodeList[2].children[4].style.display = "initial"
        chefNodeList[2].children[3].style.display = "none"
    }  else {
        chefNodeList.re
    }
    //大于三位厨师框框变大
    if (chefNodeList.length > 3) {
        chefPlace.style.height = '38%'
    }
    return true;
}
//确认招聘
confirmRecruitment.addEventListener("click", (e) => {
    console.log(e);
    buyChef1.style.display="none";
    blackShadow.style.display="none";
    buyChef()
})
//先不招聘
noRecruitment.addEventListener("click", (e) => {
    buyChef1.style.display="none";
    blackShadow.style.display="none";
})
//先不解雇
noFry.addEventListener("click", (e) => {
    fryChef1.style.display="none";
    blackShadow.style.display="none";
})
confirmFry.addEventListener("click", (e) => {
    fryChef()
})

//解雇厨师
function fryChef() {
    if (chefNodeList.length == 2) {
        //如果只剩下一位厨师就不能解雇了
        chefNodeList[1].children[4].style.display = "none"
        chefNodeList[1].children[3].style.display = "none"
        chefNodeList[2].children[4].style.display = "initial"
        chefNodeList[2].children[3].style.display = "none"
    }  else {
        chefNodeList.re
    }
    //大于三位厨师框框变大
    if (chefNodeList.length > 3) {
        chefPlace.style.height = '38%'
    }
    return true;
}
//确认招聘
confirmRecruitment.addEventListener("click", (e) => {
    console.log(e);
    buyChef1.style.display="none";
    blackShadow.style.display="none";
    buyChef()
})
//先不招聘
noRecruitment.addEventListener("click", (e) => {
    buyChef1.style.display="none";
    blackShadow.style.display="none";
})
//先不解雇
noFry.addEventListener("click", (e) => {
    fryChef1.style.display="none";
    blackShadow.style.display="none";
})
confirmFry.addEventListener("click", (e) => {
    fryChef()
})

//监视厨师工作,其实就是监视 chefWorking 这个数组,
//如果有厨师在工作,则这个数组内就会包含这个厨师在chefList中的序号
//监视到厨师在工作,则会调用相应厨师的cooking函数,让他工作,每一毫秒都调用一次,
watchingChefWorking = () => {
  chefWorking.map((v, i) => {
    chefList[i].cooking()
  })
}

//全局计时器
GlobalTime = () => {
  watchingChefWorking()
}

stopTime = () => {
  clearInterval(interval)
}

continueTime = () => {
  clearInterval(interval)
  interval = setInterval(GlobalTime, 100);
}

init()//全局初始化
//设置全局时间流动,之前的写法是每个厨师都有一个cooking方法会调用一个计时器,但这样的话
//后面是很难停下来的,设置一个时间计时器来总揽全部时间流动,每一种变化都是加入到时间流中
//可以实现暂停跟继续
interval = setInterval(GlobalTime, 100);