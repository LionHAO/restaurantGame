let timer = false;
let globalTime = 0; //总时间
let week = 1;
let day = 1;
var width = [0, 0, 0, 0, 0, 0];//六位等待顾客的进度条
var interval //全局定时器,在末尾赋值
var isNewDay// 判断是否是全新一天
let fryNum;//炒掉第几个厨师
let chefNode;//厨师节点，为了删除厨师
var sumMoney //总金额
var allDishes = [] //所有菜品队列
var doneDishes = [] //完成的菜品
var customerId;//第几位顾客
var seatid;//上座时的第几位顾客
var customerWaitNode;//等待顾客节点

const chefNodeList = []//厨师的dom节点list
const chefList = []//厨师的对象list
const chefWorking = []//储存正在工作的厨师的序号var

var customerWaitList = []//顾客等待队列的对象list
var customerWaitNodeList = []//顾客等待队列的dom节点list

const customerSeatList = []//顾客座位队列的座位list
const customerSeatNodeList = []//顾客座位队列的dom节点list

const dayNum = document.querySelector('.dayNum')//天数
const weekNum = document.querySelector('.weekNum')//周数
const chefBoxPlace = document.querySelector(".small-inline-Box")
const button = document.querySelectorAll("button")
const chefPlace = document.querySelector(".chefPlace")
const customerWaitPlace = document.querySelector(".waitingPlace")
const buyChef1 = document.querySelector(".buyChef")//招聘厨师部分
const fryChef1 = document.querySelector(".fryChef")//解雇厨师部分
const main = document.querySelector("#main");
const body = document.querySelector("body");
const blackShadow = document.querySelector(".blackShadow");//添加阴影效果
const confirmRecruitment = document.querySelector(".confirmRecruitment");//确认招聘
const noRecruitment = document.querySelector(".noRecruitment");//先不招聘
const confirmFry = document.querySelector(".confirmFry");//确认解雇
const noFry = document.querySelector(".noFry");//先不解雇
const customerSeats = document.querySelectorAll(".grid-item")

const menu = document.querySelector(".menu")//菜单
const checkedDish = document.querySelectorAll(".check")//菜单上的菜的
const confirmButton = document.querySelectorAll(".menu button")//菜单上的俩按钮
//顾客图片
const customersrc = ['asset/customer1.png','asset/customer2.png','asset/customer3.png','asset/customer4.png','asset/customer5.png','asset/customer6.png']


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

button[4].addEventListener("click", () => {
  //菜单的确定按钮
  //获取表单的菜品选择情况
  var currentDish = []
  for (i in checkedDish) {
    if (checkedDish[i].checked) {
      currentDish.push(i)//在当前菜品队列中增加
      allDishes.push(i)//在总菜品队里俄中
    }
  }
  //菜品已经储存在currentDish中,其储存形式是如['0','1','2']
  for (const i in customerSeats) {
    const element = customerSeats[i];
    //如果位置没有图片,则是空位
    if (!element.children[0].children[0]) {
      new CustomerSeat(istc = "/asset/customer2.png", node = element, myDish = [0, 1, 2])
      break
    }
  }
  //还是上一个顾客的菜单
  menu.style.display = 'none'
  blackShadow.style.display = 'none'
  //菜单的取消按钮
})

//   <div class="grid-item">
//   <div class="seat"></div>
//   <div class="orderdishes">
//     <div class="Bar">
//       <div class="shade">
//         <p class="dish">UI炖UI</p>
//       </div>
//     </div>
//     <div class="Bar">
//       <div class="shade">
//         <p class="dish">UI炖UI</p>
//       </div>
//     </div>
//     <div class="Bar">
//       <div class="shade">
//         <p class="dish">UI炖UI</p>
//       </div>
//     </div>
//   </div>
// </div>


//顾客的位置对象
class CustomerSeat {
  constructor(isrc, node, myDish) {
    //两个参数 一个是图片路径,一个是座位的node节点,一个是菜品列表)
    this.isrc = isrc
    this.node = node
    this.myDish = myDish//点的菜
    this.money = 0
    this.bar = node.children[1].children//进度条
    this.#init()
  }

  #init() {
    var seatImg = document.createElement('img')
    seatImg.classList.add('seatImg')
    seatImg.src = this.isrc
    node.children[0].appendChild(seatImg)

    customerSeatList.push(this)

    var j = 0
    for (i in this.myDish) {
      if (i == 0) {
        this.bar[j].children[0].children[0].innerText = '头孢'
        this.bar[j].style.display = 'block'
      }
      if (i == 1) {
        this.bar[j].children[0].children[0].innerText = '炸鸡'
        this.bar[j].style.display = 'block'
      }
      if (i == 2) {
        this.bar[j].children[0].children[0].innerText = '啤酒'
        this.bar[j].style.display = 'block'
      }
      //如果不走这一步初始化width 可能在后面的判断会读不到width
      this.bar[j].children[0].style.width = '0%'
      j += 1
    }
    menu.style.display = 'none'
    blackShadow.style.display = 'none'
  }

  waiting() {
    if (this.myDish.length <= 0) {
      return
    }
    //给宽进行递增
    for (i = 0; i < this.myDish.length; i++) {
      //要是没有这个判断,会疯狂报错
      //因为这个i成分不纯有很多乱七八糟的东西但是其中有1,2,3这样我们想要的可以自己log看看
      var width = this.bar[i].children[0].style.width.match(/\d+/)
      if (width >= 100) {
        this.bar[i].children[0].style.background = 'black'
        continue
      }
      width = parseInt(width[0]) + 1
      this.bar[i].children[0].style.width = width + '%'
    }

  }
}

