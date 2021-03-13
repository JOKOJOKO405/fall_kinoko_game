const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 画像設定
const imageBoy = new Image()
const imageKinoko = new Image()
const imagePoisonKinoko = new Image()
const imageSpecialKinoko = new Image()
imageBoy.src = './assets/img/ico_boy1_8.gif'
imageKinoko.src = './assets/img/ico_mushroom2_12.gif'
imagePoisonKinoko.src = './assets/img/ico_mushroom2_15.gif'
imageSpecialKinoko.src = './assets/img/ico_mushroom2_2.gif'

// 複数きのこ配列
let Kinokos = []
let PoisonKinokos = []

// 表示テキスト
const getKinokoText = document.getElementById('text')
const kinokoCountText = document.getElementById('catchKinoko')
const timerText = document.getElementById('timer')
let timerCount = 0
let kinokoCount = 0
const kinokoXposMax = 772
const kinokoXposMin = 20

// タイマー
let timer = 60
timerText.innerText = timer;

class Character {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
    this.width = width
    this.height = height
  }
  computedDistance(obj){
    const distanceX = Math.abs(obj.centerX - this.centerX)
    const distanceY = Math.abs(obj.centerY - this.centerY)
    return distanceX <= 20 && distanceY <= 20
  }
  calculateCenterPos(){
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
  }
  draw(image){
    ctx.drawImage(image, this.x, this.y, this.width, this.height)
  }
}

class Boy extends Character{
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.isSlow = false
  }
  move(keyEvent) {
    if(keyEvent === 'ArrowRight' && this.x < 774){
      this.x += 18
    }else if(keyEvent === 'ArrowLeft' && this.x > 0){
      this.x -= 18
    }
    super.draw(imageBoy)
    super.calculateCenterPos()
  }
  slowMove(keyEvent){
    if(keyEvent === 'ArrowRight' && this.x < 774){
      this.x += 3
    }else if(keyEvent === 'ArrowLeft' && this.x > 0){
      this.x -= 3
    }
    super.draw(imageBoy)
    super.calculateCenterPos()
  }
  getKinoko(){
    Kinokos.forEach((kinoko)=>{
      if(this.computedDistance(kinoko)){
        kinoko.reuseKinoko(makeRandomNum(5, 1))
        getKinokoText.innerText = 'きのこゲット！'
        kinokoCount ++;
        kinokoCountText.innerText = kinokoCount
      }
    })
    PoisonKinokos.forEach((poisonKinoko)=>{
      if(this.computedDistance(poisonKinoko)){
        poisonKinoko.reuseKinoko(makeRandomNum(5, 1))
        getKinokoText.innerText = '毒きのこだ！'
        this.isSlow = true
      }
    })
    if(this.computedDistance(specialKinoko)){
      getKinokoText.innerText = 'スペシャルきのこゲット！！'
      this.isSlow = false
    }
  }
}
class Kinoko extends Character {
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.speed = makeRandomNum(5, 1)
  }
  move() {
    this.y += this.speed
    this.calculateCenterPos()
    if (this.y > 500) {
      this.reuseKinoko(makeRandomNum(5, 1))
    }
    super.draw(imageKinoko)
  }
  reuseKinoko(speed){
    this.x = makeRandomNum(kinokoXposMax, kinokoXposMin)
    this.y = -100
    this.speed = speed
  }
}

class PoisonKinoko extends Kinoko{
  constructor(x, y, width, height){
    super(x, y, width, height)
  }
  move() {
    super.move()
    super.draw(imagePoisonKinoko)
  }
  reuseKinoko(){
    super.reuseKinoko(makeRandomNum(5, 1))
  }
}

class SpecialKinoko extends Kinoko{
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.speed = 10
    this.isReady = false
  }
  move() {
    this.y += this.speed
    this.calculateCenterPos()
    if (this.y > 500) {
      setTimeout(() => {
        this.reuseKinoko(this.speed)
      }, 5000)
    }
    super.draw(imageSpecialKinoko)
  }
  reuseKinoko(){
    super.reuseKinoko(10)
  }
}

imageBoy.onload = () => {
  ctx.drawImage(imageBoy, boy.x, boy.y, boy.width, boy.height)
}
imageSpecialKinoko.onload = () => {
  ctx.drawImage(imageSpecialKinoko, boy.x, boy.y, boy.width, boy.height)
}
imageKinoko.onload = () => {
  Kinokos.forEach((kinoko) => {
    kinoko.move()
  })
}
imagePoisonKinoko.onload = () => {
  PoisonKinokos.forEach((poisonKinoko) => {
    poisonKinoko.move()
  })
}

const makeRandomNum = (max, min) => {
  const num = Math.floor(Math.random() * (max - min + 1) + min)
  return num
}
const makeKinokos = () => {
  let kinoko = []
  for (let i = 0; i < makeRandomNum(25, 20); i++) {
    const randumX = makeRandomNum(kinokoXposMax, kinokoXposMin)
    const randumY = makeRandomNum(10, 1)
    kinoko[i] = new Kinoko(randumX, randumY, 20, 20)
    Kinokos.push(kinoko[i])
  }
  return kinoko
}

const makePoisonKinokos = () => {
  let poisonKinoko = []
  for (let i = 0; i < makeRandomNum(20,15); i++) {
    const randumX = makeRandomNum(kinokoXposMax, kinokoXposMin)
    const randumY = makeRandomNum(10, 1)
    poisonKinoko[i] = new PoisonKinoko(randumX, randumY, 20, 20)
    PoisonKinokos.push(poisonKinoko[i])
  }
  return poisonKinoko
}



let boy = new Boy(792 / 2, 500-34, 18, 34)
let specialKinoko = new SpecialKinoko(makeRandomNum(780, 20), -50, 20, 20)

function mainLoop() {
  let loopId = window.requestAnimationFrame(mainLoop)
  ctx.clearRect(0,0,800,500)
  boy.move()
  boy.getKinoko()
  Kinokos.forEach((kinoko) => {
    kinoko.move()
  })
  PoisonKinokos.forEach((poisonKinoko) => {
    poisonKinoko.move()
  })
  if(specialKinoko.isReady){
    specialKinoko.move()
  }

  if(!timer){
    stopCountDown()
    cancelAnimationFrame(loopId)
    window.onkeydown = (e) => {
      e.preventDefault();
    }
  }
}
requestAnimationFrame(mainLoop)

window.onkeydown = (e) => {
  if(boy.isSlow){
    boy.slowMove(e.code)
    setTimeout(() => {
      boy.isSlow = false
    }, 5000);
  }else{
    boy.move(e.code)
  }
}

let intervalId;

const startCountDown = () => {
  intervalId = setInterval(()=>{
    timer --;
    timerText.innerText = timer;
    if(timer <= 0){
      clearInterval(intervalId);
    }
  }, 1000)
}
const stopCountDown = () => {
  clearInterval(intervalId);
}
window.onload = () => {
  startCountDown()
  makePoisonKinokos()
  makeKinokos()
  setTimeout(() => {
    specialKinoko.isReady = true
  }, makeRandomNum(3000, 15000));
}