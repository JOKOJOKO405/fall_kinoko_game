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
let spKinokos = []

let gameObjs = []

// 表示テキスト
const getKinokoText = document.getElementById('text')
const kinokoCountText = document.getElementById('normalKinoko')
const poisonKinokoCountText = document.getElementById('poisonKinoko')
const spKinokoCountText = document.getElementById('specialKinoko')
const timerText = document.getElementById('timer')
let timerCount = 0
let kinokoCount = 0
let poisonKinokoCount = 0
let spKinokoCount = 0
const kinokoXposMax = 772
const kinokoXposMin = 20

const startBtn = document.getElementById('start')
const resetBtn = document.getElementById('reset')

// タイマー
let timer = 40
timerText.innerText = timer;
let isStarted = false

// 画面設定
const canvasH = 500
const canvasW = 792
const kinokoBorderLine = 500 - 32 - 20
const boyStandPos = 500 - 32 - 34
class GameObjects {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
    this.width = width
    this.height = height
    gameObjs.push(this) 
    console.debug(gameObjs)
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

class Boy extends GameObjects{
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.isSlow = false
    this.slowCount = 0
  }
  update(keyEvent) {
    let speed = this.isSlow ? -3 : 18;
    this.touchPoisonKinoko()

    if(keyEvent === 'ArrowRight' && this.x < 774){
      this.x += speed
    }else if(keyEvent === 'ArrowLeft' && this.x > 0){
      this.x -= speed
    }
    super.draw(imageBoy)
    super.calculateCenterPos()
    this.getKinoko()
  }
  touchPoisonKinoko(){
    let timeoutId;
    // はじめて毒きのことった場合
    if(this.isSlow && !this.slowCount){
      timeoutId = setTimeout(() => {
        this.isSlow = false
        this.slowCount = 0
      }, 5000)
    // 連続で取った場合 
    }else if(this.isSlow && this.slowCount > 0){
      clearTimeout(timeoutId)
      this.isSlow = true
      this.slowCount = 0
    }
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
        this.slowCount ++;
        poisonKinokoCount ++;
        poisonKinokoCountText.innerText = poisonKinokoCount
      }
    })
    spKinokos.forEach((spKinoko)=>{
      if(this.computedDistance(spKinoko)){
        spKinoko.reuseKinoko(7, -5000)
        getKinokoText.innerText = 'スペシャルきのこゲット！！'
        spKinokoCount ++;
        spKinokoCountText.innerText = spKinokoCount
        this.isSlow = false
      }
    })
  }
}
class Kinoko extends GameObjects {
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.speed = makeRandomNum(5, 1)
  }
  update() {
    this.y += this.speed
    this.calculateCenterPos()
    if (this.y > kinokoBorderLine) {
      this.reuseKinoko(makeRandomNum(5, 1))
    }
    super.draw(imageKinoko)
  }
  reuseKinoko(speed, y = -100){
    this.x = makeRandomNum(kinokoXposMax, kinokoXposMin)
    this.y = y
    this.speed = speed
  }
}

class PoisonKinoko extends Kinoko{
  constructor(x, y, width, height){
    super(x, y, width, height)
  }
  update() {
    super.update()
    super.draw(imagePoisonKinoko)
  }
  reuseKinoko(){
    super.reuseKinoko(makeRandomNum(5, 1))
  }
}

class SpecialKinoko extends Kinoko{
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.speed = 8
    this.isReady = false
    setTimeout(() => {
      this.isReady = true
    }, makeRandomNum(3000, 15000));
  }
  update() {
    if(!this.isReady) return // 早期リターン

    this.y += this.speed
    this.calculateCenterPos()
    if (this.y > kinokoBorderLine) {
      setTimeout(() => {
        this.reuseKinoko(this.speed)
      }, 5000)
    }
    super.draw(imageSpecialKinoko)
  }
  reuseKinoko(){
    super.reuseKinoko(8, -5000)
  }
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

const makeSpKinokos = () => {
  let spKinoko = []
  for (let i = 0; i < 1; i++) {
    const randumX = makeRandomNum(kinokoXposMax, kinokoXposMin)
    spKinoko[i] = new SpecialKinoko(randumX, -50, 20, 20)
    spKinokos.push(spKinoko[i])
  }
  return spKinoko
}


function mainLoop() {
  if(isStarted){
    let loopId = window.requestAnimationFrame(mainLoop)
    ctx.clearRect(0,0,canvasW,canvasH)
    gameObjs.forEach((gameObj) => {
      gameObj.update()
    })  
    if(!timer){
      stopCountDown()
      getKinokoText.innerText = 'タイムアップ！'
      cancelAnimationFrame(loopId)
      window.onkeydown = (e) => {
        e.preventDefault();
      }
      ctx.clearRect(0,0,canvasW,canvasH)
    }
  }else{
    cancelAnimationFrame(mainLoop)
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
const gameStart = () => {
  if(!isStarted) return

  let boy = new Boy(792 / 2, boyStandPos, 18, 34)
  window.onkeydown = (e) => {
    boy.update(e.code)
  }
  startCountDown()
  makePoisonKinokos()
  makeKinokos()
  makeSpKinokos()
  requestAnimationFrame(mainLoop)
}

startBtn.addEventListener('click', (e) => {
  isStarted = true;
  gameStart()
  startBtn.style.display = 'none'
})
resetBtn.addEventListener('click', (e) => {
  isStarted = false;
  stopCountDown(intervalId)
  location.href = './index.html'
})