class Customer {
  constructor() {
    this.#init()
  }
  
  // customerid = nowcustomer
  #init = () => {
    // <!-- <div class='waitCustomerBox' id='waitCustomerBox0'>
    //     <div class='cookingBar'>
    //       <div class='shade'>
    //         <p class='wait'>等待中</p>
    //       </div>
    //     </div>
    //     <img class='customerImg' src='asset/customer1.png' alt='custmoer'>
    //   </div> -->

    const customer = document.createElement('div')
    console.log(customerId);
    customer.setAttribute("data-index", customerId)
    customer.classList.add("waitCustomerBox")
    const cookingBar = document.createElement("div")
    cookingBar.classList.add("cookingBar")

    const shade = document.createElement("div")
    shade.classList.add("shade")

    const wait = document.createElement("p")
    wait.append("等待中")
    wait.classList.add("wait")

    shade.appendChild(wait)
    cookingBar.appendChild(shade)

    const customerImg = document.createElement("img")
    customerImg.src = customersrc[customerId]
    customerImg.classList.add('customerImg')
    customerImg.setAttribute("data-index", customerId)
    customer.appendChild(cookingBar)
    customer.appendChild(customerImg)

    // [div.cookingBar, img.customerImg]
    //数组添加
    customerWaitList.push(this)
    customerWaitNodeList.push(customer)
    customerWaitPlace.appendChild(customer)
    
    customerImg.addEventListener('click', (e) => { 
      customerWaitNode = customerImg.parentNode;
      seatid = e.target.dataset.index;
      console.log(seatid);
      menu.style.display = 'initial'
      blackShadow.style.display = 'initial'
    })
  }

  waiting = () => {

    // 对象在数组的下标
    var index = customerWaitList.indexOf(this)
    // 获得进度条对象
    var waitingBar = customerWaitNodeList[index].children[0]
    if (!waitingBar.children[0].style.width) {
      waitingBar.children[0].style.width = '0%'
    }
    // var width = parseInt(waitingBar.children[0].style.width.match(/\d+/)[0]) + 1
    // waitingBar.children[0].style.width = width + '%'
    // if (width >= 100) {
    //   customerWaitNodeList.splice(index, 1)
    //   customerWaitList.splice(index, 1)
    // }


    width[index] = width[index] + 0.5
    // var width = parseFloat(waitingBar.children[0].style.width.match(/\d+/)[0]) + 0.5
    waitingBar.children[0].style.width = width[index] + '%'
    if (width[index] >= 100) {
      customerWaitNodeList.splice(index, 1)
      customerWaitList.splice(index, 1)
      var pObjs = customerWaitPlace.childNodes;
      for (var i = pObjs.length - 1; i >= 0; i--) { // 一定要倒序，正序是删不干净的，可自行尝试
        customerWaitPlace.removeChild(pObjs[i]);
      }
    }
  }
}


class Chef {
  constructor(isBusy, workable) {
    this.isBusy = isBusy //忙吗
    this.workable = workable //能不能干活
    this.workingDish //烧的是哪道菜
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
    delChef.setAttribute("data-index", chefNodeList.length)
    delChef.style.display = "none"
    delChef.addEventListener("click", (e) => {
      fryChef1.style.display = "block";
      blackShadow.style.display = "block";
      chefNode = delChef.parentNode;
      fryNum = e.target.dataset.index;
      console.log(fryNum + "---------");
      console.log(e.target);
    })


    // 添加
    const saveChef = document.createElement("div");
    saveChef.append("＋")
    saveChef.classList.add("save-chef");
    saveChef.addEventListener("click", (e) => {
      buyChef1.style.display = "block";
      blackShadow.style.display = "block";
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

      switch (this.workingDish) {
        case '0':
          cookingBar.children[0].children[0].innerText = '头孢'
          break
        case '1':
          cookingBar.children[0].children[0].innerText = '炸鸡'
          break
        case '2':
          cookingBar.children[0].children[0].innerText = '啤酒'
          break
      }

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
    chefList.push(new Chef(isBusy = false, workable = false))//也可以写成Chef(false,true)只是比较好

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
  } else {
    chefNodeList.splice(fryNum, 1);
    chefBoxPlace.removeChild(chefNode);
  }
  //大于三位厨师框框变大
  if (chefNodeList.length > 3) {
    chefPlace.style.height = '38%'
  }
  return true;
}

//监视厨师工作,其实就是监视 chefWorking 这个数组,
//如果有厨师在工作,则这个数组内就会包含这个厨师在chefList中的序号
//监视到厨师在工作,则会调用相应厨师的cooking函数,让他工作,每一毫秒都调用一次,
watchingChefWorking = () => {
  if (allDishes.length > 0) {
    chefList.some((v, i) => {
      //类似map ,但当他return和return false时会结束当前循环,return true会完全结束循环
      if (!v.isBusy && v.workable) {
        v.workingDish = allDishes.shift()//这个方法返回并删除数组的第一个元素
        chefWorking.push(i)
        return true
      }
    })
  }


  chefWorking.map((v, i) => {
    chefList[i].cooking()
  })
}

//判断是否是全新一天,每天都要一开始就做一些东西
//1 顾客写死进6位
//
watchingIsNewDay = () => {
  if (isNewDay) {
    width = [0, 0, 0, 0, 0, 0]
    customerWaitList = []
    customerWaitNodeList = []
    console.log("newDay");
    //直接硬加上6位
    for (i = 0; i < 6; i++) {
      customerId = i
      new Customer()
    }
    isNewDay = false
  }
}
// //每天一次
// function dealDaily(){   
//   for (i = 0; i < customers.length; i++)
//   {
//       customers[i].todayAte = false;
//   }
// }

//如果
watchIngCustomerWaiting = () => {
  customerWaitList.map((v) => {
    v.waiting()
  })
}

watchingCustomerSeatWaiting = () => {
  customerSeatList.map((v) => {
    console.log();
    v.waiting()
  })
}


//全局计时器
chronography = () => {
  if (timer) {

    globalTime++;
    watchingIsNewDay()
    watchingChefWorking()
    watchIngCustomerWaiting()
    watchingCustomerSeatWaiting()
  }

  if (globalTime >= 240) {
    isNewDay = true;
    day++;
    dayNum.innerHTML = day
    globalTime = 0;
    // dealDaily();
  }
  if (day > 7) {
    week++;
    weekNum.innerHTML = week
    day = 1;
    // dealWeek();
  }
}
 
//测试时间静止
stopTime = () => {
  clearInterval(interval)
}

//测试时间继续
continueTime = () => {
  clearInterval(interval)
  interval = setInterval(chronography, 100);
}

resetMenu = () => {
  for (i in checkedDish) {
    checkedDish[i].checked = false
  }
}

//给所有需要加上eventListener的集合
allAddEventListener = () => {
  //确认招聘
  confirmRecruitment.addEventListener("click", (e) => {
    buyChef1.style.display = "none";
    blackShadow.style.display = "none";
    buyChef()
  })

  //先不招聘
  noRecruitment.addEventListener("click", (e) => {
    buyChef1.style.display = "none";
    blackShadow.style.display = "none";
  })
  //先不解雇
  noFry.addEventListener("click", (e) => {
    fryChef1.style.display = "none";
    blackShadow.style.display = "none";
  })
  confirmFry.addEventListener("click", (e) => {
    console.log(chefNodeList.length);
    fryChef()
    fryChef1.style.display = "none";
    blackShadow.style.display = "none";
    console.log(chefNodeList.length);
  })


  //菜单的确定按钮
  confirmButton[0].addEventListener('click', (e) => {
    //获取表单的菜品选择情况
    var currentDish = []
    //checkedDish是html的dom节点,判断是否给某个菜品打了勾
    for (i in checkedDish) {
      if (checkedDish[i].checked) {
        currentDish.push(i)//在当前菜品队列中增加
        allDishes.push(i)//在总菜品队里俄中
      }
    }
    //菜品已经储存在currentDish中,其储存形式是如['0','1','2']
    for (const i in customerSeats) {
      const element = customerSeats[i];
      //如果位置没有图片,则是空位
      if (!element.children[0].children[0]) {
        new CustomerSeat(isrc = customersrc[seatid], node = element, myDish = currentDish)
        break
      }
    }
    resetMenu()//把选项去了,如果不调用这个东西下一个顾客打开菜单menu里面
    //还是上一个顾客的菜单
    menu.style.display = 'none'
    blackShadow.style.display = 'none'
    customerWaitPlace.removeChild(customerWaitNode);
  })
  //菜单的取消按钮
  confirmButton[1].addEventListener('click', (e) => {
    resetMenu()//把选项去了,如果不调用这个东西下一个顾客打开菜单menu里面
    //还是上一个顾客的菜单
    menu.style.display = 'none'
    blackShadow.style.display = 'none'
    customerWaitPlace.removeChild(customerWaitNode);
  })
}

resetMenu = () => {
  for (i in checkedDish) {
    checkedDish[i].checked = false
  }
}

//初始化
init = () => {
  timer = true
  sumMoney = 300
  isNewDay = true
  allAddEventListener()//开局需要加上的eventListener
  buyChef();//开局加一个
  buyChef();//开局加一个
  //设置全局时间流动,之前的写法是每个厨师都有一个cooking方法会调用一个计时器,但这样的话
  //后面是很难停下来的,设置一个时间计时器来总揽全部时间流动,每一种变化都是加入到时间流中
  //可以实现暂停跟继续
  interval = setInterval(chronography, 100);

  return true;
}


init()//全局初始化
